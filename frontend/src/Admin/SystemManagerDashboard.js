import React, { useState } from "react";

const SystemManagerDashboard = ({ setUser }) => {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div style={styles.page}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        {/* TOP */}
        <div>
          <div style={styles.brand}>
            <div style={styles.logoCircle}>KMC</div>
            <h2 style={styles.logoText}>Admin Panel</h2>
          </div>

          <ul style={styles.menu}>
            <li
              style={activePage === "dashboard" ? styles.activeItem : styles.menuItem}
              onClick={() => setActivePage("dashboard")}
            >
              Dashboard
            </li>
            <li
              style={activePage === "departments" ? styles.activeItem : styles.menuItem}
              onClick={() => setActivePage("departments")}
            >
              Departments
            </li>
            <li
              style={activePage === "managers" ? styles.activeItem : styles.menuItem}
              onClick={() => setActivePage("managers")}
            >
              Managers
            </li>
            <li
              style={activePage === "analytics" ? styles.activeItem : styles.menuItem}
              onClick={() => setActivePage("analytics")}
            >
              Analytics
            </li>
            <li
              style={activePage === "reports" ? styles.activeItem : styles.menuItem}
              onClick={() => setActivePage("reports")}
            >
              Reports
            </li>
          </ul>
        </div>

        {/* LOGOUT */}
        <div
          style={styles.logout}
          onClick={() => setUser(null)}
        >
          Logout
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "analytics" && <Analytics />}
        {activePage === "departments" && <Placeholder title="Manage Departments" />}
        {activePage === "managers" && <Placeholder title="Department Managers" />}
        {activePage === "reports" && <Placeholder title="System Reports" />}
      </main>
    </div>
  );
};

/* ===================== PAGES ===================== */

const Dashboard = () => (
  <>
    <header style={styles.header}>
      <h1 style={styles.pageTitle}>System Manager Dashboard</h1>
      <p style={styles.subtitle}>Overall control & monitoring</p>
    </header>

    <section style={styles.cardRow}>
      <StatCard label="Total Departments" value="12" />
      <StatCard label="Department Managers" value="28" />
      <StatCard label="Total Complaints" value="4,562" />
      <StatCard label="Pending Complaints" value="312" />
    </section>
  </>
);

const Analytics = () => (
  <>
    <h1 style={styles.pageTitle}>Complaint Analytics</h1>

    <div style={{ maxWidth: "500px" }}>
      <ChartBar label="Health Department" value={80} />
      <ChartBar label="Sanitation Department" value={60} />
      <ChartBar label="Water Supply" value={45} />
      <ChartBar label="Electricity" value={70} />
    </div>
  </>
);

const Placeholder = ({ title }) => (
  <h1 style={styles.pageTitle}>{title}</h1>
);

/* ===================== COMPONENTS ===================== */

const StatCard = ({ label, value }) => (
  <div style={styles.card}>
    <p style={styles.cardLabel}>{label}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const ChartBar = ({ label, value }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ marginBottom: "6px", fontSize: "14px" }}>{label}</div>
    <div style={styles.barBg}>
      <div style={{ ...styles.barFill, width: `${value}%` }} />
    </div>
  </div>
);

/* ===================== STYLES ===================== */

const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "Inter, Segoe UI, sans-serif",
    background: "#f4f6f8",
  },

  sidebar: {
    width: "260px",
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
    gap: "12px",
    marginBottom: "30px",
  },

  logoCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    background: "#38bdf8",
    color: "#002b45",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    fontSize: "18px",
    margin: 0,
  },

  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  menuItem: {
    padding: "12px 14px",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "6px",
    opacity: 0.85,
  },

  activeItem: {
    padding: "12px 14px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.15)",
    fontWeight: "600",
    marginBottom: "6px",
  },

  logout: {
    padding: "12px",
    background: "#b91c1c",
    textAlign: "center",
    borderRadius: "6px",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: "30px",
  },

  header: {
    marginBottom: "30px",
  },

  pageTitle: {
    margin: 0,
    fontSize: "26px",
  },

  subtitle: {
    margin: "6px 0 0",
    color: "#6b7280",
  },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "22px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  cardLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  cardValue: {
    margin: "8px 0 0",
    fontSize: "30px",
    color: "#0b3c5d",
  },

  barBg: {
    height: "10px",
    background: "#e5e7eb",
    borderRadius: "6px",
  },

  barFill: {
    height: "10px",
    background: "#0b3c5d",
    borderRadius: "6px",
  },
};

export default SystemManagerDashboard;
