import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const role = localStorage.getItem('role'); // Get stored role


    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');

            if (!token || !username) {
                navigate('/login');
                return;
            }

            try {
                // Fetch all students
                const response = await axios.get('http://localhost:5000/api/students', {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true
                });

                if (response.data.success && response.data.data?.rows) {
                    // Find the user with matching username (case insensitive)
                    const foundUser = response.data.data.rows.find(
                        student => student.username.toLowerCase() === username.toLowerCase()
                    );
                    
                    if (foundUser) {
                        setUser(foundUser);
                    } else {
                        setError('Your account was not found in student records');
                        console.log('Available usernames:', response.data.data.rows.map(u => u.username));
                    }
                } else {
                    setError('Invalid data format from server');
                }
            } catch (err) {
                console.error('Profile load error:', err);
                if (err.response?.status === 401) {
                    // Token expired or invalid
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    navigate('/login');
                }
                setError(err.response?.data?.message || err.message || 'Failed to load profile');
            }
            setLoading(false);
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        navigate('/login');
    };

    if (loading) return <div className="profile-loading">Loading your profile...</div>;
    if (error) return (
        <div className="profile-error">
            <p>Error: {error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
            </button>
            <button onClick={handleLogout} className="logout-btn">
                Logout
            </button>
        </div>
    );
    if (!user) return <div className="profile-no-data">No profile data available</div>;

    return (
        <div className="profile-container">
            <h2>Welcome, {user.firstname || user.username}!</h2>
            <p className="role-label">You are logged in as a <strong>{role}</strong>.</p>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
            
            <div className="profile-info">
                <div className="profile-field">
                    <span className="field-label">Username:</span>
                    <span className="field-value">{user.username}</span>
                </div>
                {user.firstname && (
                    <div className="profile-field">
                        <span className="field-label">First Name:</span>
                        <span className="field-value">{user.firstname}</span>
                    </div>
                )}
                {user.lastname && (
                    <div className="profile-field">
                        <span className="field-label">Last Name:</span>
                        <span className="field-value">{user.lastname}</span>
                    </div>
                )}
                {user.email && (
                    <div className="profile-field">
                        <span className="field-label">Email:</span>
                        <span className="field-value">{user.email}</span>
                    </div>
                )}
            </div>
        </div>
    );
    
};

export default Profile;