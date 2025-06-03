const Opportunity = require('../models/Opportunity');
const User = require('../models/User');

// @desc    Obtenir toutes les opportunités
// @route   GET /api/opportunities
// @access  Public
exports.getOpportunities = async (req, res) => {
  try {
    // Filtrer les opportunités en fonction du rôle de l'utilisateur
    let query = {};
    
    // Si l'utilisateur n'est pas admin, ne montrer que les opportunités approuvées
    if (!req.user || req.user.role !== 'admin') {
      query = { status: 'approuvé' };
    }
    // Si l'utilisateur est admin, montrer toutes les opportunités (pas de filtre)

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const opportunities = await Opportunity.find(query)
      .sort({ createdAt: -1 }) // Trier par date de création décroissante
      .skip(startIndex)
      .limit(limit)
      .populate('createdBy', 'firstName lastName');
    
    const total = await Opportunity.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: opportunities.length,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit)
      },
      data: opportunities
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des opportunités'
    });
  }
};

// @desc    Obtenir une opportunité par ID
// @route   GET /api/opportunities/:id
// @access  Public
exports.getOpportunity = async (req, res) => {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate('createdBy', 'firstName lastName');
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunité non trouvée'
      });
    }
    
    // Vérifier si l'utilisateur peut voir cette opportunité
    if (opportunity.status !== 'approuvé' && (!req.user || req.user.role !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'Non autorisé à accéder à cette opportunité'
      });
    }
    
    res.status(200).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'opportunité'
    });
  }
};

// @desc    Créer une nouvelle opportunité
// @route   POST /api/opportunities
// @access  Private/Admin
exports.createOpportunity = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent créer des opportunités'
      });
    }
    
    // Afficher les données reçues pour le débogage
    console.log('Données reçues pour la création d\'opportunité:', req.body);
    
    // Ajouter l'utilisateur comme créateur de l'opportunité
    req.body.createdBy = req.user.id;
    
    // Les opportunités créées par les admins sont automatiquement approuvées
    req.body.status = 'approuvé';
    req.body.approvedBy = req.user.id;
    req.body.statusUpdatedAt = Date.now();
    
    // Vérifier que tous les champs requis sont présents
    const requiredFields = ['title', 'organization', 'location', 'category', 'commitment', 'description', 'contactEmail', 'hours'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Champs manquants: ${missingFields.join(', ')}`
      });
    }
    
    const opportunity = await Opportunity.create(req.body);
    
    res.status(201).json({
      success: true,
      data: opportunity
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'opportunité:', error);
    
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
      message: 'Erreur lors de la création de l\'opportunité: ' + (error.message || 'Erreur inconnue')
    });
  }
};

// @desc    Mettre à jour une opportunité
// @route   PUT /api/opportunities/:id
// @access  Private/Admin
exports.updateOpportunity = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent modifier des opportunités'
      });
    }
    
    let opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunité non trouvée'
      });
    }
    
    opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: opportunity
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
      message: 'Erreur lors de la mise à jour de l\'opportunité'
    });
  }
};

// @desc    Supprimer une opportunité
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
exports.deleteOpportunity = async (req, res) => {
  try {
    // Vérifier si l'utilisateur est admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Seuls les administrateurs peuvent supprimer des opportunités'
      });
    }
    
    const opportunity = await Opportunity.findById(req.params.id);
    
    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunité non trouvée'
      });
    }
    
    await opportunity.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'opportunité'
    });
  }
};