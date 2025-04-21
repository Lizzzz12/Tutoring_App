import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./TeacherProfile.css";

const TeacherProfile = () => {
  const [teacher, setTeacher] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [reviews, setReviews] = useState([]); // overall teacher reviews
  const [loading, setLoading] = useState({
    profile: true,
    announcements: true,
    reviews: false,
  });
  const [error, setError] = useState(null);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    subject: "",
    price: "",
    content: "",
  });
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "teacher") {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleBackToProfile = () => {
    fetchTeacherData();
    setExpandedAnnouncement(null);
  };

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      if (role !== "teacher" || !username || !token) {
        throw new Error("Authentication required");
      }

      const teacherResponse = await axios.get(
        "http://localhost:5000/api/teachers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const teacherData = teacherResponse.data.data.find(
        (t) => t.username === username
      );

      if (!teacherData) throw new Error("Teacher not found");
      setTeacher(teacherData);

      const announcementsResponse = await axios.get(
        `http://localhost:5000/api/teacher/${teacherData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAnnouncements(announcementsResponse.data.data || []);

      const reviewsResponse = await axios.get(
        `http://localhost:5000/api/reviews/${teacherData.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReviews(reviewsResponse.data.data || []);

      setLoading((prev) => ({
        ...prev,
        profile: false,
        announcements: false,
        reviews: false,
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
      setLoading((prev) => ({
        ...prev,
        profile: false,
        announcements: false,
        reviews: false,
      }));
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/create_announcements",
        newAnnouncement,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewAnnouncement({ subject: "", price: "", content: "" });
      setShowForm(false);
      fetchTeacherData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create announcement");
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `http://localhost:5000/api/delete_announcements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAnnouncements((prev) => prev.filter((ann) => ann.id !== id));
      if (expandedAnnouncement === id) {
        setExpandedAnnouncement(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete announcement");
      if (err.response?.status === 401) {
        handleLogout();
      }
      fetchTeacherData();
    }
  };

  useEffect(() => {
    fetchTeacherData();
    const tokenCheckInterval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        handleLogout();
      }
    }, 300000);
    return () => clearInterval(tokenCheckInterval);
  }, []);

  if (loading.profile) {
    return (
      <div className="page-wrapper loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrapper error-container">
        <h3>Error Loading Profile</h3>
        <p>{error}</p>
        <button className="logout-btn" onClick={handleLogout}>
          Return to Login
        </button>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="page-wrapper">
        <p>No teacher data available</p>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="profile-actions">
        <button
          className="back-btn"
          onClick={handleBackToProfile}
          disabled={!expandedAnnouncement}
        >
          ← Back to Profile
        </button>
        {/* <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
      </div>

      <div className="profile-section">
        <div className="profile-content">
          <div className="profile-photo">
            <img
              src={teacher.img_url || "https://via.placeholder.com/150"}
              alt={`${teacher.firstname} ${teacher.lastname}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
          </div>

          <div className="profile-details">
            <h2>
              {teacher.firstname} {teacher.lastname}
              {parseFloat(teacher.ratings) > 4.5 && (
                <span className="verified-badge">Top Rated</span>
              )}
            </h2>

            <button
              className="edit-btn"
              onClick={() =>
                navigate("/edit-teacher-profile", {
                  state: { teacherId: teacher.id },
                })
                
              }
            >
              ✏️ Edit Profile
            </button>

            <div className="detail-grid">
              {teacher.subject && (
                <div className="detail-item">
                  <span className="detail-label">Subject:</span>
                  <span>{teacher.subject}</span>
                </div>
              )}
              {teacher.email && (
                <div className="detail-item">
                  <span className="detail-label">Email:</span>
                  <span>
                    <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                  </span>
                </div>
              )}
              {teacher.phone && (
                <div className="detail-item">
                  <span className="detail-label">Phone:</span>
                  <span>
                    <a href={`tel:${teacher.phone}`}>{teacher.phone}</a>
                  </span>
                </div>
              )}
              {teacher.price && (
                <div className="detail-item">
                  <span className="detail-label">Rate:</span>
                  <span>${teacher.price}/hour</span>
                </div>
              )}
              {teacher.availability && (
                <div className="detail-item">
                  <span className="detail-label">Availability:</span>
                  <span>{teacher.availability}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Rating:</span>
                <span>
                  {teacher.ratings || "0"}/5
                  {parseFloat(teacher.ratings) > 4 && (
                    <span className="star-icon">★</span>
                  )}
                </span>
              </div>
            </div>

            <div className="profile-description">
              <h3>About Me</h3>
              <p>{teacher.description || "No description provided."}</p>
            </div>

            <div className="reviews-section">
              <h3>Student Reviews</h3>
              {reviews.length > 0 ? (
                <div className="reviews-list">
                  {reviews.map((review) => (
                    <div key={review.id} className="review-card">
                      <div className="review-header">
                        <strong>{review.title}</strong>
                        <span className="review-rating">
                          Rating: {review.rating}/5
                        </span>
                      </div>
                      <p className="review-content">"{review.review}"</p>
                      <p className="review-author">
                        – {review.student_firstname} {review.student_lastname}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No reviews yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="announcements-section">
          <div className="announcements-header">
            <h3>My Announcements</h3>
            <button
              className="primary-btn"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Create Announcement"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleCreateAnnouncement}
              className="announcement-form"
            >
              <input
                type="text"
                placeholder="Subject"
                value={newAnnouncement.subject}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    subject: e.target.value,
                  })
                }
                required
              />
              <input
                type="number"
                placeholder="Price per hour"
                value={newAnnouncement.price}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    price: e.target.value,
                  })
                }
                required
              />
              <textarea
                placeholder="Announcement content"
                value={newAnnouncement.content}
                onChange={(e) =>
                  setNewAnnouncement({
                    ...newAnnouncement,
                    content: e.target.value,
                  })
                }
                required
              />
              <button type="submit" className="primary-btn">
                Post Announcement
              </button>
            </form>
          )}

          {loading.announcements ? (
            <div className="loading-container">
              <div className="loading-spinner small"></div>
              <p>Loading announcements...</p>
            </div>
          ) : announcements.length > 0 ? (
            <div className="announcements-list">
              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-card">
                  <div className="announcement-header">
                    <div
                      className="clickable-header"
                      onClick={() =>
                        setExpandedAnnouncement(
                          expandedAnnouncement === announcement.id
                            ? null
                            : announcement.id
                        )
                      }
                    >
                      <h4>
                        {announcement.subject} (${announcement.price}/hour)
                      </h4>
                      <span className="toggle-icon">
                        {expandedAnnouncement === announcement.id ? "▼" : "▶"}
                      </span>
                    </div>
                    <button
                      className="delete-announcement-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAnnouncement(announcement.id);
                      }}
                      title="Delete announcement"
                    >
                      ×
                    </button>
                  </div>
                  <p className="announcement-date">
                    Posted on{" "}
                    {new Date(announcement.created_at).toLocaleDateString()}
                  </p>
                  <p className="announcement-content">{announcement.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No announcements yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
