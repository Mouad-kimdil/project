const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter un nom']
  },
  role: {
    type: String,
    required: [true, 'Veuillez ajouter un rôle']
  },
  image: {
    type: String,
    default: 'https://randomuser.me/api/portraits/lego/1.jpg'
  },
  quote: {
    type: String,
    required: [true, 'Veuillez ajouter un témoignage'],
    maxlength: [500, 'Le témoignage ne peut pas dépasser 500 caractères']
  },
  project: {
    type: String,
    required: [true, 'Veuillez ajouter un projet']
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);