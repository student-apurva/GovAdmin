const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ===================== CREATE DEFAULT SYSTEM MANAGER (RUNS ONCE) ===================== */
const ensureDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({
      email: "admin@kmc.gov.in",
    });

    if (adminExists) return;

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "System Manager",
      email: "admin@kmc.gov.in",
      password: hashedPassword,
      role: "system_manager",
      isActive: true,
      isOnline: false,
      loginHistory: [],
    });

    console.log("✅ Default System Manager created");
  } catch (err) {
    console.error("❌ Failed to create default admin:", err.message);
  }
};

/* 🔥 EXECUTE ON FILE LOAD */
ensureDefaultAdmin();

/* ===================== LOGIN ===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* 🔴 BLOCK DISABLED USERS */
    if (!user.isActive) {
      return res
        .status(403)
        .json({ message: "Access disabled by System Manager" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    /* ===================== 🟢 LOGIN TRACKING (SAFE FIX) ===================== */
    if (!user.loginHistory) {
      user.loginHistory = [];
    }

    user.loginHistory.push({
      loginAt: new Date(),
    });

    user.isOnline = true;
    await user.save();
    /* ======================================================================= */

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        department: user.department || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || null,
        enrollmentId: user.enrollmentId || null,
        isActive: user.isActive,
        isOnline: user.isOnline,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===================== CREATE DEPARTMENT MANAGER ===================== */
router.post("/create-manager", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { name, email, password, department, isActive } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const count = await User.countDocuments({ role: "department_manager" });
    const enrollmentId = `KMC-DM-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "department_manager",
      department,
      enrollmentId,
      isActive: isActive !== undefined ? isActive : true,
      isOnline: false,
      loginHistory: [],
    });

    res.status(201).json({
      message: "Department Manager created successfully",
    });
  } catch (err) {
    console.error("CREATE MANAGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
