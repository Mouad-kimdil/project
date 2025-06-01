import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-column">
            <div className="footer-logo">
        <img src="/assets/Croissant_rouge" alt="Croissant Rouge Logo" className="footer-logo-image" />
      </div>
            <p className="footer-description">
              Connecting passionate volunteers with meaningful opportunities to make a difference in communities around the world.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#home">Home</a></li>
              <li><a href="#opportunities">Find Opportunities</a></li>
              <li><a href="#impact">Our Impact</a></li>
              <li><a href="#events">Upcoming Events</a></li>
              <li><a href="#join">Join Us</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Volunteer Categories</h4>
            <ul className="footer-links">
              <li><a href="#">Environmental</a></li>
              <li><a href="#">Community Support</a></li>
              <li><a href="#">Education</a></li>
              <li><a href="#">Healthcare</a></li>
              <li><a href="#">Crisis Response</a></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4 className="footer-heading">Contact Us</h4>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> 123 Volunteer Street, City, Country</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@volunteerhub.org</li>
            </ul>
            <div className="newsletter">
              <h5>Subscribe to our newsletter</h5>
              <div className="newsletter-form">
                <input type="email" placeholder="Your email" />
                <button type="submit">Subscribe</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} VolunteerHub. All rights reserved.</p>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;