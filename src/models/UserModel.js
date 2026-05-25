const db = require('../config/database');

class UserModel {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT id_usuario, nome_completo, email, data_registro, perfil FROM Usuario", [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static create(data) {
        const { senha, nome_completo, email, data_registro, perfil } = data;
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Usuario (senha, nome_completo, email, data_registro, perfil) VALUES (?, ?, ?, ?, ?)`;
            db.run(sql, [senha, nome_completo, email, data_registro, perfil], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, nome_completo, email, perfil });
            });
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run("DELETE FROM Usuario WHERE id_usuario = ?", [id], function(err) {
                if (err) reject(err);
                resolve(this.changes > 0);
            });
        });
    }
}

module.exports = UserModel;
