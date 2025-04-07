import React, { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Making the request to the backend without authorization token
        const response = await fetch("http://localhost:5000/api/profile");

        // Check if the response status is OK (status code 200-299)
        if (!response.ok) {
          // If not, throw an error with the response status
          throw new Error(`Failed to fetch user data: ${response.statusText}`);
        }

        // Parse the JSON data from the response
        const data = await response.json();

        // Assuming the backend sends user data in a property called `data`
        setUser(data.data); 
      } catch (err) {
        // Set the error message if any error occurs
        setError(err.message);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Profile Page</h1>

      {/* Display error message if there is an error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display user data if available */}
      {user ? (
        <div>
          <p><strong>Name:</strong> {user.firstname} {user.lastname}</p>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default Profile;
