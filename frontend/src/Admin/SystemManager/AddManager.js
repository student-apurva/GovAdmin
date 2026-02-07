import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/* ================= EMAIL GENERATOR ================= */
const generateOfficialEmail = (name, department) => {
  if (!name || !department) return "";

  const deptMap = {
    "Health Department": "health",
    "Sanitation Department": "sanitation",
    "Water Supply Department": "water",
    "Electricity Department": "electricity",
  };

  const deptKey = deptMap[department];
  if (!deptKey) return "";

  const firstName = name.trim().split(" ")[0].toLowerCase();
  const unique = Math.floor(1000 + Math.random() * 9000);

  return `${deptKey}.${firstName}.${unique}@kmc.gov.in`;
};

const AddManager = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    address: "",
    department: "",
    officialEmail: "",
    personalEmail: "",
    phone: "",
    password: "",
    isActive: true,
  });

  const [message, setMessage] = useState("");

  /* ================= AUTO EMAIL ================= */
  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      officialEmail: generateOfficialEmail(
        prev.fullName,
        prev.department
      ),
    }));
  }, [form.fullName, form.department]);

  /* ================= INPUT HANDLER ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 📞 Phone → numbers only, max 10 digits
    if (name === "phone") {
      if (!/^\d{0,10}$/.test(value)) return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  /* ================= SUBMIT ================= */
  const submit = async () => {
    setMessage("");

    // 🔴 VALIDATIONS
    if (!form.fullName || !form.department || !form.password) {
      setMessage("❌ Please fill all required fields");
      return;
    }

    if (form.phone.length !== 10) {
      setMessage("❌ Phone number must be exactly 10 digits");
      return;
    }

    if (form.password.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/create-manager",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("kmc_token")}`,
          },
          body: JSON.stringify({
            name: form.fullName,
            email: form.officialEmail,
            password: form.password,
            department: form.department,
            personalEmail: form.personalEmail,
            phone: form.phone,
            address: form.address,
            isActive: form.isActive,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "❌ Failed to create manager");
        return;
      }

      setMessage("✅ Department Manager created successfully");

      // 🔁 Redirect back to manager list
      setTimeout(() => {
        navigate("/system-manager/managers");
      }, 1200);
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Department Manager Registration</h2>
        <p style={styles.subTitle}>
          Government Employee Account Creation
        </p>

        {message && (
          <div
            style={{
              ...styles.message,
              background: message.startsWith("✅")
                ? "#ecfdf5"
                : "#fee2e2",
              color: message.startsWith("✅")
                ? "#065f46"
                : "#b91c1c",
            }}
          >
            {message}
          </div>
        )}

        <Field
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          placeholder="As per government records"
        />

        <Field
          label="Residential Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          placeholder="Complete address"
        />

        <div style={styles.field}>
          <label style={styles.label}>Department</label>
          <select
            name="department"
            value={form.department}
            onChange={handleChange}
            style={styles.input}
          >
            <option value="">Select Department</option>
            <option>Health Department</option>
            <option>Sanitation Department</option>
            <option>Water Supply Department</option>
            <option>Electricity Department</option>
          </select>
        </div>

        <Field
          label="Designation"
          value="Department Manager"
          disabled
        />

        <Field
          label="Official Department Email (Login ID)"
          value={form.officialEmail}
          disabled
        />

        <Field
          label="Personal Email"
          name="personalEmail"
          value={form.personalEmail}
          onChange={handleChange}
          placeholder="example@gmail.com"
        />

        <Field
          label="Mobile Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="10-digit mobile number"
        />

        <Field
          label="Temporary Password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Temporary login password"
          type="password"
        />

        <div style={styles.checkboxRow}>
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          <span>Activate login immediately</span>
        </div>

        <div style={styles.buttonRow}>
          <button onClick={submit} style={styles.primaryBtn}>
            Create Manager
          </button>
          <button
            onClick={() => navigate("/system-manager/managers")}
            style={styles.secondaryBtn}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= FIELD COMPONENT ================= */
const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}) => (
  <div style={styles.field}>
    <label style={styles.label}>{label}</label>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        ...styles.input,
        background: disabled ? "#f3f4f6" : "#fff",
      }}
    />
  </div>
);

/* ================= STYLES ================= */

const styles = {
  overlay: { display: "flex", justifyContent: "center", paddingTop: 30 },
  card: {
    width: 480,
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 14px 40px rgba(0,0,0,0.18)",
  },
  title: { textAlign: "center", color: "#0b3c5d" },
  subTitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 22,
  },
  field: { marginBottom: 14 },
  label: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 6,
    display: "block",
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },
  checkboxRow: {
    display: "flex",
    gap: 8,
    margin: "18px 0 22px",
  },
  buttonRow: { display: "flex", gap: 14 },
  primaryBtn: {
    flex: 1,
    padding: 12,
    background: "#0b3c5d",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    flex: 1,
    padding: 12,
    background: "#e5e7eb",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
  },
  message: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    textAlign: "center",
  },
};

export default AddManager;
