// Utilitaire pour charger les données initiales dans l'application
import initialData from '../data/initialData.json';

/**
 * Charge les données initiales dans le localStorage pour simuler une base de données
 * Cette fonction est appelée au démarrage de l'application
 */
export const loadInitialData = () => {
  console.log('Chargement des données initiales...');
  
  // Vérifier si les données sont déjà chargées
  const dataLoaded = localStorage.getItem('initialDataLoaded');
  
  if (!dataLoaded) {
    try {
      // Charger les utilisateurs
      localStorage.setItem('users', JSON.stringify(initialData.users));
      console.log(`${initialData.users.length} utilisateurs chargés`);
      
      // Charger les opportunités
      localStorage.setItem('opportunities', JSON.stringify(initialData.opportunities));
      console.log(`${initialData.opportunities.length} opportunités chargées`);
      
      // Charger les événements
      localStorage.setItem('events', JSON.stringify(initialData.events));
      console.log(`${initialData.events.length} événements chargés`);
      
      // Charger les témoignages
      localStorage.setItem('feedback', JSON.stringify(initialData.feedback));
      console.log(`${initialData.feedback.length} témoignages chargés`);
      
      // Charger les activités des utilisateurs
      localStorage.setItem('userActivities', JSON.stringify(initialData.userActivities));
      console.log(`${initialData.userActivities.length} activités utilisateur chargées`);
      
      // Marquer les données comme chargées
      localStorage.setItem('initialDataLoaded', 'true');
      
      console.log('Chargement des données initiales terminé avec succès');
    } catch (error) {
      console.error('Erreur lors du chargement des données initiales:', error);
    }
  } else {
    console.log('Les données initiales ont déjà été chargées');
  }
};

/**
 * Réinitialise toutes les données dans le localStorage
 * Utile pour le développement et les tests
 */
export const resetData = () => {
  localStorage.removeItem('users');
  localStorage.removeItem('opportunities');
  localStorage.removeItem('events');
  localStorage.removeItem('feedback');
  localStorage.removeItem('userActivities');
  localStorage.removeItem('initialDataLoaded');
  
  console.log('Toutes les données ont été réinitialisées');
  
  // Recharger les données initiales
  loadInitialData();
};