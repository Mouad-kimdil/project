const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Veuillez ajouter un titre'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  date: {
    type: Date,
    required: [true, 'Veuillez ajouter une date']
  },
  startTime: {
    type: String,
    required: [true, 'Veuillez ajouter une heure de début']
  },
  endTime: {
    type: String,
    required: [true, 'Veuillez ajouter une heure de fin']
  },
  location: {
    type: String,
    required: [true, 'Veuillez ajouter un lieu']
  },
  organizer: {
    type: String,
    required: [true, 'Veuillez ajouter un organisateur']
  },
  description: {
    type: String,
    required: [true, 'Veuillez ajouter une description']
  },
  contactEmail: {
    type: String,
    required: [true, 'Veuillez ajouter un email de contact'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Veuillez ajouter un email valide'
    ]
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60'
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
  // Ajout de l'utilisateur qui a approuvé/refusé l'événement
  approvedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  // Date d'approbation/refus
  statusUpdatedAt: {
    type: Date
  },
  participants: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Event', EventSchema);