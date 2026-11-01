const MatchModel = require('../models/MatchModel');

class MatchController {
  static async getAllMatches(req, res) {
    try {
      const query = req.validated?.query || { page: 1, limit: 50 };
      return res.json(await MatchModel.getAll(query));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Não foi possível listar as partidas.' });
    }
  }

  static async createMatch(req, res) {
    try {
      return res.status(201).json(await MatchModel.create(req.validated.body));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Não foi possível criar a partida.' });
    }
  }

  static async updateMatch(req, res) {
    try {
      return res.json(await MatchModel.update(req.validated.params.id, req.validated.body));
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ erro: 'Partida não encontrada.' });
      console.error(error);
      return res.status(500).json({ erro: 'Não foi possível alterar a partida.' });
    }
  }

  static async deleteMatch(req, res) {
    try {
      await MatchModel.delete(req.validated.params.id);
      return res.status(204).send();
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ erro: 'Partida não encontrada.' });
      if (error.code === 'P2003') return res.status(409).json({ erro: 'Remova as estatísticas da partida antes de excluí-la.' });
      console.error(error);
      return res.status(500).json({ erro: 'Não foi possível excluir a partida.' });
    }
  }

  static async uploadMatchFile(req, res) {
    if (!req.file) return res.status(400).json({ erro: 'Envie um arquivo no campo arquivo_partida.' });
    try {
      const arquivo = await MatchModel.replaceFile(req.validated.params.id, req.file);
      return res.status(201).json({
        mensagem: 'Arquivo da partida enviado com sucesso.',
        arquivo
      });
    } catch (error) {
      if (error.code === 'P2025') return res.status(404).json({ erro: 'Partida não encontrada.' });
      console.error(error);
      return res.status(500).json({ erro: 'Não foi possível associar o arquivo à partida.' });
    }
  }
}

module.exports = MatchController;
