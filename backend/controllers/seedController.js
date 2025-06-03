const User = require('../models/User');
const Opportunity = require('../models/Opportunity');
const Event = require('../models/Event');
const Feedback = require('../models/Feedback');
const UserActivity = require('../models/UserActivity');
const mongoose = require('mongoose');

// Données initiales
const initialData = require('../data/initialData.json');

// @desc    Remplir la base de données avec des données initiales
// @route   POST /api/seed
// @access  Public (en développement uniquement)
exports.seedDatabase = async (req, res) => {
  try {
    // Vérifier si nous sommes en mode développement
    if (process.env.NODE_ENV !== 'development') {
      return res.status(403).json({ 
        success: false, 
        message: 'Cette opération n\'est autorisée qu\'en mode développement' 
      });
    }

    // Vider les collections existantes
    await User.deleteMany({});
    await Opportunity.deleteMany({});
    await Event.deleteMany({});
    await Feedback.deleteMany({});
    await UserActivity.deleteMany({});

    console.log('Collections vidées avec succès');

    // Préparer les utilisateurs en supprimant les IDs personnalisés
    const usersToInsert = initialData.users.map(user => {
      // Créer une copie sans l'ID personnalisé
      const { id, ...userWithoutCustomId } = user;
      return userWithoutCustomId;
    });

    // Insérer les utilisateurs
    const users = await User.create(usersToInsert);
    console.log(`${users.length} utilisateurs insérés`);

    // Mapper les IDs des utilisateurs
    const userIdMap = {};
    users.forEach((user, index) => {
      const originalId = initialData.users[index].id;
      userIdMap[originalId] = user._id;
    });

    // Préparer les opportunités
    const opportunitiesToInsert = initialData.opportunities.map(opp => {
      // Supprimer l'ID personnalisé et remplacer createdBy par l'ID MongoDB
      const { id, createdBy, ...oppWithoutCustomId } = opp;
      return {
        ...oppWithoutCustomId,
        createdBy: userIdMap[createdBy]
      };
    });

    // Insérer les opportunités
    const opportunities = await Opportunity.create(opportunitiesToInsert);
    console.log(`${opportunities.length} opportunités insérées`);

    // Mapper les IDs des opportunités
    const opportunityIdMap = {};
    opportunities.forEach((opp, index) => {
      const originalId = initialData.opportunities[index].id;
      opportunityIdMap[originalId] = opp._id;
    });

    // Préparer les événements
    const eventsToInsert = initialData.events.map(evt => {
      // Supprimer l'ID personnalisé et remplacer createdBy par l'ID MongoDB
      const { id, createdBy, ...evtWithoutCustomId } = evt;
      return {
        ...evtWithoutCustomId,
        createdBy: userIdMap[createdBy]
      };
    });

    // Insérer les événements
    const events = await Event.create(eventsToInsert);
    console.log(`${events.length} événements insérés`);

    // Mapper les IDs des événements
    const eventIdMap = {};
    events.forEach((evt, index) => {
      const originalId = initialData.events[index].id;
      eventIdMap[originalId] = evt._id;
    });

    // Préparer les témoignages
    const feedbackToInsert = initialData.feedback.map(fb => {
      // Supprimer l'ID personnalisé et remplacer userId par l'ID MongoDB
      const { id, userId, ...fbWithoutCustomId } = fb;
      return {
        ...fbWithoutCustomId,
        userId: userIdMap[userId]
      };
    });

    // Insérer les témoignages
    const feedback = await Feedback.create(feedbackToInsert);
    console.log(`${feedback.length} témoignages insérés`);

    // Préparer les activités des utilisateurs
    const activitiesToInsert = initialData.userActivities.map(activity => {
      // Supprimer l'ID personnalisé et remplacer les IDs par les IDs MongoDB
      const { id, userId, itemId, type, ...activityWithoutCustomId } = activity;
      
      // Déterminer l'ID de l'élément (événement ou opportunité)
      const mappedItemId = type === 'event' 
        ? eventIdMap[itemId] 
        : opportunityIdMap[itemId];

      return {
        ...activityWithoutCustomId,
        userId: userIdMap[userId],
        itemId: mappedItemId,
        type
      };
    });

    // Insérer les activités des utilisateurs
    const activities = await UserActivity.create(activitiesToInsert);
    console.log(`${activities.length} activités utilisateur insérées`);

    res.status(200).json({
      success: true,
      message: 'Base de données remplie avec succès',
      data: {
        users: users.length,
        opportunities: opportunities.length,
        events: events.length,
        feedback: feedback.length,
        activities: activities.length
      }
    });
  } catch (error) {
    console.error('Erreur lors du remplissage de la base de données:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du remplissage de la base de données',
      error: error.message
    });
  }
};