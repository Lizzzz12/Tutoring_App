import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/styles.css";

const MainLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      navigate("/login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div>
      {/* Styled Header */}
      <header className="header">
        <div className="header-content">
         <Link to={isLoggedIn ? "/teacher-profile" : "/"} className="logo">
  Tutoring App
</Link>

          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <button className="login-btn" onClick={handleAuthClick}>
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default MainLayout;
