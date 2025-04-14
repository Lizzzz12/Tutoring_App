import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("Logging in...");

    try {
      // Try student login first
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
        setTimeout(() => {
          const role = localStorage.getItem("role");
          if (role === "teacher") {
            navigate("/teacher-profile");
          } else {
            navigate("/profile"); // student
          }
        }, 1000);
        return;
      }
    } catch (err) {
      // continue to try teacher login
    }

    try {
      // Try teacher login if student login fails
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
        setTimeout(() => {
          const role = localStorage.getItem("role");
          if (role === "teacher") {
            navigate("/teacher-profile");
          } else {
            navigate("/profile"); // student
          }
        }, 1000);
        return;
      }
    } catch (error) {
      // login failed for both
      setMessage(
        error.response?.data?.message ||
        "Login failed as student and teacher. Please try again."
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

        <button type="submit" className="btn login-btn">
          Login
        </button>
      </form>

      {message && (
        <div className={`message ${message.includes("successful") ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
