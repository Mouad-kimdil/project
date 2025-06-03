/**
 * Utilitaire pour gérer les erreurs réseau et les erreurs ECONNRESET
 */

/**
 * Vérifie si l'erreur est liée à un problème de connexion réseau
 * @param {Error} error - L'erreur à vérifier
 * @returns {boolean} Vrai si c'est une erreur réseau
 */
export const isNetworkError = (error) => {
  return (
    error.name === 'AbortError' ||
    error.name === 'TypeError' ||
    (error.message && (
      error.message.includes('network') ||
      error.message.includes('ECONNRESET') ||
      error.message.includes('Failed to fetch')
    ))
  );
};

/**
 * Gère les erreurs réseau et retourne un message approprié
 * @param {Error} error - L'erreur à gérer
 * @param {string} defaultMessage - Message par défaut si ce n'est pas une erreur réseau
 * @returns {string} Message d'erreur formaté
 */
export const handleNetworkError = (error, defaultMessage = 'Une erreur est survenue') => {
  if (isNetworkError(error)) {
    return 'Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau et réessayer.';
  }
  
  // Si l'erreur vient de l'API avec un message spécifique
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  return defaultMessage;
};

/**
 * Crée un signal d'abandon avec timeout pour les requêtes fetch
 * @param {number} timeoutMs - Délai avant abandon en millisecondes
 * @returns {AbortSignal} Signal d'abandon avec timeout
 */
export const createTimeoutSignal = (timeoutMs = 10000) => {
  return AbortSignal.timeout(timeoutMs);
};

/**
 * Effectue une requête fetch avec gestion des erreurs réseau
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête fetch
 * @returns {Promise<Object>} Données de la réponse
 */
export const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    // Ajouter un timeout par défaut s'il n'est pas déjà défini
    if (!options.signal) {
      options.signal = createTimeoutSignal();
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw { response: { data, status: response.status } };
    }
    
    return data;
  } catch (error) {
    console.error(`Erreur lors de la requête à ${url}:`, error);
    
    if (isNetworkError(error)) {
      throw { 
        response: { 
          data: { 
            success: false, 
            message: 'Erreur de connexion au serveur. Veuillez vérifier votre connexion réseau et réessayer.' 
          },
          status: 0 // Code d'erreur réseau
        } 
      };
    }
    
    throw error;
  }
};