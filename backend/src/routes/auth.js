import crypto from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
import { signToken } from "../config/jwt.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import { sendOtpEmail } from "../utils/email.js";

const router = Router();

router.get("/", (_req, res) => res.json({ message: "CRM API is running" }));
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });
    return res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const otp = crypto.randomInt(100000, 1000000).toString();
      await prisma.user.update({
        where: { id: user.id },
        data: {
          otp,
          otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
          resetToken: crypto.randomBytes(32).toString("hex"),
          resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
          updatedAt: new Date(),
        },
      });
      await sendOtpEmail(email, otp);
    }

    return res.json({ message: "If that email exists, a reset code has been sent" });
  } catch (error) {
    console.error("Forgot-password failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/create_user", authenticate, isAdmin, async (req, res) => {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();
    const role = req.body.role ?? "coordinator";

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }
    if (!["admin", "tpo", "coordinator", "hod"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const now = new Date();
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email,
        password: await bcrypt.hash(password, 10),
        role,
        createdAt: now,
        updatedAt: now,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Create-user failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();
    const otp = String(req.body.otp ?? "");
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user?.otp || !user.otpExpiry || user.otp !== otp || user.otpExpiry <= new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { otp: null, otpExpiry: null, updatedAt: new Date() },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, purpose: "password-reset" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" },
    );
    return res.json({ token });
  } catch (error) {
    console.error("OTP verification failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Reset token required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({ message: "Invalid or expired reset token" });
    }
    if (decoded.purpose !== "password-reset") {
      return res.status(401).json({ message: "Invalid token purpose" });
    }

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: await bcrypt.hash(newPassword, 10),
        resetToken: null,
        resetTokenExpiry: null,
        updatedAt: new Date(),
      },
    });
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
