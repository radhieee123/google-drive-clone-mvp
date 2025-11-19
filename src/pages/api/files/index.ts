import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";
import { Prisma } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      return handleGet(req, res, userId);
    case "POST":
      return handlePost(req, res, userId);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
) {
  try {
    const { folderId, starred, trashed } = req.query;

    const whereClause: Prisma.FileWhereInput = { userId };

    if (folderId) {
      whereClause.folderId = folderId as string;
    } else {
      whereClause.folderId = null;
    }

    if (starred === "true") {
      whereClause.isStarred = true;
    }

    if (trashed === "true") {
      whereClause.isTrashed = true;
    } else {
      whereClause.isTrashed = false;
    }

    const [files, folders] = await Promise.all([
      db.file.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      }),
      db.folder.findMany({
        where: {
          userId,
          parentId: folderId ? (folderId as string) : null,
          isStarred: starred === "true" ? true : undefined,
          isTrashed: trashed === "true" ? true : false,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return res.status(200).json({ files, folders });
  } catch (error) {
    console.error("Get files error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
) {
  try {
    const { fileName, fileLink, fileExtension, fileSize, folderId } = req.body;

    const file = await db.file.create({
      data: {
        fileName,
        fileLink,
        fileExtension,
        fileSize,
        folderId: folderId || null,
        userId,
      },
    });

    return res.status(201).json(file);
  } catch (error) {
    console.error("Create file error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
