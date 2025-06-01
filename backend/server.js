const express = require('express'); //importe le freamwork express
const cors = require('cors');//importe le module CROS 
const dotenv = require('dotenv');//importe dotenv pour lire les variables d'environnement definis dans le fichier .env
const connectDB = require('./config/db');//importe la fonction de connexion à la base de données MongoDB 

dotenv.config();//charge les variables d'env
connectDB(); //etablir la connexion avec la base de données MongoDB

const app = express();//Créer une instance de l'application Express
app.use(cors());//Autorise toutes les origines à accéder à L'API 
app.use(express.json());//permet au serveur de lire les données JSON envoyées dans les requetes (POST , PUT)

// Routes
//Importe les routes d'authentification et les routes d'événements
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

//Utilise les routes /api/auth pour les utilisateurs (inscription,connexion...)
//Utilise /api/events pour les événements (création,consultation,etc)
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

const PORT = process.env.PORT || 5000;//définit le port sur lequel le serveur va écouter (depuiss .env ou 5000 par défaut)
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); //Démarre le serveur et affiche un message dans le terminal pour confirmer qu'il fonctionne 
