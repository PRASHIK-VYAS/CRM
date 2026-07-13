import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRE = process.env.JWT_EXPIRE || '24h';

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
}

export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
