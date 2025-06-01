const User = require('../models/User');//importe le modèle utilisateur pour interagir avec la base de données MongoDB 
const bcrypt = require('bcryptjs');//importe bcryptjs pour hasher(chiffrer) et comparer les mots de passe
const jwt = require('jsonwebtoken');//importe jsonwebtoken

exports.signup = async (req, res) => {//Déclare la fonction signup (exportée pour etre utilisée dans les routes)
  const { name, email, password } = req.body;//récupère les données envoyées par le client via le corps de la requete(POST)
  const hashed = await bcrypt.hash(password, 10);//Hashe le mot de passe en utilisant bcrypt avec un niveau de sécurité(salt rooiunds) de 10
  try {
    const user = await User.create({ name, email, password: hashed });//Tente de créer un nouveau utilisateur dans la base MongoDB avec les infos reçues ,enregistrant le mot de passe haché
    res.json(user);//Si tout va bien , retourne l'objet user au format JSON(sans masquer les infos ici)
  } catch (err) {
    res.status(400).json({ message: 'User already exists' });//Si une erreur se produit (ex:email déjà existant),retourne un code 400 avec un message d'erreur
  }
};

exports.login = async (req, res) => {//Déclare la fonction login ,aussi asynchrome
  const { email, password } = req.body;//récupèr l'amail et le mot de passe envoyés par l'utilisateur
  const user = await User.findOne({ email });//Cherche un utilisateur avec cet email dans la base MongoDB
  if (!user) return res.status(400).json({ message: 'User not found' });//Si aucun utilisateur trouvé,renvoie une erreur 400 avec un message "User not founed"

  const isMatch = await bcrypt.compare(password, user.password);//Compare les mot de passe fourni avec le mot de passe hashé enregistré
  if (!isMatch) return res.status(400).json({ message: 'Wrong password' });//Si les mots de passe ne correspond pas,renvois une erreur

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });//Génère un token JWT avec l'id et  le role de l'utilisateur .Le token est signé avec une clé secrète et expire dans 1 jour
  res.json({ token });//Envoie le token au client,qui pourra s'en servir pour s'authentifier sur les routes protégées
};
