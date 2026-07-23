import { access } from "node:fs";
import { signToken, signRefreshToken, verifyToken } from "../config/jwt.js";

export function signAccessToken(payload) {
    return signToken(payload);
}
export function signRefreshToken(payload) {
    return { 
        accessToken : signAccessToken(payload),
        refreshToken: signRefreshToken({ ...payload, type: "refresh" }),
    };
}

export function verifyAccessToken(token){
    const decoded = verifyToken(token);
    if(decoded.type === "refresh") {
        throw new Error("token is a refresh token, not access token");
    }
    return decoded;
}

export function verifyRefreshToken(token) {
    const decoded = verifyToken(token);
    if(decoded.type !== "refresh") {
        throw new Error("token is not a refresh token");
    }
    return decoded;
}