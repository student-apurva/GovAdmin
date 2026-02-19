const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No Authorization header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // ❌ Invalid format (Must be: Bearer TOKEN)
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 🔐 Verify token (must match login payload: { id, role })
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👤 Fetch full user from DB using decoded.id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔴 Block disabled users
    if (!user.isActive) {
      return res.status(403).json({
        message: "Access disabled by System Manager",
      });
    }

    // ✅ Attach full user object (includes role)
    req.user = user;

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
};

module.exports = authMiddleware;
