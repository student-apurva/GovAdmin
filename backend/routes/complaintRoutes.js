const express = require("express");
const Complaint = require("../models/Complaint");
const createNotification = require("../utils/createNotification");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

/* ===============================
   CREATE COMPLAINT
================================ */
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;

    const complaint = await Complaint.create({
      title,
      description,
      department,
      priority,
      createdBy: req.user._id,
    });

    /* 🔥 IF URGENT → NOTIFY SYSTEM MANAGER */
    if (priority === "urgent") {
      await createNotification(req.app.get("io"), {
        title: "Urgent Complaint Received",
        message: `Urgent complaint in ${department}`,
        type: "urgent",
        recipientRole: "system_manager",
      });
    }

    res.status(201).json(complaint);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
