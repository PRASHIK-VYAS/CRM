import { verifyAccessToken } from "../utils/jwt.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    req.user = verifyAccessToken(header.slice(7));
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function optionalAuth(req, _res, next) {
  const header = req.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    try {
      req.user = verifyAccessToken(header.slice(7));
    } catch {
      // silently ignore
    }
  }
  return next();
}

export function isAdmin(req, res, next) {
  if(req.user.role !== "admin") {
    return res.status(403).json({ message: "administrator access required" });
  }
  return next();
}