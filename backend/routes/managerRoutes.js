// backend/routes/managerRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const auth = require("../middleware/authMiddleware"); // ✅ CORRECT
const User = require("../models/User");

/* =====================================================
   GET ALL DEPARTMENT MANAGERS
===================================================== */
router.get("/", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const managers = await User.find({
      role: "department_manager",
    }).sort({ createdAt: -1 });

    res.json(managers);
  } catch (err) {
    console.error("GET MANAGERS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   CREATE DEPARTMENT MANAGER
===================================================== */
router.post("/create-manager", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const {
      name,
      email,
      password,
      department,
      isActive = true,
      phone,
      personalEmail,
      address,
    } = req.body;

    if (!name || !email || !password || !department) {
      return res.status(400).json({
        message: "Name, email, password and department are required",
      });
    }

    /* ❌ Duplicate email check */
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already exists" });
    }

    /* 🔐 Hash password */
    const hashedPassword = await bcrypt.hash(password, 10);

    /* 🆔 Generate Enrollment ID */
    const count = await User.countDocuments({
      role: "department_manager",
    });

    const enrollmentId = `KMC-DM-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(4, "0")}`;

    /* ✅ Create manager */
    const manager = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "department_manager",
      department,
      enrollmentId,
      isActive,
      phone,
      personalEmail,
      address,
    });

    res.status(201).json({
      message: "Manager created successfully",
      manager: {
        _id: manager._id,
        name: manager.name,
        email: manager.email,
        department: manager.department,
        enrollmentId: manager.enrollmentId,
        isActive: manager.isActive,
      },
    });
  } catch (err) {
    console.error("CREATE MANAGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   TOGGLE MANAGER ACCESS (ENABLE / DISABLE)
===================================================== */
router.put("/toggle/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const manager = await User.findById(req.params.id);

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    manager.isActive = !manager.isActive;
    await manager.save();

    res.json({
      message: "Access updated successfully",
      isActive: manager.isActive,
    });
  } catch (err) {
    console.error("TOGGLE ACCESS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* =====================================================
   DELETE MANAGER
===================================================== */
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Access denied" });
    }

    const manager = await User.findById(req.params.id);

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    if (manager.role !== "department_manager") {
      return res.status(403).json({ message: "Not allowed" });
    }

    await manager.deleteOne();

    res.json({ message: "Manager deleted successfully" });
  } catch (err) {
    console.error("DELETE MANAGER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
