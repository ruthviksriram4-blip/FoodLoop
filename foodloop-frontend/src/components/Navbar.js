import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import FoodLoopLogo from "./FoodLoopLogo";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("foodloopUser");
    setUser(stored ? JSON.parse(stored) : null);
  }, [location]);

  const logout = () => {
    localStorage.removeItem("foodloopUser");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link" style={{ textDecoration: "none" }}>
        <FoodLoopLogo size={38} variant="light" />
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Dashboard
              <span
                style={{
                  background: "rgba(209, 250, 229, 0.9)",
                  color: "#065f46",
                  border: "1px solid rgba(52, 211, 153, 0.35)",
                  fontSize: "10px",
                  fontWeight: "800",
                  padding: "2px 7px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                {user.role}
              </span>
            </Link>
            <span style={{ fontSize: "14px", color: "#47745a", fontWeight: "600" }}>
              Hi, {user.name?.split(" ")[0]}
            </span>
            <button className="nav-button" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="nav-register">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
