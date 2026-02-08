const { verifyToken } = require("../utils/token");
const User = require("../models/User");

module.exports = async function authMiddleware(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    if (!h.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token" });
    }

    const token = h.split(" ")[1];
    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized" });
  }
};
