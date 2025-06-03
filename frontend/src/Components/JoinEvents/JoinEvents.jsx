import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import './JoinEvents.scss';

// Composant pour afficher les événements disponibles à rejoindre
const JoinEvents = () => {
  // État pour stocker les événements
  const [events, setEvents] = useState([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);
  // État pour stocker les événements auxquels l'utilisateur est inscrit
  const [registeredEvents, setRegisteredEvents] = useState({});

  // Charger les événements au montage du composant
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Récupérer les événements approuvés depuis l'API
        const response = await eventApi.getEvents();
        setEvents(response.data || []);
        
        // Récupérer les événements auxquels l'utilisateur est inscrit
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userEventsResponse = await fetch(
              'http://localhost:5001/api/users/events',
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (userEventsResponse.ok) {
              const userEventsData = await userEventsResponse.json();
              
              // Créer un objet avec les IDs des événements comme clés pour faciliter la recherche
              const registeredMap = {};
              if (userEventsData.data && Array.isArray(userEventsData.data)) {
                userEventsData.data.forEach(event => {
                  registeredMap[event._id] = true;
                });
              }
              
              setRegisteredEvents(registeredMap);
            }
          } catch (userEventsError) {
            console.warn('Erreur lors de la récupération des événements de l\'utilisateur:', userEventsError);
            // Ne pas afficher d'erreur à l'utilisateur pour cette partie
          }
        }
        
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

  // Fonction pour rejoindre un événement
  const handleJoinEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour rejoindre un événement');
        return;
      }
      
      // Appel à l'API pour rejoindre l'événement
      await eventApi.registerForEvent(eventId);
      
      // Mettre à jour l'état local pour refléter l'inscription
      setRegisteredEvents(prev => ({
        ...prev,
        [eventId]: true
      }));
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription à l\'événement:', error);
      setError('Impossible de rejoindre l\'événement. Veuillez réessayer plus tard.');
    }
  };

  // Fonction pour quitter un événement
  const handleLeaveEvent = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour quitter un événement');
        return;
      }
      
      // Appel à l'API pour quitter l'événement
      await eventApi.unregisterFromEvent(eventId);
      
      // Mettre à jour l'état local pour refléter la désinscription
      setRegisteredEvents(prev => {
        const updated = { ...prev };
        delete updated[eventId];
        return updated;
      });
      
    } catch (error) {
      console.error('Erreur lors de la désinscription de l\'événement:', error);
      setError('Impossible de quitter l\'événement. Veuillez réessayer plus tard.');
    }
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="join-events-container">
        <div className="loading-spinner">Chargement des événements...</div>
      </div>
    );
  }

  return (
    <div className="join-events-container">
      <h1 className="join-events-title">Rejoindre des <span className="highlight">Événements</span></h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="events-list">
        {events.length === 0 ? (
          <p className="no-events">Aucun événement disponible pour le moment.</p>
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
                
                <div className="event-actions">
                  <Link to={`/events/${event._id}`} className="event-details-link">
                    Voir les détails
                  </Link>
                  
                  {registeredEvents[event._id] ? (
                    <button 
                      className="leave-event-button"
                      onClick={() => handleLeaveEvent(event._id)}
                    >
                      Se désinscrire
                    </button>
                  ) : (
                    <button 
                      className="join-event-button"
                      onClick={() => handleJoinEvent(event._id)}
                    >
                      Rejoindre
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JoinEvents;