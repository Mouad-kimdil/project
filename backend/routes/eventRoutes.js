const express = require('express');
const router = express.Router();
const { createEvent, getEvents } = require('../controllers/eventController'); // importer getEvents aussi
const auth = require('../middleware/auth');

// Créer un événement (POST)
router.post('/', auth, createEvent);

// Afficher tous les événements (GET)
router.get('/', auth, getEvents);

module.exports = router;
