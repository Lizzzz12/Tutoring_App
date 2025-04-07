import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const MainLayout = ({ children }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <a href="/" className="logo">Tutoring App</a>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            {/* <Link to="/tutorprofile">Tutor Profile  </Link>  */}

            {/* Login Dropdown */}
            <div className="login-dropdown">
              <button 
                className="login-btn" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                Login
              </button>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/login">Login</Link>
                  <Link to="/signup">Sign Up</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer
      <footer className="footer">
        <p>&copy; 2025 Tutoring App. All rights reserved.</p>
      </footer> */}
    </div>
  );
};

export default MainLayout;
