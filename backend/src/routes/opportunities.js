const express = require('express');
const {
  getOpportunities,
  getOpportunity,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity
} = require('../controllers/opportunities');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router
  .route('/')
  .get(getOpportunities)
  .post(protect, upload.single('image'), createOpportunity);

router
  .route('/:id')
  .get(getOpportunity)
  .put(protect, upload.single('image'), updateOpportunity)
  .delete(protect, deleteOpportunity);

module.exports = router;