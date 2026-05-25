const db = require('../config/database');

class DenunciaModel {
    static getAll() {
        return new Promise((resolve, reject) => {
            db.all("SELECT * FROM Denuncia", [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });
    }

    static create(data) {
        const { relato_usuario, data_registro, status, id_usuario_fk } = data;
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO Denuncia (relato_usuario, data_registro, status, id_usuario_fk) VALUES (?, ?, ?, ?)`;
            db.run(sql, [relato_usuario, data_registro, status || 'Novo', id_usuario_fk], function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, ...data });
            });
        });
    }
}

module.exports = DenunciaModel;
