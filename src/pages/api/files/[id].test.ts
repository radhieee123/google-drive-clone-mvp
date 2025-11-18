import { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../server/db";
import handler from "../../../pages/api/files/[id]";

jest.mock("../../../server/db", () => ({
  db: {
    file: {
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("/api/files/[id] API Handler", () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn(() => ({ json: jsonMock }));

    req = {
      query: { id: "file-123" },
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
      req.method = "PATCH";
      req.headers = {};

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 401 when x-user-id is undefined", async () => {
      req.method = "DELETE";
      req.headers = { "x-user-id": undefined };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });

    it("should return 401 when x-user-id is empty string", async () => {
      req.method = "PATCH";
      req.headers = { "x-user-id": "" };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });

  describe("Method Validation", () => {
    it("should return 405 for GET method", async () => {
      req.method = "GET";

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(405);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Method not allowed" });
    });

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
  });

  describe("PATCH /api/files/[id]", () => {
    beforeEach(() => {
      req.method = "PATCH";
    });

    it("should successfully update a file when user owns it", async () => {
      const mockFile = {
        id: "file-123",
        userId: "user-456",
        name: "old-name.txt",
      };
      const updates = { name: "new-name.txt" };
      const updatedFile = { ...mockFile, ...updates };

      req.body = updates;
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockResolvedValue(updatedFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.findUnique).toHaveBeenCalledWith({
        where: { id: "file-123" },
      });
      expect(db.file.update).toHaveBeenCalledWith({
        where: { id: "file-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFile);
    });

    it("should return 404 when file does not exist", async () => {
      (db.file.findUnique as jest.Mock).mockResolvedValue(null);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "File not found" });
      expect(db.file.update).not.toHaveBeenCalled();
    });

    it("should return 404 when user does not own the file", async () => {
      const mockFile = {
        id: "file-123",
        userId: "different-user",
        name: "file.txt",
      };
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "File not found" });
      expect(db.file.update).not.toHaveBeenCalled();
    });

    it("should handle multiple field updates", async () => {
      const mockFile = {
        id: "file-123",
        userId: "user-456",
        name: "old.txt",
        starred: false,
      };
      const updates = { name: "new.txt", starred: true };
      const updatedFile = { ...mockFile, ...updates };

      req.body = updates;
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockResolvedValue(updatedFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.update).toHaveBeenCalledWith({
        where: { id: "file-123" },
        data: updates,
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(updatedFile);
    });

    it("should handle empty update object", async () => {
      const mockFile = {
        id: "file-123",
        userId: "user-456",
        name: "file.txt",
      };
      req.body = {};
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockResolvedValue(mockFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.update).toHaveBeenCalledWith({
        where: { id: "file-123" },
        data: {},
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should return 500 when database findUnique throws error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      (db.file.findUnique as jest.Mock).mockRejectedValue(
        new Error("Database connection failed"),
      );

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });

    it("should return 500 when database update throws error", async () => {
      const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
      const mockFile = { id: "file-123", userId: "user-456" };
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockRejectedValue(
        new Error("Update failed"),
      );

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Internal server error",
      });
      consoleErrorSpy.mockRestore();
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in file ID", async () => {
      req.method = "PATCH";
      req.query = { id: "file-123-!@#$%^&*()" };
      const mockFile = {
        id: "file-123-!@#$%^&*()",
        userId: "user-456",
      };
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockResolvedValue(mockFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.findUnique).toHaveBeenCalledWith({
        where: { id: "file-123-!@#$%^&*()" },
      });
    });

    it("should handle array as file ID (query parameter edge case)", async () => {
      req.method = "DELETE";
      req.query = { id: ["file-1", "file-2"] };

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.findUnique).toHaveBeenCalled();
    });

    it("should handle null in request body for PATCH", async () => {
      req.method = "PATCH";
      req.body = null;
      const mockFile = { id: "file-123", userId: "user-456" };
      (db.file.findUnique as jest.Mock).mockResolvedValue(mockFile);
      (db.file.update as jest.Mock).mockResolvedValue(mockFile);

      await handler(req as NextApiRequest, res as NextApiResponse);

      expect(db.file.update).toHaveBeenCalledWith({
        where: { id: "file-123" },
        data: null,
      });
    });
  });
});
