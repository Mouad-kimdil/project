const jwt = require('jsonwebtoken');//importe la biblio jsonwebtoken poour pouvoir verifier et decoder les tokens JWT

const authMiddleware = (req, res, next) => {//declare une fonction middleware nommé authMiddlware
  const token = req.header('Authorization')?.split(' ')[1];//récupère le token depuis l'en-tete HTTP authorization au format Bearer <token>
  if (!token) return res.status(401).json({ message: 'No token' }); //si aucun token n'est présent ,renvoie une réponse avec code 401 Unauthorized et un message d'erreur
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);//Vérifie le token à l'aide de la clé secrète définie dans le fichier .env
    req.user = { id: decoded.id, role: decoded.role };//Ajoute les infos de l'utilisateur (id et role) dans l'objet req pour qu'elles soient accessibles dans les routes suivantes
    next();//Passe au middleware ou à la route suivante(puisque le token est valide)
  } catch (err) {//si le token est invalide ou expiré, retourne un code 401 avec un message "Invalid token"
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;//Exporte la fonction middleware pour pouvoir l'utiliser dans d'autre fichiers (comme les routes protégées)
