import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("foodloopUser"));

  const logout = () => {
    localStorage.removeItem("foodloopUser");
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
            <Link to="/dashboard">Dashboard</Link>
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