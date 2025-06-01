const express = require('express');//Importe Express
const router = express.Router();//Crée un routeur Express pour y attacher des routes spécifiques à l'authentification(signup,login)
const { signup, login } = require('../controllers/authController');//importe les fonctions signup et login depuis le fichier autheController.js.Ces fonctions seront appelées quand un uutilisateur s'inscrit ou se connecte

router.post('/signup', signup);//Définit la route POST/signup 
router.post('/login', login);//Définit la route/login 

module.exports = router;//exporte le routeur pour qu'il soit utilisée dans le fichier principal server.js
