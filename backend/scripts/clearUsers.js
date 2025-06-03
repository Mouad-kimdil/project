const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Fonction pour effacer uniquement la collection des utilisateurs
const clearUsers = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`Connexion établie à ${process.env.MONGODB_URI}`);
    console.log('Suppression de la collection des utilisateurs...');
    
    // Supprimer uniquement la collection des utilisateurs
    const result = await mongoose.connection.db.collection('users').deleteMany({});
    
    console.log(`${result.deletedCount} utilisateurs supprimés avec succès!`);
  } catch (error) {
    console.error('Erreur lors de la suppression des utilisateurs:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la fonction
clearUsers();