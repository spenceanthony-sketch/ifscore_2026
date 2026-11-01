const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'matches'));
const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/gif']);
const extensionByMime = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif'
};

fs.mkdirSync(uploadDir, { recursive: true });

class UploadValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UploadValidationError';
    this.status = 400;
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const extension = extensionByMime[file.mimetype];
    cb(null, `${crypto.randomUUID()}${extension}`);
  }
});

const fileFilter = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    return cb(new UploadValidationError('Tipo de arquivo não permitido. Envie uma imagem JPEG, PNG ou GIF.'));
  }
  return cb(null, true);
};

const uploadMatchFile = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }
});

module.exports = {
  uploadMatchFile,
  UploadValidationError,
  uploadDir,
  allowedMimeTypes
};
