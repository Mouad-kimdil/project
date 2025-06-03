import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { opportunityApi } from '../../api/opportunityApi';
import { authApi } from '../../api/authApi';
import './OpportunityDetail.scss';

// Composant pour afficher les détails d'une opportunité spécifique
const OpportunityDetail = () => {
  const navigate = useNavigate();
  // Récupère l'ID de l'opportunité depuis les paramètres d'URL
  const { id } = useParams();
  // État pour stocker les détails de l'opportunité
  const [opportunity, setOpportunity] = useState(null);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);
  // État pour vérifier si l'utilisateur est admin
  const [isAdmin, setIsAdmin] = useState(false);
  // État pour le chargement du bouton de candidature
  const [applyLoading, setApplyLoading] = useState(false);
  // État pour le succès de la candidature
  const [applySuccess, setApplySuccess] = useState(false);
  // État pour le chargement de la suppression
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Effet pour charger les détails de l'opportunité au chargement du composant
  useEffect(() => {
    const fetchOpportunityDetails = async () => {
      try {
        // Vérifier si l'utilisateur est admin
        const currentUser = authApi.getCurrentUser();
        setIsAdmin(currentUser && currentUser.role === 'admin');
        
        // Appel à l'API pour récupérer les détails de l'opportunité par son ID
        const response = await opportunityApi.getOpportunityById(id);
        setOpportunity(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Erreur lors du chargement des détails de l\'opportunité:', err);
        setError('Échec du chargement des détails de l\'opportunité. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };

    fetchOpportunityDetails();
  }, [id]); // Recharge les données si l'ID change

  // Fonction pour retourner à la liste des opportunités
  const handleBackToOpportunities = () => {
    navigate('/opportunities');
  };

  // Fonction pour postuler à l'opportunité
  const handleApply = async () => {
    // Vérifier si l'utilisateur est connecté
    if (!authApi.isAuthenticated()) {
      navigate('/login');
      return;
    }

    setApplyLoading(true);
    try {
      // Simuler une requête d'application
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Afficher un message de succès
      setApplySuccess(true);
      
      // Réinitialiser après 3 secondes
      setTimeout(() => {
        setApplySuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Erreur lors de la candidature:', err);
      setError('Impossible de soumettre votre candidature. Veuillez réessayer plus tard.');
    } finally {
      setApplyLoading(false);
    }
  };

  // Fonction pour modifier l'opportunité (admin uniquement)
  const handleEdit = () => {
    // Rediriger vers le formulaire d'édition
    navigate(`/create-opportunity?edit=${id}`);
  };

  // Fonction pour gérer les participants (admin uniquement)
  const handleManageParticipants = () => {
    navigate(`/admin/opportunities/${id}/participants`);
  };

  // Fonction pour supprimer l'opportunité (admin uniquement)
  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opportunité ? Cette action est irréversible.')) {
      setDeleteLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/opportunities/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          navigate('/opportunities', { replace: true });
        } else {
          const data = await response.json();
          setError(data.message || 'Erreur lors de la suppression de l\'opportunité');
        }
      } catch (err) {
        console.error('Erreur lors de la suppression de l\'opportunité:', err);
        setError('Erreur lors de la suppression de l\'opportunité. Veuillez réessayer plus tard.');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  // Affiche un indicateur de chargement si les données sont en cours de chargement
  if (loading) return <div className="loading">Chargement des détails de l'opportunité...</div>;
  
  // Affiche un message d'erreur si le chargement a échoué
  if (error) return <div className="error">{error}</div>;
  
  // Affiche un message si l'opportunité n'est pas trouvée
  if (!opportunity) return <div className="error">Opportunité non trouvée</div>;

  return (
    <div className="opportunity-detail-page">
      <div className="opportunity-detail-container">
        {applySuccess && (
          <div className="success-message">
            Votre candidature a été soumise avec succès! Nous vous contacterons bientôt.
          </div>
        )}

        <div className="opportunity-detail-content">
          {/* Conteneur d'image de l'opportunité */}
          <div className="opportunity-detail-image-container">
            <img 
              src={opportunity.image || 'https://via.placeholder.com/800x500?text=Image+non+disponible'} 
              alt={opportunity.title} 
              className="opportunity-detail-image" 
            />
            <div className="opportunity-category">{opportunity.category}</div>
            <button onClick={handleBackToOpportunities} className="back-link">
              <i className="fas fa-arrow-left"></i> Retour aux opportunités
            </button>
          </div>

          <div className="opportunity-detail-info">
            {/* En-tête avec titre */}
            <div className="opportunity-detail-header">
              <h1>{opportunity.title}</h1>
            </div>
            
            {/* Carte d'informations sur l'opportunité */}
            <div className="opportunity-info-card">
              {/* Élément d'information sur l'organisation */}
              <div className="opportunity-info-item">
                <i className="fas fa-building"></i>
                <div>
                  <h4>Organisation</h4>
                  <p>{opportunity.organization}</p>
                </div>
              </div>

              {/* Élément d'information sur le lieu */}
              <div className="opportunity-info-item">
                <i className="fas fa-map-marker-alt"></i>
                <div>
                  <h4>Lieu</h4>
                  <p>{opportunity.location}</p>
                </div>
              </div>

              {/* Élément d'information sur l'engagement de temps */}
              <div className="opportunity-info-item">
                <i className="fas fa-clock"></i>
                <div>
                  <h4>Engagement de temps</h4>
                  <p>{opportunity.commitment}</p>
                </div>
              </div>

              {/* Élément d'information sur les heures */}
              <div className="opportunity-info-item">
                <i className="fas fa-hourglass-half"></i>
                <div>
                  <h4>Heures par session</h4>
                  <p>{opportunity.hours} heures</p>
                </div>
              </div>

              {/* Bouton pour postuler à l'opportunité */}
              <button 
                className="apply-button"
                onClick={handleApply}
                disabled={applyLoading}
              >
                {applyLoading ? 'Traitement en cours...' : 'Postuler à cette opportunité'}
              </button>
              
              {/* Boutons admin */}
              {isAdmin && (
                <>
                  <button 
                    className="admin-button"
                    onClick={handleManageParticipants}
                  >
                    Gérer les participants
                  </button>
                  <button 
                    className="admin-button edit-button"
                    onClick={handleEdit}
                  >
                    Modifier cette opportunité
                  </button>
                  <button 
                    className="admin-button delete-button"
                    onClick={handleDelete}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? 'Suppression...' : 'Supprimer cette opportunité'}
                  </button>
                </>
              )}
            </div>

            {/* Section de description de l'opportunité */}
            <div className="opportunity-description-section">
              <h2>À propos de cette opportunité</h2>
              <p>{opportunity.description}</p>
            </div>

            {/* Section des prérequis */}
            {opportunity.requirements && (
              <div className="opportunity-requirements-section">
                <h2>Prérequis</h2>
                <p>{opportunity.requirements}</p>
              </div>
            )}

            {/* Section des compétences requises */}
            {opportunity.skills && opportunity.skills.length > 0 && (
              <div className="opportunity-skills-section">
                <h2>Compétences requises</h2>
                <div className="skills-list">
                  {opportunity.skills.map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Section d'informations de contact */}
            <div className="opportunity-contact-section">
              <h2>Informations de contact</h2>
              <p>
                <strong>Email:</strong> <a href={`mailto:${opportunity.contactEmail}`}>{opportunity.contactEmail}</a>
              </p>
              {opportunity.contactPhone && (
                <p>
                  <strong>Téléphone:</strong> <a href={`tel:${opportunity.contactPhone}`}>{opportunity.contactPhone}</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetail;