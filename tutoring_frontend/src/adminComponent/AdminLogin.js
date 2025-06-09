import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AdminLogin = () => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin', { username, password });
      if (response.data.success) {
        navigate('/admin-dashboard');
      } else {
        setError(response.data.message || t('adminLogin.errorInvalid'));
      }
    } catch (err) {
      console.error(err);
      setError(t('adminLogin.errorFailed'));
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>{t('adminLogin.title')}</h2>
        <LanguageSwitcher />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="form-group mb-3">
          <label>{t('adminLogin.username')}</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-4">
          <label>{t('adminLogin.password')}</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">{t('adminLogin.login')}</button>
      </form>
    </div>
  );
};

export default AdminLogin;
