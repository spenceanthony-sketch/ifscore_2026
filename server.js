const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middlewares
app.use(morgan('dev')); // Log de requisições
app.use(cors()); // Permitir requisições de diferentes origens
app.use(bodyParser.json()); // Parse de JSON no corpo da requisição
app.use(express.static('public'))

// Armazenamento temporário em arrays (Simulando um Banco de Dados)
let matches = [
    { id: 1, team1: "Flamengo", score1: 2, team2: "Palmeiras", score2: 1, time: "18:00" },
    { id: 2, team1: "Corinthians", score1: 1, team2: "São Paulo", score2: 3, time: "21:30" },
    { id: 3, team1: "Grêmio", score1: 0, team2: "Internacional", score2: 0, time: "19:45" }
];

let players = [
    { id: 1, name: "Marcus Silva", avatar: "M", rating: 2.54, team: "Flamengo" },
    { id: 2, name: "Renan Torres", avatar: "R", rating: 1.98, team: "Palmeiras" },
    { id: 3, name: "Diego Matos", avatar: "D", rating: 1.98, team: "Corinthians" },
    { id: 4, name: "Lucas Oliveira", avatar: "L", rating: 2.10, team: "São Paulo" }
];

// --- ROTAS DA API (PADRÃO REST) ---

// 1. ROTAS DE PARTIDAS (MATCHES)

// GET - Listar todas as partidas
app.get('/api/matches', (req, res) => {
    res.status(200).json(matches);
});

// POST - Criar uma nova partida
app.post('/api/matches', (req, res) => {
    const { team1, score1, team2, score2, time } = req.body;
    
    // Validação básica
    if (!team1 || !team2 || time === undefined) {
        return res.status(400).json({ error: "Dados incompletos para criar partida." });
    }

    const newMatch = {
        id: matches.length > 0 ? matches[matches.length - 1].id + 1 : 1,
        team1,
        score1: parseInt(score1) || 0,
        team2,
        score2: parseInt(score2) || 0,
        time
    };

    matches.push(newMatch);
    res.status(201).json(newMatch);
});

// PUT - Atualizar uma partida existente
app.put('/api/matches/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { team1, score1, team2, score2, time } = req.body;
    
    const index = matches.findIndex(m => m.id === id);
    
    if (index === -1) {
        return res.status(404).json({ error: "Partida não encontrada." });
    }

    matches[index] = {
        ...matches[index],
        team1: team1 || matches[index].team1,
        score1: score1 !== undefined ? parseInt(score1) : matches[index].score1,
        team2: team2 || matches[index].team2,
        score2: score2 !== undefined ? parseInt(score2) : matches[index].score2,
        time: time || matches[index].time
    };

    res.status(200).json(matches[index]);
});

// DELETE - Remover uma partida
app.delete('/api/matches/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = matches.length;
    matches = matches.filter(m => m.id !== id);
    
    if (matches.length === initialLength) {
        return res.status(404).json({ error: "Partida não encontrada." });
    }
    
    res.status(204).send(); // Sucesso sem conteúdo
});

// 2. ROTAS DE JOGADORES (PLAYERS)

// GET - Listar todos os jogadores
app.get('/api/players', (req, res) => {
    res.status(200).json(players);
});

// POST - Criar um novo jogador
app.post('/api/players', (req, res) => {
    const { name, rating, team } = req.body;
    
    if (!name || !team) {
        return res.status(400).json({ error: "Nome e time são obrigatórios." });
    }

    const newPlayer = {
        id: players.length > 0 ? players[players.length - 1].id + 1 : 1,
        name,
        avatar: name.charAt(0).toUpperCase(),
        rating: parseFloat(rating) || 0,
        team
    };

    players.push(newPlayer);
    res.status(201).json(newPlayer);
});

// DELETE - Remover um jogador
app.delete('/api/players/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const initialLength = players.length;
    players = players.filter(p => p.id !== id);
    
    if (players.length === initialLength) {
        return res.status(404).json({ error: "Jogador não encontrado." });
    }
    
    res.status(204).send();
});

// Rota para verificar se o servidor está rodando
// app.get('/', (req, res) => {
//     res.send('API IFScore rodando com sucesso!');
// });

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
});
