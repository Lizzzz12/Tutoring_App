import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from './AuthContext';

// Student interface imports
import StudentDashboard from "./studentComponent/student_dashboard";
import AnnouncementDetails from "./studentComponent/details";
import StudentLogin from "./studentComponent/student_login";
import Favorites from "./studentComponent/favorites";
import Register from "./studentComponent/student_register";
import TeacherProfile from "./studentComponent/teacher_profile";

const App = () => {
  return (
    <AuthProvider>
       <Router>
       
        <Routes>
          <Route path="/" element={<StudentLogin />} />
          <Route path="/student_register" element={<Register />} />
          <Route path="/teacher/:id" element={<AnnouncementDetails />} />
          <Route path="/teacher-profile/:teacherId" element={<TeacherProfile />} />
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
        </Routes>
      
    </Router>
    </AuthProvider>
  );
};

export default App;
