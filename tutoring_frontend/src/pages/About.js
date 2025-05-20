import React from "react";
import "./About.css"; // Create this CSS file or add styles in your global CSS

const About = () => {
  return (
    <div className="about-container">
      <h2 className="about-title">Welcome to Our Tutoring Platform</h2>
      <p className="about-intro">
        Empowering students and tutors to connect, grow, and succeed together.
      </p>

      <div className="about-section">
        <h3>🎯 Our Mission</h3>
        <p>
          We aim to make quality education accessible to everyone by connecting
          passionate tutors with curious students. Whether you're preparing for
          exams or exploring a new subject, we're here to support your journey.
        </p>
      </div>

      <div className="about-section">
        <h3>🧑‍🏫 For Tutors</h3>
        <p>
          Share your expertise, build your profile, and help students thrive.
          Our platform makes it easy to manage availability, connect with
          learners, and grow your tutoring career.
        </p>
      </div>

      <div className="about-section">
        <h3>📚 For Students</h3>
        <p>
          Discover top-rated tutors across various subjects. Schedule sessions,
          track progress, and get the support you need — anytime, anywhere.
        </p>
      </div>

      <div className="about-footer">
        <p>
          🚀 Ready to learn or teach? <a href="/signup">Join us today!</a>
        </p>
      </div>
    </div>
  );
};

export default About;
