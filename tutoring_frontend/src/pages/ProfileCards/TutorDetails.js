import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './TutorDetail.css';

const TutorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);

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

  if (!tutor) return <p>Loading...</p>;

  return (
    <div className="tutor-detail-container">
      <div className="tutor-detail-card">
        <img src={tutor.img_url} alt={`${tutor.firstname} ${tutor.lastname}`} />
        <h2>{tutor.firstname} {tutor.lastname}</h2>
        <p><strong>Subject:</strong> {tutor.subject}</p>
        <p><strong>Description:</strong> {tutor.description}</p>
        <p><strong>Availability:</strong> {tutor.availability}</p>
        <p><strong>Rating:</strong> ⭐ {tutor.ratings}</p>
      </div>

      <div className="tutor-detail-buttons">
        <button className="go-back-button" onClick={() => navigate('/')}>
          ← Go Back
        </button>
        <button className="go-back-button" onClick={() => navigate('/login')}>
          Login
        </button>
        <button className="go-back-button" onClick={() => navigate('/signup')}>
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default TutorDetail;
