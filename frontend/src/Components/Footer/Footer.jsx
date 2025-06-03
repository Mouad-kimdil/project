import React from 'react';
import './Footer.scss';

// Composant de pied de page pour toutes les pages du site
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Grille principale du pied de page */}
        <div className="footer-grid">
          {/* Première colonne avec logo, description et icônes sociales */}
          <div className="footer-column">
            <div className="footer-logo">
              <img src="/assets/Croissant_rouge" alt="Logo Croissant Rouge" className="footer-logo-image" />
            </div>
            <p className="footer-description">
              Connecter des bénévoles passionnés avec des opportunités significatives pour faire une différence dans les communautés du monde entier.
            </p>
            <div className="social-icons">
              <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
            </div>
          </div>
          
          {/* Deuxième colonne avec liens rapides */}
          <div className="footer-column">
            <h4 className="footer-heading">Liens rapides</h4>
            <ul className="footer-links">
              <li><a href="#home">Accueil</a></li>
              <li><a href="#opportunities">Trouver des opportunités</a></li>
              <li><a href="#impact">Notre impact</a></li>
              <li><a href="#events">Événements à venir</a></li>
              <li><a href="#join">Rejoignez-nous</a></li>
            </ul>
          </div>
          
          {/* Troisième colonne avec catégories de bénévolat */}
          <div className="footer-column">
            <h4 className="footer-heading">Catégories de bénévolat</h4>
            <ul className="footer-links">
              <li><a href="#">Environnement</a></li>
              <li><a href="#">Soutien communautaire</a></li>
              <li><a href="#">Éducation</a></li>
              <li><a href="#">Santé</a></li>
              <li><a href="#">Réponse aux crises</a></li>
            </ul>
          </div>
          
          {/* Quatrième colonne avec informations de contact */}
          <div className="footer-column">
            <h4 className="footer-heading">Contactez-nous</h4>
            <ul className="contact-info">
              <li><i className="fas fa-map-marker-alt"></i> 123 Rue du Bénévolat, Ville, Pays</li>
              <li><i className="fas fa-phone"></i> +1 (555) 123-4567</li>
              <li><i className="fas fa-envelope"></i> info@volunteerhub.org</li>
            </ul>
          </div>
        </div>
        
        {/* Bas de page avec copyright et liens légaux */}
        <div className="footer-bottom">
          <p className="copyright">&copy; {new Date().getFullYear()} VolunteerHub. Tous droits réservés.</p>
          <div className="footer-bottom-links">
            <a href="#">Politique de confidentialité</a>
            <a href="#">Conditions d'utilisation</a>
            <a href="#">Politique des cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;