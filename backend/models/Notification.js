const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },

  type: {
    type: String,
    enum: ["urgent", "normal", "info"],
    default: "normal",
  },

  recipientRole: {
    type: String,
    enum: ["system_manager", "department_manager"],
    required: true,
  },

  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // null = all users of that role
  },

  isRead: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
