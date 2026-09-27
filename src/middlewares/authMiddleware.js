const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'ifscore-dev-secret-change-in-production';

async function authMiddleware(req, res, next) {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ erro: 'Autenticação obrigatória. Envie um token Bearer.' });
  }

  try {
    const token = authorization.slice(7);
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(401).json({ erro: 'Usuário do token não foi encontrado.' });
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

module.exports = authMiddleware;