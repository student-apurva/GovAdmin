const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* =========================================================
   CREATE DEFAULT SYSTEM MANAGER (RUNS ONCE)
========================================================= */
const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = "admin@kmc.gov.in";

    const exists = await User.findOne({ email: adminEmail });
    if (exists) return;

    const hashedPassword = await bcrypt.hash("admin123", 12);

    await User.create({
      name: "System Manager",
      email: adminEmail,
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

ensureDefaultAdmin();

/* =========================================================
   LOGIN
========================================================= */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Access disabled by System Manager" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    user.isOnline = true;
    user.loginHistory = user.loginHistory || [];
    user.loginHistory.push({
      loginAt: new Date(),
      logoutAt: null,
    });

    await user.save();

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
        department: user.department,
        enrollmentId: user.enrollmentId,
        isActive: user.isActive,
        isOnline: user.isOnline,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   GET CURRENT USER
========================================================= */
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   UPDATE PROFILE
========================================================= */
router.put("/update-profile", auth, async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   CHANGE PASSWORD
========================================================= */
router.put("/change-password", auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   LOGOUT
========================================================= */
router.post("/logout", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isOnline = false;

    const last = user.loginHistory[user.loginHistory.length - 1];
    if (last && !last.logoutAt) {
      last.logoutAt = new Date();
    }

    await user.save();

    res.json({ message: "Logged out successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================================================
   VERIFY SYSTEM MANAGER
========================================================= */
router.post("/verify-system-manager", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({
      email,
      role: "system_manager",
      isActive: true,
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid System Manager credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid System Manager credentials" });
    }

    res.json({
      success: true,
      message: "System Manager verified successfully",
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* =========================================================
   CREATE MANAGER (AUTO PROFESSIONAL ENROLLMENT ID)
========================================================= */
router.post("/create-manager", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Only System Manager allowed" });
    }

    const { name, email, password, department, isActive, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const finalRole =
      role === "System Manager"
        ? "system_manager"
        : "department_manager";

    /* ================= PROFESSIONAL ID FORMAT ================= */
    let generatedEnrollmentId = null;

    if (finalRole === "department_manager") {
      const year = new Date().getFullYear();
      const count = await User.countDocuments({ role: "department_manager" });
      const nextNumber = (count + 1).toString().padStart(4, "0");
      generatedEnrollmentId = `KMC-DM-${year}-${nextNumber}`;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: finalRole,
      department: department || null,
      enrollmentId: generatedEnrollmentId,
      isActive: isActive ?? true,
      isOnline: false,
      loginHistory: [],
    });

    res.status(201).json({
      message:
        finalRole === "system_manager"
          ? "System Manager created successfully"
          : "Department Manager created successfully",
    });

  } catch (err) {
    console.error("CREATE MANAGER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
