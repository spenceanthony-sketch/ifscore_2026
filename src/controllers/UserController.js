const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const JWT_SECRET = process.env.JWT_SECRET || 'ifscore-dev-secret-change-in-production';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(user) {
  if (!user) return null;
  const { senha, ...safeUser } = user;
  return safeUser;
}

function createToken(user) {
  return jwt.sign(
    {
      sub: user.id_usuario,
      email: user.email,
      perfil: user.perfil
    },
    JWT_SECRET,
    { expiresIn: '2h' }
  );
}

function validateCredentials({ nome_completo, email, senha }) {
  if (
    typeof nome_completo !== 'string' ||
    nome_completo.trim().length < 2 ||
    nome_completo.trim().length > 120
  ) {
    return 'O nome completo deve ter entre 2 e 120 caracteres.';
  }

  if (
    typeof email !== 'string' ||
    !EMAIL_REGEX.test(email.trim()) ||
    email.trim().length > 160
  ) {
    return 'Informe um e-mail válido.';
  }

  if (typeof senha !== 'string' || senha.length < 6 || senha.length > 128) {
    return 'A senha deve ter entre 6 e 128 caracteres.';
  }

  return null;
}

class UserController {
  static async getAllUsers(req, res) {
    try {
      const users = await UserModel.getAll();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: 'Não foi possível listar os usuários.'
      });
    }
  }

  static async createUser(req, res) {
    try {
      const payload = {
        nome_completo: req.body?.nome_completo,
        email: req.body?.email?.trim().toLowerCase(),
        senha: req.body?.senha
      };

      const validationError = validateCredentials(payload);
      if (validationError) {
        return res.status(400).json({ erro: validationError });
      }

      const existingUser = await UserModel.findByEmail(payload.email);
      if (existingUser) {
        return res.status(409).json({
          erro: 'Este e-mail já está cadastrado.'
        });
      }

      const hashedPassword = await bcrypt.hash(payload.senha, 12);
      const user = await UserModel.create({
        nome_completo: payload.nome_completo.trim(),
        email: payload.email,
        senha: hashedPassword,
        perfil: 'P02'
      });

      return res.status(201).json({
        mensagem: 'Usuário cadastrado com sucesso.',
        usuario: user
      });
    } catch (error) {
      if (error.code === 'P2002') {
        return res.status(409).json({
          erro: 'Este e-mail já está cadastrado.'
        });
      }

      console.error(error);
      return res.status(500).json({
        erro: 'Não foi possível cadastrar o usuário.'
      });
    }
  }

  static async login(req, res) {
    try {
      const email = req.body?.email?.trim().toLowerCase();
      const senha = req.body?.senha;

      if (
        typeof email !== 'string' ||
        !EMAIL_REGEX.test(email) ||
        typeof senha !== 'string' ||
        !senha
      ) {
        return res.status(400).json({
          erro: 'Informe e-mail e senha válidos.'
        });
      }

      const user = await UserModel.findByEmail(email);
      let passwordMatches = user
        ? await bcrypt.compare(senha, user.senha)
        : false;

      // Compatibilidade com bancos antigos.
      // Converte o texto legado em bcrypt no primeiro login correto.
      const isLegacyPlaintext =
        user &&
        !user.senha.startsWith('$2') &&
        user.senha === senha;

      if (isLegacyPlaintext) {
        const migratedHash = await bcrypt.hash(senha, 12);
        await UserModel.updatePassword(user.id_usuario, migratedHash);
        passwordMatches = true;
      }

      if (!user || !passwordMatches) {
        return res.status(401).json({
          erro: 'E-mail ou senha incorretos.'
        });
      }

      return res.status(200).json({
        mensagem: 'Autenticação realizada com sucesso.',
        token: createToken(user),
        usuario: publicUser(user)
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        erro: 'Não foi possível realizar a autenticação.'
      });
    }
  }

  static async me(req, res) {
    return res.status(200).json({ usuario: req.user });
  }

  static async deleteUser(req, res) {
    try {
      await UserModel.delete(req.params.id);
      return res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          erro: 'Usuário não encontrado.'
        });
      }

      console.error(error);
      return res.status(500).json({
        erro: 'Não foi possível excluir o usuário.'
      });
    }
  }
}

module.exports = UserController;
