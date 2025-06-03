const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config();

// Modèle User simplifié pour ce script
const UserSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Fonction pour créer le premier administrateur
const createFirstAdmin = async () => {
  try {
    console.log('Tentative de connexion à MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`Connexion établie à ${process.env.MONGODB_URI}`);
    
    // Définir le modèle User
    const User = mongoose.model('User', UserSchema);
    
    // Vérifier si un admin existe déjà
    const adminExists = await User.findOne({ role: 'admin' });
    
    if (adminExists) {
      console.log('Un administrateur existe déjà:');
      console.log(`Email: ${adminExists.email}`);
      console.log(`Nom: ${adminExists.firstName} ${adminExists.lastName}`);
    } else {
      // Créer un mot de passe hashé
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      // Créer l'administrateur
      const admin = await User.create({
        firstName: 'Admin',
        lastName: 'System',
        email: 'admin@volunteerhub.com',
        password: hashedPassword,
        role: 'admin'
      });
      
      console.log('Administrateur créé avec succès:');
      console.log(`Email: ${admin.email}`);
      console.log(`Mot de passe: admin123`);
      console.log(`Nom: ${admin.firstName} ${admin.lastName}`);
    }
  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    // Fermer la connexion
    await mongoose.connection.close();
    console.log('Connexion fermée');
    process.exit(0);
  }
};

// Exécuter la fonction
createFirstAdmin();