import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [userType, setUserType] = useState("student"); // Default is student
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const endpoint = userType === "student" ? "student_auth" : "teacher_auth";

    try {
      const response = await axios.post(`http://localhost:3000/${endpoint}`, formData);
      localStorage.setItem("token", response.data.token);
      setMessage("Login successful! Redirecting...");
      setTimeout(() => {
        navigate("/profile"); // Navigate to profile
      }, 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <select onChange={(e) => setUserType(e.target.value)} value={userType}>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Login;
