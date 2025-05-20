import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './TutorDetail.css';

const TutorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teachers/${id}`);
        const data = await response.json();
        if (data.success) {
          setTutor(data.data);
        }
      } catch (error) {
        console.error('Error fetching tutor detail:', error);
      }
    };

    fetchTutor();
  }, [id]);

  if (!tutor) return <p>{t('tutorDetail.loading')}</p>;

  return (
    <div className="tutor-detail-container">
      <div className="tutor-detail-card">
        <img src={tutor.img_url || 'https://via.placeholder.com/150'} alt={`${tutor.firstname} ${tutor.lastname}`} />
        <h2>{tutor.firstname} {tutor.lastname}</h2>
        <p><strong>{t('tutorDetail.subject')}:</strong> {tutor.subject}</p>
        <p><strong>{t('tutorDetail.description')}:</strong> {tutor.description || t('tutorDetail.noDescription')}</p>
        <p><strong>{t('tutorDetail.availability')}:</strong> {tutor.availability || t('tutorDetail.noAvailability')}</p>
        <p><strong>{t('tutorDetail.rating')}:</strong> ⭐ {tutor.ratings || 'N/A'}</p>
      </div>

      <div className="tutor-detail-buttons">
        <button className="go-back-button" onClick={() => navigate('/')}>
          ← {t('tutorDetail.back')}
        </button>
        <button className="go-back-button" onClick={() => navigate('/login')}>
          {t('tutorDetail.login')}
        </button>
        <button className="go-back-button" onClick={() => navigate('/signup')}>
          {t('tutorDetail.signup')}
        </button>
      </div>
    </div>
  );
};

export default TutorDetail;
