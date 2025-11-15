// src/pages/api/folders/[id].ts
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
    case "PATCH":
      return handlePatch(req, res, userId, id as string);
    case "DELETE":
      return handleDelete(req, res, userId, id as string);
    default:
      return res.status(405).json({ message: "Method not allowed" });
  }
}

// Update folder (rename, star, trash)
async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  folderId: string,
) {
  try {
    const updates = req.body;

    // Verify ownership
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

// Delete folder and all contents
async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  folderId: string,
) {
  try {
    // Verify ownership
    const folder = await db.folder.findUnique({
      where: { id: folderId },
    });

    if (!folder || folder.userId !== userId) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Delete folder (cascade will handle files and subfolders)
    await db.folder.delete({
      where: { id: folderId },
    });

    return res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Delete folder error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
