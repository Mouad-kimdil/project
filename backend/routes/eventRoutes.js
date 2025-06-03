const express = require('express');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventParticipants,
  removeParticipant
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getEvents);
router.get('/:id', getEvent);

// Routes protégées pour les administrateurs uniquement
router.post('/', protect, authorize('admin'), createEvent);
router.put('/:id', protect, authorize('admin'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

// Routes pour la gestion des participants (admin uniquement)
router.get('/:id/participants', protect, authorize('admin'), getEventParticipants);
router.delete('/:id/participants/:userId', protect, authorize('admin'), removeParticipant);

// Routes pour s'inscrire/se désinscrire à un événement (pour tous les utilisateurs)
router.post('/:id/register', protect, registerForEvent);
router.delete('/:id/register', protect, unregisterFromEvent);

module.exports = router;