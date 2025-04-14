// src/pages/ProfilePage.js
import React, { useEffect, useState } from "react";

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/login"; // Redirect to login if no token
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to fetch profile data");
        }

        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-container">
      <h2>Welcome, {userData?.username}</h2>
      <p>Email: {userData?.email}</p>
      {/* Add more user profile data here */}
      <button onClick={() => localStorage.removeItem("token")}>Logout</button>
    </div>
  );
};

export default ProfilePage;
