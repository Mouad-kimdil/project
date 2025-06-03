const express = require('express');
const { seedDatabase } = require('../controllers/seedController');

const router = express.Router();

// Route pour remplir la base de données avec des données initiales
router.post('/', seedDatabase);

module.exports = router;