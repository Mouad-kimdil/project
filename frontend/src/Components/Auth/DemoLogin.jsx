import React from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Auth.scss';

// Composant permettant une connexion rapide avec des identifiants de démonstration
const DemoLogin = () => {
  const navigate = useNavigate();
  
  // Fonction pour gérer la connexion de démonstration
  const handleDemoLogin = async () => {
    try {
      // Appel à l'API d'authentification avec les identifiants de démonstration
      await authApi.login('demo@example.com', 'Demo123');
      // Redirection vers la page de profil après connexion réussie
      navigate('/profile');
    } catch (err) {
      console.error('Erreur de connexion démo:', err);
    }
  };

  return (
    <div className="demo-login">
      {/* Bouton pour se connecter rapidement avec le compte de démonstration */}
      <button 
        onClick={handleDemoLogin}
        className="demo-button"
      >
        Connexion démo rapide
      </button>
      {/* Note affichant les identifiants de démonstration */}
      <p className="demo-note">Email: demo@example.com, Mot de passe: Demo123</p>
    </div>
  );
};

export default DemoLogin;