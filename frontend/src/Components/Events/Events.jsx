import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import './Events.scss';

// Composant pour afficher la liste des événements
const Events = () => {
  // État pour stocker les événements
  const [events, setEvents] = useState([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);

  // Charger les événements au montage du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Récupérer les événements depuis l'API
        const response = await eventApi.getEvents();
        setEvents(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des événements:', error);
        // Ne pas afficher d'erreur s'il n'y a pas d'événements
        setEvents([]);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="events-container">
        <div className="loading-spinner">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="events-container">
      <div className="events-header">
        <h1>Événements à venir</h1>
        <p>Découvrez les événements de bénévolat à venir et inscrivez-vous pour participer</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="events-grid">
        {events.length === 0 ? (
          <div className="no-events">
            <p>Aucun événement disponible pour le moment.</p>
            <p>Revenez bientôt pour découvrir nos prochains événements de bénévolat.</p>
          </div>
        ) : (
          events.map(event => (
            <div className="event-card" key={event._id}>
              <div className="event-image-container">
                <img src={event.image} alt={event.title} className="event-image" />
                <div className="event-date">
                  <span className="event-month">{new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' })}</span>
                  <span className="event-day">{new Date(event.date).getDate()}</span>
                </div>
              </div>
              
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
                
                <div className="event-details">
                  <div className="event-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{event.location}</span>
                  </div>
                  <div className="event-time">
                    <i className="fas fa-clock"></i>
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>
                
                <p className="event-description">{event.description.substring(0, 150)}...</p>
                
                <Link to={`/events/${event._id}`} className="event-link">
                  Voir les détails
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;