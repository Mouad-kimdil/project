/**
 * API pour la gestion des événements
 * Fournit des méthodes pour interagir avec les endpoints d'événements du backend
 */
const eventApi = {
  /**
   * Récupère tous les événements
   * @returns {Promise<Object>} Données des événements
   */
  getAllEvents: async () => {
    try {
      const response = await fetch('http://localhost:5001/api/events');
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error);
      throw error;
    }
  },
  
  /**
   * Récupère un événement par son ID
   * @param {string} id - ID de l'événement
   * @returns {Promise<Object>} Données de l'événement
   */
  getEventById: async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crée un nouvel événement
   * @param {Object} eventData - Données de l'événement à créer
   * @returns {Promise<Object>} Données de l'événement créé
   */
  createEvent: async (eventData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error);
      throw error;
    }
  },
  
  /**
   * Met à jour un événement existant
   * @param {string} id - ID de l'événement
   * @param {Object} eventData - Nouvelles données de l'événement
   * @returns {Promise<Object>} Données de l'événement mis à jour
   */
  updateEvent: async (id, eventData) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Supprime un événement
   * @param {string} id - ID de l'événement à supprimer
   * @returns {Promise<Object>} Résultat de la suppression
   */
  deleteEvent: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la suppression de l'événement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * S'inscrire à un événement
   * @param {string} id - ID de l'événement
   * @returns {Promise<Object>} Résultat de l'inscription
   */
  registerForEvent: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/events/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de l'inscription à l'événement ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Se désinscrire d'un événement
   * @param {string} id - ID de l'événement
   * @returns {Promise<Object>} Résultat de la désinscription
   */
  unregisterFromEvent: async (id) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/events/${id}/unregister`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data;
    } catch (error) {
      console.error(`Erreur lors de la désinscription de l'événement ${id}:`, error);
      throw error;
    }
  }
};

export { eventApi };