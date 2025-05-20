import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./TeacherProfile.css";

const TeacherProfile = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({
    profile: true,
    announcements: true,
    reviews: true,
  });
  const [error, setError] = useState(null);
  const [expandedAnnouncement, setExpandedAnnouncement] = useState(null);
  const [newAnnouncement, setNewAnnouncement] = useState({
    id: null,
    subject: "",
    price: "",
    content: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    const stored = localStorage.getItem('favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const navigate = useNavigate();
  const location = useLocation();

  const isOwnProfile = () => {
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    return role === "teacher" && teacher && teacher.username === username;
  };

  const isStudent = () => {
    return localStorage.getItem("role") === "student";
  };

  const isFavorite = (teacherId) => {
    return favorites.some((fav) => fav.id === teacherId);
  };

  const handleSaveFavorite = (teacher) => {
    const updatedFavorites = [...favorites, teacher];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const handleRemoveFavorite = (teacherId) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== teacherId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || (role !== "teacher" && role !== "student")) {
      navigate("/login", { state: { from: location }, replace: true });
      return;
    }

    fetchTeacherData();
  }, [navigate, location, id]);

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      const username = localStorage.getItem("username");

      let teacherId = id;
      
      if (!teacherId && role === "teacher") {
        const teachersResponse = await axios.get(
          "http://localhost:5000/api/teachers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const teacherData = teachersResponse.data.data.find(
          (t) => t.username === username
        );
        if (!teacherData) throw new Error("Teacher not found");
        teacherId = teacherData.id;
      }

      if (!teacherId) throw new Error("Teacher ID not provided");

      const [teacherResponse, announcementsResponse, reviewsResponse] = await Promise.all([
        axios.get(`http://localhost:5000/api/teachers/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/teacher/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`http://localhost:5000/api/reviews/${teacherId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      setTeacher(teacherResponse.data.data);
      setAnnouncements(announcementsResponse.data.data || []);
      setReviews(reviewsResponse.data.data || []);

      setLoading({
        profile: false,
        announcements: false,
        reviews: false,
      });
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleLogout();
      }
      setLoading({
        profile: false,
        announcements: false,
        reviews: false,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleBackToProfile = () => {
    if (expandedAnnouncement) {
      setExpandedAnnouncement(null);
    } else {
      navigate(-1);
    }
  };

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const url = newAnnouncement.id 
        ? `http://localhost:5000/api/update_announcements/${newAnnouncement.id}`
        : "http://localhost:5000/api/create_announcements";
        
      const method = newAnnouncement.id ? 'put' : 'post';
      
      await axios[method](
        url,
        newAnnouncement,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setNewAnnouncement({ id: null, subject: "", price: "", content: "" });
      setShowForm(false);
      fetchTeacherData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save announcement");
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setNewAnnouncement({
      id: announcement.id,
      subject: announcement.subject,
      price: announcement.price,
      content: announcement.content
    });
    setShowForm(true);
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

  const calculateAverageRating = () => {
    const validRatings = reviews.map(r => r.rating).filter(r => typeof r === "number");
    if (validRatings.length === 0) return 0;
    const total = validRatings.reduce((sum, rating) => sum + rating, 0);
    return (total / validRatings.length).toFixed(1);
  };

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
        >
          ← Back to {expandedAnnouncement ? "Profile" : "Previous Page"}
        </button>
        {isStudent() && (
          <Link to="/favorites" className="nav-link">
            <button className="favorites-btn">My Favorites</button>
          </Link>
        )}
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
            <div className="profile-header">
              <h2>
                {teacher.firstname} {teacher.lastname}
                {parseFloat(calculateAverageRating()) > 4.5 && (
                  <span className="verified-badge">Top Rated</span>
                )}
              </h2>
              
              {isStudent() && !isOwnProfile() && (
                <div className="favorite-button-container">
                  {!isFavorite(teacher.id) ? (
                    <button
                      className="save-favorite-btn"
                      onClick={() => handleSaveFavorite(teacher)}
                    >
                      ♡ Add to Favorites
                    </button>
                  ) : (
                    <button
                      className="remove-favorite-btn"
                      onClick={() => handleRemoveFavorite(teacher.id)}
                    >
                      ✓ Remove from Favorites
                    </button>
                  )}
                </div>
              )}
            </div>

            {isOwnProfile() && (
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
            )}

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
                  {calculateAverageRating()}/5
                  {parseFloat(calculateAverageRating()) > 4 && (
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
                        <strong>{review.title || "Review"}</strong>
                        <span className="review-rating">
                          Rating: {review.rating}/5
                        </span>
                      </div>
                      <p className="review-content">"{review.review}"</p>
                      <p className="review-author">
                        – {review.student_firstname || "Student"} {review.student_lastname || ""}
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
            <h3>{isOwnProfile() ? "My Announcements" : "Announcements"}</h3>
            {isOwnProfile() && (
              <button
                className="primary-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Cancel" : "+ New Announcement"}
              </button>
            )}
          </div>

          {isOwnProfile() && showForm && (
            <form
              onSubmit={handleCreateAnnouncement}
              className="announcement-form"
            >
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  type="text"
                  placeholder="Mathematics, Physics, etc."
                  value={newAnnouncement.subject}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      subject: e.target.value,
                    })
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price">Hourly Rate ($)</label>
                <input
                  id="price"
                  type="number"
                  min="1"
                  placeholder="20"
                  value={newAnnouncement.price}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      price: e.target.value,
                    })
                  }
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="content">Announcement Details</label>
                <textarea
                  id="content"
                  placeholder="Describe what you'll teach, your methodology, etc."
                  value={newAnnouncement.content}
                  onChange={(e) =>
                    setNewAnnouncement({
                      ...newAnnouncement,
                      content: e.target.value,
                    })
                  }
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {newAnnouncement.id ? "Update" : "Publish"} Announcement
                </button>
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setShowForm(false);
                    setNewAnnouncement({ id: null, subject: "", price: "", content: "" });
                  }}
                >
                  Cancel
                </button>
              </div>
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
                <div 
                  key={announcement.id} 
                  className={`announcement-card ${expandedAnnouncement === announcement.id ? 'expanded' : ''}`}
                >
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
                      <div className="announcement-title">
                        <h4>{announcement.subject}</h4>
                        <span className="price-tag">${announcement.price}/hour</span>
                      </div>
                      <span className="toggle-icon">
                        {expandedAnnouncement === announcement.id ? "▼" : "▶"}
                      </span>
                    </div>
                    {isOwnProfile() && (
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
                    )}
                  </div>
                  
                  <div className="announcement-meta">
                    <span className="announcement-date">
                      Posted: {new Date(announcement.created_at).toLocaleDateString()}
                    </span>
                    
                  </div>
                  
                  {expandedAnnouncement === announcement.id && (
                    <div className="announcement-details">
                      <div className="announcement-content">
                        <h5>Details:</h5>
                        <p>{announcement.content}</p>
                      </div>
                      {isOwnProfile() && (
                        <div className="announcement-actions">
                          <button
                            className="edit-btn"
                            onClick={() => handleEditAnnouncement(announcement)}
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="no-announcements">
              <p>No announcements yet</p>
              {isOwnProfile() && (
                <button
                  className="primary-btn"
                  onClick={() => setShowForm(true)}
                >
                  Create Your First Announcement
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherProfile;
