/**
 * Modèle Utilisateur
 * Ce fichier définit la structure des données utilisateur dans la base de données MongoDB
 * Un modèle Mongoose est comme un plan qui décrit à quoi ressemblent les documents dans la collection
 */
const mongoose = require('mongoose'); // Bibliothèque pour interagir avec MongoDB
const bcrypt = require('bcryptjs'); // Bibliothèque pour hacher les mots de passe de façon sécurisée
const jwt = require('jsonwebtoken'); // Bibliothèque pour créer et vérifier des tokens JWT

/**
 * Schéma Mongoose pour les utilisateurs
 * Un schéma définit la structure, les validations et les comportements des documents
 * Chaque propriété du schéma correspond à un champ dans le document MongoDB
 */
const UserSchema = new mongoose.Schema({
  // Prénom de l'utilisateur
  firstName: {
    type: String, // Le type de données est une chaîne de caractères
    required: [true, 'Veuillez ajouter un prénom'] // Ce champ est obligatoire avec un message d'erreur
  },
  
  // Nom de famille de l'utilisateur
  lastName: {
    type: String,
    required: [true, 'Veuillez ajouter un nom']
  },
  
  // Email de l'utilisateur (unique pour chaque utilisateur)
  email: {
    type: String,
    required: [true, 'Veuillez ajouter un email'],
    unique: true, // Garantit que deux utilisateurs ne peuvent pas avoir le même email
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, // Expression régulière pour valider le format email
      'Veuillez ajouter un email valide' // Message d'erreur si le format est incorrect
    ]
  },
  
  // Mot de passe de l'utilisateur (stocké sous forme hachée pour la sécurité)
  password: {
    type: String,
    required: [true, 'Veuillez ajouter un mot de passe'],
    minlength: 6, // Le mot de passe doit avoir au moins 6 caractères
    select: false // Par défaut, ce champ ne sera pas inclus dans les requêtes (pour la sécurité)
  },
  
  // Image de profil de l'utilisateur (stockée sous forme de chaîne base64)
  profileImage: {
    type: String,
    default: '' // Valeur par défaut si aucune image n'est fournie
  },
  
  // Rôle de l'utilisateur (utilisateur normal ou administrateur)
  role: {
    type: String,
    enum: ['user', 'admin'], // Le rôle ne peut être que l'une de ces deux valeurs
    default: 'user' // Par défaut, un nouvel utilisateur a le rôle 'user'
  },
  
  // Date de création du compte
  createdAt: {
    type: Date,
    default: Date.now // La date actuelle sera utilisée par défaut
  }
});

/**
 * Middleware "pre-save" - s'exécute avant qu'un document soit sauvegardé
 * Cette fonction hache le mot de passe avant de le sauvegarder dans la base de données
 * Cela garantit que les mots de passe ne sont jamais stockés en texte clair
 */
UserSchema.pre('save', async function(next) {
  // Ne pas hacher le mot de passe s'il n'a pas été modifié
  // Cela évite de hacher à nouveau un mot de passe déjà haché lors des mises à jour
  if (!this.isModified('password')) {
    next(); // Passe au middleware suivant
    return;
  }

  // Génération d'un "sel" aléatoire pour renforcer la sécurité du hachage
  // Le sel est un nombre aléatoire qui est ajouté au mot de passe avant le hachage
  // Cela rend les attaques par dictionnaire beaucoup plus difficiles
  const salt = await bcrypt.genSalt(10); // 10 est le nombre de tours (plus c'est élevé, plus c'est sécurisé mais lent)
  
  // Hachage du mot de passe avec le sel
  // Le résultat est une chaîne qui ne peut pas être convertie en mot de passe d'origine
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Méthode pour générer un token JWT pour l'utilisateur
 * Un JWT (JSON Web Token) est utilisé pour l'authentification
 * Il contient des informations encodées sur l'utilisateur (comme son ID)
 * @returns {string} Token JWT signé qui peut être utilisé pour authentifier l'utilisateur
 */
UserSchema.methods.getSignedJwtToken = function() {
  // Création et signature du token avec l'ID de l'utilisateur
  // Le token est signé avec une clé secrète (définie dans les variables d'environnement)
  // et a une durée de validité limitée
  return jwt.sign(
    { id: this._id }, // Payload du token (données incluses dans le token)
    process.env.JWT_SECRET, // Clé secrète pour signer le token
    { expiresIn: process.env.JWT_EXPIRE } // Durée de validité du token
  );
};

/**
 * Méthode pour vérifier si un mot de passe correspond au mot de passe hashé de l'utilisateur
 * Cette méthode est utilisée lors de la connexion pour vérifier les identifiants
 * @param {string} enteredPassword - Mot de passe entré par l'utilisateur lors de la connexion
 * @returns {boolean} Vrai si le mot de passe correspond, faux sinon
 */
UserSchema.methods.matchPassword = async function(enteredPassword) {
  // bcrypt.compare compare un mot de passe en texte clair avec un mot de passe haché
  // Il retourne true si le mot de passe correspond, false sinon
  return await bcrypt.compare(enteredPassword, this.password);
};

// Création et exportation du modèle Mongoose à partir du schéma
// Ce modèle sera utilisé pour interagir avec la collection 'users' dans MongoDB
module.exports = mongoose.model('User', UserSchema);