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
