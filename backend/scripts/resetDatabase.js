const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fetch = require('node-fetch');

// Charger les variables d'environnement
dotenv.config();

// Fonction pour réinitialiser la base de données
const resetDatabase = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`Connexion établie à ${process.env.MONGODB_URI}`);
    console.log('Suppression de la base de données...');
    
    // Supprimer la base de données entière
    await mongoose.connection.dropDatabase();
    
    console.log('Base de données supprimée avec succès!');
    
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée');
    
    // Attendre que le serveur soit prêt
    console.log('Attente du démarrage du serveur...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Appeler l'API de seed pour remplir la base de données
    console.log('Remplissage de la base de données avec les données initiales...');
    try {
      const response = await fetch('http://localhost:5001/api/seed', { method: 'POST' });
      const data = await response.json();
      console.log('Résultat du remplissage:', data);
    } catch (error) {
      console.error('Erreur lors du remplissage de la base de données:', error);
      console.log('Assurez-vous que le serveur est en cours d\'exécution sur le port 5001');
    }
    
  } catch (error) {
    console.error('Erreur lors de la réinitialisation de la base de données:', error);
  } finally {
    process.exit(0);
  }
};

// Exécuter la fonction
resetDatabase();