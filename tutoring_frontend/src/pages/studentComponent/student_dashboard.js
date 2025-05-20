import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Dashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [studentId, setStudentId] = useState(null);
  const username = localStorage.getItem('username');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'student') {
      navigate('/login');
      return;
    }

    const fetchStudentInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/students`);
        const students = response.data.data;
        const student = students.find((s) => s.username === username);
        if (student) {
          setStudentId(student.id);
        }
      } catch (error) {
        console.error('Failed to fetch student info:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/teachers');
        if (response.data.data && Array.isArray(response.data.data)) {
          setTeachers(response.data.data);
        } else {
          console.error('Unexpected teachers format:', response.data);
        }
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
      }
    };

    fetchStudentInfo();
    fetchTeachers();
  }, [navigate, username]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    localStorage.removeItem('studentId');
    navigate('/login');
  };

  const handleSaveFavorite = (teacher) => {
    const updatedFavorites = [...favorites, teacher];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (id) => {
    return favorites.some((fav) => fav.id === id);
  };

  const filteredTeachers = teachers.filter((teacher) => {
    const fullName = `${teacher.firstname} ${teacher.lastname}` || '';
    const subjects = teacher.subjects_taught || '';
    return (
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subjects.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header">
        <div className="header-content">
          <div className="nav">
            <span className="welcome-text">Welcome, {username}!</span>
            <Link to="/favorites" className="nav-link">
              <button className="btn favorites-btn">My Favorites</button>
            </Link>
            
          </div>
        </div>
      </div>

      <div className="main-content">
        <div className="dashboard-header">
          <h2>Available Teachers</h2>
          <div className="search-container">
            <input
              type="text"
              className="search-input"
              placeholder="Search by teacher name or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="announcements-grid">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div key={teacher.id} className="announcement-card">
                <div className="card-header">
                  <h3>{teacher.firstname} {teacher.lastname}</h3>
                  <span className="price">{teacher.qualification}</span>
                </div>
                <div className="card-body">
                  <p className="teacher-name">
                    <strong>Subjects:</strong> {teacher.subjects_taught}
                  </p>
                  <p className="description">
                    <strong>Experience:</strong> {teacher.experience} years
                  </p>
                  <p className="description">
                    <strong>Availability:</strong> {teacher.availability}
                  </p>
                </div>
                <div className="card-footer">
                  <Link 
                    to={`/teacher-profile/${teacher.id}`}
                    className="btn details-btn"
                  >
                    View Profile
                  </Link>
                  {!isFavorite(teacher.id) ? (
                    <button 
                      className="btn save-btn"
                      onClick={() => handleSaveFavorite(teacher)}
                    >
                      ♡ Save
                    </button>
                  ) : (
                    <button className="btn saved-btn" disabled>
                      ✓ Saved
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No teachers found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;