const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/auth');
const { sendWelcomeEmail } = require('../services/emailService');

function publicUser(user) {
  if (!user) return null;
  const { senha, ...safeUser } = user;
  return safeUser;
}

function createToken(user) {
  return jwt.sign({ sub: user.id_usuario, email: user.email, perfil: user.perfil }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

class UserController {
  static async getAllUsers(req, res) {
    try { return res.json(await UserModel.getAll()); }
    catch (error) { console.error(error); return res.status(500).json({ erro: 'Não foi possível listar os usuários.' }); }
  }

  static async createUser(req, res) {
    try {
      const payload = req.validated.body;
      if (await UserModel.findByEmail(payload.email)) return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
      const hashedPassword = await bcrypt.hash(payload.senha, 12);
      const user = await UserModel.create({ nome_completo: payload.nome_completo, email: payload.email, senha: hashedPassword, perfil: 'P02' });
      // O e-mail é uma notificação secundária: falha no SMTP não desfaz o cadastro 201.
      void sendWelcomeEmail({ to: user.email, name: user.nome_completo }).catch(error => console.error('[email] Falha ao enviar boas-vindas:', error.message));
      return res.status(201).json({ mensagem: 'Usuário cadastrado com sucesso.', usuario: user });
    } catch (error) {
      if (error.code === 'P2002') return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
      console.error(error); return res.status(500).json({ erro: 'Não foi possível cadastrar o usuário.' });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.validated.body;
      const user = await UserModel.findByEmail(email);
      let passwordMatches = user ? await bcrypt.compare(senha, user.senha) : false;

      // Migração segura para bancos antigos que ainda possuem a senha em texto puro.
      // Após o primeiro login válido, somente o hash bcrypt permanece armazenado.
      const isLegacyPlaintext = user && !user.senha.startsWith('$2') && user.senha === senha;
      if (isLegacyPlaintext) {
        const migratedHash = await bcrypt.hash(senha, 12);
        await UserModel.updatePassword(user.id_usuario, migratedHash);
        passwordMatches = true;
      }

      if (!user || !passwordMatches) return res.status(401).json({ erro: 'E-mail ou senha incorretos.' });

      return res.json({ mensagem: 'Autenticação realizada com sucesso.', token: createToken(user), usuario: publicUser(user) });
    } catch (error) { console.error(error); return res.status(500).json({ erro: 'Não foi possível realizar a autenticação.' }); }
  }

  static async me(req, res) { return res.json({ usuario: req.user }); }

  static async updateUser(req, res) {
    const id = req.validated.params.id;
    const payload = req.validated.body;
    const data = { ...payload };
    if (data.senha) data.senha = await bcrypt.hash(data.senha, 12);
    try { return res.json(await UserModel.update(id, data)); }
    catch (error) {
      if (error.code === 'P2002') return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
      if (error.code === 'P2025') return res.status(404).json({ erro: 'Usuário não encontrado.' });
      console.error(error); return res.status(500).json({ erro: 'Não foi possível alterar o usuário.' });
    }
  }

  static async deleteUser(req, res) {
    const id = req.validated.params.id;
    if (id === Number(req.user.id_usuario)) return res.status(400).json({ erro: 'O administrador autenticado não pode excluir a própria conta.' });
    try { await UserModel.delete(id); return res.status(204).send(); }
    catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ erro: 'Usuário não encontrado.' });
      if (error.code === 'P2003') return res.status(409).json({ erro: 'Não é possível excluir usuário que possui registros vinculados.' });
      console.error(error); return res.status(500).json({ erro: 'Não foi possível excluir o usuário.' });
    }
  }
}

module.exports = UserController;
