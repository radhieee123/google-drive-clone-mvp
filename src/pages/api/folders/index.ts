// src/pages/api/folders/index.ts
import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

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
    case "POST":
      return handlePost(req, res, userId);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// Create folder
async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
) {
  try {
    const { folderName, parentId } = req.body;

    const folder = await db.folder.create({
      data: {
        folderName,
        parentId: parentId || null,
        userId,
      },
    });

    return res.status(201).json(folder);
  } catch (error) {
    console.error("Create folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
