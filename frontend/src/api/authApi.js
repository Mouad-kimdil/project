// API pour l'authentification et la gestion des utilisateurs

/**
 * API pour l'authentification et la gestion des utilisateurs
 */
const authApi = {
  /**
   * Connecte un utilisateur avec email et mot de passe
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<Object>} Informations de l'utilisateur connecté
   */
  login: async (email, password) => {
    try {
      const response = await fetch('http://localhost:5001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password }),
        // Augmenter le timeout pour éviter les erreurs ECONNRESET
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Déclencher un événement personnalisé
      window.dispatchEvent(new Event('auth-change'));
      
      return data.user;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      
      // Gérer spécifiquement les erreurs de type ECONNRESET
      if (error.name === 'AbortError' || 
          (error.message && error.message.includes('network')) ||
          (error.message && error.message.includes('ECONNRESET'))) {
        throw { 
          response: { 
            data: { 
              success: false, 
              message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau et réessayer.' 
            } 
          } 
        };
      }
      
      throw error;
    }
  },

  /**
   * Inscrit un nouvel utilisateur
   * @param {Object} userData - Données de l'utilisateur
   * @returns {Promise<Object>} Informations de l'utilisateur inscrit
   */
  register: async (userData) => {
    try {
      const response = await fetch('http://localhost:5001/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData),
        // Augmenter le timeout pour éviter les erreurs ECONNRESET
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      // Stocker le token dans le localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      
      // Déclencher un événement personnalisé
      window.dispatchEvent(new Event('auth-change'));
      
      return data.user;
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      
      // Gérer spécifiquement les erreurs de type ECONNRESET
      if (error.name === 'AbortError' || 
          (error.message && error.message.includes('network')) ||
          (error.message && error.message.includes('ECONNRESET'))) {
        throw { 
          response: { 
            data: { 
              success: false, 
              message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau et réessayer.' 
            } 
          } 
        };
      }
      
      throw error;
    }
  },

  /**
   * Déconnecte l'utilisateur actuel
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    // Déclencher un événement personnalisé
    window.dispatchEvent(new Event('auth-change'));
  },

  /**
   * Vérifie si un utilisateur est connecté
   * @returns {boolean} Vrai si un utilisateur est connecté
   */
  isAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   * @returns {Object|null} Informations de l'utilisateur ou null
   */
  getCurrentUser: () => {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  },

  /**
   * Met à jour le profil de l'utilisateur
   * @param {Object} updates - Modifications à apporter au profil
   * @returns {Promise<Object>} Profil mis à jour
   */
  updateProfile: async (updates) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates),
        // Augmenter le timeout pour éviter les erreurs ECONNRESET
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      // Mettre à jour l'utilisateur dans le localStorage
      localStorage.setItem('currentUser', JSON.stringify(data.data));
      
      // Déclencher un événement personnalisé
      window.dispatchEvent(new Event('auth-change'));
      
      return data.data;
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      
      // Gérer spécifiquement les erreurs de type ECONNRESET
      if (error.name === 'AbortError' || 
          (error.message && error.message.includes('network')) ||
          (error.message && error.message.includes('ECONNRESET'))) {
        throw { 
          response: { 
            data: { 
              success: false, 
              message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau et réessayer.' 
            } 
          } 
        };
      }
      
      throw error;
    }
  },

  /**
   * Récupère les statistiques de l'utilisateur
   * @returns {Promise<Object>} Statistiques de l'utilisateur
   */
  getUserStats: async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // Augmenter le timeout pour éviter les erreurs ECONNRESET
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur de récupération des statistiques:', error);
      
      // En cas d'erreur réseau, retourner des valeurs par défaut
      if (error.name === 'AbortError' || 
          (error.message && error.message.includes('network')) ||
          (error.message && error.message.includes('ECONNRESET'))) {
        console.warn('Erreur réseau lors de la récupération des statistiques, utilisation des valeurs par défaut');
      }
      
      return {
        hoursVolunteered: 0,
        eventsAttended: 0,
        peopleImpacted: 0
      };
    }
  },

  /**
   * Récupère les activités de l'utilisateur
   * @returns {Promise<Array>} Liste des activités
   */
  getUserActivities: async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/users/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // Augmenter le timeout pour éviter les erreurs ECONNRESET
        signal: AbortSignal.timeout(10000) // 10 secondes
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw { response: { data } };
      }
      
      return data.data;
    } catch (error) {
      console.error('Erreur de récupération des activités:', error);
      
      // En cas d'erreur réseau, retourner un tableau vide
      if (error.name === 'AbortError' || 
          (error.message && error.message.includes('network')) ||
          (error.message && error.message.includes('ECONNRESET'))) {
        console.warn('Erreur réseau lors de la récupération des activités, utilisation d\'un tableau vide');
      }
      
      return [];
    }
  }
};

export { authApi };