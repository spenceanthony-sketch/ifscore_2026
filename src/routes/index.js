const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const UserController = require('../controllers/UserController');
const DenunciaController = require('../controllers/DenunciaController');

// Rotas de Partidas (Jogos)
router.get('/matches', MatchController.getAllMatches);
router.post('/matches', MatchController.createMatch);
router.put('/matches/:id', MatchController.updateMatch);
router.delete('/matches/:id', MatchController.deleteMatch);

// Rotas de Usuários
router.get('/users', UserController.getAllUsers);
router.post('/users', UserController.createUser);
router.delete('/users/:id', UserController.deleteUser);

// Rotas de Denúncias
router.get('/denuncias', DenunciaController.getAllDenuncias);
router.post('/denuncias', DenunciaController.createDenuncia);

module.exports = router;
