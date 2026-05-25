const UserModel = require('../models/UserModel');

class UserController {
    static async getAllUsers(req, res) {
        try {
            const users = await UserModel.getAll();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createUser(req, res) {
        try {
            const { senha, nome_completo, email, data_registro, perfil } = req.body;
            if (!senha || !nome_completo || !email || !perfil) {
                return res.status(400).json({ error: "Dados obrigatórios ausentes." });
            }
            const newUser = await UserModel.create(req.body);
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteUser(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await UserModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: "Usuário não encontrado." });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = UserController;
