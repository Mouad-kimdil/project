import React, { useState, useEffect } from 'react';
import { testimonialsApi } from '../../api/api';
import './RandomFeedback.scss';

// Composant pour afficher des témoignages aléatoires
const RandomFeedback = () => {
  // État pour stocker les témoignages aléatoires
  const [testimonials, setTestimonials] = useState([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);

  // Effet pour charger les témoignages aléatoires au chargement du composant
  useEffect(() => {
    const fetchRandomTestimonials = async () => {
      try {
        // Appel à l'API pour récupérer 4 témoignages aléatoires
        const data = await testimonialsApi.getRandomTestimonials(4);
        setTestimonials(data);
        setLoading(false);
      } catch (err) {
        setError('Échec du chargement des témoignages');
        setLoading(false);
      }
    };

    fetchRandomTestimonials();
  }, []); // S'exécute uniquement au montage du composant

  // Affiche un indicateur de chargement si les données sont en cours de chargement
  if (loading) return <div className="random-feedback-loading">Chargement des témoignages...</div>;
  // Ne rien afficher en cas d'erreur
  if (error) return null;

  return (
    <div className="random-feedback-section">
      <div className="random-feedback-container">
        {/* Titre de la section */}
        <h2 className="random-feedback-title">Ce que disent nos bénévoles</h2>
        
        {/* Grille de témoignages aléatoires */}
        <div className="random-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="random-testimonial-card" key={index}>
              {/* Contenu du témoignage avec citation */}
              <div className="random-testimonial-content">
                <div className="quote-icon">
                  <i className="fas fa-quote-left"></i>
                </div>
                <p className="random-testimonial-quote">{testimonial.quote}</p>
              </div>
              {/* Informations sur l'auteur du témoignage */}
              <div className="random-testimonial-author">
                <div className="random-volunteer-image">
                  <img 
                    src={testimonial.image.startsWith('http') 
                      ? testimonial.image 
                      : `http://localhost:5001${testimonial.image}`} 
                    alt={testimonial.name} 
                  />
                </div>
                <div className="random-volunteer-info">
                  <h4 className="random-volunteer-name">{testimonial.name}</h4>
                  <p className="random-volunteer-role">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RandomFeedback;