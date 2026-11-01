const JWT_SECRET = process.env.JWT_SECRET || 'ifscore-dev-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET é obrigatório em produção.');
}

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
