import React from "react";
import { useNavigate } from "react-router-dom";
import img from "../images/backgimg.png";
import ProfileCards from "./ProfileCards/ProfileCards";

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAuthClick = () => {
    if (isLoggedIn) {
      // Logout
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("role");
      navigate("/login");
    } else {
      // Go to login
      navigate("/login");
    }
  };

  return (
    <div>
     

      {/* Top Section: Image and Text */}
      <div className="home-container">
        <img src={img} alt="Home" className="home-image" />
        <div className="home-text">
          <h1>Welcome to Our Site</h1>
          <p>
            This is some description text that will appear to the right of the image.
          </p>
        </div>
      </div>

      {/* Bottom Section: Tutor Cards */}
      <ProfileCards />
    </div>
  );
};

export default Home;
