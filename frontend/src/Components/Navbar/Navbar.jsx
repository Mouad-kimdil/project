import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import './Navbar.scss';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Check authentication status whenever location changes or component mounts
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
    
    // Listen for storage events (for when user logs in/out in another tab)
    window.addEventListener('storage', checkAuth);
    window.addEventListener('auth-change', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [location.pathname]); // Re-check when route changes

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authApi.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const goToSettings = () => {
    // Store the active tab in localStorage so Profile component can read it
    localStorage.setItem('profileActiveTab', 'settings');
    navigate('/profile');
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="logo-link">
            <img src="https://arab.org/wp-content/uploads/2019/01/croissant-rouge-maroc.jpg" alt="Croissant Rouge Logo" className="logo-image" />
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <ul className={`nav-menu ${isMenuOpen ? 'nav-menu-active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
          </li>
          <li className="nav-item">
            <Link to="/opportunities" className="nav-link" onClick={() => setIsMenuOpen(false)}>Opportunities</Link>
          </li>
          <li className="nav-item">
            <Link to="/events" className="nav-link" onClick={() => setIsMenuOpen(false)}>Events</Link>
          </li>
          
          {isAuthenticated && currentUser ? (
            <>
              <li className="nav-item dropdown">
                <span className="nav-link dropdown-toggle">
                  Create <i className="fas fa-chevron-down"></i>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <Link to="/create-opportunity" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Add Opportunity
                    </Link>
                  </li>
                  <li>
                    <Link to="/create-event" className="dropdown-item" onClick={() => setIsMenuOpen(false)}>
                      Add Event
                    </Link>
                  </li>
                </ul>
              </li>
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
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link to="/profile" className="user-dropdown-item" onClick={goToSettings}>
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  <Link to="/" className="user-dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </Link>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setIsMenuOpen(false)}>Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/signup" className="nav-link signup-button" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </li>
            </>
          )}
        </ul>

        {/* Mobile Hamburger Menu */}
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