import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const MainLayout = ({ children }) => {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Tutoring App</h1>
          <nav className="nav">
            <Link to="/">Home</Link>
            <Link to="/tutors">Find a Tutor</Link>
            <Link to="/about">About</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">{children}</main>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Tutoring App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainLayout;
