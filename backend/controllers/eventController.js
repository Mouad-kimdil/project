const Event = require('../models/Event'); 

// Créer un événement
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;

    if (!title || !date) {
      return res.status(400).json({ message: 'Titre et date sont obligatoires.' });
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      createdBy: req.user.id
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Erreur lors de la création de l\'événement :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Afficher tous les événements
const getEvents = async (req, res) => {
  try {
    const events = await Event.find(); // Récupère tous les événements
    res.json(events);
  } catch (error) {
    console.error('Erreur lors de la récupération des événements :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  createEvent,
  getEvents
};
