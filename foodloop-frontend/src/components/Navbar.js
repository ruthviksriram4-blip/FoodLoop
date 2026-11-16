import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

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
      <Link to="/" className="logo">
        FoodLoop
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/dashboard" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              Dashboard
              <span
                style={{
                  background: "#dcfce7",
                  color: "#15803d",
                  fontSize: "10px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "10px",
                  textTransform: "uppercase",
                }}
              >
                {user.role}
              </span>
            </Link>
            <span style={{ fontSize: "14px", color: "#64748b" }}>
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
