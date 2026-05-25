const DenunciaModel = require('../models/DenunciaModel');

class DenunciaController {
    static async getAllDenuncias(req, res) {
        try {
            const denuncias = await DenunciaModel.getAll();
            res.status(200).json(denuncias);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createDenuncia(req, res) {
        try {
            const { relato_usuario, id_usuario_fk } = req.body;
            if (!relato_usuario || !id_usuario_fk) {
                return res.status(400).json({ error: "Relato e ID do usuário são obrigatórios." });
            }
            const data_registro = new Date().toISOString().split('T')[0];
            const newDenuncia = await DenunciaModel.create({ ...req.body, data_registro });
            res.status(201).json(newDenuncia);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = DenunciaController;
