import { addFile } from "./drive-service";

type ProgressUpdate = Array<Record<string, number>>;

export const uploadFile = async (
  file: File,
  setProgress: (progress: (prev: ProgressUpdate) => ProgressUpdate) => void,
  folderId?: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const userStr = localStorage.getItem("mockUser");
    if (!userStr) {
      reject(new Error("Not authenticated"));
      return;
    }
    const user = JSON.parse(userStr);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const progress = Math.round((e.loaded / e.total) * 100);
        setProgress((prev: ProgressUpdate) => [
          ...prev,
          { [file.name]: progress },
        ]);
      }
    });

    xhr.addEventListener("load", async () => {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);

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

    xhr.addEventListener("error", () => {
      reject(new Error("Upload failed"));
    });

    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("x-user-id", user.id);
    xhr.send(formData);
  });
};

export const uploadFiles = async (
  files: FileList,
  setProgress: (progress: (prev: ProgressUpdate) => ProgressUpdate) => void,
  folderId?: string,
): Promise<void> => {
  const uploadPromises = Array.from(files).map((file) =>
    uploadFile(file, setProgress, folderId),
  );

  await Promise.all(uploadPromises);
};
