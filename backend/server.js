const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const managerRoutes = require("./routes/managerRoutes");
const User = require("./models/User");

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
    try {
      socket.userId = userId; // store for disconnect

      const user = await User.findById(userId);
      if (!user) return;

      user.loginHistory.push({
        loginAt: new Date(),
      });

      user.isOnline = true;
      await user.save();

      console.log(`🟢 Manager online: ${userId}`);
    } catch (err) {
      console.error("SOCKET ONLINE ERROR:", err.message);
    }
  });

  /* 🔹 JOIN DEPARTMENT ROOM */
  socket.on("joinDepartment", (department) => {
    socket.join(department);
    console.log(`📌 Socket joined department: ${department}`);
  });

  /* 🔹 COMPLAINT STATUS UPDATES */
  socket.on("complaintUpdate", (data) => {
    io.to(data.department).emit("complaintUpdated", data);
  });

  /* 🔴 MANAGER OFFLINE + LOGIN HISTORY UPDATE */
  socket.on("disconnect", async () => {
    try {
      if (!socket.userId) {
        console.log("🔴 Socket disconnected:", socket.id);
        return;
      }

      const user = await User.findById(socket.userId);
      if (!user) return;

      const last =
        user.loginHistory[user.loginHistory.length - 1];

      if (last && !last.logoutAt) {
        last.logoutAt = new Date();
      }

      user.isOnline = false;
      await user.save();

      console.log(`🔴 Manager offline: ${socket.userId}`);
    } catch (err) {
      console.error("SOCKET OFFLINE ERROR:", err.message);
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
app.use("/api/managers", managerRoutes);

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Backend + Socket.IO running on http://localhost:${PORT}`);
});
