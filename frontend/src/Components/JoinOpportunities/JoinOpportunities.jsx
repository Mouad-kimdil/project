import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityApi } from '../../api/opportunityApi';
import './JoinOpportunities.scss';

// Composant pour afficher les opportunités disponibles à rejoindre
const JoinOpportunities = () => {
  // État pour stocker les opportunités
  const [opportunities, setOpportunities] = useState([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);
  // État pour stocker les opportunités auxquelles l'utilisateur est inscrit
  const [registeredOpportunities, setRegisteredOpportunities] = useState({});

  // Charger les opportunités au montage du composant
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        // Récupérer les opportunités approuvées depuis l'API
        const response = await opportunityApi.getOpportunities();
        setOpportunities(response.data || []);
        
        // Récupérer les opportunités auxquelles l'utilisateur est inscrit
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const userOpportunitiesResponse = await fetch(
              'http://localhost:5001/api/users/opportunities',
              {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              }
            );
            
            if (userOpportunitiesResponse.ok) {
              const userOpportunitiesData = await userOpportunitiesResponse.json();
              
              // Créer un objet avec les IDs des opportunités comme clés pour faciliter la recherche
              const registeredMap = {};
              if (userOpportunitiesData.data && Array.isArray(userOpportunitiesData.data)) {
                userOpportunitiesData.data.forEach(opportunity => {
                  registeredMap[opportunity._id] = true;
                });
              }
              
              setRegisteredOpportunities(registeredMap);
            }
          } catch (userOpportunitiesError) {
            console.warn('Erreur lors de la récupération des opportunités de l\'utilisateur:', userOpportunitiesError);
            // Ne pas afficher d'erreur à l'utilisateur pour cette partie
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des opportunités:', error);
        // Ne pas afficher d'erreur s'il n'y a pas d'opportunités
        setOpportunities([]);
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, []);

  // Fonction pour rejoindre une opportunité
  const handleJoinOpportunity = async (opportunityId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour rejoindre une opportunité');
        return;
      }
      
      // Appel à l'API pour rejoindre l'opportunité
      await fetch(`http://localhost:5001/api/opportunities/${opportunityId}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      // Mettre à jour l'état local pour refléter l'inscription
      setRegisteredOpportunities(prev => ({
        ...prev,
        [opportunityId]: true
      }));
      
    } catch (error) {
      console.error('Erreur lors de l\'inscription à l\'opportunité:', error);
      setError('Impossible de rejoindre l\'opportunité. Veuillez réessayer plus tard.');
    }
  };

  // Fonction pour quitter une opportunité
  const handleLeaveOpportunity = async (opportunityId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Vous devez être connecté pour quitter une opportunité');
        return;
      }
      
      // Appel à l'API pour quitter l'opportunité
      await fetch(`http://localhost:5001/api/opportunities/${opportunityId}/register`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Mettre à jour l'état local pour refléter la désinscription
      setRegisteredOpportunities(prev => {
        const updated = { ...prev };
        delete updated[opportunityId];
        return updated;
      });
      
    } catch (error) {
      console.error('Erreur lors de la désinscription de l\'opportunité:', error);
      setError('Impossible de quitter l\'opportunité. Veuillez réessayer plus tard.');
    }
  };

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="join-opportunities-container">
        <div className="loading-spinner">Chargement des opportunités...</div>
      </div>
    );
  }

  return (
    <div className="join-opportunities-container">
      <h1 className="join-opportunities-title">Rejoindre des <span className="highlight">Opportunités</span></h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="opportunities-list">
        {opportunities.length === 0 ? (
          <p className="no-opportunities">Aucune opportunité disponible pour le moment.</p>
        ) : (
          opportunities.map(opportunity => (
            <div className="opportunity-card" key={opportunity._id}>
              <div className="opportunity-image-container">
                <img src={opportunity.image} alt={opportunity.title} className="opportunity-image" />
                <div className="opportunity-category">{opportunity.category}</div>
              </div>
              
              <div className="opportunity-content">
                <h3 className="opportunity-title">{opportunity.title}</h3>
                
                <div className="opportunity-details">
                  <div className="opportunity-organization">
                    <i className="fas fa-building"></i>
                    <span>{opportunity.organization}</span>
                  </div>
                  <div className="opportunity-location">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{opportunity.location}</span>
                  </div>
                  <div className="opportunity-commitment">
                    <i className="fas fa-clock"></i>
                    <span>{opportunity.commitment}</span>
                  </div>
                </div>
                
                <p className="opportunity-description">{opportunity.description.substring(0, 150)}...</p>
                
                <div className="opportunity-skills">
                  <strong>Compétences requises:</strong>
                  <div className="skills-list">
                    {opportunity.skills && opportunity.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
                
                <div className="opportunity-actions">
                  <Link to={`/opportunities/${opportunity._id}`} className="opportunity-details-link">
                    Voir les détails
                  </Link>
                  
                  {registeredOpportunities[opportunity._id] ? (
                    <button 
                      className="leave-opportunity-button"
                      onClick={() => handleLeaveOpportunity(opportunity._id)}
                    >
                      Se désinscrire
                    </button>
                  ) : (
                    <button 
                      className="join-opportunity-button"
                      onClick={() => handleJoinOpportunity(opportunity._id)}
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

export default JoinOpportunities;