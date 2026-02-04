import React, { useState } from "react";

const DepartmentManagerDashboard = ({ department, setUser }) => {
  const [page, setPage] = useState("dashboard");

  /* ================== ALL COMPLAINTS (SIMULATED BACKEND DATA) ================== */
  const complaints = [
    {
      id: 1,
      title: "Garbage not collected",
      area: "Ward 12",
      priority: "High",
      status: "Pending",
      date: "Today",
      department: "Health Department",
    },
    {
      id: 2,
      title: "Overflowing drainage",
      area: "Ward 4",
      priority: "High",
      status: "Pending",
      date: "Today",
      department: "Health Department",
    },
    {
      id: 3,
      title: "Water leakage",
      area: "Ward 8",
      priority: "Medium",
      status: "Resolved",
      date: "Today",
      department: "Water Supply Department",
    },
    {
      id: 4,
      title: "Street light not working",
      area: "Ward 5",
      priority: "Low",
      status: "Pending",
      date: "Yesterday",
      department: "Electricity Department",
    },
  ];

  /* ================== SMART DEPARTMENT ROUTING ================== */
  const departmentComplaints = complaints.filter(
    (c) => c.department === department
  );

  /* ================== DASHBOARD METRICS ================== */
  const total = departmentComplaints.length;
  const resolved = departmentComplaints.filter(
    (c) => c.status === "Resolved"
  ).length;
  const pending = total - resolved;
  const today = departmentComplaints.filter(
    (c) => c.date === "Today"
  ).length;

  return (
    <div style={styles.page}>
      {/* ================== SIDEBAR ================== */}
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.logoCircle}>
              {department?.charAt(0)}
            </div>
            <h3 style={styles.sidebarTitle}>{department}</h3>
          </div>

          <ul style={styles.menu}>
            <li
              style={page === "dashboard" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("dashboard")}
            >
              Dashboard
            </li>
            <li
              style={page === "complaints" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("complaints")}
            >
              Complaints
            </li>
            <li
              style={page === "assign" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("assign")}
            >
              Assign Work
            </li>
            <li
              style={page === "reports" ? styles.activeItem : styles.menuItem}
              onClick={() => setPage("reports")}
            >
              Reports
            </li>
          </ul>
        </div>

        <div style={styles.logout} onClick={() => setUser(null)}>
          Logout
        </div>
      </aside>

      {/* ================== MAIN CONTENT ================== */}
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
              <h3>⚠ SLA & Escalation Alerts</h3>
              {pending > 0 ? (
                <>
                  <p>• Pending complaints require action</p>
                  <p>• High-priority complaints should be resolved within 48 hours</p>
                </>
              ) : (
                <p>✔ No pending SLA violations</p>
              )}
            </div>
          </>
        )}

        {page === "complaints" && (
          <>
            <h1 style={styles.pageTitle}>Department Complaints</h1>

            {departmentComplaints.length === 0 && (
              <p>No complaints assigned to this department.</p>
            )}

            {departmentComplaints.map((c) => (
              <div key={c.id} style={styles.complaintCard}>
                <h4>{c.title}</h4>
                <p>📍 Area: {c.area}</p>
                <p>⚡ Priority: {c.priority}</p>
                <p>Status: {c.status}</p>
                <p>Date: {c.date}</p>
              </div>
            ))}
          </>
        )}

        {page === "assign" && (
          <>
            <h1 style={styles.pageTitle}>Assign Work</h1>

            <div style={styles.assignCard}>
              <label>Complaint ID</label>
              <input placeholder="Enter Complaint ID" style={styles.input} />

              <label>Assign Officer</label>
              <input placeholder="Officer Name / ID" style={styles.input} />

              <label>Set Priority</label>
              <select style={styles.input}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>

              <button style={styles.button}>Assign</button>
            </div>
          </>
        )}

        {page === "reports" && (
          <>
            <h1 style={styles.pageTitle}>Department Reports</h1>
            <p>• Monthly complaint summary</p>
            <p>• Resolution efficiency</p>
            <p>• Area-wise complaint density</p>
            <p>• SLA compliance report</p>
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
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
    background: "#f4f6f8",
  },

  sidebar: {
    width: "260px",
    background: "#134e4a",
    color: "#fff",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  brand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "25px",
  },

  logoCircle: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "#5eead4",
    color: "#042f2e",
    fontWeight: "700",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  sidebarTitle: {
    fontSize: "16px",
    margin: 0,
  },

  menu: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },

  menuItem: {
    padding: "12px 14px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "6px",
    background: "rgba(255,255,255,0.1)",
  },

  activeItem: {
    padding: "12px 14px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "6px",
    background: "rgba(255,255,255,0.25)",
    fontWeight: "600",
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

  pageTitle: {
    fontSize: "26px",
    marginBottom: "20px",
  },

  cardRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },

  cardLabel: {
    color: "#6b7280",
  },

  cardValue: {
    fontSize: "28px",
    color: "#134e4a",
  },

  panel: {
    background: "#fff7ed",
    padding: "20px",
    borderRadius: "10px",
  },

  complaintCard: {
    background: "#fff",
    padding: "15px",
    borderRadius: "8px",
    marginBottom: "10px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },

  assignCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  button: {
    padding: "10px",
    width: "100%",
    background: "#134e4a",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
  },
};

export default DepartmentManagerDashboard;
