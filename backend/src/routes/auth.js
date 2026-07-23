import crypto from "node:crypto";
import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { signAccessToken } from "../utils/jwt.js";
import { authenticate, isAdmin } from "../middleware/auth.js";
import { sendOtpEmail } from "../utils/email.js";
import {
  findUserByEmail,
  createUser,
  generatePasswordResetOtp,
  verifyOtp as verifyOtpService,
  resetPassword,
} from "../services/auth.service.js";

const router = Router();

router.get("/", (_req, res) => res.json({ message: "CRM API is running" }));
router.get("/health", (_req, res) => res.json({ status: "ok" }));

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signAccessToken({ id: user.id, email: user.email, role: user.role });
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

    const user = await findUserByEmail(email);
    if (user) {
      const { otp } = await generatePasswordResetOtp(user);
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

    const user = await createUser({ name, email, password, role });
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

    const user = await findUserByEmail(email);
    if (!user || !(await verifyOtpService(user, otp))) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const token = signAccessToken({ id: user.id, email: user.email, purpose: "password-reset" });
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
      decoded = verifyAccessToken(header.slice(7));
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

    const user = await findUserByEmail(decoded.email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await resetPassword(user, newPassword);
    return res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Password reset failed:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;