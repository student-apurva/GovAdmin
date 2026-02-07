import React, { useState, useEffect } from "react";

const SanitationDepartment = ({ setUser }) => {
  const [page, setPage] = useState("dashboard");
  const [time, setTime] = useState(new Date());

  /* ================= CLOCK ================= */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= SANITATION COMPLAINTS ================= */
  const complaints = [
    {
      id: 1,
      title: "Garbage not collected",
      area: "Ward 3",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Overflowing dustbin",
      area: "Ward 7",
      priority: "Medium",
      status: "Resolved",
    },
    {
      id: 3,
      title: "Street cleaning required",
      area: "Ward 11",
      priority: "Low",
      status: "Pending",
    },
  ];

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const pending = total - resolved;

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Sanitation Department</h1>
          <p style={styles.subtitle}>
            Municipal Cleanliness & Waste Management
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
              Complaints
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
              <h2 style={styles.sectionTitle}>Overview</h2>

              <div style={styles.cards}>
                <Stat label="Total Complaints" value={total} />
                <Stat label="Resolved" value={resolved} />
                <Stat label="Pending" value={pending} />
              </div>
            </>
          )}

          {page === "complaints" && (
            <>
              <h2 style={styles.sectionTitle}>Sanitation Issues</h2>

              {complaints.map((c) => (
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
    <p style={{ color: "#6b7280" }}>{label}</p>
    <h2 style={{ margin: 0 }}>{value}</h2>
  </div>
);

/* ================= SIMPLE GOVERNMENT UI STYLES ================= */
const styles = {
  page: {
    height: "100vh",
    background: "#f9fafb",
    fontFamily: "Segoe UI, sans-serif",
  },

  header: {
    background: "#14532d",
    color: "#fff",
    padding: "18px 28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 700,
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    opacity: 0.9,
  },

  clockBox: {
    textAlign: "right",
    fontSize: 13,
    opacity: 0.95,
  },

  layout: {
    display: "flex",
    height: "calc(100vh - 86px)",
  },

  sidebar: {
    width: 230,
    background: "#166534",
    color: "#fff",
    padding: 18,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  menuItem: {
    padding: 12,
    marginBottom: 6,
    cursor: "pointer",
    borderRadius: 6,
    background: "rgba(255,255,255,0.12)",
  },

  activeItem: {
    padding: 12,
    marginBottom: 6,
    cursor: "pointer",
    borderRadius: 6,
    background: "rgba(255,255,255,0.28)",
    fontWeight: 600,
  },

  logout: {
    background: "#991b1b",
    padding: 12,
    borderRadius: 6,
    textAlign: "center",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 28,
    overflowY: "auto",
  },

  sectionTitle: {
    marginBottom: 16,
    fontSize: 22,
    color: "#14532d",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: 18,
  },

  statCard: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  card: {
    background: "#ffffff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
};

export default SanitationDepartment;
