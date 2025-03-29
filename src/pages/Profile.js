// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchUser = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("You must be logged in to view this page.");
//         return;
//       }

//       console.log("🔹 Token Found:", token);

//       try {
//         const response = await axios.get("http://localhost:3000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
        
//         console.log("✅ User Data:", response.data);
//         setUser(response.data);
//       } catch (err) {
//         console.error("❌ API Error:", err.response);
//         setError(err.response?.data?.message || "Error fetching user data.");
//       }
//     };
    

//     fetchUser();
//   }, []);

//   return (
//     <div className="profile-container">
//       <h2>User Profile</h2>
//       {error && <p className="error">{error}</p>}
//       {user ? (
//         <div>
//           <p><strong>Email:</strong> {user.email}</p>
//           <p><strong>Username:</strong> {user.username}</p>
//           <p><strong>First Name:</strong> {user.firstname}</p>
//           <p><strong>Last Name:</strong> {user.lastname}</p>
//           <button 
//             onClick={() => {
//               localStorage.removeItem("token");
//               window.location.href = "/login";
//             }}
//           >
//             Logout
//           </button>
//         </div>
//       ) : (
//         !error && <p>Loading...</p>
        
//       )}

//     </div>
//   );
// };

// export default Profile;


import React from "react";

const Profile = () => {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>Welcome to your profile!</p>
    </div>
  );
};

export default Profile;
