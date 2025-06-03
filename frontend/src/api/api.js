// API pour accéder aux données des événements et témoignages

/**
 * API pour les événements
 */
export const eventsApi = {
  /**
   * Récupère la liste des événements avec pagination
   * @param {number} page - Numéro de page
   * @returns {Promise<Array>} Liste des événements
   */
  getEvents: async (page = 1) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventsData = JSON.parse(localStorage.getItem('events') || '[]');
        const pageSize = 6;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedEvents = eventsData.slice(startIndex, endIndex);
        resolve(paginatedEvents);
      }, 500); // Simule un délai réseau
    });
  },

  /**
   * Récupère un événement par son ID
   * @param {string} id - ID de l'événement
   * @returns {Promise<Object>} Détails de l'événement
   */
  getEventById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const eventsData = JSON.parse(localStorage.getItem('events') || '[]');
        const event = eventsData.find(e => e.id === id);
        if (event) {
          resolve(event);
        } else {
          reject(new Error('Événement non trouvé'));
        }
      }, 300);
    });
  },

  /**
   * Ajoute un nouvel événement
   * @param {Object} eventData - Données de l'événement
   * @returns {Promise<Object>} Événement créé
   */
  addEvent: async (eventData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventsData = JSON.parse(localStorage.getItem('events') || '[]');
        const newEvent = {
          id: `event-${Date.now()}`,
          ...eventData,
          createdAt: new Date().toISOString()
        };
        eventsData.push(newEvent);
        localStorage.setItem('events', JSON.stringify(eventsData));
        resolve(newEvent);
      }, 500);
    });
  }
};

/**
 * API pour les témoignages
 */
export const testimonialsApi = {
  /**
   * Récupère des témoignages aléatoires
   * @param {number} count - Nombre de témoignages à récupérer
   * @returns {Promise<Array>} Liste des témoignages
   */
  getRandomTestimonials: async (count = 3) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbackData = JSON.parse(localStorage.getItem('feedback') || '[]');
        // Mélange les témoignages et prend les premiers 'count'
        const shuffled = [...feedbackData].sort(() => 0.5 - Math.random());
        resolve(shuffled.slice(0, count));
      }, 400);
    });
  },

  /**
   * Ajoute un nouveau témoignage
   * @param {Object} testimonialData - Données du témoignage
   * @returns {Promise<Object>} Témoignage créé
   */
  addTestimonial: async (testimonialData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const feedbackData = JSON.parse(localStorage.getItem('feedback') || '[]');
        const newTestimonial = {
          id: `feedback-${Date.now()}`,
          ...testimonialData,
          createdAt: new Date().toISOString()
        };
        feedbackData.push(newTestimonial);
        localStorage.setItem('feedback', JSON.stringify(feedbackData));
        resolve(newTestimonial);
      }, 500);
    });
  }
};

/**
 * API pour les opportunités
 */
export const opportunitiesApi = {
  /**
   * Récupère la liste des opportunités avec pagination
   * @param {number} page - Numéro de page
   * @returns {Promise<Array>} Liste des opportunités
   */
  getOpportunities: async (page = 1) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const opportunitiesData = JSON.parse(localStorage.getItem('opportunities') || '[]');
        const pageSize = 6;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedOpportunities = opportunitiesData.slice(startIndex, endIndex);
        resolve(paginatedOpportunities);
      }, 500);
    });
  },

  /**
   * Récupère une opportunité par son ID
   * @param {string} id - ID de l'opportunité
   * @returns {Promise<Object>} Détails de l'opportunité
   */
  getOpportunityById: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const opportunitiesData = JSON.parse(localStorage.getItem('opportunities') || '[]');
        const opportunity = opportunitiesData.find(o => o.id === id);
        if (opportunity) {
          resolve(opportunity);
        } else {
          reject(new Error('Opportunité non trouvée'));
        }
      }, 300);
    });
  },

  /**
   * Ajoute une nouvelle opportunité
   * @param {Object} opportunityData - Données de l'opportunité
   * @returns {Promise<Object>} Opportunité créée
   */
  addOpportunity: async (opportunityData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const opportunitiesData = JSON.parse(localStorage.getItem('opportunities') || '[]');
        const newOpportunity = {
          id: `opp-${Date.now()}`,
          ...opportunityData,
          createdAt: new Date().toISOString()
        };
        opportunitiesData.push(newOpportunity);
        localStorage.setItem('opportunities', JSON.stringify(opportunitiesData));
        resolve(newOpportunity);
      }, 500);
    });
  }
};