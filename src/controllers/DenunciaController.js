const DenunciaModel = require('../models/DenunciaModel');

class DenunciaController {
  static async getAllDenuncias(req, res) {
    try { return res.json(await DenunciaModel.getAll()); }
    catch (error) { console.error(error); return res.status(500).json({ erro: 'Não foi possível listar as denúncias.' }); }
  }

  static async createDenuncia(req, res) {
    try {
      const denuncia = await DenunciaModel.create({ ...req.validated.body, id_usuario_fk: req.user.id_usuario });
      return res.status(201).json(denuncia);
    } catch (error) {
      console.error(error); return res.status(500).json({ erro: 'Não foi possível criar a denúncia.' });
    }
  }
}

module.exports = DenunciaController;
