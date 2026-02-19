import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react";
import AddOfficer from "../../shared/AddOfficer";

const WaterDepartment = ({ setUser }) => {
  const [page, setPage] = useState("Dashboard");
  const [time, setTime] = useState(new Date());
  const [showAddOfficer, setShowAddOfficer] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const complaints = [
    {
      id: 1,
      title: "Pipeline Leakage - Ward 8",
      priority: "High",
      status: "Pending",
    },
    {
      id: 2,
      title: "Low Water Pressure - Ward 3",
      priority: "Medium",
      status: "Resolved",
    },
  ];

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === "Resolved").length;
  const pending = total - resolved;

  return (
    <div style={styles.container}>

      {/* ================= NAVBAR ================= */}
      <header style={styles.navbar}>
        <div style={styles.navLeft}>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/120px-Emblem_of_India.svg.png"
            alt="Government Emblem"
            style={styles.logo}
          />
          <div>
            <h2 style={{ margin: 0 }}>KMC</h2>
            <p style={styles.subTitle}>
              Kolhapur Municipal Corporation <br />
              Water Supply Department
            </p>
          </div>
        </div>

        <div style={styles.clock}>
          <div>{time.toLocaleTimeString("en-IN")}</div>
          <div>{time.toLocaleDateString("en-IN")}</div>
        </div>
      </header>

      <div style={styles.layout}>

        {/* ================= SIDEBAR ================= */}
        <aside style={styles.sidebar}>
          <div>
            <MenuItem
              icon={<LayoutDashboard size={18} />}
              label="Dashboard"
              active={page === "Dashboard"}
              onClick={() => {
                setPage("Dashboard");
                setShowAddOfficer(false);
              }}
            />
            <MenuItem
              icon={<FileText size={18} />}
              label="Complaints"
              active={page === "Complaints"}
              onClick={() => {
                setPage("Complaints");
                setShowAddOfficer(false);
              }}
            />
            <MenuItem
              icon={<Users size={18} />}
              label="Officers"
              active={page === "Officers"}
              onClick={() => setPage("Officers")}
            />
            <MenuItem
              icon={<ClipboardList size={18} />}
              label="Audit Log"
              active={page === "Audit Log"}
              onClick={() => {
                setPage("Audit Log");
                setShowAddOfficer(false);
              }}
            />
          </div>

          <div style={styles.logout} onClick={() => setUser(null)}>
            <LogOut size={16} />
            Logout
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={styles.main}>

          {/* ================= DASHBOARD ================= */}
          {page === "Dashboard" && (
            <>
              <div style={styles.statsGrid}>
                <StatCard label="Total Complaints" value={total} />
                <StatCard label="Resolved" value={resolved} />
                <StatCard label="Pending" value={pending} />
              </div>

              <div style={styles.sectionBox}>
                <h3>Department Overview</h3>
                <p>
                  This division manages municipal water supply, leakage control,
                  and pipeline maintenance across all wards in Kolhapur city.
                </p>
              </div>
            </>
          )}

          {/* ================= COMPLAINTS ================= */}
          {page === "Complaints" && (
            <>
              <h2>Active Complaints</h2>

              {complaints.map((c) => (
                <div key={c.id} style={styles.card}>
                  <div>
                    <h4>{c.title}</h4>
                    <div style={styles.badgeRow}>
                      <Badge text={c.priority} />
                      <Badge text={c.status} />
                    </div>
                  </div>
                  <button style={styles.primaryBtn}>
                    View Details
                  </button>
                </div>
              ))}
            </>
          )}

          {/* ================= OFFICERS ================= */}
          {page === "Officers" && (
            <>
              {!showAddOfficer ? (
                <div style={styles.sectionBox}>
                  <div style={styles.officerHeader}>
                    <h2>Officer Management</h2>

                    <button
                      style={styles.primaryBtn}
                      onClick={() => setShowAddOfficer(true)}
                    >
                      + Add Officer
                    </button>
                  </div>

                  <p>Manage department officers and assignments here.</p>
                </div>
              ) : (
                <>
                  <div style={styles.officerHeader}>
                    <h2>Add New Officer</h2>

                    <button
                      style={styles.secondaryBtn}
                      onClick={() => setShowAddOfficer(false)}
                    >
                      ← Back
                    </button>
                  </div>

                  <AddOfficer />
                </>
              )}
            </>
          )}

          {/* ================= AUDIT ================= */}
          {page === "Audit Log" && (
            <div style={styles.sectionBox}>
              <h2>Audit Log</h2>
              <p>System logs will appear here.</p>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

/* ================= MENU ITEM ================= */

const MenuItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    style={{
      ...styles.menuItem,
      background: active ? "#2563eb" : "#334155",
      fontWeight: active ? 600 : 400,
    }}
  >
    {icon}
    <span style={{ marginLeft: 10 }}>{label}</span>
  </div>
);

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ label, value }) => (
  <div style={styles.statCard}>
    <p>{label}</p>
    <h2>{value}</h2>
  </div>
);

const Badge = ({ text }) => (
  <span style={styles.badge}>{text}</span>
);

/* ================= STYLES ================= */

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f1f5f9",
    fontFamily: "Segoe UI, sans-serif",
  },

  navbar: {
    background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    color: "#fff",
    padding: "15px 25px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  navLeft: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },

  logo: { width: 45 },

  subTitle: {
    margin: 0,
    fontSize: 12,
    opacity: 0.8,
  },

  clock: { textAlign: "right", fontSize: 13 },

  layout: { display: "flex", flex: 1 },

  sidebar: {
    width: 240,
    background: "#1e293b",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  logout: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#dc2626",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    cursor: "pointer",
  },

  main: {
    flex: 1,
    padding: 30,
    overflowY: "auto",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
    gap: 20,
    marginBottom: 30,
  },

  statCard: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },

  sectionBox: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
  },

  badgeRow: { display: "flex", gap: 8, marginTop: 8 },

  badge: {
    background: "#1e40af",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
  },

  primaryBtn: {
    background: "#2563eb",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "#64748b",
    color: "#fff",
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },

  officerHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
};

export default WaterDepartment;
