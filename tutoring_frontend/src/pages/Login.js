// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Login = () => {
//   const [userType, setUserType] = useState("student");
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const endpoint = userType === "student" ? "student_auth" : "teacher_auth";

//     try {
//       const response = await axios.post(`http://localhost:5000/api/student_auth`, formData);
//       localStorage.setItem("token", response.data.token);
//       setMessage("Login successful! Redirecting...");
//       setTimeout(() => {
//         navigate("/profile");
//       }, 1500);
//     } catch (error) {
//       setMessage(error.response?.data?.message || "Login failed");
//     }
//   };

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleLogin}>
//       <input
//   type="text"
//   name="username"
//   placeholder="Username"
//   className="input-field"
//   onChange={handleChange}
//   required
// />

// <input
//   type="password"
//   name="password"
//   placeholder="Password"
//   className="input-field"
//   onChange={handleChange}
//   required
// />

// <select
//   className="input-field"
//   onChange={(e) => setUserType(e.target.value)}
//   value={userType}
// >
//   <option value="student">Student</option>
//   <option value="teacher">Teacher</option>
// </select>

// <button type="submit" className="btn login-btn">
//   Login
// </button>

//       </form>
//       {message && <p>{message}</p>}
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import "./Login.css";

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
      const response = await axios.post(
        "http://localhost:5000/api/student_auth",
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Store both token and username in localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", formData.username);
        
        setMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/profile"), 1000);
      } else {
        setMessage(response.data.message || "Login failed");
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || 
        error.message || 
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>
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
      {message && <div className={`message ${message.includes("success") ? "success" : "error"}`}>{message}</div>}
    </div>
  );
};

export default Login;