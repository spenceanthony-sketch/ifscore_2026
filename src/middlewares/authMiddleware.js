const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { JWT_SECRET } = require('../config/auth');

function extractToken(authorization) {
  if (typeof authorization !== 'string') return null;
  const match = authorization.trim().match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  const token = match[1].trim().replace(/^['"]|['"]$/g, '');
  return token || null;
}

async function authMiddleware(req, res, next) {
  const token = extractToken(req.headers.authorization);
  if (!token) {
    return res.status(401).json({ erro: 'Autenticação obrigatória. Envie Authorization: Bearer <token>.' });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.sub) return res.status(401).json({ erro: 'Token inválido.' });
    const user = await UserModel.findById(payload.sub);
    if (!user) return res.status(401).json({ erro: 'Usuário do token não foi encontrado.' });
    req.user = user;
    req.auth = payload;
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return res.status(401).json({ erro: 'Token expirado. Faça login novamente.' });
    return res.status(401).json({ erro: 'Token inválido ou assinado com outro JWT_SECRET.' });
  }
}

module.exports = authMiddleware;
