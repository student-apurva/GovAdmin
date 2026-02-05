import React, { useState } from "react";

const AddManager = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    isActive: true,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async () => {
    setMessage("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/auth/create-manager",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("kmc_token")}`,
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to create manager");
        return;
      }

      setMessage("✅ Manager created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        department: "",
        isActive: true,
      });
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <div style={{ maxWidth: 420 }}>
      <h2>Add Department Manager</h2>

      {message && <p>{message}</p>}

      <input
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        style={styles.input}
      />

      <input
        name="password"
        placeholder="Temporary Password"
        value={form.password}
        onChange={handleChange}
        style={styles.input}
      />

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

      <label style={{ display: "flex", gap: "8px", marginBottom: 12 }}>
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        Give Login Access
      </label>

      <button onClick={submit} style={styles.button}>
        Create Manager
      </button>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0b3c5d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default AddManager;
