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

  const registeredAccounts = [
    {
      role: "DONOR",
      name: "Grand Feast Hotel",
      email: "donor@foodloop.com",
      password: "Donor@123",
      altPass: "donor123",
      tag: "Surplus Food Donor",
    },
    {
      role: "NGO",
      name: "Feed The Hungry Foundation",
      email: "ngo@foodloop.com",
      password: "Ngo@123",
      altPass: "ngo123",
      tag: "Verified NGO",
    },
    {
      role: "VOLUNTEER",
      name: "Alex Sharma",
      email: "volunteer@foodloop.com",
      password: "Volunteer@123",
      altPass: "volunteer123",
      tag: "Food Pickup & Delivery",
    },
    {
      role: "ADMIN",
      name: "System Administrator",
      email: "admin@foodloop.com",
      password: "Admin@123",
      altPass: "admin123",
      tag: "Central Platform Admin",
    },
    {
      role: "DONOR",
      name: "Ruthvik Sriram",
      email: "ruthviksriram4@gmail.com",
      password: "Password@123",
      altPass: "Ruthvik@2007",
      tag: "Personal Account",
    },
  ];

  const handleQuickLogin = async (acc) => {
    setFormData({
      email: acc.email,
      password: acc.password,
    });
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", {
        email: acc.email.trim(),
        password: acc.password.trim(),
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

  const fillFormOnly = (acc) => {
    setFormData({
      email: acc.email,
      password: acc.password,
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
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        <h1>Welcome Back</h1>
        <p>Login to your FoodLoop account to manage surplus food redistribution.</p>

        {error && <div className="error-message">{error}</div>}

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

          <button type="submit" className="primary-button" disabled={loading} style={{ width: "100%", marginTop: "16px" }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Registered Credentials & 1-Click Login List */}
        <div style={{ marginTop: "24px", paddingTop: "18px", borderTop: "1px solid rgba(6, 78, 59, 0.12)" }}>
          <p style={{ fontSize: "12px", fontWeight: "800", color: "#064e3b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>🔑</span> Registered Accounts & Credentials:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {registeredAccounts.map((acc) => (
              <div
                key={acc.email}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "rgba(255, 255, 255, 0.8)",
                  border: "1px solid rgba(167, 243, 208, 0.8)",
                  borderRadius: "10px",
                  backdropFilter: "blur(10px)",
                  fontSize: "12px",
                }}
              >
                <div>
                  <div style={{ fontWeight: "700", color: "#064e3b", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>{acc.name}</span>
                    <span style={{ fontSize: "10px", padding: "2px 6px", background: "rgba(209, 250, 229, 0.9)", color: "#065f46", borderRadius: "10px", fontWeight: "800" }}>
                      {acc.role}
                    </span>
                  </div>
                  <div style={{ color: "#47745a", marginTop: "2px" }}>
                    <code>{acc.email}</code> | Pass: <code>{acc.password}</code>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => fillFormOnly(acc)}
                    style={{
                      padding: "6px 9px",
                      background: "rgba(234, 243, 240, 0.9)",
                      border: "1px solid rgba(6, 78, 59, 0.15)",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "600",
                      cursor: "pointer",
                      color: "#064e3b",
                    }}
                    title="Fill into form"
                  >
                    Fill
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin(acc)}
                    disabled={loading}
                    style={{
                      padding: "6px 12px",
                      background: "linear-gradient(135deg, #059669 0%, #047857 100%)",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer",
                      color: "white",
                      boxShadow: "0 2px 6px rgba(5, 150, 105, 0.25)",
                    }}
                    title="1-Click Login directly"
                  >
                    Login ➔
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="auth-footer" style={{ marginTop: "22px" }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
