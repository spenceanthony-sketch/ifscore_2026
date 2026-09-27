const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const UserController = require('../controllers/UserController');
const DenunciaController = require('../controllers/DenunciaController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/auth/signup', UserController.createUser);
router.post('/auth/login', UserController.login);
router.get('/auth/me', authMiddleware, UserController.me);

router.get('/users', authMiddleware, UserController.getAllUsers);
router.delete('/users/:id', authMiddleware, UserController.deleteUser);

router.get('/matches', MatchController.getAllMatches);
router.post('/matches', authMiddleware, MatchController.createMatch);
router.put('/matches/:id', authMiddleware, MatchController.updateMatch);
router.delete('/matches/:id', authMiddleware, MatchController.deleteMatch);

router.get('/denuncias', authMiddleware, DenunciaController.getAllDenuncias);
router.post('/denuncias', authMiddleware, DenunciaController.createDenuncia);

module.exports = router;