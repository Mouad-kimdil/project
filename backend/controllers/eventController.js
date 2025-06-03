const Event = require('../models/Event');
const User = require('../models/User');

// @desc    Obtenir tous les événements
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    // Filtrer les événements en fonction du rôle de l'utilisateur
    let query = {};
    
    // Si l'utilisateur n'est pas admin, ne montrer que les événements approuvés
    if (!req.user || req.user.role !== 'admin') {
      query = { status: 'approuvé' };
    }
    // Si l'utilisateur est admin, montrer tous les événements (pas de filtre)

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const events = await Event.find(query)
      .sort({ date: 1 }) // Trier par date croissante
      .skip(startIndex)
      .limit(limit)
      .populate('createdBy', 'firstName lastName');
    
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: events.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: events
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des événements'
    });
  }
};

// @desc    Obtenir un événement par ID
// @route   GET /api/events/:id
// @access  Public
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'firstName lastName')
      .populate('participants', 'firstName lastName email profileImage');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur peut voir cet événement
    if (event.status !== 'approuvé' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cet événement'
      });
    }
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'événement'
    });
  }
};

// @desc    Obtenir les participants d'un événement
// @route   GET /api/events/:id/participants
// @access  Private/Admin
exports.getEventParticipants = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent voir les participants'
      });
    }
    
    const event = await Event.findById(req.params.id).populate('participants', 'firstName lastName email profileImage');
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      count: event.participants.length,
      data: event.participants
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des participants'
    });
  }
};

// @desc    Supprimer un participant d'un événement
// @route   DELETE /api/events/:id/participants/:userId
// @access  Private/Admin
exports.removeParticipant = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent supprimer des participants'
      });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // Vérifier si l'utilisateur est inscrit
    if (!event.participants.includes(req.params.userId)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur n\'est pas inscrit à cet événement'
      });
    }
    
    // Retirer l'utilisateur des participants
    event.participants = event.participants.filter(
      participant => participant.toString() !== req.params.userId
    );
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Participant supprimé avec succès',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du participant'
    });
  }
};

// @desc    Créer un nouvel événement
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent créer des événements'
      });
    }
    
    // Afficher les données reçues pour le débogage
    console.log('Données reçues pour la création d\'événement:', req.body);
    
    // Ajouter l'utilisateur comme créateur de l'événement
    req.body.createdBy = req.user.id;
    
    // Les événements créés par les admins sont automatiquement approuvés
    req.body.status = 'approuvé';
    req.body.approvedBy = req.user.id;
    req.body.statusUpdatedAt = Date.now();
    
    // Vérifier que tous les champs requis sont présents
    const requiredFields = ['title', 'date', 'startTime', 'endTime', 'location', 'organizer', 'description', 'contactEmail'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      });
    }
    
    const event = await Event.create(req.body);
    
    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement:', error);
    
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'événement: ' + (error.message || 'Erreur inconnue')
    });
  }
};

// @desc    Mettre à jour un événement
// @route   PUT /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent modifier des événements'
      });
    }
    
    let event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error(error);
    
    // Gérer les erreurs de validation
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'événement'
    });
  }
};

// @desc    Supprimer un événement
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent supprimer des événements'
      });
    }
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    await event.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'événement'
    });
  }
};

// @desc    S'inscrire à un événement
// @route   POST /api/events/:id/register
// @access  Private
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // Vérifier si l'événement est approuvé
    if (event.status !== 'approuvé') {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas vous inscrire à un événement non approuvé'
      });
    }
    
    // Vérifier si l'utilisateur est déjà inscrit
    if (event.participants.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà inscrit à cet événement'
      });
    }
    
    // Ajouter l'utilisateur aux participants
    event.participants.push(req.user.id);
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Inscription réussie',
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'inscription à l\'événement'
    });
  }
};

// @desc    Se désinscrire d'un événement
// @route   DELETE /api/events/:id/register
// @access  Private
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Événement non trouvé'
      });
    }
    
    // Si un userId est fourni et que l'utilisateur est admin, désinscrire cet utilisateur
    const userIdToRemove = req.body.userId && req.user.role === 'admin' 
      ? req.body.userId 
      : req.user.id;
    
    // Vérifier si l'utilisateur est inscrit
    if (!event.participants.includes(userIdToRemove)) {
      return res.status(400).json({
        success: false,
        message: 'Cet utilisateur n\'est pas inscrit à cet événement'
      });
    }
    
    // Retirer l'utilisateur des participants
    event.participants = event.participants.filter(
      participant => participant.toString() !== userIdToRemove
    );
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Désinscription réussie',
      data: event
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la désinscription de l\'événement'
    });
  }
};