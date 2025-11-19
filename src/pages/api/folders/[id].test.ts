import { NextApiRequest, NextApiResponse } from "next";
import handler from "./[id]";
import { db } from "../../../server/db";

jest.mock("../../../server/db", () => ({
  db: {
    folder: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("/api/folders/[id] API Handler", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    req = {
      query: { id: "folder-123" },
      headers: { "x-user-id": "user-456" },
      body: {},
    };

    res = {
      status: statusMock,
    };

    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 when x-user-id header is missing", async () => {
      req.method = "GET";
      req.headers = {};

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 401 when x-user-id is undefined", async () => {
      req.method = "PATCH";
      req.headers = { "x-user-id": undefined };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 401 when x-user-id is empty string", async () => {
      req.method = "DELETE";
      req.headers = { "x-user-id": "" };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });

  describe("Method Validation", () => {
    it("should return 405 for POST method", async () => {
      req.method = "POST";

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Method not allowed" });
    });

    it("should return 405 for PUT method", async () => {
      req.method = "PUT";

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Method not allowed" });
    });

    it("should return 405 for unsupported methods", async () => {
      req.method = "OPTIONS";

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Method not allowed" });
    });
  });

  describe("GET /api/folders/[id]", () => {
    beforeEach(() => {
      req.method = "GET";
    });

    it("should successfully retrieve a folder when user owns it", async () => {
      const mockFolder = {
        id: "folder-123",
        folderName: "My Folder",
        parentId: null,
        isStarred: false,
        isTrashed: false,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        userId: "user-456",
      };

      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.findUnique).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        select: {
          id: true,
          folderName: true,
          parentId: true,
          isStarred: true,
          isTrashed: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockFolder);
    });

    it("should return 404 when folder does not exist", async () => {
      (db.folder.findUnique as jest.Mock).mockResolvedValue(null);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
    });

    it("should return 404 when user does not own the folder", async () => {
      const mockFolder = {
        id: "folder-123",
        folderName: "Someone else's folder",
        userId: "different-user",
        parentId: null,
        isStarred: false,
        isTrashed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
    });

    it("should retrieve a folder with parent", async () => {
      const mockFolder = {
        id: "folder-123",
        folderName: "Subfolder",
        parentId: "parent-folder-id",
        isStarred: true,
        isTrashed: false,
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-20"),
        userId: "user-456",
      };

      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockFolder);
    });

    it("should retrieve a starred folder", async () => {
      const mockFolder = {
        id: "folder-123",
        folderName: "Important Folder",
        parentId: null,
        isStarred: true,
        isTrashed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-456",
      };

      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockFolder);
      expect(jsonMock.mock.calls[0][0].isStarred).toBe(true);
    });

    it("should retrieve a trashed folder", async () => {
      const mockFolder = {
        id: "folder-123",
        folderName: "Trashed Folder",
        parentId: null,
        isStarred: false,
        isTrashed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: "user-456",
      };

      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockFolder);
      expect(jsonMock.mock.calls[0][0].isTrashed).toBe(true);
    });

    describe("Error scenarios", () => {
      let consoleErrorSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      it("should return 500 when database throws error", async () => {
        (db.folder.findUnique as jest.Mock).mockRejectedValue(
          new Error("Database connection failed"),
        );

        await handler(req as NextApiRequest, res as NextApiResponse);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Internal server error",
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Get folder error:",
          expect.any(Error),
        );
      });
    });
  });

  describe("PATCH /api/folders/[id]", () => {
    beforeEach(() => {
      req.method = "PATCH";
    });

    it("should successfully update a folder when user owns it", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        folderName: "Old Name",
      };
      const updates = { folderName: "New Name" };
      const updatedFolder = { ...mockFolder, ...updates };

      req.body = updates;
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(updatedFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.findUnique).toHaveBeenCalledWith({
        where: { id: "folder-123" },
      });
      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFolder);
    });

    it("should return 404 when folder does not exist", async () => {
      (db.folder.findUnique as jest.Mock).mockResolvedValue(null);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
      expect(db.folder.update).not.toHaveBeenCalled();
    });

    it("should return 404 when user does not own the folder", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "different-user",
        folderName: "Folder",
      };
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
      expect(db.folder.update).not.toHaveBeenCalled();
    });

    it("should update folder with isStarred", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        isStarred: false,
      };
      const updates = { isStarred: true };
      const updatedFolder = { ...mockFolder, ...updates };

      req.body = updates;
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(updatedFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFolder);
    });

    it("should update folder with isTrashed", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        isTrashed: false,
      };
      const updates = { isTrashed: true };
      const updatedFolder = { ...mockFolder, ...updates };

      req.body = updates;
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(updatedFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should update folder with parentId", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        parentId: null,
      };
      const updates = { parentId: "parent-folder-id" };
      const updatedFolder = { ...mockFolder, ...updates };

      req.body = updates;
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(updatedFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFolder);
    });

    it("should handle multiple field updates", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        folderName: "Old Name",
        isStarred: false,
      };
      const updates = {
        folderName: "New Name",
        isStarred: true,
        parentId: "parent-123",
      };
      const updatedFolder = { ...mockFolder, ...updates };

      req.body = updates;
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(updatedFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFolder);
    });

    it("should handle empty update object", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        folderName: "Folder",
      };
      req.body = {};
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: {},
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    describe("Error scenarios", () => {
      let consoleErrorSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      it("should return 500 when database findUnique throws error", async () => {
        (db.folder.findUnique as jest.Mock).mockRejectedValue(
          new Error("Database connection failed"),
        );

        await handler(req as NextApiRequest, res as NextApiResponse);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Internal server error",
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Update folder error:",
          expect.any(Error),
        );
      });

      it("should return 500 when database update throws error", async () => {
        const mockFolder = { id: "folder-123", userId: "user-456" };
        (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
        (db.folder.update as jest.Mock).mockRejectedValue(
          new Error("Update failed"),
        );

        await handler(req as NextApiRequest, res as NextApiResponse);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Internal server error",
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Update folder error:",
          expect.any(Error),
        );
      });
    });
  });

  describe("DELETE /api/folders/[id]", () => {
    beforeEach(() => {
      req.method = "DELETE";
    });

    it("should successfully delete a folder when user owns it", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "user-456",
        folderName: "Folder to delete",
      };
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.delete as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.findUnique).toHaveBeenCalledWith({
        where: { id: "folder-123" },
      });
      expect(db.folder.delete).toHaveBeenCalledWith({
        where: { id: "folder-123" },
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Folder deleted successfully",
      });
    });

    it("should return 404 when folder does not exist", async () => {
      (db.folder.findUnique as jest.Mock).mockResolvedValue(null);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
      expect(db.folder.delete).not.toHaveBeenCalled();
    });

    it("should return 404 when user does not own the folder", async () => {
      const mockFolder = {
        id: "folder-123",
        userId: "different-user",
        folderName: "Someone else's folder",
      };
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Folder not found" });
      expect(db.folder.delete).not.toHaveBeenCalled();
    });

    describe("Error scenarios", () => {
      let consoleErrorSpy: jest.SpyInstance;

      beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      });

      afterEach(() => {
        consoleErrorSpy.mockRestore();
      });

      it("should return 500 when database findUnique throws error", async () => {
        (db.folder.findUnique as jest.Mock).mockRejectedValue(
          new Error("Database error"),
        );

        await handler(req as NextApiRequest, res as NextApiResponse);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Internal server error",
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Delete folder error:",
          expect.any(Error),
        );
      });

      it("should return 500 when database delete throws error", async () => {
        const mockFolder = { id: "folder-123", userId: "user-456" };
        (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
        (db.folder.delete as jest.Mock).mockRejectedValue(
          new Error("Delete failed"),
        );

        await handler(req as NextApiRequest, res as NextApiResponse);

        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledWith({
          message: "Internal server error",
        });
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          "Delete folder error:",
          expect.any(Error),
        );
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in folder ID", async () => {
      req.method = "GET";
      req.query = { id: "folder-!@#$%^&*()" };
      const mockFolder = {
        id: "folder-!@#$%^&*()",
        userId: "user-456",
        folderName: "Special Folder",
        parentId: null,
        isStarred: false,
        isTrashed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.findUnique).toHaveBeenCalledWith({
        where: { id: "folder-!@#$%^&*()" },
        select: expect.any(Object),
      });
    });

    it("should handle null request body for PATCH", async () => {
      req.method = "PATCH";
      req.body = null;
      const mockFolder = { id: "folder-123", userId: "user-456" };
      (db.folder.findUnique as jest.Mock).mockResolvedValue(mockFolder);
      (db.folder.update as jest.Mock).mockResolvedValue(mockFolder);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.update).toHaveBeenCalledWith({
        where: { id: "folder-123" },
        data: null,
      });
    });

    it("should handle undefined folder ID", async () => {
      req.method = "GET";
      req.query = { id: undefined };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.folder.findUnique).toHaveBeenCalled();
    });
  });
});
