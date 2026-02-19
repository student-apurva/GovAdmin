const mongoose = require("mongoose");

/* ================= LOGIN HISTORY SUB-SCHEMA ================= */
const loginHistorySchema = new mongoose.Schema({
  loginAt: {
    type: Date,
    default: Date.now,
  },
  logoutAt: {
    type: Date,
    default: null,
  },
});

/* ================= MAIN USER SCHEMA ================= */
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["system_manager", "department_manager"],
      required: true,
    },

    // 🔥 Optional for system_manager
    department: {
      type: String,
      default: null,
    },

    // 🔥 Optional but unique for department_manager
    enrollmentId: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    loginHistory: [loginHistorySchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
