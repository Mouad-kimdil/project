const express = require('express');
const {
  getTestimonials,
  getRandomTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonials');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/random', getRandomTestimonials);

router
  .route('/')
  .get(getTestimonials)
  .post(protect, upload.single('image'), createTestimonial);

router
  .route('/:id')
  .get(getTestimonial)
  .put(protect, upload.single('image'), updateTestimonial)
  .delete(protect, deleteTestimonial);

module.exports = router;