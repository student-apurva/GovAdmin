import React, { useState } from "react";

const AdminLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      // 🔐 Save token for future APIs & Socket.io
      localStorage.setItem("kmc_token", data.token);

      // ✅ Let App.js control navigation
      setUser(data.user);
    } catch (err) {
      setError("Server not reachable");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      {/* LEFT PANEL */}
      <div style={styles.leftPanel}>
        <h1 style={styles.kmcTitle}>Kolhapur Municipal Corporation</h1>
        <p style={styles.kmcSubtitle}>Administrative Control System</p>

        <ul style={styles.kmcList}>
          <li>✔ Secure Officer Authentication</li>
          <li>✔ Role-Based Access Control</li>
          <li>✔ Centralized City Management</li>
          <li>✔ Digital Governance Platform</li>
        </ul>

        <div style={styles.kmcFooter}>
          Government of Maharashtra
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div style={styles.rightPanel}>
        <div style={styles.loginBox}>
          <h2 style={styles.heading}>Admin Login</h2>
          <p style={styles.subHeading}>Authorized Officers Only</p>

          {error && <div style={styles.error}>{error}</div>}

          <label style={styles.label}>Official Email</label>
          <input
            style={styles.input}
            type="email"
            placeholder="name@kmc.gov.in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            style={styles.button}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Login"}
          </button>

          <div style={styles.footer}>
            © Kolhapur Municipal Corporation
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🎨 INLINE STYLES (UNCHANGED UI) */
const styles = {
  page: {
    display: "flex",
    height: "100vh",
    fontFamily: "Segoe UI, sans-serif",
  },
  leftPanel: {
    flex: 1,
    background: "linear-gradient(135deg, #e0f2fe, #93c5fd)",
    padding: "60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  kmcTitle: {
    fontSize: "34px",
    fontWeight: "700",
    marginBottom: "10px",
  },
  kmcSubtitle: {
    fontSize: "18px",
    marginBottom: "30px",
    color: "#1e40af",
  },
  kmcList: {
    fontSize: "16px",
    lineHeight: "2",
    paddingLeft: "20px",
  },
  kmcFooter: {
    marginTop: "40px",
    fontSize: "14px",
    opacity: 0.8,
  },
  rightPanel: {
    flex: 1,
    background: "#ffffff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    width: "380px",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
  },
  heading: {
    textAlign: "center",
    color: "#0f4c75",
  },
  subHeading: {
    textAlign: "center",
    color: "#666",
    fontSize: "14px",
    marginBottom: "20px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "600",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#0f4c75",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  error: {
    background: "#ffe0e0",
    color: "red",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
    textAlign: "center",
  },
  footer: {
    marginTop: "15px",
    textAlign: "center",
    fontSize: "12px",
    color: "#888",
  },
};

export default AdminLogin;
