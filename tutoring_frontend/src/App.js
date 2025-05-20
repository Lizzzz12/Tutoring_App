import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./i18n"; // Import the i18n configuration

// Student interface imports
import StudentDashboard from "./pages/studentComponent/student_dashboard";
import AnnouncementDetails from "./pages/studentComponent/details";
import Favorites from "./pages/studentComponent/favorites";

// Main interface imports
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import TeacherProfile from "./pages/tutor_page/TeacherProfile";
import ProfileCards from "./pages/ProfileCards/ProfileCards";
import TutorDetail from "./pages/ProfileCards/TutorDetails";
import EditTeacherProfile from "./pages/tutor_page/EditTeacherProfile";
import ForgotPassword from "./pages/ForgotPassword";
// import Chatbot from "./components/Chatbot";

const App = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* General pages */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/teacher-profile/:id" element={<TeacherProfile />} />
          <Route path="/teacher-profile" element={<TeacherProfile />} />
          <Route path="/profilecards" element={<ProfileCards />} />
          <Route path="/tutor/:id" element={<TutorDetail />} />
          <Route path="/edit-teacher-profile" element={<EditTeacherProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* <Route path="/chatbot" element={<Chatbot />} /> */}

          {/* Student-specific pages */}
          <Route path="/dashboard" element={<StudentDashboard />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/teacher/:id" element={<AnnouncementDetails />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
