import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userId = req.headers["x-user-id"] as string;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const form = formidable({
      uploadDir: path.join(process.cwd(), "public", "uploads"),
      keepExtensions: true,
      maxFileSize: 100 * 1024 * 1024,
    });

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const [fields, files] = await new Promise<
      [formidable.Fields, formidable.Files]
    >((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const originalName = uploadedFile.originalFilename || "unnamed";
    const extension = path.extname(originalName);
    const nameWithoutExt = path.basename(originalName, extension);
    const timestamp = Date.now();
    const newFilename = `${nameWithoutExt}-${timestamp}${extension}`;

    const oldPath = uploadedFile.filepath;
    const newPath = path.join(uploadDir, newFilename);

    await fs.rename(oldPath, newPath);

    return res.status(200).json({
      fileName: originalName,
      fileLink: `/uploads/${newFilename}`,
      fileSize: uploadedFile.size,
      fileExtension: extension.replace(".", ""),
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed" });
  }
}
