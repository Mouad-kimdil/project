import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Auth.scss';

const DemoLogin = () => {
  const navigate = useNavigate();
  
  const handleDemoLogin = async () => {
    try {
      await authApi.login('demo@example.com', 'Demo123');
      navigate('/profile');
    } catch (err) {
      console.error('Demo login error:', err);
    }
  };

  return (
    <div className="demo-login">
      <button 
        onClick={handleDemoLogin}
        className="demo-button"
      >
        Quick Demo Login
      </button>
      <p className="demo-note">Email: demo@example.com, Password: Demo123</p>
    </div>
  );
};

export default DemoLogin;