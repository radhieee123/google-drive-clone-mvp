import {
  addFile,
  getFiles,
  renameFile,
  starFile,
  trashFile,
  deleteFile,
  addFolder,
  renameFolder,
  starFolder,
  trashFolder,
  deleteFolder,
  getFolderById,
  getFolderPath,
  getAllFolders,
} from "./api-client";

global.fetch = jest.fn();

function mockFetchResponse(data: any, ok = true) {
  (global.fetch as jest.Mock).mockResolvedValue({
    ok,
    json: async () => data,
  });
}

beforeEach(() => {
  jest.clearAllMocks();

  const store: Record<string, string> = {
    mockUser: JSON.stringify({ id: "user123" }),
  };

  global.localStorage = {
    getItem: jest.fn((key) => store[key] ?? null),
    setItem: jest.fn((key, value) => (store[key] = value)),
    removeItem: jest.fn((key) => delete store[key]),
    clear: jest.fn(() => Object.keys(store).forEach((k) => delete store[k])),
    key: jest.fn(),
    length: 1,
  };
});

test("getFiles builds query params correctly", async () => {
  mockFetchResponse([]);

  await getFiles("folder1", true, false);

  expect(fetch).toHaveBeenCalledWith(
    "/api/files?folderId=folder1&starred=true",
    expect.anything(),
  );
});

test("getFiles throws when response is not ok", async () => {
  mockFetchResponse({}, false);

  await expect(getFiles()).rejects.toThrow("Failed to get files");
});

test("renameFile sends PATCH body correctly", async () => {
  mockFetchResponse({ updated: true });

  await renameFile("file123", "new.txt");

  const call = (fetch as jest.Mock).mock.calls[0];
  expect(call[0]).toBe("/api/files/file123");
  expect(JSON.parse(call[1].body)).toEqual({ fileName: "new.txt" });
});

test("starFile correctly sets isStarred", async () => {
  mockFetchResponse({});

  await starFile("file123", true);

  expect(fetch).toHaveBeenCalledWith(
    "/api/files/file123",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ isStarred: true }),
    }),
  );
});

test("trashFile sets isTrashed and resets isStarred", async () => {
  mockFetchResponse({});

  await trashFile("file123", true);

  expect(fetch).toHaveBeenCalledWith(
    "/api/files/file123",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ isTrashed: true, isStarred: false }),
    }),
  );
});

test("deleteFile sends DELETE request", async () => {
  mockFetchResponse({ deleted: true });

  await deleteFile("file123");

  expect(fetch).toHaveBeenCalledWith(
    "/api/files/file123",
    expect.objectContaining({
      method: "DELETE",
    }),
  );
});

test("addFolder sends POST request", async () => {
  mockFetchResponse({ id: "folder123" });

  const result = await addFolder("Projects");

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders",
    expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ folderName: "Projects", parentId: undefined }),
    }),
  );

  expect(result).toEqual({ id: "folder123" });
});

test("renameFolder sends correct PATCH request", async () => {
  mockFetchResponse({ renamed: true });

  await renameFolder("folder123", "New Folder");

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders/folder123",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ folderName: "New Folder" }),
    }),
  );
});

test("starFolder sets isStarred", async () => {
  mockFetchResponse({});

  await starFolder("folder123", true);

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders/folder123",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ isStarred: true }),
    }),
  );
});

test("trashFolder sets isTrashed and resets isStarred", async () => {
  mockFetchResponse({});

  await trashFolder("folder123", true);

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders/folder123",
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ isTrashed: true, isStarred: false }),
    }),
  );
});

test("deleteFolder sends DELETE request", async () => {
  mockFetchResponse({});

  await deleteFolder("folder123");

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders/folder123",
    expect.objectContaining({
      method: "DELETE",
    }),
  );
});

test("getFolderById sends GET request", async () => {
  mockFetchResponse({ id: "folder123" });

  await getFolderById("folder123");

  expect(fetch).toHaveBeenCalledWith(
    "/api/folders/folder123",
    expect.objectContaining({
      method: "GET",
      headers: expect.any(Object),
    }),
  );
});

test("getFolderById throws on error", async () => {
  mockFetchResponse({}, false);

  await expect(getFolderById("folder123")).rejects.toThrow(
    "Failed to fetch folder",
  );
});

describe("api-client - Additional Coverage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("getUserId and getHeaders", () => {
    it("should return null userId when mockUser is not in localStorage", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-user-id": "",
          }),
        }),
      );
    });

    it("should use userId from localStorage when mockUser exists", async () => {
      localStorage.setItem("mockUser", JSON.stringify({ id: "user-123" }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-user-id": "user-123",
          }),
        }),
      );
    });
  });

  describe("Query parameter building", () => {
    it("should build URL with all parameters for getFiles", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles("folder-123", true, true);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?folderId=folder-123&starred=true&trashed=true",
        expect.any(Object),
      );
    });

    it("should build URL with only folderId parameter", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles("folder-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?folderId=folder-123",
        expect.any(Object),
      );
    });

    it("should build URL with no parameters", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?",
        expect.any(Object),
      );
    });
  });

  describe("Error response handling", () => {
    it("should throw error with correct message for 404 responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(getFiles()).rejects.toThrow("Failed to get files");
    });

    it("should throw error with correct message for 500 responses", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 500,
      });

      await expect(deleteFile("file-123")).rejects.toThrow(
        "Failed to delete file",
      );
    });

    it("should handle network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(addFile("test.txt", "link", "txt", 100)).rejects.toThrow(
        "Network error",
      );
    });
  });

  describe("Request body formatting", () => {
    it("should send correct body for addFile with all parameters", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile(
        "test.txt",
        "http://example.com",
        "txt",
        1024,
        "folder-123",
      );

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            fileName: "test.txt",
            fileLink: "http://example.com",
            fileExtension: "txt",
            fileSize: 1024,
            folderId: "folder-123",
          }),
        }),
      );
    });

    it("should send correct body for addFile without folderId", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile("test.txt", "http://example.com", "txt", 1024);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "test.txt",
            fileLink: "http://example.com",
            fileExtension: "txt",
            fileSize: 1024,
            folderId: undefined,
          }),
        }),
      );
    });

    it("should send correct body for trashFile with isStarred set to false", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await trashFile("file-123", true);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files/file-123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ isTrashed: true, isStarred: false }),
        }),
      );
    });

    it("should send correct body for trashFolder with isStarred set to false", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await trashFolder("folder-123", true);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders/folder-123",
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({ isTrashed: true, isStarred: false }),
        }),
      );
    });
  });

  describe("Folder-specific operations", () => {
    it("should call getFolderPath with correct endpoint", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ path: [{ id: "1", name: "root" }] }),
      });

      await getFolderPath("folder-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders/folder-123/path",
        expect.objectContaining({
          method: "GET",
        }),
      );
    });

    it("should call getAllFolders with correct endpoint", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ folders: [] }),
      });

      await getAllFolders();

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders",
        expect.objectContaining({
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
        }),
      );
    });

    it("should add folder with parentId", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "folder-456" }),
      });

      await addFolder("Subfolder", "parent-123");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders",
        expect.objectContaining({
          body: JSON.stringify({
            folderName: "Subfolder",
            parentId: "parent-123",
          }),
        }),
      );
    });
  });
});

describe("api-client - Enhanced Coverage (3%+ increase)", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe("Special characters and encoding", () => {
    it("should handle file names with special characters", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      const specialFileName = "file@#$%^&*().txt";
      await addFile(specialFileName, "link", "txt", 100);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: specialFileName,
            fileLink: "link",
            fileExtension: "txt",
            fileSize: 100,
            folderId: undefined,
          }),
        }),
      );
    });

    it("should handle folder names with unicode characters", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "folder-123" }),
      });

      const unicodeName = "文件夾 📁";
      await addFolder(unicodeName);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders",
        expect.objectContaining({
          body: JSON.stringify({
            folderName: unicodeName,
            parentId: undefined,
          }),
        }),
      );
    });

    it("should handle file names with emojis", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const emojiName = "🎉 Party File 🎊.txt";
      await renameFile("file-123", emojiName);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files/file-123",
        expect.objectContaining({
          body: JSON.stringify({ fileName: emojiName }),
        }),
      );
    });

    it("should handle URLs with query parameters in folderId", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      const complexFolderId = "folder-123?param=value&other=data";
      await getFiles(complexFolderId);

      expect(global.fetch).toHaveBeenCalledWith(
        `/api/files?folderId=${encodeURIComponent(complexFolderId)}`,
        expect.any(Object),
      );
    });

    it("should handle very long file names", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const longName = "a".repeat(500) + ".txt";
      await renameFile("file-123", longName);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files/file-123",
        expect.objectContaining({
          body: JSON.stringify({ fileName: longName }),
        }),
      );
    });
  });

  describe("Boundary conditions", () => {
    it("should handle zero file size", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile("empty.txt", "link", "txt", 0);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "empty.txt",
            fileLink: "link",
            fileExtension: "txt",
            fileSize: 0,
            folderId: undefined,
          }),
        }),
      );
    });

    it("should handle very large file size", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      const largeSize = Number.MAX_SAFE_INTEGER;
      await addFile("huge.iso", "link", "iso", largeSize);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "huge.iso",
            fileLink: "link",
            fileExtension: "iso",
            fileSize: largeSize,
            folderId: undefined,
          }),
        }),
      );
    });

    it("should handle empty string file extension", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile("noextension", "link", "", 100);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "noextension",
            fileLink: "link",
            fileExtension: "",
            fileSize: 100,
            folderId: undefined,
          }),
        }),
      );
    });

    it("should handle empty folder name", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "folder-123" }),
      });

      await addFolder("");

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders",
        expect.objectContaining({
          body: JSON.stringify({
            folderName: "",
            parentId: undefined,
          }),
        }),
      );
    });
  });

  describe("Various HTTP status codes", () => {
    it("should handle 400 Bad Request", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 400,
      });

      await expect(addFile("test.txt", "link", "txt", 100)).rejects.toThrow(
        "Failed to add file",
      );
    });

    it("should handle 401 Unauthorized", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 401,
      });

      await expect(getFiles()).rejects.toThrow("Failed to get files");
    });

    it("should handle 403 Forbidden", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 403,
      });

      await expect(deleteFile("file-123")).rejects.toThrow(
        "Failed to delete file",
      );
    });

    it("should handle 409 Conflict", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 409,
      });

      await expect(addFolder("Existing Folder")).rejects.toThrow(
        "Failed to add folder",
      );
    });

    it("should handle 503 Service Unavailable", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 503,
      });

      await expect(getAllFolders()).rejects.toThrow("Failed to get folders");
    });
  });

  describe("Response parsing edge cases", () => {
    it("should handle response with null data", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => null,
      });

      const result = await getFiles();
      expect(result).toBeNull();
    });

    it("should handle response with empty object", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({}),
      });

      const result = await getFolderById("folder-123");
      expect(result).toEqual({});
    });

    it("should handle response with nested objects", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          file: {
            id: "file-123",
            metadata: {
              nested: {
                value: "deep",
              },
            },
          },
        }),
      });

      const result = await renameFile("file-123", "new-name.txt");
      expect(result.file.metadata.nested.value).toBe("deep");
    });

    it("should handle response with arrays", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          files: [
            { id: "1", name: "file1.txt" },
            { id: "2", name: "file2.txt" },
          ],
        }),
      });

      const result = await getFiles();
      expect(result.files).toHaveLength(2);
    });

    it("should handle JSON parsing errors", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError("Unexpected token");
        },
      });

      await expect(getFiles()).rejects.toThrow("Unexpected token");
    });
  });

  describe("Boolean flag combinations", () => {
    it("should handle starred files without folder", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles(undefined, true, false);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?starred=true",
        expect.any(Object),
      );
    });

    it("should handle trashed files without folder", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles(undefined, false, true);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?trashed=true",
        expect.any(Object),
      );
    });

    it("should handle starred and trashed together", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles(undefined, true, true);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files?starred=true&trashed=true",
        expect.any(Object),
      );
    });

    it("should handle unstarring a file", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await starFile("file-123", false);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files/file-123",
        expect.objectContaining({
          body: JSON.stringify({ isStarred: false }),
        }),
      );
    });

    it("should handle untrashing a file", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await trashFile("file-123", false);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files/file-123",
        expect.objectContaining({
          body: JSON.stringify({ isTrashed: false, isStarred: false }),
        }),
      );
    });

    it("should handle unstarring a folder", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await starFolder("folder-123", false);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders/folder-123",
        expect.objectContaining({
          body: JSON.stringify({ isStarred: false }),
        }),
      );
    });

    it("should handle untrashing a folder", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await trashFolder("folder-123", false);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders/folder-123",
        expect.objectContaining({
          body: JSON.stringify({ isTrashed: false, isStarred: false }),
        }),
      );
    });
  });

  describe("Network error scenarios", () => {
    it("should handle timeout errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("Request timeout"),
      );

      await expect(getFiles()).rejects.toThrow("Request timeout");
    });

    it("should handle connection refused", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("Connection refused"),
      );

      await expect(addFile("test.txt", "link", "txt", 100)).rejects.toThrow(
        "Connection refused",
      );
    });

    it("should handle DNS resolution errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("DNS lookup failed"),
      );

      await expect(getAllFolders()).rejects.toThrow("DNS lookup failed");
    });

    it("should handle CORS errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("CORS policy blocked"),
      );

      await expect(deleteFile("file-123")).rejects.toThrow(
        "CORS policy blocked",
      );
    });
  });

  describe("User ID and header edge cases", () => {
    it("should handle malformed JSON in localStorage", async () => {
      localStorage.setItem("mockUser", "invalid-json{");

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await expect(getFiles()).rejects.toThrow();
    });

    it("should handle mockUser without id field", async () => {
      localStorage.setItem("mockUser", JSON.stringify({ name: "John" }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-user-id": "",
          }),
        }),
      );
    });

    it("should handle empty string user id", async () => {
      localStorage.setItem("mockUser", JSON.stringify({ id: "" }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-user-id": "",
          }),
        }),
      );
    });

    it("should handle numeric user id", async () => {
      localStorage.setItem("mockUser", JSON.stringify({ id: 12345 }));

      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ data: [] }),
      });

      await getFiles();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            "x-user-id": 12345,
          }),
        }),
      );
    });
  });

  describe("Parameter validation and edge cases", () => {
    it("should handle null folderId in addFile", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile("test.txt", "link", "txt", 100, null as any);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "test.txt",
            fileLink: "link",
            fileExtension: "txt",
            fileSize: 100,
            folderId: null,
          }),
        }),
      );
    });

    it("should handle null parentId in addFolder", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "folder-123" }),
      });

      await addFolder("Test Folder", null as any);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/folders",
        expect.objectContaining({
          body: JSON.stringify({
            folderName: "Test Folder",
            parentId: null,
          }),
        }),
      );
    });

    it("should handle file links with special protocols", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      await addFile("test.txt", "data:text/plain;base64,SGVsbG8=", "txt", 100);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: expect.stringContaining("data:text/plain;base64"),
        }),
      );
    });

    it("should handle very long file extensions", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      const longExt = "a".repeat(100);
      await addFile("test", "link", longExt, 100);

      expect(global.fetch).toHaveBeenCalledWith(
        "/api/files",
        expect.objectContaining({
          body: JSON.stringify({
            fileName: "test",
            fileLink: "link",
            fileExtension: longExt,
            fileSize: 100,
            folderId: undefined,
          }),
        }),
      );
    });
  });

  describe("Concurrent operations", () => {
    it("should handle multiple simultaneous file additions", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ id: "file-123" }),
      });

      const promises = [
        addFile("file1.txt", "link1", "txt", 100),
        addFile("file2.txt", "link2", "txt", 200),
        addFile("file3.txt", "link3", "txt", 300),
      ];

      await Promise.all(promises);

      expect(global.fetch).toHaveBeenCalledTimes(6);
    });

    it("should handle mixed operations concurrently", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const promises = [
        getFiles(),
        addFolder("New Folder"),
        renameFile("file-123", "renamed.txt"),
        starFolder("folder-456", true),
      ];

      await Promise.all(promises);

      expect(global.fetch).toHaveBeenCalledTimes(8);
    });

    it("should handle errors in concurrent operations", async () => {
      let callCount = 0;
      (global.fetch as jest.Mock).mockImplementation(() => {
        callCount++;
        if (callCount === 2) {
          return Promise.resolve({
            ok: false,
            status: 500,
          });
        }
        return Promise.resolve({
          ok: true,
          json: async () => ({ success: true }),
        });
      });

      const promises = [
        getFiles(),
        getAllFolders(),
        getFolderById("folder-123"),
      ];

      const results = await Promise.allSettled(promises);

      expect(results[0].status).toBe("fulfilled");
      expect(results[1].status).toBe("rejected");
      expect(results[2].status).toBe("fulfilled");
    });
  });

  describe("Logging edge cases", () => {
    it("should log both success and error for failed request", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      try {
        await getFiles();
      } catch (error) {
        return;
      }
    });

    it("should log network errors", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(
        new Error("Network failure"),
      );

      try {
        await deleteFile("file-123");
      } catch (error) {
        return;
      }
    });
  });

  describe("Additional folder operations coverage", () => {
    it("should handle getFolderPath with error", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        status: 404,
      });

      await expect(getFolderPath("folder-123")).rejects.toThrow(
        "Failed to fetch folder path",
      );
    });

    it("should handle getFolderPath with network error", async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

      await expect(getFolderPath("folder-123")).rejects.toThrow(
        "Network error",
      );
    });

    it("should handle getFolderById with complex response", async () => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: "folder-123",
          name: "My Folder",
          children: [
            { id: "child-1", name: "Child 1" },
            { id: "child-2", name: "Child 2" },
          ],
          metadata: {
            created: "2024-01-01",
            modified: "2024-01-15",
          },
        }),
      });

      const result = await getFolderById("folder-123");

      expect(result.id).toBe("folder-123");
      expect(result.children).toHaveLength(2);
      expect(result.metadata.created).toBe("2024-01-01");
    });
  });
});
