const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe, 
  getUserById,
  updateMe, 
  updatePassword,
  getUserEvents,
  getUserOpportunities
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Routes publiques
router.post('/register', registerUser);
router.post('/login', loginUser);

// Routes protégées (utilisateur connecté)
router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/updatepassword', protect, updatePassword);
router.get('/events', protect, getUserEvents);
router.get('/opportunities', protect, getUserOpportunities);

// Routes protégées (admin uniquement)
router.get('/:id', protect, authorize('admin'), getUserById);

module.exports = router;