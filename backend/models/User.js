const mongoose = require('mongoose');//Importe la biblio Mongoose pour créer des modèles et interagir avec MongoDB

const userSchema = new mongoose.Schema({//Créer un nouveau schema Mongoose nommé userSchema, qui définie la structure des documents User dans la collection MongoDB 
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  attendingEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]
});

module.exports = mongoose.model('User', userSchema);//Crée un exporte le mpdèle User basé sur ce schéma 
//Ce modèle sera utilisé pour créer ,lire,mettre à jour ou supprimer des Utilisateurs dans la base MongoDB
