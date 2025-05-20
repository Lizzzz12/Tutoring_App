import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Favorites.css';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
      setFavorites(storedFavorites);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (id) => {
    const updated = favorites.filter((item) => item.id !== id);
    setFavorites(updated);
    localStorage.setItem('favorites', JSON.stringify(updated));
  };

  const handleViewDetails = (id) => {
    navigate(`/teacher-profile/${id}`);
  };

  if (loading) {
    return (
      <div className="favorites-loading">
        <div className="spinner"></div>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2>⭐ Your Favorite Teachers</h2>
        <p className="favorites-count">{favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-favorites">
          <div className="empty-image">📚</div>
          <h4>No favorites yet</h4>
          <p>When you save announcements, they'll appear here</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/')}
          >
            Browse Teachers
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {favorites.map((announcement) => (
            <div key={announcement.id} className="favorite-card">
              <div className="card-header">
                <div className="avatar-container">
                  {announcement.teacher_image ? (
                    <img 
                      src={announcement.teacher_image}
                      alt={announcement.teacher_name}
                      className="teacher-avatar"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        document.querySelector(`#fallback-${announcement.id}`).style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    id={`fallback-${announcement.id}`}
                    className="avatar-fallback"
                    style={{ display: announcement.teacher_image ? 'none' : 'flex' }}
                  >
                    {announcement.teacher_name ? announcement.teacher_name.charAt(0).toUpperCase() : 'T'}
                  </div>
                </div>
                <div className="teacher-info">
                  <h3>{announcement.teacher_name || 'Unknown Teacher'}</h3>
                  <div className="teacher-rating">
                    <span>⭐ {announcement.rating || '4.5'}/5</span>
                  </div>
                </div>
              </div>

              <div className="card-body">
                <h4 className="announcement-title">{announcement.subject || 'No subject specified'}</h4>
                <p className="announcement-description">{announcement.content || 'No description provided'}</p>
                
                <div className="announcement-details">
                  <div className="detail-item">
                    <span>💰 ${announcement.price || '0'}/hour</span>
                  </div>
                  <div className="detail-item">
                    <span>📚 {announcement.subject || 'General'}</span>
                  </div>
                  <div className="detail-item">
                    <span>⏰ {announcement.availability || 'Flexible hours'}</span>
                  </div>
                  <div className="detail-item">
                    <span>📅 Posted: {announcement.created_at ? new Date(announcement.created_at).toLocaleDateString() : 'Unknown date'}</span>
                  </div>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="btn btn-view"
                  onClick={() => handleViewDetails(announcement.id)}
                >
                  👀 View Profile
                </button>
                <button
                  className="btn btn-remove"
                  onClick={() => handleRemove(announcement.id)}
                >
                  🗑️ Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;