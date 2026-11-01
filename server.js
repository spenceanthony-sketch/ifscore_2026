require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const routes = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const uploadDirectory = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'matches'));
app.use('/uploads', express.static(path.dirname(uploadDirectory)));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse http://localhost:${PORT}` );
});
