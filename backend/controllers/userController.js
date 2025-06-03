const User = require('../models/User');
const Event = require('../models/Event');
const Opportunity = require('../models/Opportunity');
const jwt = require('jsonwebtoken');

/**
 * @desc    Inscrire un nouvel utilisateur
 * @route   POST /api/users/register
 * @access  Public
 */
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Vérifier si tous les champs obligatoires sont remplis
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        success: false,
        field: !firstName ? 'firstName' : !lastName ? 'lastName' : !email ? 'email' : 'password',
        message: 'Veuillez remplir tous les champs obligatoires' 
      });
    }

    // Valider le format de l'email avec une expression régulière
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        field: 'email',
        message: 'Veuillez entrer une adresse email valide' 
      });
    }

    // Valider la longueur minimale du mot de passe
    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        field: 'password',
        message: 'Le mot de passe doit contenir au moins 6 caractères' 
      });
    }

    // Vérifier si un utilisateur avec cet email existe déjà
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ 
        success: false,
        field: 'email',
        message: 'Cette adresse email est déjà utilisée' 
      });
    }

    // Créer un nouvel utilisateur dans la base de données
    user = await User.create({
      firstName,
      lastName,
      email,
      password
    });

    console.log(`Nouvel utilisateur créé avec email: ${email}`);
    // Générer un token JWT et envoyer la réponse
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    
    // Gérer les erreurs de validation spécifiques de Mongoose
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors);
      const field = errors.length > 0 ? errors[0].path : '';
      const message = errors.length > 0 ? errors[0].message : 'Validation échouée';
      
      return res.status(400).json({ 
        success: false,
        field,
        message
      });
    }
    
    // Gérer les erreurs de duplication (email déjà utilisé)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        field: 'email',
        message: 'Cette adresse email est déjà utilisée' 
      });
    }
    
    // Erreur générique
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de l\'inscription. Veuillez réessayer.' 
    });
  }
};

/**
 * @desc    Connecter un utilisateur existant
 * @route   POST /api/users/login
 * @access  Public
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Valider la présence de l'email
    if (!email) {
      return res.status(400).json({ 
        success: false,
        field: 'email',
        message: 'Veuillez entrer votre adresse email' 
      });
    }
    
    // Valider la présence du mot de passe
    if (!password) {
      return res.status(400).json({ 
        success: false,
        field: 'password',
        message: 'Veuillez entrer votre mot de passe' 
      });
    }

    // Rechercher l'utilisateur par email et inclure le mot de passe hashé
    const user = await User.findOne({ email }).select('+password');

    // Vérifier si l'utilisateur existe
    if (!user) {
      return res.status(401).json({ 
        success: false,
        field: 'email',
        message: 'Adresse email ou mot de passe incorrect' 
      });
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        field: 'password',
        message: 'Adresse email ou mot de passe incorrect' 
      });
    }

    // Générer un token JWT et envoyer la réponse
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Erreur de connexion:', error);
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de la connexion. Veuillez réessayer.' 
    });
  }
};

/**
 * @desc    Obtenir les informations de l'utilisateur connecté
 * @route   GET /api/users/me
 * @access  Private
 */
exports.getMe = async (req, res) => {
  try {
    // Récupérer les données de l'utilisateur à partir de son ID (fourni par le middleware d'authentification)
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de la récupération de votre profil' 
    });
  }
};

/**
 * @desc    Obtenir un utilisateur par son ID (réservé aux administrateurs)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur'
    });
  }
};

/**
 * @desc    Mettre à jour les informations de l'utilisateur connecté
 * @route   PUT /api/users/me
 * @access  Private
 */
exports.updateMe = async (req, res) => {
  try {
    console.log('Mise à jour du profil utilisateur');
    
    // Trouver l'utilisateur par son ID
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    // Mettre à jour les champs si présents dans la requête
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.profileImage !== undefined) {
      console.log('Mise à jour de l\'image de profil');
      user.profileImage = req.body.profileImage;
    }
    
    // Sauvegarder les modifications dans la base de données
    await user.save();
    
    console.log('Profil mis à jour avec succès');
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors);
      const field = errors.length > 0 ? errors[0].path : '';
      const message = errors.length > 0 ? errors[0].message : 'Validation échouée';
      
      return res.status(400).json({ 
        success: false,
        field,
        message
      });
    }
    
    // Gérer les erreurs de duplication (email déjà utilisé)
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        field: 'email',
        message: 'Cette adresse email est déjà utilisée' 
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour de votre profil' 
    });
  }
};

/**
 * @desc    Mettre à jour le mot de passe de l'utilisateur
 * @route   PUT /api/users/updatepassword
 * @access  Private
 */
exports.updatePassword = async (req, res) => {
  try {
    // Récupérer l'utilisateur avec son mot de passe hashé
    const user = await User.findById(req.user.id).select('+password');

    // Vérifier si le mot de passe actuel est correct
    if (!(await user.matchPassword(req.body.currentPassword))) {
      return res.status(401).json({ 
        success: false,
        field: 'currentPassword',
        message: 'Le mot de passe actuel est incorrect' 
      });
    }

    // Mettre à jour le mot de passe
    user.password = req.body.newPassword;
    await user.save();

    // Générer un nouveau token JWT et envoyer la réponse
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors);
      const field = errors.length > 0 ? errors[0].path : '';
      const message = errors.length > 0 ? errors[0].message : 'Validation échouée';
      
      return res.status(400).json({ 
        success: false,
        field,
        message
      });
    }
    
    res.status(500).json({ 
      success: false,
      message: 'Une erreur est survenue lors de la mise à jour de votre mot de passe' 
    });
  }
};

/**
 * @desc    Obtenir les événements auxquels l'utilisateur est inscrit
 * @route   GET /api/users/events
 * @access  Private
 */
exports.getUserEvents = async (req, res) => {
  try {
    // Trouver les événements où l'utilisateur est inscrit comme participant
    const events = await Event.find({
      participants: req.user.id,
      status: 'approuvé'
    }).sort({ date: 1 }); // Trier par date croissante
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements de l\'utilisateur'
    });
  }
};

/**
 * @desc    Obtenir les opportunités auxquelles l'utilisateur est inscrit
 * @route   GET /api/users/opportunities
 * @access  Private
 */
exports.getUserOpportunities = async (req, res) => {
  try {
    // Note: Système d'inscription aux opportunités à implémenter
    // Pour l'instant, retourne un tableau vide
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des opportunités de l\'utilisateur'
    });
  }
};

/**
 * Fonction utilitaire pour générer un token JWT et envoyer la réponse
 * @param {Object} user - L'utilisateur pour lequel générer le token
 * @param {number} statusCode - Code de statut HTTP à renvoyer
 * @param {Object} res - Objet de réponse Express
 */
const sendTokenResponse = (user, statusCode, res) => {
  // Créer token JWT
  const token = user.getSignedJwtToken();

  // Ne pas renvoyer le mot de passe dans la réponse
  user.password = undefined;

  res.status(statusCode).json({
    success: true,
    token,
    user
  });
};