import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { opportunityApi } from '../../api/opportunityApi';
import './Opportunities.scss';

// Composant pour afficher la liste des opportunités
const Opportunities = () => {
  // État pour stocker les opportunités
  const [opportunities, setOpportunities] = useState([]);
  // État pour indiquer si les données sont en cours de chargement
  const [loading, setLoading] = useState(true);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState(null);

  // Charger les opportunités au montage du composant
  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        setLoading(true);
        // Récupérer les opportunités depuis l'API
        const response = await opportunityApi.getOpportunities();
        setOpportunities(response.data || []);
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

  // Afficher un message de chargement
  if (loading) {
    return (
      <div className="opportunities-container">
        <div className="loading-spinner">Chargement des opportunités...</div>
      </div>
    );
  }

  return (
    <div className="opportunities-container">
      <div className="opportunities-header">
        <h1>Opportunités de bénévolat</h1>
        <p>Découvrez les opportunités de bénévolat disponibles et trouvez celle qui vous convient</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="opportunities-grid">
        {opportunities.length === 0 ? (
          <div className="no-opportunities">
            <p>Aucune opportunité disponible pour le moment.</p>
            <p>Revenez bientôt pour découvrir nos prochaines opportunités de bénévolat.</p>
          </div>
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
                
                <Link to={`/opportunities/${opportunity._id}`} className="opportunity-link">
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

export default Opportunities;