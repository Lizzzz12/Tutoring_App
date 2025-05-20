import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './EditTeacherProfile.css'; // Import your CSS file for styling

const EditTeacherProfile = () => {
  // State management
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    img_url: '',
    subject: '',
    price: '',
    availability: '',
    tutoring_location: ''
  });
  const [teacherId, setTeacherId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);
  const navigate = useNavigate();

  // Configure axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  // Add request interceptor for token
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => Promise.reject(error));

  // Fetch teacher data on component mount
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setLoading(true);
        const username = localStorage.getItem('username');
        
        // Verify we have required data
        if (!username) {
          throw new Error('No username found in storage');
        }

        const response = await api.get('/teachers');
        
        if (response.data.success) {
          const teacherData = response.data.data.find(t => t.username === username);
          
          if (!teacherData) {
            throw new Error('Teacher data not found');
          }

          setTeacherId(teacherData.id);
          setFormData({
            firstname: teacherData.firstname || '',
            lastname: teacherData.lastname || '',
            username: teacherData.username || '',
            email: teacherData.email || '',
            phone: teacherData.phone || '',
            address: teacherData.address || '',
            description: teacherData.description || '',
            img_url: teacherData.img_url || '',
            subject: teacherData.subject || '',
            price: teacherData.price || '',
            availability: teacherData.availability || '',
            tutoring_location: teacherData.tutoring_location || ''
          });
        } else {
          throw new Error(response.data.message || 'Failed to fetch teachers');
        }
      } catch (err) {
        handleApiError(err, 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Centralized error handling
  const handleApiError = (err, defaultMessage) => {
    console.error('API Error:', {
      message: err.message,
      response: err.response?.data,
      stack: err.stack
    });

    // Store debug info for display
    setDebugInfo({
      error: err.message,
      response: err.response?.data,
      timestamp: new Date().toISOString()
    });

    if (err.response?.status === 401) {
      // Handle unauthorized (token expired/invalid)
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/login', { state: { from: 'session-expired' } });
    } else {
      setError(err.response?.data?.message || defaultMessage);
    }
  };

  // Form validation
  const validateForm = () => {
    const requiredFields = ['firstname', 'lastname', 'username', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.price && isNaN(formData.price)) {
      setError('Price must be a number');
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setDebugInfo(null);

    // Validate form before submission
    if (!validateForm()) return;

    try {
      // Create optimized payload with only changed fields
      const payload = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        ...(formData.phone && { phone: formData.phone }),
        ...(formData.address && { address: formData.address }),
        ...(formData.description && { description: formData.description }),
        ...(formData.img_url && { img_url: formData.img_url }),
        ...(formData.subject && { subject: formData.subject }),
        ...(formData.price && { price: parseFloat(formData.price) }),
        ...(formData.availability && { availability: formData.availability }),
        ...(formData.tutoring_location && { tutoring_location: formData.tutoring_location })
      };

      console.log('Submitting payload:', payload); // Debug log

      const response = await api.post(`/teacher_update/${teacherId}`, payload);

      if (response.data.success) {
        setSuccess('Profile updated successfully! Redirecting...');
        setTimeout(() => navigate('/teacher-profile'), 1500);
      } else {
        throw new Error(response.data.message || 'Update failed without error message');
      }
    } catch (err) {
      handleApiError(err, 'Failed to update profile. Please try again.');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your profile data...</p>
      </div>
    );
  }

  return (
    <div className="edit-profile-container">
      <h1>Edit Teacher Profile</h1>
      
      {/* Status Messages */}
      {error && (
        <div className="alert error">
          <strong>Error:</strong> {error}
          {debugInfo && (
            <details className="debug-details">
              <summary>Debug Information</summary>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </details>
          )}
        </div>
      )}
      
      {success && <div className="alert success">{success}</div>}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="firstname">First Name *</label>
            <input
              id="firstname"
              type="text"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
              minLength="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">Last Name *</label>
            <input
              id="lastname"
              type="text"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              required
              minLength="2"
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username *</label>
            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Teaching Details</h3>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price ($/hr)</label>
            <input
              id="price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="availability">Availability</label>
            <input
              id="availability"
              type="text"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              placeholder="e.g., Mon-Fri 3pm-7pm"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tutoring_location">Tutoring Location</label>
            <input
              id="tutoring_location"
              type="text"
              name="tutoring_location"
              value={formData.tutoring_location}
              onChange={handleChange}
              placeholder="e.g., Online, In-person"
            />
          </div>
        </div>

        <div className="form-section full-width">
          <h3>Additional Information</h3>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell students about your teaching experience..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="img_url">Profile Image URL</label>
            <input
              id="img_url"
              type="url"
              name="img_url"
              value={formData.img_url}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher-profile')}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacherProfile;