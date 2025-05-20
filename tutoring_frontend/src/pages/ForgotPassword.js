import React, { useState } from "react";
import axios from "axios";
// import "..styles/ForgotPassword.css"; 
import "../styles/ForgotPassword.css"; 

const ForgotPassword = () => {
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Sending reset link...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/forgot-password",
        { input },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Password reset link sent!");
      setSubmitted(true);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      <p>Enter your username or email to receive a reset link.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="input"
          placeholder="Username or Email"
          value={input}
          onChange={handleChange}
          className="input-field"
          required
        />

        <button type="submit" className="btn">
          Send Reset Link
        </button>
      </form>

      {message && (
        <div className={`message ${submitted ? "success" : "error"}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
