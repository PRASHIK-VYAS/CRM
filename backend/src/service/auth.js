import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js"

export async function findUserByEmail(email) {
    return prisma.user.findUnique({ where : { email: email.trim().toLowerCase() }});
}
export async function validatePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
}

export async function hashPassword(plain){
    return bcrypt.hash(plain, 10);
}

export async function createUser({ name, email, password, role }){
    const now = new Date();
    return prisma.user.create({
        data : {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: await hashPassword(password),
            role,
            createdAt : now,
            updatedAt : now,
        },
        select: { id: true, name: true, email: true, role: true },
    });
}

export async function generatePasswordResetOtp(user) {
    const otp = crypto.randomInt(100000, 1000000).toString();
    const resetToken = crypto.randomBytes(32).toString("hex");
    await prisma.user.update({
        where : { id: user.id },
        data : {
            otp,
            otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
            resetToken,
            resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
            updatedAt: new Date(),
        },
    });
    return { otp, resetToken };
}

export async function verifyOtp(user, otp) {
  if (!user.otp || !user.otpExpiry || user.otp !== otp || user.otpExpiry <= new Date()) {
    return false;
  }
  await prisma.user.update({
    where: { id: user.id },
    data: { otp: null, otpExpiry: null, updatedAt: new Date() },
  });
  return true;
}

export async function resetPassword(user, newPassword) {
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: await hashPassword(newPassword),
      resetToken: null,
      resetTokenExpiry: null,
      updatedAt: new Date(),
    },
  });
}