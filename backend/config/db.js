const mongoose = require('mongoose');//Importe la bibliothèque Mongoose 
const connectDB = async () => { //Déclare une fonction asynchrone appelée connectDB qui va gérer la connexion à MongoDB  
  try { //Essaie de connecter à MongoDB en utilisant l'URL stockée dans la variable d'env MONGO_URI 
    await mongoose.connect(process.env.MONGO_URI); //Utilisation de await 
    console.log('MongoDB connected');//Si la connexion réussit ,afficche un message de succées dans le terminal
  } catch (err) {  
    console.error(err.message);//Si une erreur se produit pendant la tentative de connexion ,connexion,affiche le message de l'erreur dans le terminal
    process.exit(1);//Arrete complétement le serveur avec un code d'erreur (1) car dans la base de données l'application ne peut pas fonctionner 
  }
};
module.exports = connectDB;//Exporte la fonction pour qu'elle puisse etre utilisée dans d'autres fichiers (comme server.js)
