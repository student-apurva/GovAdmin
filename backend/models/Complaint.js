const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    /* ================= BASIC INFO ================= */

    complaintId: {
      type: String,
      unique: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= DEPARTMENT ================= */

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    /* ================= PRIORITY ================= */

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },

    /* ================= STATUS ================= */

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },

    /* ================= IMAGE ================= */

    image: {
      type: String, // Cloudinary URL or local path
    },

    /* ================= USER INFO ================= */

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ================= TIMELINE ================= */

    timeline: [
      {
        time: {
          type: String,
        },
        action: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

/* ================= AUTO GENERATE COMPLAINT ID ================= */

complaintSchema.pre("save", async function (next) {
  if (!this.complaintId) {
    const random = Math.floor(1000 + Math.random() * 9000);
    this.complaintId = `CMP-${random}`;
  }
  next();
});

module.exports = mongoose.model("Complaint", complaintSchema);
