import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token && role) {
      if (role === "teacher") {
        navigate("/teacher-profile");
      } else if (role === "student") {
        navigate("/dashboard");
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      const studentRes = await axios.post(
        "http://localhost:5000/api/student_auth",
        formData
      );

      if (studentRes.data.success && studentRes.data.student) {
        const { id, username } = studentRes.data.student;

        localStorage.setItem("token", studentRes.data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("role", "student");
        localStorage.setItem("studentId", id.toString());

        setMessage("Login successful as student! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1000);
        return;
      }
    } catch (err) {
      console.log("Student login failed, trying teacher...");
    }

    try {
      const teacherRes = await axios.post(
        "http://localhost:5000/api/teacher_auth",
        formData
      );

      if (teacherRes.data.success) {
        localStorage.setItem("token", teacherRes.data.token);
        localStorage.setItem("username", formData.username);
        localStorage.setItem("role", "teacher");

        setMessage("Login successful as teacher! Redirecting...");
        setTimeout(() => navigate("/teacher-profile"), 1000);
        return;
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Login failed for both roles. Please check your credentials."
      );
    }
  };

  return (
    <div className="signup-container">
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

        <button type="submit" className="btn signup-btn">
          Login
        </button>
      </form>

      <p>{message}</p>

      <p className="login-link">
        Don't have an account? <a href="/signup">Sign up here</a>
      </p>

      <p className="forgot-password-link">
        <a href="/forgot-password">Forgot Password?</a>
      </p>
    </div>
  );
};

export default Login;
