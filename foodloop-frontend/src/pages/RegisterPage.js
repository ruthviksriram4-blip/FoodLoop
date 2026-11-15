import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "DONOR",
    organizationName: "",
    address: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/users/register", formData);

      setSuccess("Registration successful! You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card register-card" onSubmit={handleSubmit}>
        <h1>Create Account</h1>
        <p>Join the FoodLoop community.</p>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <label>Full Name</label>
        <input
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
          required
        />

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
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Phone Number</label>
        <input
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />

        <label>Account Role</label>
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="DONOR">Donor</option>
          <option value="NGO">NGO</option>
          <option value="VOLUNTEER">Volunteer</option>
        </select>

        <label>Organization Name (optional)</label>
        <input
          name="organizationName"
          placeholder="Enter organization name"
          value={formData.organizationName}
          onChange={handleChange}
        />

        <label>Address</label>
        <textarea
          name="address"
          placeholder="Enter your address"
          value={formData.address}
          onChange={handleChange}
          rows="3"
        />

        <button type="submit" className="primary-button" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;