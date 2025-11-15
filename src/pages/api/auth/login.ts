// src/pages/api/auth/login.ts
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

    // In a real app, you'd hash the password and compare
    // For mock auth, we'll do a simple check
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

    // Simple password check (in production, use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Don't send password back
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
