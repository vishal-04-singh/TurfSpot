import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useEffect, useState } from "react";

function Navbar() {
  const user = localStorage.getItem("user_id");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="navbar">

      <div className="logo">
        <div className="logo-icon">TS</div>
        <h3>TurfSpot</h3>
      </div>

      <div className="links">
        <Link to="/" className="link">Home</Link>

        {user && (
          <>
            <Link to="/turfs" className="link">Turfs</Link>
            <Link to="/my-bookings" className="link">My Bookings</Link>
          </>
        )}
      </div>

      <div className="navbar-right">
        <button className="theme-toggle" onClick={toggleTheme} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {!user ? (
          <>
            <Link to="/login" className="btn btn-dark">Login</Link>
            <Link to="/register" className="btn btn-neon">Sign Up</Link>
          </>
        ) : (
          <button
            className="btn btn-dark"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        )}
      </div>

    </div>
  );
}

export default Navbar;