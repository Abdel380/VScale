const express = require('express');
const { createGoal, getGoals, updateGoal, deleteGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware'); // Middleware d'authentification

const router = express.Router();

// Routes pour les objectifs financiers
router.post('/', createGoal);    // Créer un objectif
router.get('/', getGoals);      // Récupérer les objectifs de l'utilisateur
router.put('/:id', updateGoal); // Mettre à jour un objectif
router.delete('/:id', deleteGoal); // Supprimer un objectif

module.exports = router;