const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/MatchController');
const UserController = require('../controllers/UserController');
const DenunciaController = require('../controllers/DenunciaController');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const validate = require('../middlewares/validate');
const { uploadMatchFile } = require('../middlewares/uploadMatchFile');
const {
  idParamsSchema,
  signupSchema,
  loginSchema,
  userUpdateSchema,
  matchCreateSchema,
  matchUpdateSchema,
  matchesQuerySchema,
  denunciaCreateSchema
} = require('../validation/schemas');

// Autenticação pública
router.post('/auth/signup', validate({ body: signupSchema }), UserController.createUser);
router.post('/auth/login', validate({ body: loginSchema }), UserController.login);

// Usuário autenticado
router.get('/auth/me', authMiddleware, UserController.me);

// Usuários: listagem e exclusão são operações administrativas protegidas
router.get('/users', authMiddleware, adminMiddleware, UserController.getAllUsers);
router.put('/users/:id', authMiddleware, adminMiddleware, validate({ params: idParamsSchema, body: userUpdateSchema }), UserController.updateUser);
router.delete('/users/:id', authMiddleware, adminMiddleware, validate({ params: idParamsSchema }), UserController.deleteUser);

// Partidas: leitura pública; escrita protegida
router.get('/matches', validate({ query: matchesQuerySchema }), MatchController.getAllMatches);
router.post('/matches', authMiddleware, adminMiddleware, validate({ body: matchCreateSchema }), MatchController.createMatch);
router.put('/matches/:id', authMiddleware, adminMiddleware, validate({ params: idParamsSchema, body: matchUpdateSchema }), MatchController.updateMatch);
router.delete('/matches/:id', authMiddleware, adminMiddleware, validate({ params: idParamsSchema }), MatchController.deleteMatch);
// Auth/admin/validate executam antes do Multer: sem token o arquivo nem é processado.
router.post('/matches/:id/arquivo', authMiddleware, adminMiddleware, validate({ params: idParamsSchema }), uploadMatchFile.single('arquivo_partida'), MatchController.uploadMatchFile);
router.put('/matches/:id/arquivo', authMiddleware, adminMiddleware, validate({ params: idParamsSchema }), uploadMatchFile.single('arquivo_partida'), MatchController.uploadMatchFile);

// Denúncias exigem identidade autenticada
router.get('/denuncias', authMiddleware, DenunciaController.getAllDenuncias);
router.post('/denuncias', authMiddleware, validate({ body: denunciaCreateSchema }), DenunciaController.createDenuncia);

module.exports = router;
