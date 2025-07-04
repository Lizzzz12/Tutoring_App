import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const AdminLogin = () => {
  // const { t } = useTranslation();

    const { t, i18n } = useTranslation();
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
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fc', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header 
      onChange={(e) => i18n.changeLanguage(e.target.value)}
          value={i18n.language}
    style={{
        backgroundColor: '#fff',
        padding: '12px 24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: 0 }}>Admin Panel</h3>
        <select>
          
    <option value="en">EN</option>
    <option value="ka">KA</option>
        </select>
        {/* <LanguageSwitcher /> */}
      </header>

      {/* Form Centered */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{
          backgroundColor: '#fff',
          padding: '32px',
          borderRadius: '8px',
          boxShadow: '0 0 12px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '400px'
        }}>
          <h4 className="text-center mb-4">{t('adminLogin.title')}</h4>

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
            <button type="submit" className="btn btn-primary w-100">
              {t('adminLogin.login')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
