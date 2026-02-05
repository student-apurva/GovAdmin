import { useState } from "react";

const DepartmentsPage = () => {
  const [selectedDept, setSelectedDept] = useState(null);
  const [viewImage, setViewImage] = useState(null);

  /* ================= SAMPLE DATA ================= */

  const departments = [
    {
      name: "Health Department",
      manager: "Dr. Amit Patil",
      solved: 30,
      pending: 12,
      complaints: [
        {
          id: "HD-101",
          type: "Garbage not collected",
          location: "Ward 12",
          priority: "High",
          createdHoursAgo: 36,
          image: "https://via.placeholder.com/400x250?text=Garbage+Issue",
          timeline: [
            { time: "Day 1 - 9:00 AM", action: "Complaint registered" },
            { time: "Day 2 - 10:00 AM", action: "Assigned to Health Officer" },
          ],
        },
        {
          id: "HD-102",
          type: "Medical waste issue",
          location: "Ward 8",
          priority: "Medium",
          createdHoursAgo: 20,
          image: "https://via.placeholder.com/400x250?text=Medical+Waste",
          timeline: [
            { time: "Day 1 - 11:00 AM", action: "Complaint registered" },
          ],
        },
      ],
    },
    {
      name: "Sanitation Department",
      manager: "Mr. Rahul Shinde",
      solved: 40,
      pending: 15,
      complaints: [
        {
          id: "SD-201",
          type: "Overflowing drainage",
          location: "Ward 4",
          priority: "High",
          createdHoursAgo: 50,
          image: "https://via.placeholder.com/400x250?text=Drainage",
          timeline: [
            { time: "Day 1 - 8:30 AM", action: "Complaint registered" },
            { time: "Day 2 - 12:00 PM", action: "Escalated to Commissioner" },
          ],
        },
      ],
    },
  ];

  /* ================= SLA ================= */

  const getSLAHours = (priority) => {
    if (priority === "High") return 24;
    if (priority === "Medium") return 48;
    return 72;
  };

  const isSLABreached = (c) =>
    c.createdHoursAgo > getSLAHours(c.priority);

  /* ================= DETAILS ================= */

  if (selectedDept) {
    const total = selectedDept.solved + selectedDept.pending;
    const solvedPercent = Math.round(
      (selectedDept.solved / total) * 100
    );

    return (
      <div>
        <button style={styles.backBtn} onClick={() => setSelectedDept(null)}>
          ← Back
        </button>

        <h1 style={styles.pageTitle}>{selectedDept.name}</h1>
        <p>
          <b>Manager:</b> {selectedDept.manager}
        </p>

        {/* PERFORMANCE */}
        <div style={styles.graphBox}>
          <div>Performance</div>
          <div style={styles.barBg}>
            <div
              style={{ ...styles.barFill, width: `${solvedPercent}%` }}
            />
          </div>
          <small>{solvedPercent}% Complaints Solved</small>
        </div>

        <button style={styles.pdfBtn} onClick={() => window.print()}>
          📄 Print Govt Report
        </button>

        {/* COMPLAINTS */}
        <h3 style={{ marginTop: 30 }}>Complaints</h3>

        {Array.isArray(selectedDept.complaints) &&
          selectedDept.complaints.map((c) => {
            const breached = isSLABreached(c);

            return (
              <div
                key={c.id}
                style={{
                  ...styles.complaintRow,
                  background: breached ? "#fee2e2" : "#ffffff",
                  borderLeft: breached
                    ? "6px solid #b91c1c"
                    : "6px solid #10b981",
                }}
              >
                <div style={{ flex: 1 }}>
                  <b>{c.id}</b> – {c.type}

                  <div style={styles.smallText}>
                    📍 {c.location} | ⚡ {c.priority}
                  </div>

                  {breached && (
                    <div style={styles.escalation}>
                      ⚠️ SLA BREACHED — Escalated to Commissioner
                    </div>
                  )}

                  {/* TIMELINE (SAFE) */}
                  <div style={styles.timeline}>
                    <b>Timeline:</b>
                    {Array.isArray(c.timeline) &&
                      c.timeline.map((t, i) => (
                        <div key={i} style={styles.timelineItem}>
                          ⏱ {t.time} — {t.action}
                        </div>
                      ))}
                  </div>
                </div>

                <button
                  style={styles.viewBtn}
                  onClick={() => setViewImage(c.image)}
                >
                  📷 View Image
                </button>
              </div>
            );
          })}

        {/* IMAGE VIEWER */}
        {viewImage && (
          <div style={styles.imageOverlay} onClick={() => setViewImage(null)}>
            <img src={viewImage} alt="Complaint" style={styles.image} />
          </div>
        )}
      </div>
    );
  }

  /* ================= LIST ================= */

  return (
    <div>
      <h1 style={styles.pageTitle}>Municipal Departments</h1>

      <div style={styles.grid}>
        {departments.map((dept, i) => (
          <div
            key={i}
            style={styles.card}
            onClick={() => setSelectedDept(dept)}
          >
            <h3>{dept.name}</h3>
            <p>👤 {dept.manager}</p>
            <p>
              ✅ {dept.solved} | ⏳ {dept.pending}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= STYLES ================= */

const styles = {
  pageTitle: { fontSize: 26, color: "#0b3c5d" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 12,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  backBtn: { marginBottom: 15 },

  graphBox: { maxWidth: 400, margin: "20px 0" },

  barBg: {
    height: 10,
    background: "#e5e7eb",
    borderRadius: 6,
  },

  barFill: {
    height: 10,
    background: "#0b3c5d",
    borderRadius: 6,
  },

  pdfBtn: {
    marginTop: 10,
    padding: "8px 14px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
  },

  complaintRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    marginTop: 10,
    alignItems: "center",
  },

  smallText: { fontSize: 12, color: "#6b7280" },

  escalation: {
    marginTop: 6,
    fontSize: 12,
    color: "#b91c1c",
    fontWeight: 600,
  },

  timeline: { marginTop: 8, fontSize: 12 },

  timelineItem: { marginTop: 2 },

  viewBtn: {
    padding: "6px 10px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  imageOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  image: {
    maxWidth: "90%",
    maxHeight: "90%",
    borderRadius: 8,
  },
};

export default DepartmentsPage;
