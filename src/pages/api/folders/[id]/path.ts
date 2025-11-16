import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Folder ID is required" });
  }

  try {
    interface FolderPathItem {
      id: string;
      name: string;
      parentId: string | null;
    }

    const path: FolderPathItem[] = [];
    let currentFolderId: string | null = id;

    // Traverse up the folder hierarchy
    while (currentFolderId) {
      const folder: {
        id: string;
        folderName: string;
        parentId: string | null;
      } | null = await prisma.folder.findFirst({
        where: {
          id: currentFolderId,
          userId: userId,
        },
        select: {
          id: true,
          folderName: true,
          parentId: true,
        },
      });

      if (!folder) {
        return res.status(404).json({ error: "Folder not found" });
      }

      path.unshift({
        id: folder.id,
        name: folder.folderName,
        parentId: folder.parentId,
      });

      currentFolderId = folder.parentId;
    }

    return res.status(200).json({ path });
  } catch (error) {
    console.error("Error fetching folder path:", error);
    return res.status(500).json({ error: "Failed to fetch folder path" });
  }
}
