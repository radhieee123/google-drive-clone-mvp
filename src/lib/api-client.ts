// src/lib/api-client.ts
// API client to replace Firestore operations

const API_BASE = "/api";

// Helper to get userId from localStorage (mock auth)
const getUserId = (): string | null => {
  const userStr = localStorage.getItem("mockUser");
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  return user.id;
};

// Helper to add userId header
const getHeaders = () => {
  const userId = getUserId();
  return {
    "Content-Type": "application/json",
    "x-user-id": userId || "",
  };
};

// FILES API

export const addFile = async (
  fileName: string,
  fileLink: string,
  fileExtension: string,
  fileSize: number,
  folderId?: string,
) => {
  const response = await fetch(`${API_BASE}/files`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      fileName,
      fileLink,
      fileExtension,
      fileSize,
      folderId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add file");
  }

  return response.json();
};

export const getFiles = async (
  folderId?: string,
  starred?: boolean,
  trashed?: boolean,
) => {
  const params = new URLSearchParams();
  if (folderId) params.append("folderId", folderId);
  if (starred) params.append("starred", "true");
  if (trashed) params.append("trashed", "true");

  const response = await fetch(`${API_BASE}/files?${params.toString()}`, {
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to get files");
  }

  return response.json();
};

export const renameFile = async (fileId: string, fileName: string) => {
  const response = await fetch(`${API_BASE}/files/${fileId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ fileName }),
  });

  if (!response.ok) {
    throw new Error("Failed to rename file");
  }

  return response.json();
};

export const starFile = async (fileId: string, isStarred: boolean) => {
  const response = await fetch(`${API_BASE}/files/${fileId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ isStarred }),
  });

  if (!response.ok) {
    throw new Error("Failed to star file");
  }

  return response.json();
};

export const trashFile = async (fileId: string, isTrashed: boolean) => {
  const response = await fetch(`${API_BASE}/files/${fileId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ isTrashed, isStarred: false }),
  });

  if (!response.ok) {
    throw new Error("Failed to trash file");
  }

  return response.json();
};

export const deleteFile = async (fileId: string) => {
  const response = await fetch(`${API_BASE}/files/${fileId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }

  return response.json();
};

// FOLDERS API

export const addFolder = async (folderName: string, parentId?: string) => {
  const response = await fetch(`${API_BASE}/folders`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      folderName,
      parentId,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to add folder");
  }

  return response.json();
};

export const renameFolder = async (folderId: string, folderName: string) => {
  const response = await fetch(`${API_BASE}/folders/${folderId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ folderName }),
  });

  if (!response.ok) {
    throw new Error("Failed to rename folder");
  }

  return response.json();
};

export const starFolder = async (folderId: string, isStarred: boolean) => {
  const response = await fetch(`${API_BASE}/folders/${folderId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ isStarred }),
  });

  if (!response.ok) {
    throw new Error("Failed to star folder");
  }

  return response.json();
};

export const trashFolder = async (folderId: string, isTrashed: boolean) => {
  const response = await fetch(`${API_BASE}/folders/${folderId}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ isTrashed, isStarred: false }),
  });

  if (!response.ok) {
    throw new Error("Failed to trash folder");
  }

  return response.json();
};

export const deleteFolder = async (folderId: string) => {
  const response = await fetch(`${API_BASE}/folders/${folderId}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to delete folder");
  }

  return response.json();
};
