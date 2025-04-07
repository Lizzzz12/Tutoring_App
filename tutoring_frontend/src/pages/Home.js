import React from "react";
import { Link } from "react-router-dom";
import img from "../images/backgimg.png";

const Home = () => {
  return (
    <div>
      <div class="home-container">
        <img src={img} alt="Home" class="home-image" />
        <div class="home-text">
          <h1>Welcome to Our Site</h1>
          <p>
            This is some description text that will appear to the right of the
            image.
          </p>
          
        </div>
      </div>
    </div>
  );
};

export default Home;
