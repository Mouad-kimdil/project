/**
 * Fichier principal du serveur backend
 * Ce fichier configure et démarre le serveur Express qui gère notre API
 */
const express = require('express'); // Framework web pour Node.js qui simplifie la création d'API
const dotenv = require('dotenv'); // Module pour charger les variables d'environnement depuis un fichier .env
const cors = require('cors'); // Middleware pour permettre les requêtes cross-origin (depuis d'autres domaines)
const connectDB = require('./config/db'); // Fonction personnalisée pour se connecter à MongoDB
const path = require('path'); // Module Node.js pour manipuler les chemins de fichiers

// Charger les variables d'environnement depuis le fichier .env
// Ces variables contiennent des informations sensibles comme les identifiants de base de données
dotenv.config({ path: './config/.env' });

// Connecter à la base de données MongoDB
// Cette fonction est définie dans le fichier config/db.js
connectDB();

// Initialiser l'application Express
// Express est un framework qui facilite la création d'API web en Node.js
const app = express();

// Middleware pour parser le corps des requêtes JSON
// Cela permet de lire les données JSON envoyées par le client (par exemple lors d'un POST)
// La limite de 50MB permet de gérer des fichiers volumineux comme les images en base64
app.use(express.json({ limit: '50mb' }));

// Middleware pour parser les données de formulaire URL-encoded
// Cela permet de lire les données envoyées via des formulaires HTML
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware pour activer CORS (Cross-Origin Resource Sharing)
// Cela permet au frontend (qui s'exécute sur un autre port) d'accéder à notre API
app.use(cors());

// Configuration pour servir les fichiers statiques depuis le dossier 'public'
// Cela permet d'accéder aux fichiers comme les images via une URL directe
app.use(express.static(path.join(__dirname, 'public')));

// Importation des fichiers de routes
// Chaque fichier contient un groupe de routes liées à une fonctionnalité spécifique
const userRoutes = require('./routes/userRoutes'); // Routes pour la gestion des utilisateurs
const eventRoutes = require('./routes/eventRoutes'); // Routes pour la gestion des événements
const opportunityRoutes = require('./routes/opportunityRoutes'); // Routes pour la gestion des opportunités
const testimonialRoutes = require('./routes/testimonialRoutes'); // Routes pour la gestion des témoignages

// Configuration des routes API
// Chaque groupe de routes est associé à un préfixe d'URL
app.use('/api/users', userRoutes); // Toutes les routes utilisateur commencent par /api/users
app.use('/api/events', eventRoutes); // Toutes les routes événement commencent par /api/events
app.use('/api/opportunities', opportunityRoutes); // Toutes les routes opportunité commencent par /api/opportunities
app.use('/api/testimonials', testimonialRoutes); // Toutes les routes témoignage commencent par /api/testimonials

// Route de base pour tester si l'API fonctionne
// Cette route simple permet de vérifier que le serveur est en cours d'exécution
app.get('/', (req, res) => {
  res.send('API est en cours d\'exécution...'); // Envoie un message texte simple
});

// Définir le port d'écoute
// Utilise la variable d'environnement PORT ou 5001 par défaut
const PORT = process.env.PORT || 5001;

// Démarrer le serveur HTTP
// Le serveur commence à écouter les requêtes sur le port spécifié
const server = app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});

// Gestion des rejets de promesse non gérées
// Cela évite que le serveur plante silencieusement en cas d'erreur non gérée
process.on('unhandledRejection', (err, promise) => {
  console.log(`Erreur: ${err.message}`); // Affiche le message d'erreur
  // Fermer le serveur proprement et quitter le processus avec un code d'erreur
  server.close(() => process.exit(1));
});