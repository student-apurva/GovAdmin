const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const managerRoutesFactory = require("./routes/managerRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const complaintMonitor = require("./cron/complaintMonitor");

const User = require("./models/User");
const Notification = require("./models/Notification");

dotenv.config();

/* ================== APP & SERVER ================== */
const app = express();
const server = http.createServer(app);

/* ================== CORS CONFIG ================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* ================== SOCKET.IO SETUP ================== */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* Attach io to Express */
app.set("io", io);

/* ================== SOCKET EVENTS ================== */
io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined personal room: ${userId}`);
  });

  socket.on("managerOnline", async (userId) => {
    try {
      socket.userId = userId;

      const user = await User.findById(userId);
      if (!user) return;

      if (!user.loginHistory) user.loginHistory = [];

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

  socket.on("joinDepartment", (department) => {
    socket.join(department);
    console.log(`📌 Joined department room: ${department}`);
  });

  socket.on("complaintUpdate", async (data) => {
    try {
      io.to(data.department).emit("complaintUpdated", data);

      if (data.userId) {
        const notification = await Notification.create({
          user: data.userId,
          message: data.message,
          complaintId: data.complaintId,
        });

        io.to(data.userId).emit("newNotification", notification);
      }
    } catch (err) {
      console.error("COMPLAINT UPDATE ERROR:", err.message);
    }
  });

  socket.on("disconnect", async () => {
    try {
      if (!socket.userId) {
        console.log("🔴 Socket disconnected:", socket.id);
        return;
      }

      const user = await User.findById(socket.userId);
      if (!user) return;

      if (!user.loginHistory) user.loginHistory = [];

      const last = user.loginHistory[user.loginHistory.length - 1];

      if (last && !last.logoutAt) {
        last.logoutAt = new Date();
      }

      user.isOnline = false;
      await user.save();

      console.log("🔴 User offline:", socket.userId);
    } catch (err) {
      console.error("SOCKET OFFLINE ERROR:", err.message);
    }
  });
});

/* ================== DATABASE ================== */
connectDB();

/* ================== TEST ROUTE ================== */
app.get("/", (req, res) => {
  res.send("Municipal Complaint Backend is Running 🚀");
});

/* ================== ROUTES ================== */
const managerRoutes = managerRoutesFactory(io);

app.use("/api/auth", authRoutes);
app.use("/api/managers", managerRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/departments", departmentRoutes);

/* ================== CRON ================== */
complaintMonitor(io);

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Backend + Socket.IO running on network at http://10.1.63.212:${PORT}`
  );
});











// const express = require("express");
// const http = require("http");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const { Server } = require("socket.io");

// const connectDB = require("./config/db");
// const authRoutes = require("./routes/authRoutes");
// const managerRoutesFactory = require("./routes/managerRoutes");
// const complaintRoutes = require("./routes/complaintRoutes");
// const departmentRoutes = require("./routes/departmentRoutes"); // ✅ ADDED
// const complaintMonitor = require("./cron/complaintMonitor");

// const User = require("./models/User");
// const Notification = require("./models/Notification");

// dotenv.config();

// /* ================== APP & SERVER ================== */
// const app = express();
// const server = http.createServer(app);

// /* ================== SOCKET.IO SETUP ================== */
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// /* ✅ Attach io to Express App */
// app.set("io", io);

// /* ================== SOCKET EVENTS ================== */
// io.on("connection", (socket) => {
//   console.log("🟢 Socket connected:", socket.id);

//   /* 🔐 USER JOIN (Personal Room) */
//   socket.on("join", (userId) => {
//     socket.join(userId);
//     console.log(`👤 User joined personal room: ${userId}`);
//   });

//   /* 🟢 MANAGER ONLINE */
//   socket.on("managerOnline", async (userId) => {
//     try {
//       socket.userId = userId;

//       const user = await User.findById(userId);
//       if (!user) return;

//       if (!user.loginHistory) user.loginHistory = [];

//       user.loginHistory.push({
//         loginAt: new Date(),
//       });

//       user.isOnline = true;
//       await user.save();

//       console.log(`🟢 Manager online: ${userId}`);
//     } catch (err) {
//       console.error("SOCKET ONLINE ERROR:", err.message);
//     }
//   });

//   /* 📌 JOIN DEPARTMENT ROOM */
//   socket.on("joinDepartment", (department) => {
//     socket.join(department);
//     console.log(`📌 Joined department room: ${department}`);
//   });

//   /* 🔁 COMPLAINT STATUS UPDATE */
//   socket.on("complaintUpdate", async (data) => {
//     try {
//       io.to(data.department).emit("complaintUpdated", data);

//       if (data.userId) {
//         const notification = await Notification.create({
//           user: data.userId,
//           message: data.message,
//           complaintId: data.complaintId,
//         });

//         io.to(data.userId).emit("newNotification", notification);
//       }

//     } catch (err) {
//       console.error("COMPLAINT UPDATE ERROR:", err.message);
//     }
//   });

//   /* 🔴 MANAGER OFFLINE */
//   socket.on("disconnect", async () => {
//     try {
//       if (!socket.userId) {
//         console.log("🔴 Socket disconnected:", socket.id);
//         return;
//       }

//       const user = await User.findById(socket.userId);
//       if (!user) return;

//       if (!user.loginHistory) user.loginHistory = [];

//       const last = user.loginHistory[user.loginHistory.length - 1];

//       if (last && !last.logoutAt) {
//         last.logoutAt = new Date();
//       }

//       user.isOnline = false;
//       await user.save();

//       console.log("🔴 User offline:", socket.userId);
//     } catch (err) {
//       console.error("SOCKET OFFLINE ERROR:", err.message);
//     }
//   });
// });

// /* ================== MIDDLEWARE ================== */
// app.use(cors());
// app.use(express.json());

// /* ================== DATABASE ================== */
// connectDB();

// /* ================== ROUTES ================== */

// // ✅ Create managerRoutes with io
// const managerRoutes = managerRoutesFactory(io);

// app.use("/api/auth", authRoutes);
// app.use("/api/managers", managerRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/departments", departmentRoutes); // ✅ ADDED HERE

// /* ================== CRON ACTIVATION ================== */
// complaintMonitor(io);

// /* ================== START SERVER ================== */
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () => {
//   console.log(`🚀 Backend + Socket.IO running on http://localhost:${PORT}`);
// });
