import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const AnnouncementDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState({ announcements: true, teacher: true, reviews: true });
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ title: '', rating: 5, review: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [announcementsRes, teacherRes, reviewsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/teacher/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/teachers/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`http://localhost:5000/api/reviews/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        ]);

        const announcementsData = announcementsRes.data.data;
        if (!announcementsData || announcementsData.length === 0) {
          throw new Error(t('announcement.no_announcements'));
        }

        setAnnouncements(announcementsData);
        setCurrentAnnouncement(announcementsData[0]);
        setTeacher(teacherRes.data.data);
        setReviews(reviewsRes.data.data || []);

      } catch (err) {
        console.error('Error:', err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading({ announcements: false, teacher: false, reviews: false });
      }
    };

    fetchData();
  }, [id, navigate, t]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: name === 'rating' ? parseInt(value) : value }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const studentId = localStorage.getItem('userId');
    if (!token || !studentId) return navigate('/login');

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/reviews',
        {
          studentId,
          teacherId: id,
          title: newReview.title,
          rating: newReview.rating,
          review: newReview.review,
          announcementId: currentAnnouncement?.id
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setReviews((prev) => [...prev, response.data.data]);
      setNewReview({ title: '', rating: 5, review: '' });
      setError(null);
    } catch (err) {
      console.error('Review submission error:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.announcements || loading.teacher || loading.reviews) return <div>{t('loading')}</div>;

  if (error) return (
    <div className="error">
      <p>{error}</p>
      <button onClick={() => navigate(-1)}>{t('go_back')}</button>
    </div>
  );

  if (!currentAnnouncement || !teacher) return (
    <div className="not-found">
      <p>{t('announcement.not_found')}</p>
      <button onClick={() => navigate(-1)}>{t('go_back')}</button>
    </div>
  );

  return (
    <div className="announcement-container">
      <h2>{currentAnnouncement.subject}</h2>
      <p>{t('announcement.price', { price: currentAnnouncement.price })}</p>
      <p>{currentAnnouncement.content}</p>

      <div className="teacher-info">
        <h3>{teacher.firstname} {teacher.lastname}</h3>
        <p>{teacher.email}</p>
      </div>

      <div className="add-review">
        <h3>{t('review.add')}</h3>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmitReview}>
          <div className="form-group">
            <label>{t('review.title')}</label>
            <input type="text" name="title" value={newReview.title} onChange={handleReviewChange} required placeholder={t('review.title_placeholder')} />
          </div>
          <div className="form-group">
            <label>{t('review.rating')}</label>
            <select name="rating" value={newReview.rating} onChange={handleReviewChange} required>
              <option value="5">5 - {t('review.excellent')}</option>
              <option value="4">4 - {t('review.very_good')}</option>
              <option value="3">3 - {t('review.good')}</option>
              <option value="2">2 - {t('review.fair')}</option>
              <option value="1">1 - {t('review.poor')}</option>
            </select>
          </div>
          <div className="form-group">
            <label>{t('review.text')}</label>
            <textarea name="review" value={newReview.review} onChange={handleReviewChange} required minLength="10" placeholder={t('review.placeholder')} />
          </div>
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? t('review.submitting') : t('review.submit')}</button>
        </form>
      </div>

      <div className="reviews">
        <h3>{t('review.list')}</h3>
        {reviews.length === 0 ? (
          <p>{t('review.no_reviews')}</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review">
              <h4>{review.title}</h4>
              <p>{t('review.rating')}: {review.rating}/5</p>
              <p>{review.review}</p>
              <small>{t('review.by', { name: review.student_firstname || t('review.anonymous') })}</small>
              <small>{t('review.date', { date: new Date(review.created_at).toLocaleDateString() })}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnnouncementDetails;