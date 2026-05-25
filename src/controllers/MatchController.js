const MatchModel = require('../models/MatchModel');

class MatchController {
    static async getAllMatches(req, res) {
        try {
            const matches = await MatchModel.getAll();
            res.status(200).json(matches);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async createMatch(req, res) {
        try {
            const { time_casa, time_fora, data_jogo } = req.body;
            if (!time_casa || !time_fora || !data_jogo) {
                return res.status(400).json({ error: "Dados incompletos para criar partida." });
            }
            const newMatch = await MatchModel.create(req.body);
            res.status(201).json(newMatch);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateMatch(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updatedMatch = await MatchModel.update(id, req.body);
            if (!updatedMatch) {
                return res.status(404).json({ error: "Partida não encontrada." });
            }
            res.status(200).json(updatedMatch);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteMatch(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = await MatchModel.delete(id);
            if (!success) {
                return res.status(404).json({ error: "Partida não encontrada." });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = MatchController;
