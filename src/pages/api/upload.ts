import { NextApiRequest, NextApiResponse } from "next";
import formidable, { Fields, Files } from "formidable";
import fs from "fs/promises";
import path from "path";

const isVercel =
  process.env.VERCEL === "1" ||
  !!process.env.BLOB_READ_WRITE_TOKEN ||
  process.env.VERCEL_ENV !== undefined;

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
    if (isVercel) {
      const { put } = await import("@vercel/blob");

      const form = formidable({
        maxFileSize: 100 * 1024 * 1024,
      });

      const [, files] = await new Promise<[Fields, Files]>(
        (resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              reject(err);
            } else {
              resolve([fields, files]);
            }
          });
        },
      );

      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;

      if (!uploadedFile) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const originalName = uploadedFile.originalFilename || "unnamed";
      const extension = path.extname(originalName);
      const fileBuffer = await fs.readFile(uploadedFile.filepath);

      const blob = await put(
        `uploads/${userId}/${Date.now()}-${originalName}`,
        fileBuffer,
        {
          access: "public",
          addRandomSuffix: true,
        },
      );

      return res.status(200).json({
        fileName: originalName,
        fileLink: blob.url,
        fileSize: uploadedFile.size,
        fileExtension: extension.replace(".", ""),
      });
    } else {
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      try {
        await fs.access(uploadDir);
      } catch {
        await fs.mkdir(uploadDir, { recursive: true });
      }

      const form = formidable({
        uploadDir: uploadDir,
        keepExtensions: true,
        maxFileSize: 100 * 1024 * 1024,
      });

      const [, files] = await new Promise<[Fields, Files]>(
        (resolve, reject) => {
          form.parse(req, (err, fields, files) => {
            if (err) {
              reject(err);
            } else {
              resolve([fields, files]);
            }
          });
        },
      );

      const uploadedFile = Array.isArray(files.file)
        ? files.file[0]
        : files.file;

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

      const publicUrl = `/uploads/${newFilename}`;

      return res.status(200).json({
        fileName: originalName,
        fileLink: publicUrl,
        fileSize: uploadedFile.size,
        fileExtension: extension.replace(".", ""),
      });
    }
  } catch (error) {
    console.error("=== Upload Error ===");
    console.error(error);
    return res.status(500).json({
      message: "Upload failed",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
