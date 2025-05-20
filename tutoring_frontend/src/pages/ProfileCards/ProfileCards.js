import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './ProfileCards.css';

const ProfileCards = () => {
  const [tutors, setTutors] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/teachers');
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setTutors(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch tutors:', error);
      }
    };

    fetchTutors();
  }, []);

  const handleContact = (tutorId) => {
    navigate(`/tutor/${tutorId}`);
  };

  return (
    <div className="profile-cards-container">
      <h2>{t('profileCards.title')}</h2>
      <div className="tutors-grid">
        {tutors.map((tutor) => (
          <div key={tutor.id} className="tutor-card">
            <div className="tutor-image-container">
              <img
                src={tutor.img_url || 'https://via.placeholder.com/150'}
                alt={`${tutor.firstname} ${tutor.lastname}`}
                className="tutor-image"
              />
            </div>
            <div className="tutor-info">
              <h3>{`${tutor.firstname} ${tutor.lastname}`}</h3>
              <p className="tutor-subject">{tutor.subject}</p>
              <p className="tutor-description">
                {tutor.description || t('profileCards.noDescription')}
              </p>
              <div className="tutor-meta">
                <span className="rating">⭐ {tutor.ratings || 'N/A'}</span>
                <span className="experience">
                  {tutor.availability || t('profileCards.noAvailability')}
                </span>
              </div>
              <button className="contact-button" onClick={() => handleContact(tutor.id)}>
                {t('profileCards.contact')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileCards;
