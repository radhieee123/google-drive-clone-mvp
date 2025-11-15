// src/lib/fileUpload.ts
// Local file upload (replaces Firebase upload)

import { addFile } from "./api-client";

export const uploadFile = async (
  file: File,
  setProgress: (progress: any) => void,
  folderId?: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    // Get userId from localStorage
    const userStr = localStorage.getItem("mockUser");
    if (!userStr) {
      reject(new Error("Not authenticated"));
      return;
    }
    const user = JSON.parse(userStr);

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Track upload progress
    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setProgress((prev: any[]) => [...prev, { [file.name]: progress }]);
      }
    });

    // Handle completion
    xhr.addEventListener("load", async () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);

          // Add file record to database
          await addFile(
            response.fileName,
            response.fileLink,
            response.fileExtension,
            response.fileSize,
            folderId,
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      } else {
        reject(new Error("Upload failed"));
      }
    });

    // Handle errors
    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    // Send request
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("x-user-id", user.id);
    xhr.send(formData);
  });
};

// Batch upload multiple files
export const uploadFiles = async (
  files: FileList,
  setProgress: (progress: any) => void,
  folderId?: string,
): Promise<void> => {
  const uploadPromises = Array.from(files).map((file) =>
    uploadFile(file, setProgress, folderId),
  );

  await Promise.all(uploadPromises);
};
