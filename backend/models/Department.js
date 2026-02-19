const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // 🔥 Reference to User model
      default: null,
    },
  },
  {
    timestamps: true, // 🔥 Adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Department", departmentSchema);
