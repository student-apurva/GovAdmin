const express = require("express");
const User = require("../models/User");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ================= GET ALL MANAGERS ================= */
/* Used for manager list */
router.get("/", auth, async (req, res) => {
  try {
    // 🔐 Only system manager
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const managers = await User.find(
      { role: "department_manager" },
      {
        password: 0, // hide password
      }
    ).sort({ createdAt: -1 });

    res.json(managers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= TOGGLE MANAGER ACCESS ================= */
/* Enable / Disable button */
router.put("/toggle/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const manager = await User.findById(req.params.id);
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    manager.isActive = !manager.isActive;
    await manager.save();

    res.json({
      message: "Access updated",
      isActive: manager.isActive,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ================= GET SINGLE MANAGER ================= */
/* View modal */
router.get("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "system_manager") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const manager = await User.findById(req.params.id, {
      password: 0,
    });

    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.json(manager);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
