import React from "react";

const Login = () => {
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" className="input-field" placeholder="Enter your email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" className="input-field" placeholder="Enter your password" />
        </div>
        <button className="btn login-btn">Login</button>
      </form>
      <p>Don't have an account? <a href="/signup">Sign up</a></p>
    </div>
  );
};

export default Login;
