# VolunteerHub - Plateforme de Bénévolat

## Privilèges des utilisateurs

### Utilisateur normal (rôle 'user')
- **Peut** :
  - S'inscrire et se connecter
  - Consulter son profil et modifier ses informations personnelles
  - Consulter uniquement les événements et opportunités approuvés
  - S'inscrire aux événements approuvés
  - Laisser des témoignages

- **Ne peut pas** :
  - Créer des événements ou opportunités
  - Approuver ou refuser des événements et opportunités
  - Accéder aux fonctionnalités d'administration
  - Voir les événements et opportunités en attente ou refusés

### Administrateur (rôle 'admin')
- **Peut** :
  - Créer des événements et opportunités (automatiquement approuvés)
  - Voir tous les événements et opportunités (y compris ceux en attente et refusés)
  - Modifier et supprimer tous les événements et opportunités
  - Gérer tous les utilisateurs
  - Créer d'autres administrateurs

## Flux de travail des événements et opportunités

1. **Création** :
   - Seuls les administrateurs peuvent créer des événements et opportunités
   - Les événements et opportunités créés par les administrateurs sont automatiquement approuvés

2. **Visibilité** :
   - Les utilisateurs normaux ne voient que les événements et opportunités approuvés
   - Les administrateurs voient tous les événements et opportunités

3. **Modification** :
   - Seuls les administrateurs peuvent modifier ou supprimer des événements et opportunités

## Installation et démarrage

### Prérequis
- Node.js
- MongoDB

### Installation
```bash
# Installer les dépendances du backend
cd backend
npm install

# Installer les dépendances du frontend
cd ../frontend
npm install
```

### Configuration
Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/volunteer-hub
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=30d
NODE_ENV=development
```

### Démarrage
```bash
# Démarrer le backend
cd backend
npm run dev

# Démarrer le frontend
cd ../frontend
npm run dev
```

### Scripts utiles
```bash
# Créer le premier administrateur
cd backend
npm run create-admin

# Effacer tous les utilisateurs
npm run clear-users

# Réinitialiser toute la base de données
npm run reset-db
```

## Dépannage

### Erreur ECONNRESET
Si vous rencontrez l'erreur `ECONNRESET`, essayez les solutions suivantes :

1. **Vérifiez que MongoDB est en cours d'exécution**
   ```bash
   # Vérifier le statut de MongoDB
   sudo systemctl status mongodb
   # ou sur macOS
   brew services list mongodb-community
   ```

2. **Redémarrez MongoDB**
   ```bash
   # Sur Linux
   sudo systemctl restart mongodb
   # ou sur macOS
   brew services restart mongodb-community
   ```

3. **Augmentez le délai d'attente des requêtes**
   Dans `backend/config/db.js`, modifiez les options de connexion :
   ```javascript
   const options = {
     useNewUrlParser: true,
     useUnifiedTopology: true,
     serverSelectionTimeoutMS: 10000, // Augmenter à 10 secondes
     socketTimeoutMS: 45000 // Augmenter à 45 secondes
   };
   ```

4. **Vérifiez votre connexion réseau**
   Les problèmes de réseau instable peuvent causer cette erreur.

5. **Vérifiez les logs du serveur**
   Examinez les logs du serveur backend pour identifier la source exacte de l'erreur.