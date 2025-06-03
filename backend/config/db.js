const mongoose = require('mongoose');

/**
 * Fonction pour établir la connexion à la base de données MongoDB
 * Utilise les options recommandées pour éviter les avertissements de dépréciation
 */
const connectDB = async () => {
  try {
    // Tentative de connexion à MongoDB avec l'URI spécifié dans les variables d'environnement
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Affichage d'un message de succès si la connexion est établie
    console.log(`MongoDB Connecté: ${conn.connection.host}`);
  } catch (error) {
    // Gestion des erreurs de connexion
    console.error(`Erreur de connexion à MongoDB: ${error.message}`);
    // Quitter le processus avec un code d'erreur en cas d'échec de connexion
    process.exit(1);
  }
};

module.exports = connectDB;