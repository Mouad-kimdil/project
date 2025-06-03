import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Navbar.scss';

// Composant de barre de navigation principale de l'application
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // État pour contrôler l'ouverture du menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // État pour suivre si l'utilisateur est authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // État pour stocker les informations de l'utilisateur actuel
  const [currentUser, setCurrentUser] = useState(null);

  // Vérifie l'état d'authentification chaque fois que l'emplacement change ou que le composant est monté
  useEffect(() => {
    const checkAuth = () => {
      const auth = authApi.isAuthenticated();
      setIsAuthenticated(auth);
      
      if (auth) {
        setCurrentUser(authApi.getCurrentUser());
      } else {
        setCurrentUser(null);
      }
    };
    
    checkAuth();
    
    // Écoute les événements de stockage (pour quand l'utilisateur se connecte/déconnecte dans un autre onglet)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location.pathname]); // Revérifie quand la route change

  // Bascule l'état du menu mobile
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Gère la déconnexion de l'utilisateur
  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  // Redirige vers les paramètres du profil
  const goToSettings = () => {
    // Stocke l'onglet actif dans localStorage pour que le composant Profile puisse le lire
    localStorage.setItem('profileActiveTab', 'settings');
    navigate('/profile');
    setIsMenuOpen(false);
  };

  // Vérifie si l'utilisateur est un administrateur
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src="https://arab.org/wp-content/uploads/2019/01/croissant-rouge-maroc.jpg" alt="Logo Croissant Rouge" className="logo-image" />
          </Link>
        </div>

        {/* Liens de navigation pour ordinateur */}
        <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
          </li>
          <li className="nav-item">
            <Link to="/opportunities" className="nav-link" onClick={() => setIsMenuOpen(false)}>Opportunités</Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>Événements</Link>
          </li>
          
          {isAuthenticated && currentUser ? (
            <>
              {/* Menu "Créer" visible uniquement pour les administrateurs */}
              {isAdmin && (
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle">
                    Créer <i className="fas fa-chevron-down"></i>
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/create-opportunity" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                        Ajouter une opportunité
                      </Link>
                    </li>
                    <li>
                      <Link to="/create-event" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                        Ajouter un événement
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              
              {/* Menu "Rejoindre" visible uniquement pour les utilisateurs normaux */}
              {!isAdmin && (
                <li className="nav-item dropdown">
                  <span className="nav-link dropdown-toggle">
                    Rejoindre <i className="fas fa-chevron-down"></i>
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <Link to="/join-opportunities" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                        Rejoindre une opportunité
                      </Link>
                    </li>
                    <li>
                      <Link to="/join-events" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                        Rejoindre un événement
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
              
              <li className="nav-item user-menu">
                <Link to="/profile" className="nav-link user-link" onClick={() => setIsMenuOpen(false)}>
                  <div className="user-avatar">
                    {currentUser.profileImage ? (
                      <img src={currentUser.profileImage} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                    ) : (
                      <>{currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}</>
                    )}
                  </div>
                  <span className="user-name">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                </Link>
                <div className="user-dropdown">
                  <Link to="/profile" className="user-dropdown-item" onClick={() => setIsMenuOpen(false)}>
                    <i className="fas fa-user"></i> Profil
                  </Link>
                  <Link to="/profile" className="user-dropdown-item" onClick={goToSettings}>
                    <i className="fas fa-cog"></i> Paramètres
                  </Link>
                  <Link to="/" className="user-dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Déconnexion
                  </Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Connexion</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup-button" onClick={() => setIsMenuOpen(false)}>S'inscrire</Link>
              </li>
            </>
          )}
        </ul>

        {/* Menu hamburger pour mobile */}
        <div 
          className={`hamburger ${isMenuOpen ? 'hamburger-active' : ''}`}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;