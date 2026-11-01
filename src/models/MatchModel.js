const prisma = require('../lib/prisma');
const fs = require('fs/promises');
const path = require('path');

const matchSelect = {
  id_jogo: true,
  data_jogo: true,
  time_casa: true,
  time_fora: true,
  placar_casa: true,
  placar_fora: true,
  status: true,
  estatisticas: true
  , arquivo: {
    select: {
      id_arquivo: true,
      nome_original: true,
      caminho_publico: true,
      mime_type: true,
      tamanho_bytes: true,
      data_upload: true
    }
  }
};

const uploadDir = path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads', 'matches'));

class MatchModel {
  static async getAll({ status, page = 1, limit = 50 } = {}) {
    return prisma.jogo.findMany({
      select: matchSelect,
      where: status ? { status } : undefined,
      orderBy: { data_jogo: 'asc' },
      skip: (page - 1) * limit,
      take: limit
    });
  }

  static async findById(id) {
    return prisma.jogo.findUnique({
      where: { id_jogo: Number(id) },
      select: matchSelect
    });
  }

  static async create(data) {
    return prisma.jogo.create({
      data: {
        time_casa: data.time_casa,
        time_fora: data.time_fora,
        placar_casa: data.placar_casa ?? 0,
        placar_fora: data.placar_fora ?? 0,
        data_jogo: new Date(data.data_jogo),
        status: data.status || 'Agendado'
      },
      select: matchSelect
    });
  }

  static async update(id, data) {
    const updateData = {};
    for (const field of ['time_casa', 'time_fora', 'placar_casa', 'placar_fora', 'status']) {
      if (data[field] !== undefined) updateData[field] = data[field];
    }
    if (data.data_jogo !== undefined) updateData.data_jogo = new Date(data.data_jogo);

    return prisma.jogo.update({
      where: { id_jogo: Number(id) },
      data: updateData,
      select: matchSelect
    });
  }

  static async delete(id) {
    const match = await prisma.jogo.findUnique({ where: { id_jogo: Number(id) }, include: { arquivo: true } });
    if (!match) {
      const error = new Error('Partida não encontrada.');
      error.code = 'P2025';
      throw error;
    }
    const deleted = await prisma.jogo.delete({ where: { id_jogo: Number(id) } });
    if (match.arquivo?.nome_servidor) await fs.rm(path.join(uploadDir, match.arquivo.nome_servidor), { force: true });
    return deleted;
  }

  static async replaceFile(id, file) {
    const match = await prisma.jogo.findUnique({ where: { id_jogo: Number(id) }, include: { arquivo: true } });
    if (!match) {
      const error = new Error('Partida não encontrada.');
      error.code = 'P2025';
      throw error;
    }
    const caminho_publico = `/uploads/matches/${file.filename}`;
    try {
      const saved = await prisma.arquivoPartida.upsert({
        where: { id_jogo: Number(id) },
        create: {
          nome_original: path.basename(file.originalname),
          nome_servidor: file.filename,
          caminho_publico,
          mime_type: file.mimetype,
          tamanho_bytes: file.size,
          id_jogo: Number(id)
        },
        update: {
          nome_original: path.basename(file.originalname),
          nome_servidor: file.filename,
          caminho_publico,
          mime_type: file.mimetype,
          tamanho_bytes: file.size,
          data_upload: new Date()
        }
      });
      if (match.arquivo?.nome_servidor && match.arquivo.nome_servidor !== file.filename) {
        await fs.rm(path.join(uploadDir, match.arquivo.nome_servidor), { force: true });
      }
      return saved;
    } catch (error) {
      await fs.rm(file.path, { force: true });
      throw error;
    }
  }
}

module.exports = MatchModel;
