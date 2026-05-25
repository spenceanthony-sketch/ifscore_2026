const db = require('../config/database');

class MatchModel {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Jogo", [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static create(data) {
        const { time_casa, placar_casa, time_fora, placar_fora, data_jogo, status } = data;
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Jogo (time_casa, placar_casa, time_fora, placar_fora, data_jogo, status) VALUES (?, ?, ?, ?, ?, ?)`;
            db.run(sql, [time_casa, placar_casa || 0, time_fora, placar_fora || 0, data_jogo, status || 'Agendado'], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...data });
            });
        });
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            const { time_casa, placar_casa, time_fora, placar_fora, data_jogo, status } = data;
            const sql = `UPDATE Jogo SET time_casa = COALESCE(?, time_casa), placar_casa = COALESCE(?, placar_casa), time_fora = COALESCE(?, time_fora), placar_fora = COALESCE(?, placar_fora), data_jogo = COALESCE(?, data_jogo), status = COALESCE(?, status) WHERE id_jogo = ?`;
            db.run(sql, [time_casa, placar_casa, time_fora, placar_fora, data_jogo, status, id], function(err) {
                if (err) reject(err);
                if (this.changes === 0) resolve(null);
                resolve({ id, ...data });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Jogo WHERE id_jogo = ?", [id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}

module.exports = MatchModel;
