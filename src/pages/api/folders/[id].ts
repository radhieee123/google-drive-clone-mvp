import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { method } = req;
  const { id } = req.query;
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  switch (method) {
    case "GET":
      return handleGet(req, res, userId, id as string);
    case "PATCH":
      return handlePatch(req, res, userId, id as string);
    case "DELETE":
      return handleDelete(req, res, userId, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  folderId: string,
) {
  try {
    const folder = await db.folder.findUnique({
      where: { id: folderId },
      select: {
        id: true,
        folderName: true,
        parentId: true,
        isStarred: true,
        isTrashed: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });

    if (!folder || folder.userId !== userId) {
      return res.status(404).json({ message: "Folder not found" });
    }

    return res.status(200).json(folder);
  } catch (error) {
    console.error("Get folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  folderId: string,
) {
  try {
    const updates = req.body;

    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== userId) {
      return res.status(404).json({ message: "Folder not found" });
    }

    const updatedFolder = await db.folder.update({
      where: { id: folderId },
      data: updates,
    });

    return res.status(200).json(updatedFolder);
  } catch (error) {
    console.error("Update folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  folderId: string,
) {
  try {
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== userId) {
      return res.status(404).json({ message: "Folder not found" });
    }

    await db.folder.delete({
      where: { id: folderId },
    });

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
