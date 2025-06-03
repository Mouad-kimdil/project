import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi } from '../../api/eventApi';
import { authApi } from '../../api/authApi';
import './EventDetail.scss';

/**
 * Composant pour afficher les détails d'un événement spécifique
 * Permet aux utilisateurs de voir les informations et de s'inscrire/se désinscrire
 */
const EventDetail = () => {
  const navigate = useNavigate();
  // Récupère l'ID de l'événement depuis les paramètres d'URL
  const { id } = useParams();
  // État pour stocker les détails de l'événement
  const [event, setEvent] = useState(null);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);
  // État pour suivre si l'utilisateur est inscrit à l'événement
  const [isRegistered, setIsRegistered] = useState(false);
  // État pour le chargement du bouton d'inscription
  const [registerLoading, setRegisterLoading] = useState(false);
  // État pour vérifier si l'utilisateur est admin
  const [isAdmin, setIsAdmin] = useState(false);
  // État pour stocker le nombre de participants
  const [participantCount, setParticipantCount] = useState(0);
  // État pour le succès de l'inscription
  const [registerSuccess, setRegisterSuccess] = useState(false);
  // État pour le chargement de la suppression
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Effet pour charger les détails de l'événement au chargement du composant
  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        // Vérifier si l'utilisateur est admin
        const currentUser = authApi.getCurrentUser();
        setIsAdmin(currentUser && currentUser.role === 'admin');
        
        // Appel à l'API pour récupérer les détails de l'événement par son ID
        const response = await eventApi.getEventById(id);
        setEvent(response.data);
        
        // Si l'événement a des participants, stocker leur nombre
        if (response.data.participants) {
          setParticipantCount(response.data.participants.length);
        }
        
        // Vérifier si l'utilisateur est inscrit à cet événement
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
              if (userEventsData.data && Array.isArray(userEventsData.data)) {
                const isUserRegistered = userEventsData.data.some(
                  userEvent => userEvent._id === id
                );
                setIsRegistered(isUserRegistered);
              }
            }
          } catch (userEventsError) {
            console.warn('Erreur lors de la vérification de l\'inscription:', userEventsError);
          }
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'événement:', err);
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]); // Recharge les données si l'ID change

  // Fonction pour gérer l'inscription/désinscription à l'événement
  const handleRegistration = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!authApi.isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setRegisterLoading(true);
      setError(null);
      
      if (isRegistered) {
        // Se désinscrire de l'événement
        await eventApi.unregisterFromEvent(id);
        setIsRegistered(false);
        // Décrémenter le nombre de participants
        setParticipantCount(prev => Math.max(0, prev - 1));
        setRegisterSuccess(true);
        setTimeout(() => setRegisterSuccess(false), 3000);
      } else {
        // S'inscrire à l'événement
        await eventApi.registerForEvent(id);
        setIsRegistered(true);
        // Incrémenter le nombre de participants
        setParticipantCount(prev => prev + 1);
        setRegisterSuccess(true);
        setTimeout(() => setRegisterSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription/désinscription:', err);
      setError('Erreur lors de l\'inscription. Veuillez réessayer plus tard.');
    } finally {
      setRegisterLoading(false);
    }
  };

  // Fonction pour retourner à la liste des événements
  const handleBackToEvents = () => {
    navigate('/events');
  };
  
  // Fonction pour voir les participants (admin uniquement)
  const handleViewParticipants = () => {
    navigate(`/admin/events/${id}/participants`);
  };

  // Fonction pour modifier l'événement (admin uniquement)
  const handleEdit = () => {
    navigate(`/create-event?edit=${id}`);
  };

  // Fonction pour supprimer l'événement (admin uniquement)
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ? Cette action est irréversible.')) {
      setDeleteLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/events/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          navigate('/events', { replace: true });
        } else {
          const data = await response.json();
          setError(data.message || 'Erreur lors de la suppression de l\'événement');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'événement:', err);
        setError('Erreur lors de la suppression de l\'événement. Veuillez réessayer plus tard.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Affiche un indicateur de chargement si les données sont en cours de chargement
  if (loading) return <div className="loading">Chargement des détails de l'événement...</div>;
  
  // Affiche un message si l'événement n'est pas trouvé
  if (!event) return <div className="error">Événement non trouvé</div>;

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        {error && <div className="error-message">{error}</div>}
        {registerSuccess && (
          <div className="success-message">
            {isRegistered 
              ? 'Vous êtes inscrit à cet événement avec succès!' 
              : 'Vous vous êtes désinscrit de cet événement avec succès!'}
          </div>
        )}

        <div className="event-detail-content">
          {/* Conteneur d'image de l'événement */}
          <div className="event-detail-image-container">
            <img 
              src={event.image || 'https://via.placeholder.com/800x500?text=Image+non+disponible'} 
              alt={event.title} 
              className="event-detail-image" 
            />
            <button onClick={handleBackToEvents} className="back-link">
              <i className="fas fa-arrow-left"></i> Retour aux événements
            </button>
          </div>

          <div className="event-detail-info">
            {/* En-tête avec titre */}
            <div className="event-detail-header">
              <h1>{event.title}</h1>
            </div>
            
            {/* Carte d'informations sur l'événement */}
            <div className="event-info-card">
              {/* Élément d'information sur la date */}
              <div className="event-info-item">
                <i className="fas fa-calendar"></i>
                <div>
                  <h4>Date</h4>
                  <p>{new Date(event.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Élément d'information sur l'heure */}
              <div className="event-info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Heure</h4>
                  <p>{event.startTime} - {event.endTime}</p>
                </div>
              </div>

              {/* Élément d'information sur le lieu */}
              <div className="event-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Lieu</h4>
                  <p>{event.location}</p>
                </div>
              </div>

              {/* Élément d'information sur l'organisateur */}
              <div className="event-info-item">
                <i className="fas fa-user"></i>
                <div>
                  <h4>Organisateur</h4>
                  <p>{event.organizer}</p>
                </div>
              </div>
              
              {/* Élément d'information sur les participants */}
              <div className="event-info-item">
                <i className="fas fa-users"></i>
                <div>
                  <h4>Participants</h4>
                  <p>{participantCount} {participantCount > 1 ? 'personnes inscrites' : 'personne inscrite'}</p>
                </div>
              </div>

              {/* Bouton d'inscription à l'événement */}
              <button 
                className={`register-button ${isRegistered ? 'registered' : ''}`}
                onClick={handleRegistration}
                disabled={registerLoading}
              >
                {registerLoading 
                  ? 'Traitement en cours...' 
                  : isRegistered 
                    ? 'Se désinscrire de cet événement' 
                    : 'S\'inscrire à cet événement'
                }
              </button>
              
              {/* Boutons admin */}
              {isAdmin && (
                <>
                  <button 
                    className="admin-button"
                    onClick={handleViewParticipants}
                  >
                    Gérer les participants
                  </button>
                  <button 
                    className="admin-button edit-button"
                    onClick={handleEdit}
                  >
                    Modifier cet événement
                  </button>
                  <button 
                    className="admin-button delete-button"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Suppression...' : 'Supprimer cet événement'}
                  </button>
                </>
              )}
            </div>

            {/* Section de description de l'événement */}
            <div className="event-description-section">
              <h2>À propos de cet événement</h2>
              <p>{event.description}</p>
            </div>

            {/* Section d'informations de contact */}
            <div className="event-contact-section">
              <h2>Informations de contact</h2>
              <p>
                Pour toute question concernant cet événement, veuillez contacter: <a href={`mailto:${event.contactEmail}`}>{event.contactEmail}</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;