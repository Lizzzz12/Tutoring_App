import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      navigate(role === "teacher" ? "/teacher-profile" : "/profile");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      // Attempt Student Login
      const studentRes = await axios.post(
        "http://localhost:5000/api/student_auth",
        formData,
        { withCredentials: true }
      );

      if (studentRes.data.success) {
        localStorage.setItem("token", studentRes.data.token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("role", "student");
        setMessage("Login successful as student! Redirecting...");
        return setTimeout(() => navigate("/profile"), 1000);
      }
    } catch (err) {
      // Proceed to check teacher login
    }

    try {
      // Attempt Teacher Login
      const teacherRes = await axios.post(
        "http://localhost:5000/api/teacher_auth",
        formData,
        { withCredentials: true }
      );

      if (teacherRes.data.success) {
        localStorage.setItem("token", teacherRes.data.token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("role", "teacher");
        setMessage("Login successful as teacher! Redirecting...");
        return setTimeout(() => navigate("/teacher-profile"), 1000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Login failed for both roles. Please check your credentials."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn login-btn">Login</button>
      </form>

      {message && (
        <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </div>
      )}

      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>
    </div>
  );
};

export default Login;
