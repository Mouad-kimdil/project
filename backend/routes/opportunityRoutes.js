const express = require('express');
const {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunityController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Routes publiques
router.get('/', getOpportunities);
router.get('/:id', getOpportunity);

// Routes protégées pour les administrateurs uniquement
router.post('/', protect, authorize('admin'), createOpportunity);
router.put('/:id', protect, authorize('admin'), updateOpportunity);
router.delete('/:id', protect, authorize('admin'), deleteOpportunity);

module.exports = router;