const mongoose = require('mongoose');

const OpportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Veuillez ajouter un titre'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  organization: {
    type: String,
    required: [true, 'Veuillez ajouter une organisation'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Veuillez ajouter un lieu']
  },
  category: {
    type: String,
    required: [true, 'Veuillez ajouter une catégorie'],
    enum: [
      'Environnement',
      'Éducation',
      'Services sociaux',
      'Santé',
      'Protection des animaux',
      'Développement communautaire',
      'Arts et culture',
      'Réponse aux crises',
      'Services à la jeunesse',
      'Soutien aux aînés'
    ]
  },
  commitment: {
    type: String,
    required: [true, 'Veuillez ajouter un engagement de temps']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description']
  },
  requirements: {
    type: String,
    default: ''
  },
  skills: {
    type: [String],
    default: []
  },
  contactEmail: {
    type: String,
    required: [true, 'Veuillez ajouter un email de contact'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez ajouter un email valide'
    ]
  },
  contactPhone: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
  },
  hours: {
    type: Number,
    required: [true, 'Veuillez ajouter le nombre d\'heures'],
    min: [1, 'Le nombre d\'heures doit être au moins 1']
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  // Ajout du statut pour permettre l'approbation ou le refus
  status: {
    type: String,
    enum: ['en attente', 'approuvé', 'refusé'],
    default: 'en attente'
  },
  // Ajout de l'utilisateur qui a approuvé/refusé l'opportunité
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  // Date d'approbation/refus
  statusUpdatedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Opportunity', OpportunitySchema);