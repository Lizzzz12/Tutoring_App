import React, { useState } from "react";
import axios from "axios";
//some comments
const Signup = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const endpoint =
      userType === "student" ? "student_register" : "register_teachers";

    try {
      const response = await axios.post(
        `http://localhost:3000/${endpoint}`,
        formData
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <select
          className="input-field"
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
        >
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input
          type="text"
          name="firstname"
          placeholder="First Name"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastname"
          placeholder="Last Name"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="input-field"
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="input-field"
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn signup-btn">
          Create Account
        </button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Signup;
