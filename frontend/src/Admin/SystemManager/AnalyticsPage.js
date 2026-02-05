import { useState } from "react";

const AnalyticsPage = () => {
  /* ================= STATE ================= */
  const [viewMode, setViewMode] = useState("monthly"); // weekly | monthly

  /* ================= MONTH DATA ================= */

  const currentMonth = {
    total: 4562,
    solved: 3920,
    pending: 642,
    urgent: 128,
  };

  const previousMonth = {
    total: 4210,
    solved: 3650,
    pending: 560,
    urgent: 98,
  };

  const stats = viewMode === "monthly" ? currentMonth : {
    total: 1124,
    solved: 910,
    pending: 214,
    urgent: 36,
  };

  /* ================= MoM CALC ================= */

  const mom = (current, prev) =>
    (((current - prev) / prev) * 100).toFixed(1);

  /* ================= DATA ================= */

  const departmentData = [
    { name: "Health", value: 32 },
    { name: "Sanitation", value: 28 },
    { name: "Water Supply", value: 18 },
    { name: "Electricity", value: 14 },
    { name: "Roads", value: 8 },
  ];

  const priorityData = [
    { label: "High", value: 22, color: "#b91c1c" },
    { label: "Medium", value: 46, color: "#f59e0b" },
    { label: "Low", value: 32, color: "#10b981" },
  ];

  /* ================= PDF EXPORT ================= */
  const exportPDF = () => {
    window.print();
  };

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.pageTitle}>Analytics & Insights</h1>
          <p style={styles.subtitle}>
            Month-over-month performance & governance metrics
          </p>
        </div>

        <div style={styles.actions}>
          <button
            style={toggleStyle(viewMode === "weekly")}
            onClick={() => setViewMode("weekly")}
          >
            Weekly
          </button>
          <button
            style={toggleStyle(viewMode === "monthly")}
            onClick={() => setViewMode("monthly")}
          >
            Monthly
          </button>

          <button style={styles.pdfBtn} onClick={exportPDF}>
            🧾 Govt PDF (Digitally Signed)
          </button>
        </div>
      </div>

      {/* ================= COLLECTOR DASHBOARD ================= */}
      <section style={styles.collectorBox}>
        <h3>🧑‍⚖️ Collector / Commissioner Overview</h3>

        <CollectorRow
          label="Urgent Complaints"
          value={stats.urgent}
          mom={mom(currentMonth.urgent, previousMonth.urgent)}
        />

        <CollectorRow
          label="Pending Complaints"
          value={stats.pending}
          mom={mom(currentMonth.pending, previousMonth.pending)}
        />

        <CollectorRow
          label="Resolution Rate"
          value={`${Math.round(
            (stats.solved / stats.total) * 100
          )}%`}
          mom={mom(
            (currentMonth.solved / currentMonth.total) * 100,
            (previousMonth.solved / previousMonth.total) * 100
          )}
        />
      </section>

      {/* ================= KPI CARDS ================= */}
      <div style={styles.cardGrid}>
        <StatCard title="Total Complaints" value={stats.total} />
        <StatCard title="Resolved" value={stats.solved} color="green" />
        <StatCard title="Pending" value={stats.pending} color="#f59e0b" />
        <StatCard title="Urgent" value={stats.urgent} color="#b91c1c" />
      </div>

      {/* ================= DEPARTMENT LOAD ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Department-wise Load</h3>

        {departmentData.map((d, i) => (
          <div key={i} style={styles.barRow}>
            <span style={styles.barLabel}>{d.name}</span>
            <div style={styles.barBg}>
              <div
                style={{ ...styles.barFill, width: `${d.value}%` }}
              />
            </div>
            <span style={styles.barValue}>{d.value}%</span>
          </div>
        ))}
      </section>

      {/* ================= PRIORITY ================= */}
      <section style={styles.section}>
        <h3 style={styles.sectionTitle}>Complaint Priority Split</h3>

        <div style={styles.priorityGrid}>
          {priorityData.map((p, i) => (
            <div key={i} style={styles.priorityCard}>
              <div
                style={{
                  ...styles.priorityCircle,
                  background: p.color,
                }}
              />
              <div>
                <h4 style={{ margin: 0 }}>{p.label}</h4>
                <p style={{ margin: 0, color: "#6b7280" }}>
                  {p.value}% Complaints
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PDF FOOTER ================= */}
      <div style={styles.nicFooter}>
        Digitally Signed by NIC • Govt of India (Mock Signature)
      </div>
    </div>
  );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value, color = "#0b3c5d" }) => (
  <div style={styles.card}>
    <p style={styles.cardLabel}>{title}</p>
    <h2 style={{ ...styles.cardValue, color }}>{value}</h2>
  </div>
);

const CollectorRow = ({ label, value, mom }) => (
  <div style={styles.collectorRow}>
    <span>{label}</span>
    <b>{value}</b>
    <span
      style={{
        color: mom >= 0 ? "#b91c1c" : "#10b981",
        fontWeight: 600,
      }}
    >
      {mom >= 0 ? `▲ ${mom}%` : `▼ ${Math.abs(mom)}%`}
    </span>
  </div>
);

const toggleStyle = (active) => ({
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  cursor: "pointer",
  background: active ? "#0b3c5d" : "#e5e7eb",
  color: active ? "#fff" : "#000",
});

/* ================= STYLES ================= */

const styles = {
  pageTitle: { fontSize: 26, color: "#0b3c5d" },
  subtitle: { color: "#6b7280" },

  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  actions: { display: "flex", gap: 10 },

  pdfBtn: {
    padding: "6px 14px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  collectorBox: {
    background: "#fff7ed",
    borderLeft: "6px solid #b91c1c",
    padding: 16,
    borderRadius: 8,
    marginBottom: 30,
  },

  collectorRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 8,
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
    marginBottom: 35,
  },

  card: {
    background: "#ffffff",
    padding: 20,
    borderRadius: 12,
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  },

  cardLabel: { fontSize: 14, color: "#6b7280" },
  cardValue: { fontSize: 30, fontWeight: 700 },

  section: { marginBottom: 40 },
  sectionTitle: { fontSize: 18, color: "#0b3c5d", marginBottom: 16 },

  barRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },

  barLabel: { width: 110 },
  barBg: {
    flex: 1,
    height: 10,
    background: "#e5e7eb",
    borderRadius: 6,
  },
  barFill: { height: 10, background: "#0b3c5d", borderRadius: 6 },
  barValue: { width: 40 },

  priorityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
  },

  priorityCard: {
    display: "flex",
    gap: 14,
    background: "#fff",
    padding: 16,
    borderRadius: 10,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },

  priorityCircle: { width: 14, height: 14, borderRadius: "50%" },

  nicFooter: {
    marginTop: 40,
    textAlign: "center",
    fontSize: 12,
    color: "#6b7280",
  },
};

export default AnalyticsPage;
