import React, { useState, useEffect } from "react";
import DashboardPage from "./DashboardPage";
import ManagersPage from "./ManagersPage";
import DepartmentsPage from "./DepartmentsPage";
import AnalyticsPage from "./AnalyticsPage";
import ReportsPage from "./ReportsPage";

const pageTitles = {
  dashboard: "System Overview",
  managers: "Department Managers",
  departments: "Departments",
  analytics: "Analytics & Insights",
  reports: "System Reports",
};

const SystemManagerDashboard = ({ setUser }) => {
  const [activePage, setActivePage] = useState("dashboard");
  const [dateTime, setDateTime] = useState(new Date());

  /* ================= LIVE CLOCK ================= */
  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "managers":
        return <ManagersPage />;
      case "departments":
        return <DepartmentsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "reports":
        return <ReportsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div style={styles.layout}>
      {/* ================= SIDEBAR ================= */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.logo}>KMC</div>
            <div>
              <h2 style={styles.brandTitle}>System Manager</h2>
              <p style={styles.brandSub}>Admin Control Panel</p>
            </div>
          </div>

          <ul style={styles.menu}>
            <MenuItem label="Dashboard" value="dashboard" active={activePage} onClick={setActivePage} />
            <MenuItem label="Managers" value="managers" active={activePage} onClick={setActivePage} />
            <MenuItem label="Departments" value="departments" active={activePage} onClick={setActivePage} />
            <MenuItem label="Analytics" value="analytics" active={activePage} onClick={setActivePage} />
            <MenuItem label="Reports" value="reports" active={activePage} onClick={setActivePage} />
          </ul>
        </div>

        <div style={styles.logout} onClick={() => setUser(null)}>
          Logout
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div style={styles.mainWrapper}>
        {/* HEADER */}
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>
            {pageTitles[activePage]}
          </h1>

          {/* 🕒 CLOCK */}
          <div style={styles.clockBox}>
            <div style={styles.time}>
              {dateTime.toLocaleTimeString()}
            </div>
            <div style={styles.date}>
              {dateTime.toLocaleDateString(undefined, {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </header>

        <main style={styles.mainContent}>{renderPage()}</main>
      </div>
    </div>
  );
};

/* ================= MENU ITEM ================= */

const MenuItem = ({ label, value, active, onClick }) => (
  <li
    onClick={() => onClick(value)}
    style={{
      ...styles.menuItem,
      ...(active === value ? styles.menuItemActive : {}),
    }}
  >
    {label}
  </li>
);

/* ================= STYLES ================= */

const styles = {
  layout: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, Segoe UI, sans-serif",
    background: "#f4f6f8",
  },

  sidebar: {
    width: 270,
    background: "#0b3c5d",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 20px",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },

  logo: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "#38bdf8",
    color: "#002b45",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  brandTitle: { margin: 0, fontSize: 16 },
  brandSub: { margin: 0, fontSize: 12, opacity: 0.8 },

  menu: { listStyle: "none", padding: 0, margin: 0 },

  menuItem: {
    padding: "12px 16px",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 6,
    opacity: 0.9,
  },

  menuItemActive: {
    background: "rgba(255,255,255,0.18)",
    fontWeight: 600,
  },

  logout: {
    padding: "12px",
    background: "#b91c1c",
    borderRadius: 6,
    textAlign: "center",
    cursor: "pointer",
  },

  mainWrapper: { flex: 1, display: "flex", flexDirection: "column" },

  header: {
    background: "#ffffff",
    padding: "18px 30px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerTitle: { margin: 0, fontSize: 22, color: "#0b3c5d" },

  clockBox: {
    textAlign: "right",
    fontSize: 14,
    color: "#374151",
  },

  time: {
    fontWeight: 700,
    fontSize: 16,
    color: "#0b3c5d",
  },

  date: {
    fontSize: 12,
    color: "#6b7280",
  },

  mainContent: {
    flex: 1,
    padding: 30,
    overflowY: "auto",
  },
};

export default SystemManagerDashboard;
