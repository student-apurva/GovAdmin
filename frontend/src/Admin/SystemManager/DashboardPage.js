import { useState } from "react";

const DashboardPage = () => {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  /* ================= MOCK DATA (REPLACE WITH API) ================= */
  const stats = {
    totalDepartments: 12,
    managers: 28,
    totalComplaints: 4562,
    urgentComplaints: 78,
    pendingComplaints: 312,
    resolvedComplaints: 4250,
  };

  const complaints = [
    {
      id: "CMP-1021",
      type: "Garbage not collected",
      department: "Health Department",
      location: "Ward 12 – Rajarampuri",
      priority: "urgent",
      description:
        "Garbage has not been collected for the last 4 days causing hygiene issues.",
      image:
        "https://via.placeholder.com/400x250?text=Garbage+Issue",
    },
    {
      id: "CMP-1022",
      type: "Water leakage",
      department: "Water Supply Department",
      location: "Ward 8 – Shahupuri",
      priority: "medium",
      description:
        "Continuous water leakage near main road.",
      image:
        "https://via.placeholder.com/400x250?text=Water+Leakage",
    },
    {
      id: "CMP-1023",
      type: "Street light not working",
      department: "Electricity Department",
      location: "Ward 5 – Ujalaiwadi",
      priority: "normal",
      description:
        "Street light is not working since yesterday night.",
      image:
        "https://via.placeholder.com/400x250?text=Street+Light",
    },
  ];

  return (
    <div>
      {/* ================= HEADER ================= */}
      <h1 style={styles.title}>System Manager Dashboard</h1>
      <p style={styles.subtitle}>Overall system statistics & live complaints</p>

      {/* ================= STATS CARDS ================= */}
      <div style={styles.cardGrid}>
        <Card title="Total Departments" value={stats.totalDepartments} />
        <Card title="Department Managers" value={stats.managers} />
        <Card title="Total Complaints" value={stats.totalComplaints} />
        <Card
          title="Urgent Complaints"
          value={stats.urgentComplaints}
          priority="urgent"
        />
        <Card
          title="Pending Complaints"
          value={stats.pendingComplaints}
          priority="medium"
        />
        <Card
          title="Resolved Complaints"
          value={stats.resolvedComplaints}
          priority="normal"
        />
      </div>

      {/* ================= COMPLAINT LIST ================= */}
      <h2 style={styles.sectionTitle}>All Department Complaints</h2>

      <div style={styles.listWrapper}>
        {complaints.map((c) => (
          <div
            key={c.id}
            style={{
              ...styles.complaintRow,
              ...priorityStyle[c.priority],
            }}
          >
            <div>
              <strong>{c.id}</strong> — {c.type}
              <div style={styles.meta}>
                📍 {c.location} | 🏢 {c.department}
              </div>
            </div>

            <button
              style={styles.viewBtn}
              onClick={() => setSelectedComplaint(c)}
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {selectedComplaint && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>{selectedComplaint.type}</h2>
            <p><strong>Complaint No:</strong> {selectedComplaint.id}</p>
            <p><strong>Department:</strong> {selectedComplaint.department}</p>
            <p><strong>Location:</strong> {selectedComplaint.location}</p>
            <p>{selectedComplaint.description}</p>

            <img
              src={selectedComplaint.image}
              alt="Complaint"
              style={styles.image}
            />

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedComplaint(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= COMPONENTS ================= */

const Card = ({ title, value, priority }) => (
  <div
    style={{
      ...styles.card,
      ...(priority ? priorityCard[priority] : {}),
    }}
  >
    <p style={styles.cardLabel}>{title}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

/* ================= STYLES ================= */

const styles = {
  title: {
    fontSize: 26,
    marginBottom: 4,
    color: "#0b3c5d",
  },
  subtitle: {
    color: "#6b7280",
    marginBottom: 24,
  },
  sectionTitle: {
    marginTop: 40,
    marginBottom: 16,
    fontSize: 20,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 22,
    borderRadius: 12,
    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
  },

  cardLabel: {
    fontSize: 14,
    color: "#6b7280",
  },

  cardValue: {
    fontSize: 32,
    fontWeight: 700,
  },

  listWrapper: {
    marginTop: 10,
  },

  complaintRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderRadius: 10,
    marginBottom: 10,
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  meta: {
    fontSize: 13,
    color: "#374151",
    marginTop: 4,
  },

  viewBtn: {
    padding: "8px 14px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  modal: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    width: 500,
    maxHeight: "90vh",
    overflowY: "auto",
  },

  image: {
    width: "100%",
    marginTop: 10,
    borderRadius: 8,
  },

  closeBtn: {
    marginTop: 16,
    width: "100%",
    padding: 10,
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};

/* ================= PRIORITY COLORS ================= */

const priorityStyle = {
  urgent: { borderLeft: "6px solid #b91c1c", background: "#fff5f5" },
  medium: { borderLeft: "6px solid #d97706", background: "#fffbeb" },
  normal: { borderLeft: "6px solid #15803d", background: "#f0fdf4" },
};

const priorityCard = {
  urgent: { borderLeft: "6px solid #b91c1c" },
  medium: { borderLeft: "6px solid #d97706" },
  normal: { borderLeft: "6px solid #15803d" },
};

export default DashboardPage;
