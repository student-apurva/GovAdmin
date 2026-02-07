import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000");

const ManagersPage = () => {
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("kmc_token");

  /* ================= LOAD MANAGERS ================= */
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

  /* ================= TOGGLE ACCESS ================= */
  const toggleAccess = async (_id) => {
    await fetch(`http://localhost:5000/api/managers/toggle/${_id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    loadManagers();
  };

  /* ================= DELETE MANAGER ================= */
  const deleteManager = async (_id) => {
    if (!window.confirm("Are you sure you want to delete this manager?")) return;

    const res = await fetch(`http://localhost:5000/api/managers/${_id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) loadManagers();
    else alert("Failed to delete manager");
  };

  /* ================= DOWNLOAD MONTHLY LOGIN REPORT ================= */
  const downloadMonthlyPDF = (name, department, logs) => {
    const content = `
KOLHAPUR MUNICIPAL CORPORATION
Department Manager Attendance Report

Name: ${name}
Department: ${department}

-------------------------------------
Date | Login Time | Logout Time
-------------------------------------
${logs
  .map(
    (l) =>
      `${new Date(l.loginAt).toLocaleDateString()} | ${
        l.loginAt ? new Date(l.loginAt).toLocaleTimeString() : "-"
      } | ${
        l.logoutAt ? new Date(l.logoutAt).toLocaleTimeString() : "-"
      }`
  )
  .join("\n")}

-------------------------------------
Generated on: ${new Date().toLocaleString()}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${name}_monthly_login_report.txt`;
    link.click();
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      <h1 style={{ marginBottom: 24, fontSize: 26 }}>
        Department Managers
      </h1>

      {managers.map((m) => (
        <div key={m._id} style={styles.row}>
          <div>
            <div style={styles.nameRow}>
              <span
                style={{
                  ...styles.statusDot,
                  background: m.isOnline ? "#16a34a" : "#9ca3af",
                }}
              />
              <strong>{m.name}</strong>
              <span
                style={{
                  ...styles.statusText,
                  color: m.isOnline ? "#16a34a" : "#6b7280",
                }}
              >
                {m.isOnline ? "Online" : "Offline"}
              </span>
            </div>

            <div style={styles.meta}>
              🏢 {m.department} <br />
              📧 {m.email} <br />
              🆔 {m.enrollmentId}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={{
                ...styles.accessBtn,
                background: m.isActive ? "#15803d" : "#b91c1c",
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

      {/* ADD MANAGER */}
      <button
        style={styles.addBtn}
        onClick={() => navigate("/system-manager/add-manager")}
      >
        + Add Manager
      </button>

      {/* ================= VIEW MODAL ================= */}
      {selectedManager && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={{ marginBottom: 14 }}>Manager Details</h2>

            <p><b>Name:</b> {selectedManager.name}</p>
            <p><b>Email:</b> {selectedManager.email}</p>
            <p><b>Department:</b> {selectedManager.department}</p>
            <p><b>Enrollment ID:</b> {selectedManager.enrollmentId}</p>
            <p><b>Status:</b> {selectedManager.isOnline ? "Online" : "Offline"}</p>
            <p><b>Access:</b> {selectedManager.isActive ? "Enabled" : "Disabled"}</p>

            {/* 🔹 LOGIN ACTIVITY */}
            <div style={{ marginTop: 14 }}>
              <h4 style={{ marginBottom: 6 }}>🕘 Login Activity</h4>

              {selectedManager.loginHistory?.length > 0 ? (
                (() => {
                  const last =
                    selectedManager.loginHistory[
                      selectedManager.loginHistory.length - 1
                    ];

                  return (
                    <>
                      <p>
                        <b>Today Login:</b>{" "}
                        {last.loginAt
                          ? new Date(last.loginAt).toLocaleTimeString()
                          : "—"}
                      </p>
                      <p>
                        <b>Today Logout:</b>{" "}
                        {last.logoutAt
                          ? new Date(last.logoutAt).toLocaleTimeString()
                          : "Not yet"}
                      </p>
                    </>
                  );
                })()
              ) : (
                <p>No login data available</p>
              )}

              <button
                style={styles.pdfBtn}
                onClick={() =>
                  downloadMonthlyPDF(
                    selectedManager.name,
                    selectedManager.department,
                    selectedManager.loginHistory || []
                  )
                }
              >
                📄 Download Monthly Login PDF
              </button>
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

/* ================= STYLES ================= */

const styles = {
  row: {
    background: "#ffffff",
    padding: "18px 22px",
    borderRadius: 14,
    marginBottom: 14,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    border: "1px solid #e5e7eb",
  },
  nameRow: { display: "flex", alignItems: "center", gap: 10 },
  statusDot: { width: 10, height: 10, borderRadius: "50%" },
  statusText: { fontSize: 12, fontWeight: 600 },
  meta: { fontSize: 13, color: "#4b5563", marginTop: 8 },
  actions: { display: "flex", gap: 12 },

  accessBtn: {
    padding: "7px 18px",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  viewBtn: {
    padding: "7px 18px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: 20,
    cursor: "pointer",
    fontWeight: 600,
  },

  deleteBtn: {
    padding: "7px 18px",
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
    padding: "14px 26px",
    background: "linear-gradient(135deg, #0b3c5d, #0f5c8c)",
    color: "#fff",
    borderRadius: 999,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    background: "#fff",
    padding: 26,
    borderRadius: 16,
    width: 460,
  },

  closeBtn: {
    width: "100%",
    padding: 14,
    background: "#b91c1c",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 20,
  },

  pdfBtn: {
    marginTop: 10,
    padding: "6px 12px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
};
