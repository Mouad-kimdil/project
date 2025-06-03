// API pour la gestion des opportunités

/**
 * API pour la gestion des opportunités
 */
const opportunityApi = {
  /**
   * Récupère toutes les opportunités
   * @param {number} page - Numéro de page pour la pagination
   * @returns {Promise<Object>} Liste des opportunités
   */
  getOpportunities: async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:5001/api/opportunities?page=${page}`, {
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error);
      throw error;
    }
  },
  
  /**
   * Récupère une opportunité par son ID
   * @param {string} id - ID de l'opportunité
   * @returns {Promise<Object>} Détails de l'opportunité
   */
  getOpportunityById: async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/opportunities/${id}`, {
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'opportunité ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crée une nouvelle opportunité
   * @param {Object} opportunityData - Données de l'opportunité
   * @returns {Promise<Object>} Opportunité créée
   */
  createOpportunity: async (opportunityData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour créer une opportunité');
      }
      
      // Afficher les données envoyées pour le débogage
      console.log('Données de l\'opportunité à envoyer:', opportunityData);
      
      // Toujours utiliser JSON pour l'envoi (plus simple et plus fiable)
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Si l'image est un fichier, on ne l'envoie pas pour l'instant
      const dataToSend = { ...opportunityData };
      if (dataToSend.image instanceof File) {
        // Pour l'instant, on n'envoie pas l'image
        delete dataToSend.image;
      }
      
      // Convertir les skills en tableau si c'est une chaîne
      if (typeof dataToSend.skills === 'string') {
        dataToSend.skills = dataToSend.skills.split(',').map(skill => skill.trim());
      }
      
      const response = await fetch('http://localhost:5001/api/opportunities', {
        method: 'POST',
        headers,
        body: JSON.stringify(dataToSend),
        signal: AbortSignal.timeout(15000) // 15 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('Erreur de création d\'opportunité:', data);
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'opportunité:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour une opportunité existante
   * @param {string} id - ID de l'opportunité
   * @param {Object} opportunityData - Données mises à jour
   * @returns {Promise<Object>} Opportunité mise à jour
   */
  updateOpportunity: async (id, opportunityData) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour modifier une opportunité');
      }
      
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // Si l'image est un fichier, on ne l'envoie pas pour l'instant
      const dataToSend = { ...opportunityData };
      if (dataToSend.image instanceof File) {
        delete dataToSend.image;
      }
      
      // Convertir les skills en tableau si c'est une chaîne
      if (typeof dataToSend.skills === 'string') {
        dataToSend.skills = dataToSend.skills.split(',').map(skill => skill.trim());
      }
      
      const response = await fetch(`http://localhost:5001/api/opportunities/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(dataToSend),
        signal: AbortSignal.timeout(15000)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'opportunité ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprime une opportunité
   * @param {string} id - ID de l'opportunité
   * @returns {Promise<Object>} Confirmation de suppression
   */
  deleteOpportunity: async (id) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour supprimer une opportunité');
      }
      
      const response = await fetch(`http://localhost:5001/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'opportunité ${id}:`, error);
      throw error;
    }
  }
};

export { opportunityApi };