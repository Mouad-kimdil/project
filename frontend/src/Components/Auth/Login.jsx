import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import DemoLogin from './DemoLogin';
import './Auth.scss';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Effacer l'erreur lorsque le champ est modifié
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: null,
        general: null // Effacer également les erreurs générales
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse email valide';
    }
    
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      console.log('Tentative de connexion avec:', formData.email);
      
      await authApi.login(formData.email, formData.password);
      
      console.log('Connexion réussie');
      navigate('/profile');
    } catch (err) {
      console.error('Erreur de connexion:', err);
      
      // Gérer les erreurs spécifiques aux champs
      if (err.response?.data?.field) {
        setErrors({
          ...errors,
          [err.response.data.field]: err.response.data.message || 'Erreur de validation',
          general: null
        });
      } else {
        setErrors({
          ...errors,
          general: err.response?.data?.message || 'Email ou mot de passe invalide. Veuillez réessayer.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Bienvenue</h2>
          <p>Connectez-vous pour continuer votre parcours de bénévolat</p>
        </div>

        {errors.general && <div className="auth-error">{errors.general}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            {errors.email && <div className="error-message">{errors.email}</div>}
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Entrez votre email"
            />
          </div>

          <div className="form-group">
            {errors.password && <div className="error-message">{errors.password}</div>}
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Entrez votre mot de passe"
            />
            <div className="forgot-password">
              <Link to="/forgot-password">Mot de passe oublié?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Connexion en cours...' : 'Se connecter'}
          </button>
        </form>

        <div className="auth-divider">
          <span>OU</span>
        </div>

        <DemoLogin />

        <div className="auth-footer">
          <p>Vous n'avez pas de compte? <Link to="/signup">S'inscrire</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;