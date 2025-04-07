import React, { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/students"); // Backend endpoint
        setUsers(response.data);
      } catch (err) {
        setError("Failed to fetch users. Check backend connection.");
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="users-container">
      <h2>Users List</h2>
      {error && <p className="error">{error}</p>}
      <ul>
        {users.map((user, index) => (
          <li key={index}>
            {user.firstname} {user.lastname} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
