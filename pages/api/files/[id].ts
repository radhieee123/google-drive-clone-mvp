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

async function handlePatch(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  fileId: string,
) {
  try {
    const updates = req.body;

    const file = await db.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    const updatedFile = await db.file.update({
      where: { id: fileId },
      data: updates,
    });

    return res.status(200).json(updatedFile);
  } catch (error) {
    console.error("Update file error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function handleDelete(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string,
  fileId: string,
) {
  try {
    const file = await db.file.findUnique({
      where: { id: fileId },
    });

    if (!file || file.userId !== userId) {
      return res.status(404).json({ message: "File not found" });
    }

    await db.file.delete({
      where: { id: fileId },
    });

    return res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Delete file error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
