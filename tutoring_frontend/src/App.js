import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

// Admin
import AdminLogin from './adminComponent/AdminLogin';
import AdminDashboard from './adminComponent/AdminDashboard';

// Authentication
import RegisterForm from './RegisterForm';
import CombinedLogin from './CombinedLogin';

// Student
import AnnouncementDetails from './components/Details';
import StudentDashboard from './components/StudentDashboard';
import Favorites from './components/Favourites';
import TeacherProfile from './components/TeacherProfile';
import ChangeStudentCredentials from './components/ChangeStudentCredentials';

// Teacher
import TeacherDashboard from './teacherComponent/teacherDashboard';
import EditTeacherProfile from './teacherComponent/EditTeacherProfile';

// Main
import Home from './Home';

const App = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/main_register_form" element={<RegisterForm />} />
            <Route path="/main_login_form" element={<CombinedLogin />} />
            
            <Route path="/announcements/:id" element={<AnnouncementDetails />} />
            <Route path="/teacher-profile/:teacherId" element={<TeacherProfile />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/favorites" element={<Favorites />} />
            
            <Route path="/teacher_dashboard" element={<TeacherDashboard />} />
            <Route path="/edit_teacher/:id" element={<EditTeacherProfile />} />
            
            <Route path="/student/change_credentials/:id" element={<ChangeStudentCredentials />} />
            
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Routes>
        </Router>
      </AuthProvider>
    </Suspense>
  );
};

export default App;