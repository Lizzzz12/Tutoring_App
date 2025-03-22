import React from "react";

const Signup = () => {
  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form>
        <div>
          <label>Email:</label>
          <input type="email" className="input-field" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" className="input-field" />
        </div>
        <button className="btn signup-btn">Create Account</button>
      </form>
    </div>
  );
};

export default Signup;
