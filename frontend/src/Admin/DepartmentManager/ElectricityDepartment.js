import React, { useState, useEffect } from "react";

const ElectricityDepartment = ({ setUser }) => {
  const [page, setPage] = useState("Dashboard");
  const [time, setTime] = useState(new Date());
  const [wardFilter, setWardFilter] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  /* ================= OFFICERS ================= */
  const [officers, setOfficers] = useState([
    {
      empId: "EMP-E-101",
      name: "Suresh Patil",
      gender: "Male",
      phone: "9988776655",
      address: "Electrical Division Office",
      designation: "Electrical Supervisor",
      ward: "Ward 5",
    },
  ]);

  const [newOfficer, setNewOfficer] = useState({
    empId: "",
    name: "",
    gender: "",
    phone: "",
    address: "",
    designation: "",
    ward: "",
  });

  /* ================= COMPLAINTS ================= */
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      title: "Street light not working",
      ward: "Ward 5",
      priority: "High",
      status: "Pending",
      officer: "Not Assigned",
      createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    },
    {
      id: 2,
      title: "Power outage",
      ward: "Ward 9",
      priority: "High",
      status: "Resolved",
      officer: "Suresh Patil",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    },
    {
      id: 3,
      title: "Loose electric wire",
      ward: "Ward 14",
      priority: "Medium",
      status: "Pending",
      officer: "Not Assigned",
      createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000),
    },
  ]);

  /* ================= SLA ================= */
  const getAging = (createdAt) => {
    const hours = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60);
    if (hours < 24) return { label: "Normal", color: "#2563eb" };
    if (hours < 72) return { label: "Warning", color: "#f59e0b" };
    return { label: "Escalated", color: "#dc2626" };
  };

  /* ================= HELPERS ================= */
  const notify = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), time: new Date().toLocaleTimeString("en-IN"), message },
      ...prev.slice(0, 4),
    ]);
  };

  const logAction = (action) => {
    setAuditLogs((prev) => [
      { time: new Date().toLocaleString("en-IN"), action },
      ...prev,
    ]);
  };

  /* ================= ADD OFFICER ================= */
  const addOfficer = () => {
    if (!newOfficer.empId || !newOfficer.name || !newOfficer.phone) {
      alert("Employee ID, Name and Phone are mandatory");
      return;
    }

    setOfficers((prev) => [...prev, newOfficer]);
    notify(`Officer ${newOfficer.name} added`);
    logAction(`New officer added: ${newOfficer.name}`);

    setNewOfficer({
      empId: "",
      name: "",
      gender: "",
      phone: "",
      address: "",
      designation: "",
      ward: "",
    });
  };

  /* ================= ASSIGN OFFICER ================= */
  const assignOfficer = (id, officer) => {
    setComplaints((prev) =>
      prev.map((c) => (c.id === id ? { ...c, officer } : c))
    );
    notify(`Complaint #${id} assigned to ${officer}`);
    logAction(`Complaint #${id} assigned to ${officer}`);
  };

  /* ================= STATUS ================= */
  const toggleStatus = (id) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === "Pending" ? "Resolved" : "Pending" }
          : c
      )
    );
    notify(`Complaint #${id} status updated`);
    logAction(`Complaint #${id} status updated`);
  };

  /* ================= FILTER ================= */
  const filteredComplaints =
    wardFilter === "All"
      ? complaints
      : complaints.filter((c) => c.ward === wardFilter);

  /* ================= METRICS ================= */
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "Resolved").length;
  const pending = total - resolved;
  const escalated = complaints.filter(
    (c) => getAging(c.createdAt).label === "Escalated"
  ).length;

  return (
    <div style={styles.page}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div>
          <h1>Electricity Department</h1>
          <p>Municipal Electrical Infrastructure & Power Management</p>
        </div>
        <div style={styles.clock}>
          <div>{time.toLocaleTimeString("en-IN")}</div>
          <div>{time.toLocaleDateString("en-IN")}</div>
        </div>
      </header>

      <div style={styles.layout}>
        {/* ================= SIDEBAR ================= */}
        <aside style={styles.sidebar}>
          <div style={styles.menuSection}>
            {["Dashboard", "Complaints", "Analytics", "Audit Log", "Officers"].map(
              (m) => (
                <div
                  key={m}
                  style={page === m ? styles.activeItem : styles.menuItem}
                  onClick={() => setPage(m)}
                >
                  {m}
                </div>
              )
            )}
          </div>

          <div style={styles.logoutSection}>
            <div style={styles.logout} onClick={() => setUser(null)}>
              Logout
            </div>
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main style={styles.main}>
          {page === "Dashboard" && (
            <>
              <div style={styles.cards}>
                <Stat label="Total" value={total} />
                <Stat label="Resolved" value={resolved} />
                <Stat label="Pending" value={pending} />
                <Stat label="Escalated" value={escalated} />
              </div>

              <h3 style={{ marginTop: 20 }}>Notifications</h3>
              {notifications.map((n) => (
                <div key={n.id} style={styles.notification}>
                  ⏰ {n.time} – {n.message}
                </div>
              ))}
            </>
          )}

          {page === "Complaints" && (
            <>
              <select
                value={wardFilter}
                onChange={(e) => setWardFilter(e.target.value)}
              >
                <option>All</option>
                <option>Ward 5</option>
                <option>Ward 9</option>
                <option>Ward 14</option>
              </select>

              {filteredComplaints.map((c) => {
                const aging = getAging(c.createdAt);
                return (
                  <div key={c.id} style={styles.card}>
                    <h4>{c.title}</h4>
                    <p>{c.ward}</p>

                    <div style={styles.badges}>
                      <Badge text={c.priority} color={priorityColors[c.priority]} />
                      <Badge text={c.status} color={statusColors[c.status]} />
                      <Badge text={aging.label} color={aging.color} />
                    </div>

                    <select
                      style={styles.assignSelect}
                      value={c.officer}
                      onChange={(e) =>
                        assignOfficer(c.id, e.target.value)
                      }
                    >
                      <option>Not Assigned</option>
                      {officers.map((o) => (
                        <option key={o.empId} value={o.name}>
                          {o.name} ({o.designation})
                        </option>
                      ))}
                    </select>

                    <button onClick={() => toggleStatus(c.id)}>
                      {c.status === "Pending" ? "Mark Resolved" : "Reopen"}
                    </button>
                  </div>
                );
              })}
            </>
          )}

          {page === "Officers" && (
            <>
              <h2>Add Officer</h2>
              <div style={styles.formBox}>
                {Object.keys(newOfficer).map((k) => (
                  <input
                    key={k}
                    placeholder={k.toUpperCase()}
                    value={newOfficer[k]}
                    onChange={(e) =>
                      setNewOfficer({ ...newOfficer, [k]: e.target.value })
                    }
                  />
                ))}
                <button onClick={addOfficer}>Add Officer</button>
              </div>
            </>
          )}

          {page === "Audit Log" && (
            <>
              <h2>Audit Log</h2>
              {auditLogs.map((a, i) => (
                <p key={i}>
                  {a.time} – {a.action}
                </p>
              ))}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */
const Stat = ({ label, value }) => (
  <div style={styles.statCard}>
    <p>{label}</p>
    <h2>{value}</h2>
  </div>
);

const Badge = ({ text, color }) => (
  <span style={{ ...styles.badge, background: color }}>{text}</span>
);

/* ================= COLORS ================= */
const priorityColors = { High: "#dc2626", Medium: "#f59e0b", Low: "#2563eb" };
const statusColors = { Pending: "#f59e0b", Resolved: "#16a34a" };

/* ================= STYLES ================= */
const styles = {
  page: { height: "100vh", background: "#fefce8", fontFamily: "Segoe UI" },
  header: { background: "#a16207", color: "#1f2937", padding: 20, display: "flex", justifyContent: "space-between" },
  clock: { textAlign: "right", fontSize: 13 },

  layout: { display: "flex", height: "calc(100vh - 80px)" },

  sidebar: {
    width: 240,
    background: "#92400e",
    color: "#fff",
    padding: "16px 14px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  menuSection: { display: "flex", flexDirection: "column", marginTop: 10 },
  menuItem: { padding: 12, marginBottom: 6, cursor: "pointer", background: "rgba(255,255,255,0.12)", borderRadius: 6 },
  activeItem: { padding: 12, marginBottom: 6, cursor: "pointer", background: "rgba(255,255,255,0.28)", borderRadius: 6, fontWeight: 600 },

  logoutSection: { paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.25)" },
  logout: { background: "#991b1b", padding: 12, borderRadius: 6, textAlign: "center", cursor: "pointer" },

  main: { flex: 1, padding: 24, overflowY: "auto" },

  cards: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 },
  statCard: { background: "#fff", padding: 20, borderRadius: 10, textAlign: "center" },

  card: { background: "#fff", padding: 16, borderRadius: 10, marginBottom: 12 },
  badges: { display: "flex", gap: 8, marginBottom: 10 },
  badge: { padding: "4px 12px", borderRadius: 20, color: "#fff", fontSize: 12 },

  assignSelect: { width: "100%", padding: 6, marginBottom: 8 },

  notification: { background: "#ecfdf5", padding: 10, borderRadius: 6, marginBottom: 6 },

  formBox: { background: "#fff", padding: 20, borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 10 },
};

export default ElectricityDepartment;
