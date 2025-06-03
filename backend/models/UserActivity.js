const mongoose = require('mongoose');

const UserActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['event', 'opportunity'],
    required: true
  },
  itemId: {
    type: mongoose.Schema.ObjectId,
    required: true,
    refPath: 'type'
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

// Définir les références dynamiques
UserActivitySchema.path('itemId').ref(function(doc) {
  return doc.type === 'event' ? 'Event' : 'Opportunity';
});

module.exports = mongoose.model('UserActivity', UserActivitySchema);