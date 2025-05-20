import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
 
const AnnouncementDetails = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState({});
  const [teacher, setTeacher] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [studentId, setStudentId] = useState('');
  const [rating, setRating] = useState('');
  const [reviewText, setReviewText] = useState('');
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchAnnouncement = async () => {
      const response = await fetch(`http://localhost:5001/api/teacher/${id}`);
      const data = await response.json();
 
      if (data.success && data.data && data.data.length > 0) {
        setAnnouncement(data.data[0]);
      }
    };
 
    fetchAnnouncement();
  }, [id]);
 
  useEffect(() => {
    const fetchTeacher = async () => {
      if (!announcement || !announcement.teacher_id) return;
 
      try {
        const response = await fetch(`http://localhost:5001/api/teachers/${announcement.teacher_id}`);
        const data = await response.json();
 
        if (data.success && data.data) {
          setTeacher(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch teacher:', error);
      }
    };
 
    fetchTeacher();
  }, [announcement]);
 
  useEffect(() => {
    const fetchReviews = async () => {
      if (!announcement || !announcement.id) return;
 
      try {
        const response = await fetch(`http://localhost:5001/api/announcementReviews/${announcement.id}`);
        const data = await response.json();
 
        if (data.success && data.data) {
          setReviews(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error);
      }
    };
 
    fetchReviews();
  }, [announcement]);
 
  const handleMoreInfoClick = () => {
    navigate(`/teacher-profile/${teacher?.id}`);
  };
 
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
 
    if (!studentId || !rating || !reviewText) {
      alert('Please fill in all review fields.');
      return;
    }
 
    try {
      const response = await fetch('http://localhost:5001/api/announcementReviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_id: studentId,
          announcement_id: announcement.id,
          rating,
          review: reviewText,
        }),
      });
 
      const data = await response.json();
 
      if (data.success) {
        setReviews([data.data, ...reviews]);
        setStudentId('');
        setRating('');
        setReviewText('');
      } else {
        alert(data.message || 'Failed to submit review.');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review.');
    }
  };
 
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-primary">{announcement.subject || 'No subject provided'}</h2>
          <p className="card-text"><strong>Price:</strong> ${announcement.price || 'N/A'} in hour.</p>
          <p className="card-text"><strong>Description:</strong> {announcement.content || 'No description'}</p>
          <p className="card-text">
            <strong>Posted on:</strong>{' '}
            {announcement.created_at
              ? new Date(announcement.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'Not specified'}
          </p>
 
          <hr />
 
          <h4 className="text-success">Teacher Details</h4>
          <p className="mb-1"><strong>Name:</strong> {teacher ? `${teacher.firstname} ${teacher.lastname}` : 'Not found'}</p>
          <p><strong>Availability:</strong> {teacher?.availability || 'Not specified'}</p>
 
          <button className="btn btn-info mb-4" onClick={handleMoreInfoClick}>
            More Information
          </button>
 
          <hr />
 
          <div className="mt-4">
            <h4 className="text-info">Reviews</h4>
            {reviews.length === 0 ? (
              <p>No reviews yet.</p>
            ) : (
              <ul className="list-group mb-4">
                {reviews.map((review) => (
                  <li key={review.id} className="list-group-item">
                    <div className="d-flex justify-content-between">
                      <span><strong>{review.student_name}</strong> - Rating: {review.rating}/5</span>
                      <span>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <p>{review.review}</p>
                  </li>
                ))}
              </ul>
            )}
 
            <h5 className="mt-4">Leave a Review</h5>
            <form onSubmit={handleReviewSubmit}>
              <div className="form-group mb-2">
                <label>Student ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
              <div className="form-group mb-2">
                <label>Rating (1-5)</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max="5"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <label>Review</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">Submit Review</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
 
export default AnnouncementDetails;
 