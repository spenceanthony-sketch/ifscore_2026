function adminMiddleware(req, res, next) {
  if (!req.user || req.user.perfil !== 'P01') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
  }
  return next();
}

module.exports = adminMiddleware;
