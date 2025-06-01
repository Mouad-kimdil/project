import React from 'react';
import './Hero.scss';

const Hero = () => {
  const handleVolunteerClick = () => {
    // Add your volunteer action here (e.g., navigate to form, open modal, etc.)
    console.log('Volunteer button clicked!');
    // Example: window.location.href = '/volunteer-form';
  };

  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-flex-container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              <span className="highlight">VolunteerHub</span>: Make a Difference Today
            </h1>
            
            <blockquote className="hero-quote">
              "The best way to find yourself is to lose yourself in the service of others."
              <cite className="quote-author">- Mahatma Gandhi</cite>
            </blockquote>
            
            <p className="hero-description">
              Join thousands of volunteers who are changing lives in their communities. 
              Every small act of kindness creates ripples of positive change that extend far beyond what we can see.
            </p>
            
            <div className="hero-actions">
              <button 
                className="volunteer-btn"
                onClick={handleVolunteerClick}
              >
                <span className="btn-text">Start Volunteering</span>
                <span className="btn-icon">❤️</span>
              </button>
              
              <button className="learn-more-btn">
                Learn More
              </button>
            </div>
            
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">10,000+</span>
                <span className="stat-label">Volunteers</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Communities</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hero-image-container">
          <img 
            src="https://images.unsplash.com/photo-1560252829-804f1aedf1be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" 
            alt="Volunteers helping in community service" 
            className="hero-image" 
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;