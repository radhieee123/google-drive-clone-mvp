import { logCustom } from "../utils/logger";
import { trackedLocalStorage } from "../utils/logger/storage";

const API_BASE = "/api";

const getUserId = (): string | null => {
  const userStr = trackedLocalStorage.getItem("mockUser");
  if (!userStr) return null;
  const user = JSON.parse(userStr);
  return user.id;
};

const getHeaders = () => {
  const userId = getUserId();
  return {
    "Content-Type": "application/json",
    "x-user-id": userId || "",
  };
};

const logApiCall = async (
  endpoint: string,
  method: string,
  success: boolean,
  error?: string,
) => {
  logCustom(`API ${method} ${endpoint}`, "API_CALL", {
    endpoint,
    method,
    status: success ? "success" : "error",
    error,
  });
};

export const addFile = async (
  fileName: string,
  fileLink: string,
  fileExtension: string,
  fileSize: number,
  folderId?: string,
) => {
  const endpoint = `${API_BASE}/files`;
  try {
    const response = await fetch(endpoint, {
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
      await logApiCall(endpoint, "POST", false, `HTTP ${response.status}`);
      throw new Error("Failed to add file");
    }

    await logApiCall(endpoint, "POST", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "POST", false, String(error));
    throw error;
  }
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

  const endpoint = `${API_BASE}/files?${params.toString()}`;

  try {
    const response = await fetch(endpoint, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "GET", false, `HTTP ${response.status}`);
      throw new Error("Failed to get files");
    }

    await logApiCall(endpoint, "GET", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "GET", false, String(error));
    throw error;
  }
};

export const renameFile = async (fileId: string, fileName: string) => {
  const endpoint = `${API_BASE}/files/${fileId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ fileName }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to rename file");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const starFile = async (fileId: string, isStarred: boolean) => {
  const endpoint = `${API_BASE}/files/${fileId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ isStarred }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to star file");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const trashFile = async (fileId: string, isTrashed: boolean) => {
  const endpoint = `${API_BASE}/files/${fileId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ isTrashed, isStarred: false }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to trash file");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const deleteFile = async (fileId: string) => {
  const endpoint = `${API_BASE}/files/${fileId}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "DELETE", false, `HTTP ${response.status}`);
      throw new Error("Failed to delete file");
    }

    await logApiCall(endpoint, "DELETE", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "DELETE", false, String(error));
    throw error;
  }
};

export const addFolder = async (folderName: string, parentId?: string) => {
  const endpoint = `${API_BASE}/folders`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        folderName,
        parentId,
      }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "POST", false, `HTTP ${response.status}`);
      throw new Error("Failed to add folder");
    }

    await logApiCall(endpoint, "POST", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "POST", false, String(error));
    throw error;
  }
};

export const renameFolder = async (folderId: string, folderName: string) => {
  const endpoint = `${API_BASE}/folders/${folderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ folderName }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to rename folder");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const starFolder = async (folderId: string, isStarred: boolean) => {
  const endpoint = `${API_BASE}/folders/${folderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ isStarred }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to star folder");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const trashFolder = async (folderId: string, isTrashed: boolean) => {
  const endpoint = `${API_BASE}/folders/${folderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ isTrashed, isStarred: false }),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "PATCH", false, `HTTP ${response.status}`);
      throw new Error("Failed to trash folder");
    }

    await logApiCall(endpoint, "PATCH", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "PATCH", false, String(error));
    throw error;
  }
};

export const deleteFolder = async (folderId: string) => {
  const endpoint = `${API_BASE}/folders/${folderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "DELETE", false, `HTTP ${response.status}`);
      throw new Error("Failed to delete folder");
    }

    await logApiCall(endpoint, "DELETE", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "DELETE", false, String(error));
    throw error;
  }
};

export async function getFolderById(folderId: string) {
  const endpoint = `/api/folders/${folderId}`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "GET", false, `HTTP ${response.status}`);
      throw new Error("Failed to fetch folder");
    }

    await logApiCall(endpoint, "GET", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "GET", false, String(error));
    throw error;
  }
}

export async function getFolderPath(folderId: string) {
  const endpoint = `/api/folders/${folderId}/path`;

  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "GET", false, `HTTP ${response.status}`);
      throw new Error("Failed to fetch folder path");
    }

    await logApiCall(endpoint, "GET", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "GET", false, String(error));
    throw error;
  }
}

export const getAllFolders = async () => {
  const endpoint = `${API_BASE}/folders`;

  try {
    const response = await fetch(endpoint, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      await logApiCall(endpoint, "GET", false, `HTTP ${response.status}`);
      throw new Error("Failed to get folders");
    }

    await logApiCall(endpoint, "GET", true);
    return response.json();
  } catch (error) {
    await logApiCall(endpoint, "GET", false, String(error));
    throw error;
  }
};
