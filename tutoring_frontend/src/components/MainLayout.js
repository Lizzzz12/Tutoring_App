import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/styles.css";

const MainLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

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

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={`app-container ${location.pathname === '/chatbot' ? 'chatbot-fullscreen' : ''}`}>
      {location.pathname !== '/chatbot' && (
        <header className="header">
          <div className="header-content">
            <div
              className="logo"
              onClick={() => {
                const role = localStorage.getItem("role");
                if (role === "student") {
                  navigate("/dashboard");
                } else if (role === "teacher") {
                  navigate("/teacher-profile");
                } else {
                  navigate("/");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              Tutoring App
            </div>

            <nav className="nav">
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
              <button className="login-btn" onClick={handleAuthClick}>
                {isLoggedIn ? t('nav.logout') : t('nav.login')}
              </button>
              {/* Language switcher */}
              <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className="language-switcher">
                <option value="en">EN</option>
                <option value="ka">KA</option>
              </select>
            </nav>
          </div>
        </header>
      )}

      {location.pathname !== '/chatbot' && (
        <main className="main-content">
          {children}
        </main>
      )}
    </div>
  );
};

export default MainLayout;
