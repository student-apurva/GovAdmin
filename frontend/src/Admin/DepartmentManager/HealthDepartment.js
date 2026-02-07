import React, { useState, useEffect } from "react";

const HealthDepartment = ({ setUser }) => {
  const [page, setPage] = useState("dashboard");
  const [time, setTime] = useState(new Date());

  /* ================= CLOCK ================= */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= SAMPLE HEALTH COMPLAINTS ================= */
  const complaints = [
    {
      id: 1,
      title: "Garbage not collected",
      area: "Ward 12",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Drainage overflow",
      area: "Ward 4",
      priority: "High",
      status: "Resolved",
    },
    {
      id: 3,
      title: "Unhygienic public toilet",
      area: "Ward 7",
      priority: "Medium",
      status: "Pending",
    },
  ];

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = total - resolved;

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Health Department</h1>
          <p style={styles.subtitle}>
            Public Health, Sanitation & Disease Control Division
          </p>
        </div>

        <div style={styles.clockBox}>
          <div>{time.toLocaleTimeString("en-IN")}</div>
          <div>{time.toLocaleDateString("en-IN")}</div>
        </div>
      </header>

      {/* ================= BODY ================= */}
      <div style={styles.layout}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div>
            <div
              style={page === "dashboard" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </div>

            <div
              style={page === "complaints" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("complaints")}
            >
              Health Complaints
            </div>
          </div>

          <div style={styles.logout} onClick={() => setUser(null)}>
            Logout
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={styles.main}>
          {page === "dashboard" && (
            <>
              <h2>Department Overview</h2>

              <div style={styles.cards}>
                <Stat label="Total Complaints" value={total} />
                <Stat label="Resolved" value={resolved} />
                <Stat label="Pending" value={pending} />
              </div>
            </>
          )}

          {page === "complaints" && (
            <>
              <h2>Health Related Complaints</h2>

              {complaints.map(c => (
                <div key={c.id} style={styles.card}>
                  <h4>{c.title}</h4>
                  <p>📍 {c.area}</p>
                  <p>⚡ Priority: {c.priority}</p>
                  <p>Status: {c.status}</p>
                </div>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENT ================= */
const Stat = ({ label, value }) => (
  <div style={styles.statCard}>
    <p>{label}</p>
    <h2>{value}</h2>
  </div>
);

/* ================= STYLES ================= */
const styles = {
  page: { height: "100vh", background: "#ecfdf5" },

  header: {
    background: "linear-gradient(135deg,#047857,#16a34a)",
    color: "#fff",
    padding: "20px 32px",
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "4px solid #065f46",
  },

  title: { margin: 0, fontSize: 28, fontWeight: 700 },
  subtitle: { marginTop: 6, fontSize: 14 },

  clockBox: { textAlign: "right", fontSize: 14 },

  layout: { display: "flex", height: "calc(100vh - 90px)" },

  sidebar: {
    width: 240,
    background: "#065f46",
    color: "#fff",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  menuItem: {
    padding: 12,
    marginBottom: 6,
    cursor: "pointer",
    borderRadius: 6,
    background: "rgba(255,255,255,0.15)",
  },

  activeItem: {
    padding: 12,
    marginBottom: 6,
    cursor: "pointer",
    borderRadius: 6,
    background: "rgba(255,255,255,0.35)",
    fontWeight: 600,
  },

  logout: {
    background: "#b91c1c",
    padding: 12,
    borderRadius: 6,
    textAlign: "center",
    cursor: "pointer",
  },

  main: { flex: 1, padding: 30 },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 20,
  },

  statCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
  },

  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
};

export default HealthDepartment;
