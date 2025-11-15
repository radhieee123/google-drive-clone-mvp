import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/server/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;
    const user = await db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      user: userWithoutPassword,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
