import React, { useState } from "react";

/* ================== AUTO ROUTING LOGIC ================== */
const detectDepartment = (text) => {
  const t = text.toLowerCase();
  if (t.includes("garbage") || t.includes("drainage"))
    return "Health Department";
  if (t.includes("water"))
    return "Water Supply Department";
  if (t.includes("light") || t.includes("electric"))
    return "Electricity Department";
  return "General Department";
};

const DepartmentManagerDashboard = ({ department, setUser }) => {
  const [page, setPage] = useState("dashboard");

  /* ================== COMPLAINT DATA ================== */
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Garbage not collected",
      area: "Ward 12",
      priority: "High",
      status: "Pending",
      date: "Today",
      department: detectDepartment("Garbage not collected"),
      officer: "",
      createdAt: Date.now() - 1000 * 60 * 60 * 30,
    },
    {
      id: 2,
      title: "Overflowing drainage",
      area: "Ward 4",
      priority: "High",
      status: "Pending",
      date: "Today",
      department: detectDepartment("Overflowing drainage"),
      officer: "",
      createdAt: Date.now() - 1000 * 60 * 60 * 20,
    },
    {
      id: 3,
      title: "Water leakage",
      area: "Ward 8",
      priority: "Medium",
      status: "Resolved",
      date: "Today",
      department: detectDepartment("Water leakage"),
      officer: "Officer A",
      createdAt: Date.now() - 1000 * 60 * 60 * 10,
    },
    {
      id: 4,
      title: "Street light not working",
      area: "Ward 5",
      priority: "Low",
      status: "Pending",
      date: "Yesterday",
      department: detectDepartment("Street light not working"),
      officer: "",
      createdAt: Date.now() - 1000 * 60 * 60 * 50,
    },
  ]);

  /* ================== FILTER BY DEPARTMENT ================== */
  const departmentComplaints = complaints.filter(
    (c) => c.department === department
  );

  /* ================== SLA LOGIC ================== */
  const getSLAHours = (priority) => {
    if (priority === "High") return 24;
    if (priority === "Medium") return 48;
    return 72;
  };

  const isSLABreached = (c) => {
    const hours = (Date.now() - c.createdAt) / (1000 * 60 * 60);
    return hours > getSLAHours(c.priority) && c.status !== "Resolved";
  };

  /* ================== NOTIFICATION (MOCK) ================== */
  const sendNotification = (msg) => {
    console.log("📩 SMS / EMAIL:", msg);
    alert(msg);
  };

  /* ================== ASSIGN OFFICER ================== */
  const assignOfficer = (id, officer) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, officer, status: "In Progress" }
          : c
      )
    );
    sendNotification(`Complaint #${id} assigned to ${officer}`);
  };

  /* ================== STATUS UPDATE ================== */
  const updateStatus = (id, status) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status } : c
      )
    );
  };

  /* ================== METRICS ================== */
  const total = departmentComplaints.length;
  const resolved = departmentComplaints.filter(c => c.status === "Resolved").length;
  const pending = total - resolved;
  const today = departmentComplaints.filter(c => c.date === "Today").length;

  return (
    <div style={styles.page}>
      {/* ================== SIDEBAR ================== */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.logoCircle}>{department?.charAt(0)}</div>
            <h3 style={styles.sidebarTitle}>{department}</h3>
          </div>

          <ul style={styles.menu}>
            <li style={page === "dashboard" ? styles.activeItem : styles.menuItem} onClick={() => setPage("dashboard")}>Dashboard</li>
            <li style={page === "complaints" ? styles.activeItem : styles.menuItem} onClick={() => setPage("complaints")}>Complaints</li>
            <li style={page === "assign" ? styles.activeItem : styles.menuItem} onClick={() => setPage("assign")}>Assign Work</li>
            <li style={page === "map" ? styles.activeItem : styles.menuItem} onClick={() => setPage("map")}>GIS Map</li>
          </ul>
        </div>

        <div style={styles.logout} onClick={() => setUser(null)}>Logout</div>
      </aside>

      {/* ================== MAIN ================== */}
      <main style={styles.main}>
        {page === "dashboard" && (
          <>
            <h1 style={styles.pageTitle}>Department Dashboard</h1>

            <div style={styles.cardRow}>
              <StatCard label="Today's Complaints" value={today} />
              <StatCard label="Total Complaints" value={total} />
              <StatCard label="Resolved" value={resolved} />
              <StatCard label="Pending" value={pending} />
            </div>

            <div style={styles.panel}>
              <h3>⚠ SLA Alerts</h3>
              {departmentComplaints.some(isSLABreached)
                ? <p>🚨 Some complaints have breached SLA</p>
                : <p>✔ All complaints within SLA</p>}
            </div>
          </>
        )}

        {page === "complaints" && (
          <>
            <h1 style={styles.pageTitle}>Department Complaints</h1>
            {departmentComplaints.map(c => (
              <div key={c.id} style={styles.complaintCard}>
                <h4>{c.title}</h4>
                <p>📍 {c.area}</p>
                <p>⚡ {c.priority}</p>
                <p>Status: {c.status}</p>
                {isSLABreached(c) && <p style={styles.sla}>🚨 SLA BREACHED</p>}
              </div>
            ))}
          </>
        )}

        {page === "assign" && (
          <>
            <h1 style={styles.pageTitle}>Assign Work</h1>
            {departmentComplaints.map(c => (
              <div key={c.id} style={styles.assignCard}>
                <h4>{c.title}</h4>

                <input
                  placeholder="Assign Officer"
                  defaultValue={c.officer}
                  onBlur={(e) => assignOfficer(c.id, e.target.value)}
                  style={styles.input}
                />

                <select
                  value={c.status}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                  style={styles.input}
                >
                  <option>Pending</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            ))}
          </>
        )}

        {page === "map" && (
          <>
            <h1 style={styles.pageTitle}>Ward-wise GIS Map</h1>
            <div style={styles.mapPlaceholder}>
              🗺️ Ward-wise interactive map (Google Maps / Leaflet ready)
            </div>
          </>
        )}
      </main>
    </div>
  );
};

/* ================== COMPONENTS ================== */
const StatCard = ({ label, value }) => (
  <div style={styles.card}>
    <p style={styles.cardLabel}>{label}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

/* ================== STYLES ================== */
const styles = {
  page: { display: "flex", height: "100vh", background: "#f4f6f8", fontFamily: "Segoe UI" },
  sidebar: { width: 260, background: "#134e4a", color: "#fff", padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-between" },
  brand: { display: "flex", alignItems: "center", gap: 10, marginBottom: 20 },
  logoCircle: { width: 38, height: 38, borderRadius: "50%", background: "#5eead4", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700" },
  sidebarTitle: { fontSize: 16 },
  menu: { listStyle: "none", padding: 0 },
  menuItem: { padding: 12, cursor: "pointer", borderRadius: 6, marginBottom: 6, background: "rgba(255,255,255,0.1)" },
  activeItem: { padding: 12, cursor: "pointer", borderRadius: 6, marginBottom: 6, background: "rgba(255,255,255,0.25)", fontWeight: "600" },
  logout: { padding: 12, background: "#b91c1c", textAlign: "center", borderRadius: 6, cursor: "pointer" },
  main: { flex: 1, padding: 30 },
  pageTitle: { fontSize: 26, marginBottom: 20 },
  cardRow: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 30 },
  card: { background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
  cardLabel: { color: "#6b7280" },
  cardValue: { fontSize: 28, color: "#134e4a" },
  panel: { background: "#fff7ed", padding: 20, borderRadius: 10 },
  complaintCard: { background: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 },
  assignCard: { background: "#fff", padding: 15, borderRadius: 8, marginBottom: 10 },
  input: { width: "100%", padding: 10, marginBottom: 10 },
  sla: { color: "red", fontWeight: "600" },
  mapPlaceholder: { height: 320, background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10 },
};

export default DepartmentManagerDashboard;
