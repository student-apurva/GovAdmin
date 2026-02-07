const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ❌ Invalid format
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 🔐 Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔴 BLOCK DISABLED USERS EVERYWHERE
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Access disabled by System Manager" });
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
