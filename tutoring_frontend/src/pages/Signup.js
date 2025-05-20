import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    username: "",
    password: "",
    address: "",
    phone: "",
    subject: "",
    description: "",
    price: "",
    availability: "",
    img_url: "",
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
        `http://localhost:5000/api/${endpoint}`,
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

        {/* Extra fields only shown if user is a teacher */}
        {userType === "teacher" && (
          <>
            <input
              type="text"
              name="address"
              placeholder="Address"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="availability"
              placeholder="Availability (e.g. Mon-Fri)"
              className="input-field"
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="img_url"
              placeholder="Image URL"
              className="input-field"
              onChange={handleChange}
              required
            />
          </>
        )}

        <button type="submit" className="btn signup-btn">
          Create Account
        </button>
      </form>

      <p>{message}</p>

      <p className="login-link">
        Already have an account? <a href="/login">Log in here</a>
      </p>
    </div>
  );
};

export default Signup;
