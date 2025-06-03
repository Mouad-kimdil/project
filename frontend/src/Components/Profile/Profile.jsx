/**
 * Composant de Profil Utilisateur
 * 
 * Ce composant affiche la page de profil d'un utilisateur connecté.
 * Il montre les informations personnelles, les statistiques et les activités de l'utilisateur.
 * La page est divisée en onglets pour une meilleure organisation des informations.
 */
import React, { useState, useEffect } from 'react'; // Importe React et les hooks useState et useEffect
import { Link } from 'react-router-dom'; // Importe Link pour créer des liens de navigation
import './Profile.scss'; // Importe les styles spécifiques à ce composant

/**
 * Composant principal de profil utilisateur
 * Ce composant gère l'affichage et la logique de la page de profil
 */
const Profile = () => {
  // --- ÉTATS (VARIABLES RÉACTIVES) ---
  
  // État pour stocker les données de l'utilisateur connecté
  // Quand ces données changent, le composant se met à jour automatiquement
  const [user, setUser] = useState(null);
  
  // État pour indiquer si les données sont en cours de chargement
  // Permet d'afficher un indicateur de chargement
  const [loading, setLoading] = useState(true);
  
  // État pour gérer l'onglet actif (aperçu, activités ou paramètres)
  const [activeTab, setActiveTab] = useState('overview');
  
  // État pour stocker les statistiques de l'utilisateur (heures de bénévolat, etc.)
  const [stats, setStats] = useState({
    hoursVolunteered: 0, // Heures de bénévolat
    eventsAttended: 0,   // Nombre d'événements auxquels l'utilisateur a participé
    peopleImpacted: 0    // Nombre de personnes aidées
  });
  
  // État pour stocker les activités de l'utilisateur (événements passés, etc.)
  const [activities, setActivities] = useState([]);

  /**
   * Fonction pour récupérer les données de l'utilisateur depuis le serveur
   * Cette fonction fait plusieurs appels API pour obtenir toutes les informations nécessaires
   */
  const fetchUserData = async () => {
    try {
      // Indique que le chargement commence
      setLoading(true);
      
      // Récupère le token d'authentification du stockage local
      const token = localStorage.getItem('token');
      
      // Si aucun token n'est trouvé, l'utilisateur n'est pas connecté
      if (!token) {
        setLoading(false); // Arrête le chargement
        return; // Sort de la fonction
      }
      
      // --- RÉCUPÉRATION DES DONNÉES UTILISATEUR ---
      
      // Appel API pour récupérer les informations de l'utilisateur
      const response = await fetch('http://localhost:5001/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}` // Inclut le token pour l'authentification
        }
      });
      
      // Vérifie si la requête a réussi
      if (!response.ok) {
        throw new Error('Échec de récupération des données utilisateur');
      }
      
      // Convertit la réponse en objet JavaScript
      const userData = await response.json();
      
      // Met à jour l'état avec les données de l'utilisateur
      setUser(userData.data);
      
      // --- RÉCUPÉRATION DES STATISTIQUES ---
      
      // Appel API pour récupérer les statistiques de l'utilisateur
      const statsResponse = await fetch('http://localhost:5001/api/users/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Si la requête a réussi, met à jour les statistiques
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        // Utilise les données reçues ou des valeurs par défaut si aucune donnée n'est disponible
        setStats(statsData.data || {
          hoursVolunteered: 0,
          eventsAttended: 0,
          peopleImpacted: 0
        });
      }
      
      // --- RÉCUPÉRATION DES ACTIVITÉS ---
      
      // Appel API pour récupérer les activités de l'utilisateur
      const activitiesResponse = await fetch('http://localhost:5001/api/users/activities', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Si la requête a réussi, met à jour les activités
      if (activitiesResponse.ok) {
        const activitiesData = await activitiesResponse.json();
        setActivities(activitiesData.data || []);
      }
    } catch (error) {
      // Affiche l'erreur dans la console pour le débogage
      console.error('Erreur lors de la récupération des données utilisateur:', error);
    } finally {
      // Qu'il y ait une erreur ou non, arrête l'indicateur de chargement
      setLoading(false);
    }
  };

  // --- EFFETS (ACTIONS AUTOMATIQUES) ---
  
  /**
   * useEffect est un hook qui exécute du code à des moments spécifiques
   * Ici, il s'exécute une fois au chargement du composant (tableau de dépendances vide [])
   */
  useEffect(() => {
    // Appelle la fonction pour récupérer les données utilisateur
    fetchUserData();
  }, []); // Le tableau vide signifie "exécuter une seule fois au montage du composant"

  // --- RENDU CONDITIONNEL ---
  
  // Si les données sont en cours de chargement, affiche un indicateur
  if (loading && !user) {
    return <div className="profile-loading">Chargement du profil...</div>;
  }

  // Si aucun utilisateur n'est trouvé après le chargement, affiche un message d'erreur
  if (!user) {
    return (
      <div className="profile-error">
        <h2>Non Connecté</h2>
        <p>Veuillez <Link to="/login">vous connecter</Link> pour voir votre profil.</p>
      </div>
    );
  }

  // --- RENDU PRINCIPAL ---
  
  // Si l'utilisateur est chargé, affiche son profil
  return (
    <div className="profile-container">
      {/* En-tête du profil avec avatar et informations de base */}
      <div className="profile-header">
        {/* Avatar de l'utilisateur (image ou initiales) */}
        <div className="profile-avatar">
          {user.profileImage ? (
            // Si l'utilisateur a une image de profil, l'afficher
            <img 
              src={user.profileImage} 
              alt={`${user.firstName} ${user.lastName}`} 
            />
          ) : (
            // Sinon, afficher ses initiales
            <>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</>
          )}
        </div>
        
        {/* Informations de base et statistiques */}
        <div className="profile-info">
          {/* Nom complet de l'utilisateur */}
          <h1>{user.firstName} {user.lastName}</h1>
          
          {/* Email de l'utilisateur */}
          <p className="profile-email">{user.email}</p>
          
          {/* Statistiques de bénévolat */}
          <div className="profile-stats">
            {/* Heures de bénévolat */}
            <div className="stat">
              <span className="stat-value">{stats.hoursVolunteered}</span>
              <span className="stat-label">Heures</span>
            </div>
            
            {/* Nombre d'événements */}
            <div className="stat">
              <span className="stat-value">{stats.eventsAttended}</span>
              <span className="stat-label">Événements</span>
            </div>
            
            {/* Nombre de personnes aidées */}
            <div className="stat">
              <span className="stat-value">{stats.peopleImpacted}</span>
              <span className="stat-label">Personnes Aidées</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="profile-tabs">
        {/* Onglet Aperçu */}
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} // Ajoute la classe 'active' si cet onglet est sélectionné
          onClick={() => setActiveTab('overview')} // Change l'onglet actif lors du clic
        >
          Aperçu
        </button>
        
        {/* Onglet Activités */}
        <button 
          className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`}
          onClick={() => setActiveTab('activities')}
        >
          Activités
        </button>
        
        {/* Onglet Paramètres */}
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          Paramètres
        </button>
      </div>

      {/* Contenu des onglets - change en fonction de l'onglet actif */}
      <div className="profile-content">
        {/* ONGLET APERÇU */}
        {activeTab === 'overview' && (
          <div className="profile-overview">
            {/* Section d'impact */}
            <div className="profile-section">
              <h2>Votre Impact</h2>
              <div className="impact-cards">
                {/* Carte pour les heures de bénévolat */}
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-clock"></i> {/* Icône d'horloge */}
                  </div>
                  <div className="impact-details">
                    <h3>{stats.hoursVolunteered} Heures</h3>
                    <p>De bénévolat</p>
                  </div>
                </div>
                
                {/* Carte pour les événements */}
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-calendar-check"></i> {/* Icône de calendrier */}
                  </div>
                  <div className="impact-details">
                    <h3>{stats.eventsAttended} Événements</h3>
                    <p>Participés</p>
                  </div>
                </div>
                
                {/* Carte pour les personnes aidées */}
                <div className="impact-card">
                  <div className="impact-icon">
                    <i className="fas fa-users"></i> {/* Icône de personnes */}
                  </div>
                  <div className="impact-details">
                    <h3>{stats.peopleImpacted} Personnes</h3>
                    <p>Aidées</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Section des activités récentes */}
            <div className="profile-section">
              <h2>Activités Récentes</h2>
              {/* Affiche la liste des activités ou un message si aucune activité */}
              {activities.length > 0 ? (
                <>
                  {/* Liste des 3 activités les plus récentes */}
                  <div className="activities-list">
                    {activities.slice(0, 3).map(activity => (
                      <div className="activity-item" key={activity.id}>
                        {/* Type d'activité (événement ou opportunité) */}
                        <div className="activity-type">
                          <span className={`activity-badge ${activity.type}`}>
                            {activity.type === 'event' ? 'Événement' : 'Opportunité'}
                          </span>
                        </div>
                        
                        {/* Détails de l'activité */}
                        <div className="activity-details">
                          <h3>{activity.title}</h3>
                          <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        
                        {/* Statut de l'activité */}
                        <div className="activity-status">
                          <span className={`status-badge ${activity.status.toLowerCase()}`}>
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Bouton pour voir toutes les activités si plus de 3 */}
                  {activities.length > 3 && (
                    <div className="view-all">
                      <button className="view-all-btn" onClick={() => setActiveTab('activities')}>
                        Voir Toutes les Activités
                      </button>
                    </div>
                  )}
                </>
              ) : (
                // Message affiché si aucune activité n'est trouvée
                <div className="no-activities">
                  <p>Vous n'avez pas encore participé à des activités.</p>
                  <div className="activity-links">
                    <Link to="/events" className="activity-link">Parcourir les Événements</Link>
                    <Link to="/opportunities" className="activity-link">Trouver des Opportunités</Link>
                  </div>
                </div>
              )}
            </div>
            
            {/* Section des recommandations */}
            <div className="profile-section">
              <h2>Recommandé Pour Vous</h2>
              <div className="recommendations">
                {/* Première recommandation */}
                <div className="recommendation-card">
                  <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Collecte de Nourriture" />
                  <div className="recommendation-content">
                    <h3>Collecte de Nourriture</h3>
                    <p>Aidez à collecter de la nourriture pour les familles dans le besoin de notre communauté.</p>
                    <Link to="/events/2" className="view-details-btn">Voir les Détails</Link>
                  </div>
                </div>
                
                {/* Deuxième recommandation */}
                <div className="recommendation-card">
                  <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60" alt="Partenaire de Lecture" />
                  <div className="recommendation-content">
                    <h3>Partenaire de Lecture</h3>
                    <p>Lisez avec des enfants pour améliorer leurs compétences en lecture.</p>
                    <Link to="/opportunities/2" className="view-details-btn">Voir les Détails</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET ACTIVITÉS */}
        {activeTab === 'activities' && (
          <div className="profile-activities">
            <h2>Vos Activités</h2>
            {/* Affiche toutes les activités ou un message si aucune activité */}
            {activities.length > 0 ? (
              <div className="activities-list full-list">
                {/* Mappe à travers toutes les activités pour les afficher */}
                {activities.map(activity => (
                  <div className="activity-item" key={activity.id}>
                    <div className="activity-type">
                      <span className={`activity-badge ${activity.type}`}>
                        {activity.type === 'event' ? 'Événement' : 'Opportunité'}
                      </span>
                    </div>
                    <div className="activity-details">
                      <h3>{activity.title}</h3>
                      <p>Date: {new Date(activity.date).toLocaleDateString()}</p>
                    </div>
                    <div className="activity-status">
                      <span className={`status-badge ${activity.status.toLowerCase()}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              // Message affiché si aucune activité n'est trouvée
              <div className="no-activities">
                <p>Vous n'avez pas encore participé à des activités.</p>
                <div className="activity-links">
                  <Link to="/events" className="activity-link">Parcourir les Événements</Link>
                  <Link to="/opportunities" className="activity-link">Trouver des Opportunités</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ONGLET PARAMÈTRES */}
        {activeTab === 'settings' && (
          <div className="profile-settings">
            <h2>Paramètres du Compte</h2>
            {/* Formulaire pour modifier les informations du compte */}
            <div className="settings-form">
              {/* Champ pour le prénom */}
              <div className="form-group">
                <label>Prénom</label>
                <input type="text" defaultValue={user.firstName} />
              </div>
              
              {/* Champ pour le nom */}
              <div className="form-group">
                <label>Nom</label>
                <input type="text" defaultValue={user.lastName} />
              </div>
              
              {/* Champ pour l'email */}
              <div className="form-group">
                <label>Email</label>
                <input type="email" defaultValue={user.email} />
              </div>
              
              {/* Champ pour le mot de passe */}
              <div className="form-group">
                <label>Mot de passe</label>
                <input type="password" placeholder="••••••••" />
              </div>
              
              {/* Bouton pour enregistrer les modifications */}
              <button className="save-settings-btn">Enregistrer les Modifications</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Exporte le composant pour qu'il puisse être utilisé ailleurs dans l'application
export default Profile;