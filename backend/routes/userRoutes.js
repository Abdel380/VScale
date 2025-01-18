const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Route pour créer un utilisateur
router.post('/register', userController.createUser);

// Route pour connecter un utilisateur  / On stocke aussi les données non sensible dans le cache sous forme d'objet
router.post('/login', userController.loginUser);
router.post('/getUserCode', userController.getUserCode);


router.post('/actualizeAccount', userController.accountActualizer);

// Route pour mettre à jour les champs liés à l'API (p_access_token, p_temp_token, p_user_id)
// router.put('/:id/api-data', userController.updateAPIUserData);

module.exports = router;
