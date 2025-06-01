const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({//Crée un nouveau schéma Mogoose nommé eventSchema,qui definie la structure des documents Event dans la collection MongoDB
  name: String,
  description: String,
  location: String,
  date: Date,
  requiredVolunteers: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  interestedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],//tableau
  selectedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]//tableau
});

module.exports = mongoose.model('Event', eventSchema);//Crée et exporte le modèle Event basé sur ce schéma 
 