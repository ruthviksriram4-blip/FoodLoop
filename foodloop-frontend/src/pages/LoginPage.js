import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: "Donor", email: "donor@foodloop.com", pass: "Donor@123", role: "DONOR", desc: "Grand Feast Hotel" },
    { label: "Verified NGO", email: "ngo@foodloop.com", pass: "Ngo@123", role: "NGO", desc: "Feed The Hungry" },
    { label: "Volunteer", email: "volunteer@foodloop.com", pass: "Volunteer@123", role: "VOLUNTEER", desc: "Alex Sharma" },
    { label: "Admin", email: "admin@foodloop.com", pass: "Admin@123", role: "ADMIN", desc: "Central Oversight" },
  ];

  // 1-Click Auto Login with pre-seeded demo accounts
  const handleQuickDemoLogin = async (acc) => {
    setFormData({
      email: acc.email,
      password: acc.pass,
    });
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email: acc.email.trim(),
        password: acc.pass.trim(),
      });

      localStorage.setItem(
        "foodloopUser",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email: formData.email.trim(),
        password: formData.password.trim(),
      });

      localStorage.setItem(
        "foodloopUser",
        JSON.stringify({
          ...response.data.user,
          token: response.data.token,
        })
      );

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid email or password. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your FoodLoop account to manage surplus food redistribution.</p>

        {error && <div className="error-message">{error}</div>}

        {/* 1-Click Instant Demo Login Buttons */}
        <div style={{ marginBottom: "22px", padding: "14px 16px", background: "rgba(209, 250, 229, 0.6)", border: "1px solid rgba(167, 243, 208, 0.8)", borderRadius: "12px" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: "#065f46", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>⚡</span> 1-Click Instant Demo Login:
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => handleQuickDemoLogin(acc)}
                disabled={loading}
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(52, 211, 153, 0.4)",
                  borderRadius: "8px",
                  padding: "8px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  color: "#065f46",
                  fontWeight: "700",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 6px rgba(6, 78, 59, 0.05)",
                }}
              >
                <span>{acc.label} ➔</span>
                <span style={{ fontSize: "10px", fontWeight: "500", color: "#649483" }}>{acc.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="e.g. donor@foodloop.com"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <button type="submit" className="primary-button" disabled={loading} style={{ width: "100%", marginTop: "18px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer" style={{ marginTop: "24px" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
