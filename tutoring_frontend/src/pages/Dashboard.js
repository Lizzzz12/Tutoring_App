// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       navigate("/login");
//       return;
//     }
  
//     fetch("https://your-backend-url.com/api/user", {
//       method: "GET",
//       headers: { 
//         "Authorization": `Bearer ${token}`,
//         "Content-Type": "application/json"
//       }
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Unauthorized");
//         return res.json();
//       })
//       .then((data) => setUser(data))
//       .catch(() => {
//         localStorage.removeItem("token"); // Clear invalid token
//         navigate("/login");
//       });
//   }, [navigate]);
  
//   return (
//     <div className="container">
//       <h1>Welcome, {user.name}!</h1>
//       <p>{user.role === "teacher" ? "Thanks for helping students learn!" : "Ready to book a tutor?"}</p>
//       <button onClick={() => {
//         localStorage.removeItem("token");
//         navigate("/login");
//       }}>Logout</button>
//     </div>
//   );
  
// };

// export default Dashboard;
