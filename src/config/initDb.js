const db = require('./database');

const initDb = () => {
    db.serialize(() => {
        // Tabela Papel
        db.run(`CREATE TABLE IF NOT EXISTS Papel (
            id_papel CHAR(3) PRIMARY KEY NOT NULL,
            nome_papel VARCHAR(25) NOT NULL
        )`);

        // Tabela Usuario
        db.run(`CREATE TABLE IF NOT EXISTS Usuario (
            id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
            senha VARCHAR(11) NOT NULL,
            nome_completo VARCHAR(50) NOT NULL,
            email VARCHAR(30) UNIQUE NOT NULL,
            data_registro DATE NOT NULL,
            perfil CHAR(3) NOT NULL,
            FOREIGN KEY (perfil) REFERENCES Papel(id_papel)
        )`);

        // Tabela Jogo
        db.run(`CREATE TABLE IF NOT EXISTS Jogo (
            id_jogo INTEGER PRIMARY KEY AUTOINCREMENT,
            data_jogo DATE NOT NULL,
            time_casa VARCHAR(30) NOT NULL,
            time_fora VARCHAR(30) NOT NULL,
            placar_casa INTEGER DEFAULT 0,
            placar_fora INTEGER DEFAULT 0,
            status VARCHAR(15) NOT NULL
        )`);

        // Tabela Denuncia
        db.run(`CREATE TABLE IF NOT EXISTS Denuncia (
            id_denuncia INTEGER PRIMARY KEY AUTOINCREMENT,
            relato_usuario VARCHAR(100) NOT NULL,
            data_registro DATE NOT NULL,
            status VARCHAR(15) NOT NULL,
            id_usuario_fk INTEGER NOT NULL,
            FOREIGN KEY (id_usuario_fk) REFERENCES Usuario(id_usuario)
        )`);

        // Dados Iniciais (Seeders)
        db.get("SELECT COUNT(*) as count FROM Papel", (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO Papel (id_papel, nome_papel) VALUES ('P01', 'Administrador'), ('P02', 'Usuario')`);
            }
        });

        db.get("SELECT COUNT(*) as count FROM Jogo", (err, row) => {
            if (row && row.count === 0) {
                db.run(`INSERT INTO Jogo (data_jogo, time_casa, time_fora, placar_casa, placar_fora, status) VALUES 
                ('2026-03-25', 'Flamengo', 'Palmeiras', 2, 1, 'Finalizado'),
                ('2026-10-04', 'Real Madrid', 'Barcelona', 3, 2, 'Finalizado')`);
            }
        });
    });
};

module.exports = initDb;
