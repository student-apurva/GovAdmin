import React, { useState } from "react";

const AddOfficer = ({ department, onAddOfficer, onBack }) => {
  const [officer, setOfficer] = useState({
    empId: "",
    fullName: "",
    gender: "",
    phone: "",
    address: "",
    designation: "",
    ward: "",
    department,
  });

  const handleChange = (key, value) => {
    setOfficer({ ...officer, [key]: value });
  };

  const handleSubmit = () => {
    if (!officer.empId || !officer.fullName || !officer.phone) {
      alert("Employee ID, Full Name and Phone are mandatory");
      return;
    }
    onAddOfficer(officer);
    onBack();
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h2>Add Officer</h2>
        <p>{department} Department</p>
      </div>

      <div style={styles.form}>
        <Field label="Employee ID">
          <input
            value={officer.empId}
            onChange={(e) => handleChange("empId", e.target.value)}
          />
        </Field>

        <Field label="Full Name">
          <input
            value={officer.fullName}
            onChange={(e) => handleChange("fullName", e.target.value)}
          />
        </Field>

        <Field label="Gender">
          <select
            value={officer.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="">Select</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </Field>

        <Field label="Phone Number">
          <input
            value={officer.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </Field>

        <Field label="Designation">
          <input
            value={officer.designation}
            onChange={(e) => handleChange("designation", e.target.value)}
          />
        </Field>

        <Field label="Ward / Area">
          <input
            value={officer.ward}
            onChange={(e) => handleChange("ward", e.target.value)}
          />
        </Field>

        <Field label="Address" full>
          <textarea
            rows={3}
            value={officer.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </Field>

        <div style={styles.actions}>
          <button style={styles.primaryBtn} onClick={handleSubmit}>
            Save Officer
          </button>
          <button style={styles.secondaryBtn} onClick={onBack}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= SMALL FIELD WRAPPER ================= */
const Field = ({ label, children, full }) => (
  <div style={{ ...styles.field, gridColumn: full ? "span 2" : "auto" }}>
    <label style={styles.label}>{label}</label>
    {children}
  </div>
);

/* ================= STYLES ================= */
const styles = {
  wrapper: {
    background: "#ffffff",
    borderRadius: 12,
    padding: 28,
    maxWidth: 820,
    margin: "0 auto",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  header: {
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: 12,
  },

  form: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 16,
  },

  field: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
  },

  actions: {
    gridColumn: "span 2",
    display: "flex",
    gap: 12,
    marginTop: 20,
  },

  primaryBtn: {
    background: "#14532d",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },

  secondaryBtn: {
    background: "#6b7280",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 6,
    border: "none",
    cursor: "pointer",
  },
};

export default AddOfficer;
