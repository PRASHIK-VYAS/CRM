import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;
const EXPIRE = process.env.JWT_EXPIRE || '24h';
const REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

if(!SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

export { SECRET, EXPIRE, REFRESH_EXPIRE };

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
}

export function signRefreshToken(payload){
  return jwt.sign(payload, SECRET, { expiresIn: REFRESH_EXPIRE });
}

export function verifyToken(token){
  return jwt.verify(token, SECRET);
}