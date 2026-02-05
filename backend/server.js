const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes"); // ✅ NEW
const User = require("./models/User"); // ✅ for online/offline

dotenv.config();

/* ================== APP & SERVER ================== */
const app = express();
const server = http.createServer(app);

/* ================== SOCKET.IO SETUP ================== */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

/* ================== SOCKET EVENTS ================== */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  /* 🔹 MANAGER ONLINE */
  socket.on("managerOnline", async (userId) => {
    socket.userId = userId; // store for disconnect
    await User.findByIdAndUpdate(userId, { isOnline: true });
    console.log(`🟢 Manager online: ${userId}`);
  });

  /* 🔹 JOIN DEPARTMENT ROOM */
  socket.on("joinDepartment", (department) => {
    socket.join(department);
    console.log(`📌 Socket joined department: ${department}`);
  });

  /* 🔹 COMPLAINT STATUS UPDATES */
  socket.on("complaintUpdate", (data) => {
    /*
      data = {
        id,
        status,
        officer,
        department
      }
    */
    io.to(data.department).emit("complaintUpdated", data);
  });

  /* 🔴 MANAGER OFFLINE */
  socket.on("disconnect", async () => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { isOnline: false });
      console.log(`🔴 Manager offline: ${socket.userId}`);
    } else {
      console.log("🔴 Socket disconnected:", socket.id);
    }
  });
});

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());

/* ================== DATABASE ================== */
connectDB();

/* ================== ROUTES ================== */
app.use("/api/auth", authRoutes);
app.use("/api/managers", managerRoutes); // ✅ NEW

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend + Socket.IO running on http://localhost:${PORT}`);
});
