import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminStyles.scss';

// Composant pour afficher et gérer les participants d'un événement (admin uniquement)
const EventParticipants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Charger les détails de l'événement et ses participants
  useEffect(() => {
    const fetchEventAndParticipants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Récupérer les détails de l'événement
        const eventResponse = await fetch(`http://localhost:5001/api/events/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!eventResponse.ok) {
          throw new Error('Impossible de récupérer les détails de l\'événement');
        }
        
        const eventData = await eventResponse.json();
        setEvent(eventData.data);
        
        // Si l'événement a des participants, les récupérer directement
        if (eventData.data && eventData.data.participants && eventData.data.participants.length > 0) {
          // Récupérer les détails des utilisateurs pour chaque participant
          const userPromises = eventData.data.participants.map(async (userId) => {
            try {
              const userResponse = await fetch(`http://localhost:5001/api/users/${userId}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              
              if (userResponse.ok) {
                const userData = await userResponse.json();
                return userData.data;
              }
              return { _id: userId, firstName: 'Utilisateur', lastName: 'Inconnu', email: 'inconnu@example.com' };
            } catch (error) {
              console.warn(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
              return { _id: userId, firstName: 'Utilisateur', lastName: 'Inconnu', email: 'inconnu@example.com' };
            }
          });
          
          const users = await Promise.all(userPromises);
          setParticipants(users.filter(user => user !== null));
        } else {
          setParticipants([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message || 'Une erreur est survenue');
        setLoading(false);
      }
    };
    
    fetchEventAndParticipants();
  }, [id, navigate]);

  // Supprimer un participant
  const handleRemoveParticipant = async (userId) => {
    try {
      setDeleteLoading(userId);
      const token = localStorage.getItem('token');
      
      // Appel à l'API pour supprimer le participant
      const response = await fetch(`http://localhost:5001/api/events/${id}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
      
      if (!response.ok) {
        throw new Error('Impossible de supprimer le participant');
      }
      
      // Mettre à jour la liste des participants
      setParticipants(participants.filter(p => p._id !== userId));
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Retourner à la page de l'événement
  const handleBack = () => {
    navigate(`/events/${id}`);
  };

  if (loading) {
    return <div className="admin-container loading">Chargement des participants...</div>;
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">{error}</div>
        <button className="admin-button" onClick={handleBack}>Retour à l'événement</button>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="admin-container">
        <div className="admin-error">Événement non trouvé</div>
        <button className="admin-button" onClick={() => navigate('/events')}>Retour aux événements</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="admin-back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Retour à l'événement
        </button>
        <h1>Participants: {event.title}</h1>
      </div>
      
      {participants.length === 0 ? (
        <div className="admin-empty-state">
          <p>Aucun participant inscrit à cet événement.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map(participant => (
                <tr key={participant._id}>
                  <td>
                    <div className="participant-info">
                      {participant.profileImage ? (
                        <img 
                          src={participant.profileImage} 
                          alt={`${participant.firstName} ${participant.lastName}`} 
                          className="participant-avatar"
                        />
                      ) : (
                        <div className="participant-avatar-placeholder">
                          {participant.firstName?.charAt(0)}{participant.lastName?.charAt(0)}
                        </div>
                      )}
                      <span>{participant.firstName} {participant.lastName}</span>
                    </div>
                  </td>
                  <td>{participant.email}</td>
                  <td>
                    <button 
                      className="admin-delete-button"
                      onClick={() => handleRemoveParticipant(participant._id)}
                      disabled={deleteLoading === participant._id}
                    >
                      {deleteLoading === participant._id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventParticipants;