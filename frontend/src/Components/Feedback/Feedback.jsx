import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Feedback.scss';

// Composant pour afficher les témoignages de bénévoles
const Feedback = () => {
  const navigate = useNavigate();

  // Tableau de témoignages de bénévoles
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Bénévole communautaire",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      quote: "Faire du bénévolat via VolunteerHub a été l'une des expériences les plus enrichissantes de ma vie. J'ai rencontré des personnes incroyables et fait une réelle différence dans ma communauté.",
      project: "Distribution à la banque alimentaire"
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "Militant écologiste",
      image: "https://randomuser.me/api/portraits/men/54.jpg",
      quote: "La plateforme m'a permis de trouver facilement des projets environnementaux qui correspondaient à mes valeurs. J'ai pu contribuer à plusieurs nettoyages de plages et événements de plantation d'arbres.",
      project: "Initiative de nettoyage côtier"
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Bénévole en éducation",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      quote: "En tant qu'enseignante, je voulais étendre mon impact au-delà de la salle de classe. VolunteerHub m'a mise en contact avec des élèves qui avaient besoin de tutorat, et les résultats ont été incroyables.",
      project: "Tutorat après l'école"
    }
  ];

  // Gérer le clic sur le bouton de partage d'expérience
  const handleShareStory = () => {
    navigate('/events');
  };

  return (
    <section className="feedback-section">
      <div className="feedback-container">
        {/* Titre et sous-titre de la section */}
        <h2 className="feedback-title">Histoires de <span className="highlight">bénévoles</span></h2>
        <p className="feedback-subtitle">Écoutez les témoignages de personnes qui font une différence dans leurs communautés</p>
        
        {/* Grille de témoignages */}
        <div className="testimonials-grid">
          {testimonials.map(testimonial => (
            <div className="testimonial-card" key={testimonial.id}>
              {/* En-tête du témoignage avec photo et informations du bénévole */}
              <div className="testimonial-header">
                <div className="volunteer-image">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
                <div className="volunteer-info">
                  <h3 className="volunteer-name">{testimonial.name}</h3>
                  <p className="volunteer-role">{testimonial.role}</p>
                  <div className="project-badge">{testimonial.project}</div>
                </div>
              </div>
              {/* Citation du témoignage */}
              <blockquote className="testimonial-quote">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
        
        {/* Appel à l'action pour partager sa propre histoire */}
        <div className="feedback-cta">
          <h3>Prêt à partager votre propre histoire de bénévolat?</h3>
          <button className="share-story-btn" onClick={handleShareStory}>
            Partagez votre expérience
          </button>
        </div>
      </div>
    </section>
  );
};

export default Feedback;