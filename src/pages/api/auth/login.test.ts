import handler from "./login";
import { db } from "../../../server/db";

jest.mock("../../../server/db", () => ({
  db: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

const mockRequestResponse = () => {
  const req: any = {
    method: "",
    body: {},
  };

  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };

  return { req, res };
};

describe("POST /api/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  test("should return 405 for invalid method", async () => {
    const { req, res } = mockRequestResponse();
    req.method = "GET";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  test("should return 401 if user not found", async () => {
    const { req, res } = mockRequestResponse();
    req.method = "POST";
    req.body = { email: "test@example.com", password: "123" };

    (db.user.findUnique as jest.Mock).mockResolvedValue(null);

    await handler(req, res);

    expect(db.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        password: true,
      },
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  test("should return 401 for wrong password", async () => {
    const { req, res } = mockRequestResponse();
    req.method = "POST";
    req.body = { email: "test@example.com", password: "wrong" };

    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      email: "test@example.com",
      name: "Test User",
      image: null,
      password: "correctPassword",
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
  });

  test("should return 200 for successful login", async () => {
    const { req, res } = mockRequestResponse();
    req.method = "POST";
    req.body = { email: "test@example.com", password: "correctPassword" };

    (db.user.findUnique as jest.Mock).mockResolvedValue({
      id: "123",
      email: "test@example.com",
      name: "Test User",
      image: "https://image.jpg",
      password: "correctPassword",
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Login successful",
      user: {
        id: "123",
        email: "test@example.com",
        name: "Test User",
        image: "https://image.jpg",
      },
    });
  });

  test("should return 500 on internal error", async () => {
    const { req, res } = mockRequestResponse();
    req.method = "POST";
    req.body = { email: "test@example.com", password: "123" };

    (db.user.findUnique as jest.Mock).mockRejectedValue(
      new Error("Database failed"),
    );

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal server error",
    });
  });
});
