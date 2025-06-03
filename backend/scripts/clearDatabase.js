const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Fonction pour effacer la base de données
const clearDatabase = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`Connexion établie à ${process.env.MONGODB_URI}`);
    console.log('Suppression de la base de données...');
    
    // Supprimer la base de données entière
    await mongoose.connection.dropDatabase();
    
    console.log('Base de données supprimée avec succès!');
  } catch (error) {
    console.error('Erreur lors de la suppression de la base de données:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la fonction
clearDatabase();