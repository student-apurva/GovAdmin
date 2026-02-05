import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const ManagersPage = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selectedManager, setSelectedManager] = useState(null);
  const [managers, setManagers] = useState([]);

  const token = localStorage.getItem("kmc_token");

  /* ================= LOAD MANAGERS ================= */
  const loadManagers = async () => {
    const res = await fetch("http://localhost:5000/api/managers", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      setManagers(
        data.map((m) => ({
          id: m.enrollmentId,
          _id: m._id,
          name: m.name,
          email: m.email,
          department: m.department,
          isActive: m.isActive,
          isOnline: m.isOnline,
        }))
      );
    }
  };

  useEffect(() => {
    loadManagers();
    socket.on("managerStatusUpdate", loadManagers);

    return () => socket.off("managerStatusUpdate", loadManagers);
  }, []);

  /* ================= TOGGLE ACCESS ================= */
  const toggleAccess = async (id) => {
    const manager = managers.find((m) => m.id === id);
    if (!manager) return;

    await fetch(
      `http://localhost:5000/api/managers/toggle/${manager._id}`,
      {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    loadManagers();
  };

  return (
    <div style={{ position: "relative" }}>
      <h1 style={{ marginBottom: 20 }}>Department Managers</h1>

      {managers.map((m) => (
        <div key={m.id} style={styles.row}>
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
              🆔 {m.id}
            </div>
          </div>

          <div style={styles.actions}>
            <button
              style={{
                ...styles.accessBtn,
                background: m.isActive ? "#15803d" : "#b91c1c",
              }}
              onClick={() => toggleAccess(m.id)}
            >
              {m.isActive ? "Active" : "Disabled"}
            </button>

            <button
              style={styles.viewBtn}
              onClick={() => setSelectedManager(m)}
            >
              View
            </button>
          </div>
        </div>
      ))}

      <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
        + Add Manager
      </button>

      {selectedManager && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Manager Details</h2>
            <p><b>ID:</b> {selectedManager.id}</p>
            <p><b>Name:</b> {selectedManager.name}</p>
            <p><b>Email:</b> {selectedManager.email}</p>
            <p><b>Department:</b> {selectedManager.department}</p>
            <p><b>Status:</b> {selectedManager.isOnline ? "Online" : "Offline"}</p>
            <p><b>Access:</b> {selectedManager.isActive ? "Enabled" : "Disabled"}</p>

            <button style={styles.closeBtn} onClick={() => setSelectedManager(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showAdd && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2>Add Department Manager</h2>

            <input placeholder="Full Name" style={styles.input} />
            <input placeholder="Email" style={styles.input} />
            <input placeholder="Temporary Password" style={styles.input} />

            <select style={styles.input}>
              <option>Select Department</option>
              <option>Health Department</option>
              <option>Sanitation Department</option>
              <option>Water Supply Department</option>
              <option>Electricity Department</option>
            </select>

            <label style={styles.checkbox}>
              <input type="checkbox" defaultChecked />
              Give Login Access
            </label>

            <button style={styles.saveBtn}>Create Manager</button>
            <button style={styles.cancelBtn} onClick={() => setShowAdd(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagersPage;

/* ================= STYLES (REQUIRED) ================= */

const styles = {
  row: {
    background: "#fff",
    padding: "16px 18px",
    borderRadius: 10,
    marginBottom: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
  },
  nameRow: { display: "flex", alignItems: "center", gap: 8 },
  statusDot: { width: 10, height: 10, borderRadius: "50%" },
  statusText: { fontSize: 12, marginLeft: 6 },
  meta: { fontSize: 13, color: "#374151", marginTop: 6 },
  actions: { display: "flex", gap: 10 },
  accessBtn: { padding: "6px 14px", color: "#fff", border: "none", borderRadius: 6 },
  viewBtn: { padding: "6px 14px", background: "#0b3c5d", color: "#fff", borderRadius: 6 },
  addBtn: {
    position: "fixed",
    bottom: 30,
    left: 320,
    padding: "14px 20px",
    background: "#0b3c5d",
    color: "#fff",
    borderRadius: 30,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: { background: "#fff", padding: 24, borderRadius: 12, width: 420 },
  input: { width: "100%", padding: 10, marginBottom: 12 },
  checkbox: { display: "flex", gap: 8, marginBottom: 14 },
  saveBtn: { width: "100%", padding: 12, background: "#0b3c5d", color: "#fff" },
  cancelBtn: { width: "100%", padding: 12, background: "#6b7280", color: "#fff" },
  closeBtn: { width: "100%", padding: 12, background: "#b91c1c", color: "#fff" },
};






// import React, { useState } from "react";

// const ManagersPage = () => {
//   const [showAdd, setShowAdd] = useState(false);
//   const [selectedManager, setSelectedManager] = useState(null);

//   // 🔹 Simulated manager data
//   const [managers, setManagers] = useState([
//     {
//       id: "MGR-1001",
//       name: "Ramesh Patil",
//       email: "health@kmc.gov.in",
//       department: "Health Department",
//       isActive: true,
//       isOnline: true, // 🟢 logged in
//     },
//     {
//       id: "MGR-1002",
//       name: "Suresh More",
//       email: "water@kmc.gov.in",
//       department: "Water Supply Department",
//       isActive: false,
//       isOnline: false, // 🔴 offline
//     },
//   ]);

//   /* ================= TOGGLE ACCESS ================= */
//   const toggleAccess = (id) => {
//     setManagers((prev) =>
//       prev.map((m) =>
//         m.id === id ? { ...m, isActive: !m.isActive } : m
//       )
//     );
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <h1 style={{ marginBottom: 20 }}>Department Managers</h1>

//       {/* ================= MANAGER LIST ================= */}
//       {managers.map((m) => (
//         <div key={m.id} style={styles.row}>
//           <div>
//             {/* NAME + ONLINE STATUS */}
//             <div style={styles.nameRow}>
//               <span
//                 style={{
//                   ...styles.statusDot,
//                   background: m.isOnline ? "#16a34a" : "#9ca3af",
//                 }}
//               />
//               <strong>{m.name}</strong>
//               <span
//                 style={{
//                   ...styles.statusText,
//                   color: m.isOnline ? "#16a34a" : "#6b7280",
//                 }}
//               >
//                 {m.isOnline ? "Online" : "Offline"}
//               </span>
//             </div>

//             <div style={styles.meta}>
//               🏢 {m.department} <br />
//               📧 {m.email} <br />
//               🆔 {m.id}
//             </div>
//           </div>

//           <div style={styles.actions}>
//             <button
//               style={{
//                 ...styles.accessBtn,
//                 background: m.isActive ? "#15803d" : "#b91c1c",
//               }}
//               onClick={() => toggleAccess(m.id)}
//             >
//               {m.isActive ? "Active" : "Disabled"}
//             </button>

//             <button
//               style={styles.viewBtn}
//               onClick={() => setSelectedManager(m)}
//             >
//               View
//             </button>
//           </div>
//         </div>
//       ))}

//       {/* ================= ADD MANAGER BUTTON ================= */}
//       <button style={styles.addBtn} onClick={() => setShowAdd(true)}>
//         + Add Manager
//       </button>

//       {/* ================= VIEW MANAGER MODAL ================= */}
//       {selectedManager && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h2>Manager Details</h2>

//             <p><b>ID:</b> {selectedManager.id}</p>
//             <p><b>Name:</b> {selectedManager.name}</p>
//             <p><b>Email:</b> {selectedManager.email}</p>
//             <p><b>Department:</b> {selectedManager.department}</p>
//             <p>
//               <b>Status:</b>{" "}
//               {selectedManager.isOnline ? "Online" : "Offline"}
//             </p>
//             <p>
//               <b>Access:</b>{" "}
//               {selectedManager.isActive ? "Enabled" : "Disabled"}
//             </p>

//             <button
//               style={styles.closeBtn}
//               onClick={() => setSelectedManager(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}

//       {/* ================= ADD MANAGER MODAL ================= */}
//       {showAdd && (
//         <div style={styles.overlay}>
//           <div style={styles.modal}>
//             <h2>Add Department Manager</h2>

//             <input placeholder="Full Name" style={styles.input} />
//             <input placeholder="Email" style={styles.input} />
//             <input placeholder="Temporary Password" style={styles.input} />

//             <select style={styles.input}>
//               <option>Select Department</option>
//               <option>Health Department</option>
//               <option>Sanitation Department</option>
//               <option>Water Supply Department</option>
//               <option>Electricity Department</option>
//             </select>

//             <label style={styles.checkbox}>
//               <input type="checkbox" defaultChecked />
//               Give Login Access
//             </label>

//             <button style={styles.saveBtn}>Create Manager</button>
//             <button
//               style={styles.cancelBtn}
//               onClick={() => setShowAdd(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManagersPage;

// /* ================= INLINE STYLES ================= */

// const styles = {
//   row: {
//     background: "#fff",
//     padding: "16px 18px",
//     borderRadius: 10,
//     marginBottom: 12,
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//     boxShadow: "0 3px 10px rgba(0,0,0,0.06)",
//   },

//   nameRow: {
//     display: "flex",
//     alignItems: "center",
//     gap: 8,
//   },

//   statusDot: {
//     width: 10,
//     height: 10,
//     borderRadius: "50%",
//   },

//   statusText: {
//     fontSize: 12,
//     marginLeft: 6,
//   },

//   meta: {
//     fontSize: 13,
//     color: "#374151",
//     marginTop: 6,
//     lineHeight: "1.6",
//   },

//   actions: {
//     display: "flex",
//     gap: 10,
//   },

//   accessBtn: {
//     padding: "6px 14px",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },

//   viewBtn: {
//     padding: "6px 14px",
//     background: "#0b3c5d",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },

//   addBtn: {
//     position: "fixed",
//     bottom: 30,
//     left: 320,
//     padding: "14px 20px",
//     background: "#0b3c5d",
//     color: "#fff",
//     border: "none",
//     borderRadius: 30,
//     cursor: "pointer",
//     fontSize: 14,
//     boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
//   },

//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.55)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   },

//   modal: {
//     background: "#fff",
//     padding: 24,
//     borderRadius: 12,
//     width: 420,
//   },

//   input: {
//     width: "100%",
//     padding: 10,
//     marginBottom: 12,
//     borderRadius: 6,
//     border: "1px solid #ccc",
//   },

//   checkbox: {
//     display: "flex",
//     gap: 8,
//     marginBottom: 14,
//     fontSize: 14,
//   },

//   saveBtn: {
//     width: "100%",
//     padding: 12,
//     background: "#0b3c5d",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     marginBottom: 8,
//     cursor: "pointer",
//   },

//   cancelBtn: {
//     width: "100%",
//     padding: 12,
//     background: "#6b7280",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     cursor: "pointer",
//   },

//   closeBtn: {
//     width: "100%",
//     padding: 12,
//     background: "#b91c1c",
//     color: "#fff",
//     border: "none",
//     borderRadius: 6,
//     marginTop: 12,
//     cursor: "pointer",
//   },
// };
