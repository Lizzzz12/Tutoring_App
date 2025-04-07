import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
// import Tutors from "./pages/Tutors";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
// import TeachersList from "./pages/TutorProfile";

const App = () => {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/tutors" element={<Tutors />} /> */}
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* <Route path="/dashboard" element={<Dashboard />} /> */}
          <Route path="/profile" element={<Profile />} />
          {/* <Route path="/tutorprofile" element={<TutorProfile />} />  */}
          {/* <Route path="/teacherslist" element={<TeachersList />} /> */}
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
