const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
const EXPIRE = process.env.JWT_EXPIRE || '24h';

function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRE });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { signToken, verifyToken };