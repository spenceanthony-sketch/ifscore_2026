const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./src/routes');
const initDb = require('./src/config/initDb');

const app = express();
const PORT = 3000;

// Inicializa o Banco de Dados
initDb();

// Middlewares
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Rotas da API
app.use('/api', routes);

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse http://localhost:${PORT}`);
});
