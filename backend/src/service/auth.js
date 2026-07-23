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