import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const isVercel =
  process.env.VERCEL === "1" || !!process.env.BLOB_READ_WRITE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (isVercel) {
      // Vercel Blob Storage
      const blob = await put(
        `uploads/${userId}/${Date.now()}-${file.name}`,
        file,
        {
          access: "public",
          addRandomSuffix: true,
        },
      );

      return NextResponse.json({
        fileName: file.name,
        fileLink: blob.url,
        fileExtension: file.name.split(".").pop() || "",
        fileSize: file.size,
      });
    } else {
      // Local File System
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = join(process.cwd(), "public", "uploads", userId);
      if (!existsSync(uploadDir)) {
        await mkdir(uploadDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.name}`;
      const filePath = join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        fileName: file.name,
        fileLink: `/uploads/${userId}/${fileName}`,
        fileExtension: file.name.split(".").pop() || "",
        fileSize: file.size,
      });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
