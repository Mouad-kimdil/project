const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Placeholder routes for testimonials
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    data: []
  });
});

module.exports = router;