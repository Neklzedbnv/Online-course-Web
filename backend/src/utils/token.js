const jwt = require("jsonwebtoken");
const cfg = require("../config/jwt");

function signToken(payload) {
  return jwt.sign(payload, cfg.secret, { expiresIn: cfg.expiresIn });
}

function verifyToken(token) {
  return jwt.verify(token, cfg.secret);
}

module.exports = { signToken, verifyToken };
