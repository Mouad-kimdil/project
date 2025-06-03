import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.scss';

// Composant Hero pour la section principale de la page d'accueil
const Hero = () => {
  const navigate = useNavigate();

  // Gère le clic sur le bouton de bénévolat
  const handleVolunteerClick = () => {
    navigate('/join-events');
  };

  // Gère le clic sur le bouton En savoir plus
  const handleLearnMoreClick = () => {
    // Faire défiler jusqu'à la section des témoignages
    const testimonialsSection = document.querySelector('.feedback-section');
    if (testimonialsSection) {
      testimonialsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero">
      {/* Arrière-plan du héros avec superposition */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-flex-container">
        <div className="hero-content">
          <div className="hero-text">
            {/* Titre principal avec mise en évidence */}
            <h1 className="hero-title">
              <span className="highlight">VolunteerHub</span>: Faites la différence aujourd'hui
            </h1>
            
            {/* Citation inspirante */}
            <blockquote className="hero-quote">
              "La meilleure façon de se trouver est de se perdre au service des autres."
              <cite className="quote-author">- Mahatma Gandhi</cite>
            </blockquote>
            
            {/* Description du service */}
            <p className="hero-description">
              Rejoignez des milliers de bénévoles qui changent des vies dans leurs communautés. 
              Chaque petit acte de gentillesse crée des ondulations de changement positif qui s'étendent bien au-delà de ce que nous pouvons voir.
            </p>
            
            {/* Boutons d'action */}
            <div className="hero-actions">
              <button 
                className="volunteer-btn"
                onClick={handleVolunteerClick}
              >
                <span className="btn-text">Commencer le bénévolat</span>
                <span className="btn-icon">❤️</span>
              </button>
              
              <button 
                className="learn-more-btn"
                onClick={handleLearnMoreClick}
              >
                En savoir plus
              </button>
            </div>
            
            {/* Statistiques du service */}
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Bénévoles</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projets</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Communautés</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Conteneur d'image */}
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Bénévoles aidant dans un service communautaire" 
            className="hero-image" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;