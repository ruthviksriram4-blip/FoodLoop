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
    { label: "Admin", email: "admin@foodloop.com", pass: "Admin@123", role: "ADMIN" },
    { label: "Donor", email: "donor@foodloop.com", pass: "Donor@123", role: "DONOR" },
    { label: "Verified NGO", email: "ngo@foodloop.com", pass: "Ngo@123", role: "NGO" },
    { label: "Pending NGO", email: "care.ngo@foodloop.com", pass: "Ngo@123", role: "NGO" },
    { label: "Volunteer", email: "volunteer@foodloop.com", pass: "Volunteer@123", role: "VOLUNTEER" },
  ];

  const fillDemo = (acc) => {
    setFormData({
      email: acc.email,
      password: acc.pass,
    });
    setError("");
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
      const response = await api.post("/users/login", formData);

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

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Login to your FoodLoop account to manage surplus food redistribution.</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="primary-button" disabled={loading} style={{ width: "100%", marginTop: "15px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "10px" }}>
            Quick Demo Accounts (1-Click Fill):
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => fillDemo(acc)}
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  padding: "5px 10px",
                  fontSize: "12px",
                  cursor: "pointer",
                  color: "#1e293b",
                  fontWeight: "500",
                }}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <p className="auth-footer" style={{ marginTop: "20px" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
