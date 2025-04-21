import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const EditTeacherProfile = () => {
  const [teacher, setTeacher] = useState({
    id: '',
    firstname: '',
    lastname: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        
        const response = await axios.get('http://localhost:5000/api/teachers', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const teacherData = response.data.data.find(t => t.username === username);
        if (teacherData) {
          setTeacher({
            id: teacherData.id, // Make sure to include the ID
            firstname: teacherData.firstname || '',
            lastname: teacherData.lastname || ''
          });
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to load profile');
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacher(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Updated to use ID instead of username in the URL
      await axios.post(
        `http://localhost:5000/api/teacher_update/${teacher.id}`,
        {
          firstname: teacher.firstname,
          lastname: teacher.lastname
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      navigate('/teacher-profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update name. Please try again.');
      console.error('Update error details:', err.response?.data);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>Edit Your Name</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>First Name:</label>
          <input
            type="text"
            name="firstname"
            value={teacher.firstname}
            onChange={handleChange}
            required
            minLength="2"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastname"
            value={teacher.lastname}
            onChange={handleChange}
            required
            minLength="2"
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none' }}
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate('/teacher-profile')}
            style={{ padding: '8px 16px', background: '#f44336', color: 'white', border: 'none' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacherProfile;