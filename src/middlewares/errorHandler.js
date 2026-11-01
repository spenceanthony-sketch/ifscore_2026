const { ZodError } = require('zod');
const fs = require('fs');
const multer = require('multer');

function errorHandler(error, req, res, next) {
  if (req.file?.path && error) {
    fs.rm(req.file.path, { force: true }, () => {});
  }
  if (error?.name === 'UploadValidationError') {
    return res.status(400).json({ erro: error.message });
  }
  if (error instanceof multer.MulterError) {
    const message = error.code === 'LIMIT_FILE_SIZE'
      ? 'O arquivo excede o limite máximo de 2 MB.'
      : error.code === 'LIMIT_UNEXPECTED_FILE'
        ? 'Envie apenas um arquivo no campo arquivo_partida.'
        : 'Não foi possível processar o upload.';
    return res.status(400).json({ erro: message });
  }
  if (error instanceof ZodError || error?.name === 'ZodError') {
    return res.status(400).json({
      erro: 'Dados inválidos.',
      issues: error.issues.map(issue => ({ path: issue.path, message: issue.message }))
    });
  }
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ erro: 'JSON inválido.', issues: [{ path: [], message: 'O corpo da requisição deve conter JSON válido.' }] });
  }
  if (error?.code === 'P2002') return res.status(409).json({ erro: 'Conflito: o valor informado já está cadastrado.' });
  if (error?.code === 'P2025') return res.status(404).json({ erro: 'Recurso não encontrado.' });
  console.error('[api-error]', error);
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
}

module.exports = errorHandler;
