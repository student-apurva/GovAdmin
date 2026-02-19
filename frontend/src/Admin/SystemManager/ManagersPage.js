import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { User, Mail, Building2, ShieldCheck } from "lucide-react";

const socket = io("http://localhost:5000");

const ManagersPage = () => {
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("kmc_token");

  /* LOAD MANAGERS */
  const loadManagers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/managers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setManagers(data);
    } catch {
      console.error("Failed to load managers");
    }
  };

  useEffect(() => {
    loadManagers();
    socket.on("managerStatusUpdate", loadManagers);
    return () => socket.off("managerStatusUpdate", loadManagers);
  }, []);

  const toggleAccess = async (_id) => {
    await fetch(`http://localhost:5000/api/managers/toggle/${_id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadManagers();
  };

  const deleteManager = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;
    const res = await fetch(`http://localhost:5000/api/managers/${_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) loadManagers();
  };

  return (
    <div style={{ paddingBottom: 120 }}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Department Managers</h1>
          <p style={styles.subtitle}>
            Manage access control and monitor department managers
          </p>
        </div>
      </div>

      {/* MANAGER CARDS */}
      {managers.map((m) => (
        <div key={m._id} style={styles.card}>

          <div style={styles.leftSection}>
            <div style={styles.avatar}>
              <User size={20} />
            </div>

            <div>
              <div style={styles.nameRow}>
                <strong>{m.name}</strong>

                <span
                  style={{
                    ...styles.onlineBadge,
                    background: m.isOnline ? "#dcfce7" : "#f3f4f6",
                    color: m.isOnline ? "#15803d" : "#6b7280",
                  }}
                >
                  {m.isOnline ? "Online" : "Offline"}
                </span>
              </div>

              <div style={styles.meta}>
                <span><Building2 size={14}/> {m.department}</span>
                <span><Mail size={14}/> {m.email}</span>
                <span>🆔 {m.enrollmentId}</span>
              </div>
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={{
                ...styles.accessBtn,
                background: m.isActive ? "#15803d" : "#dc2626",
              }}
              onClick={() => toggleAccess(m._id)}
            >
              {m.isActive ? "Active" : "Disabled"}
            </button>

            <button
              style={styles.viewBtn}
              onClick={() => setSelectedManager(m)}
            >
              View
            </button>

            <button
              style={styles.deleteBtn}
              onClick={() => deleteManager(m._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ADD BUTTON */}
      <button
        style={styles.addBtn}
        onClick={() => navigate("/system-manager/add-manager")}
      >
        + Add Manager
      </button>

      {/* MODAL */}
      {selectedManager && (
        <div style={styles.overlay}>
          <div style={styles.modal}>

            <div style={styles.modalHeader}>
              <div style={styles.modalAvatar}>
                <ShieldCheck size={26}/>
              </div>
              <div>
                <h2>{selectedManager.name}</h2>
                <p style={{ fontSize: 13, color: "#6b7280" }}>
                  {selectedManager.department}
                </p>
              </div>
            </div>

            <div style={styles.modalContent}>
              <InfoRow label="Email" value={selectedManager.email}/>
              <InfoRow label="Enrollment ID" value={selectedManager.enrollmentId}/>
              <InfoRow
                label="Online Status"
                value={selectedManager.isOnline ? "Online" : "Offline"}
              />
              <InfoRow
                label="Access Status"
                value={selectedManager.isActive ? "Enabled" : "Disabled"}
              />
            </div>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedManager(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ManagersPage;

/* INFO ROW COMPONENT */
const InfoRow = ({ label, value }) => (
  <div style={styles.infoRow}>
    <span style={styles.infoLabel}>{label}</span>
    <span style={styles.infoValue}>{value}</span>
  </div>
);

/* ================= PROFESSIONAL STYLES ================= */

const styles = {

  header: { marginBottom: 25 },

  title: { fontSize: 26, color: "#0b2c48" },

  subtitle: { fontSize: 14, color: "#6b7280" },

  card: {
    background: "#ffffff",
    padding: "20px 24px",
    borderRadius: 16,
    marginBottom: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 12px 30px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  leftSection: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#0b3c5d,#0f5c8c)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  nameRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  onlineBadge: {
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },

  meta: {
    marginTop: 6,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    fontSize: 13,
    color: "#4b5563",
  },

  actions: {
    display: "flex",
    gap: 12,
  },

  accessBtn: {
    padding: "8px 16px",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  viewBtn: {
    padding: "8px 16px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  deleteBtn: {
    padding: "8px 16px",
    background: "#dc2626",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  addBtn: {
    position: "fixed",
    bottom: 30,
    left: 320,
    padding: "14px 28px",
    background: "linear-gradient(135deg,#0b3c5d,#0f5c8c)",
    color: "#fff",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 30,
    borderRadius: 18,
    width: 480,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },

  modalHeader: {
    display: "flex",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },

  modalAvatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "linear-gradient(135deg,#ff9933,#ff7a00)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
  },

  modalContent: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    background: "#f8fafc",
    borderRadius: 8,
  },

  infoLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: 600,
    color: "#0b2c48",
  },

  closeBtn: {
    marginTop: 20,
    width: "100%",
    padding: 12,
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    fontWeight: 600,
  },
};
