import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AdminStyles.scss';

// Composant pour afficher et gérer les participants d'une opportunité (admin uniquement)
const OpportunityParticipants = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [opportunity, setOpportunity] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Charger les détails de l'opportunité et ses participants
  useEffect(() => {
    const fetchOpportunityAndParticipants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/login');
          return;
        }
        
        // Récupérer les détails de l'opportunité
        const opportunityResponse = await fetch(`http://localhost:5001/api/opportunities/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!opportunityResponse.ok) {
          throw new Error('Impossible de récupérer les détails de l\'opportunité');
        }
        
        const opportunityData = await opportunityResponse.json();
        setOpportunity(opportunityData.data);
        
        // Simuler la récupération des participants (à remplacer par un vrai appel API)
        // Dans un environnement réel, vous auriez un endpoint comme /api/opportunities/:id/participants
        const mockParticipants = [
          {
            _id: '1',
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
          },
          {
            _id: '2',
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie.martin@example.com',
            profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
          }
        ];
        
        setParticipants(mockParticipants);
        setLoading(false);
      } catch (error) {
        console.error('Erreur:', error);
        setError(error.message || 'Une erreur est survenue');
        setLoading(false);
      }
    };
    
    fetchOpportunityAndParticipants();
  }, [id, navigate]);

  // Supprimer un participant
  const handleRemoveParticipant = async (userId) => {
    try {
      setDeleteLoading(userId);
      
      // Simuler une requête de suppression (à remplacer par un vrai appel API)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mettre à jour la liste des participants
      setParticipants(participants.filter(p => p._id !== userId));
      
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || 'Une erreur est survenue lors de la suppression');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Retourner à la page de l'opportunité
  const handleBack = () => {
    navigate(`/opportunities/${id}`);
  };

  if (loading) {
    return <div className="admin-container loading">Chargement des participants...</div>;
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-error">{error}</div>
        <button className="admin-button" onClick={handleBack}>Retour à l'opportunité</button>
      </div>
    );
  }

  if (!opportunity) {
    return (
      <div className="admin-container">
        <div className="admin-error">Opportunité non trouvée</div>
        <button className="admin-button" onClick={() => navigate('/opportunities')}>Retour aux opportunités</button>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="admin-back-button" onClick={handleBack}>
          <i className="fas fa-arrow-left"></i> Retour à l'opportunité
        </button>
        <h1>Participants: {opportunity.title}</h1>
      </div>
      
      {participants.length === 0 ? (
        <div className="admin-empty-state">
          <p>Aucun participant inscrit à cette opportunité.</p>
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

export default OpportunityParticipants;