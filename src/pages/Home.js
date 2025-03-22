import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <h2>Welcome to the Tutoring App</h2>
      <p>Find the best tutors and start learning today!</p>

      <div className="home-buttons">
        <Link to="/signup" className="btn signup-btn">Sign Up</Link>
        <Link to="/login" className="btn login-btn">Login</Link>
      </div>
    </div>
  );
};

export default Home;
