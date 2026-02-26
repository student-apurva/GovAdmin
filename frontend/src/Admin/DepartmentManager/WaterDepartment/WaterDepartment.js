import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Users,
  Bell,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import DashboardPage from "./DashboardPage";
import ComplaintsPage from "./ComplaintsPage";
import AuditLogsPage from "./AuditLogsPage";
import OfficersPage from "./OfficersManagerPage";

const WaterDepartment = () => {
  const [page, setPage] = useState("Dashboard");
  const [time, setTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const notifications = [
    "Water supply issue reported",
    "Pipeline inspection completed",
    "Valve repair assigned",
  ];

  const confirmLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  /* CLOCK */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const renderPage = () => {
    switch (page) {
      case "Dashboard":
        return <DashboardPage />;
      case "Complaints":
        return <ComplaintsPage />;
      case "Audit Logs":
        return <AuditLogsPage />;
      case "Officers":
        return <OfficersPage department="Water Department" />;
      default:
        return <DashboardPage />;
    }
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Complaints", icon: <FileText size={18} /> },
    { name: "Audit Logs", icon: <ClipboardList size={18} /> },
    { name: "Officers", icon: <Users size={18} /> },
  ];

  return (
    <div style={styles.container}>
      {/* ================= SIDEBAR ================= */}
      <aside
        style={{
          ...styles.sidebar,
          width: sidebarOpen ? 240 : 80,
        }}
      >
        <div style={styles.logoSection}>
          {sidebarOpen ? (
            <h2 style={styles.logo}>KMC Water Dept</h2>
          ) : (
            <h2 style={styles.logoSmall}>W</h2>
          )}
        </div>

        <div style={{ flex: 1 }}>
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => setPage(item.name)}
              style={{
                ...styles.menuItem,
                background:
                  page === item.name
                    ? "rgba(201,162,39,0.15)"
                    : "transparent",
                color:
                  page === item.name
                    ? "#c9a227"
                    : "#e2e8f0",
                justifyContent: sidebarOpen
                  ? "flex-start"
                  : "center",
              }}
            >
              {page === item.name && (
                <span style={styles.activeIndicator} />
              )}
              {item.icon}
              {sidebarOpen && (
                <span style={styles.menuText}>
                  {item.name}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* LOGOUT */}
        <div
          onClick={() => setShowLogoutConfirm(true)}
          style={{
            ...styles.menuItem,
            color: "#f87171",
            justifyContent: sidebarOpen
              ? "flex-start"
              : "center",
            marginTop: "auto",
          }}
        >
          <LogOut size={18} />
          {sidebarOpen && (
            <span style={styles.menuText}>Logout</span>
          )}
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div style={styles.main}>
        <header style={styles.navbar}>
          <div style={styles.navLeft}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={styles.iconBtn}
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div>
              <h3 style={{ margin: 0, color: "#ffffff" }}>
                Kolhapur Municipal Corporation
              </h3>
              <p style={styles.subtitle}>
                Water Department
              </p>
            </div>
          </div>

          <div style={styles.navRight}>
            <div style={styles.clock}>
              {time.toLocaleTimeString("en-IN")}
            </div>

            <div style={styles.notificationIcon}>
              <Bell size={20} />
              <span style={styles.badge}>
                {notifications.length}
              </span>
            </div>

            <UserCircle size={26} />
          </div>
        </header>

        <div style={styles.content}>{renderPage()}</div>
      </div>

      {/* ================= LOGOUT CONFIRM ================= */}
      {showLogoutConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.confirmModal}>
            <h3>Confirm Logout</h3>
            <p>Are you sure you want to logout?</p>
            <div style={styles.confirmButtons}>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                style={styles.confirmBtn}
                onClick={confirmLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= IAS-LEVEL STYLES ================= */

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    background: "#f8fafc",
    fontFamily: "Segoe UI, sans-serif",
  },

  sidebar: {
    background: "#0f172a",
    color: "#ffffff",
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    transition: "width 0.35s ease",
    boxShadow: "4px 0 20px rgba(0,0,0,0.3)",
  },

  logoSection: {
    marginBottom: 35,
    textAlign: "center",
  },

  logo: {
    margin: 0,
    fontSize: 16,
    fontWeight: 700,
    color: "#c9a227",
    letterSpacing: "1px",
  },

  logoSmall: {
    margin: 0,
    fontSize: 28,
    fontWeight: 800,
    color: "#c9a227",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "12px 16px",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 8,
    position: "relative",
    transition: "all 0.25s ease",
  },

  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 8,
    bottom: 8,
    width: 4,
    background: "#c9a227",
    borderRadius: 4,
  },

  menuText: {
    fontSize: 14,
    fontWeight: 500,
  },

  main: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  navbar: {
    background:
      "linear-gradient(90deg, #0f172a, #1e293b)",
    padding: "16px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 4px 25px rgba(0,0,0,0.3)",
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 18,
  },

  navRight: {
    display: "flex",
    alignItems: "center",
    gap: 25,
    color: "#ffffff",
  },

  subtitle: {
    margin: 0,
    fontSize: 13,
    color: "#cbd5e1",
  },

  clock: {
    fontWeight: 600,
    color: "#c9a227",
  },

  iconBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
    color: "#ffffff",
  },

  content: {
    padding: 30,
    overflowY: "auto",
    flex: 1,
  },

  notificationIcon: {
    position: "relative",
    cursor: "pointer",
    color: "#ffffff",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    background: "#c9a227",
    color: "#0f172a",
    fontSize: 10,
    padding: "2px 6px",
    borderRadius: "50%",
    fontWeight: "bold",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },

  confirmModal: {
    background: "#ffffff",
    padding: 30,
    borderRadius: 12,
    width: 350,
    textAlign: "center",
  },

  confirmButtons: {
    marginTop: 20,
    display: "flex",
    justifyContent: "space-between",
  },

  cancelBtn: {
    padding: "8px 16px",
    background: "#e2e8f0",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  confirmBtn: {
    padding: "8px 16px",
    background: "#0f172a",
    color: "#ffffff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

export default WaterDepartment;