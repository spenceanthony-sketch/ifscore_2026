const prisma = require('../lib/prisma');

class DenunciaModel {
  static async create(data) {
    return prisma.denuncia.create({
      data: { relato_usuario: data.relato_usuario, status: data.status || 'Pendente', id_usuario_fk: Number(data.id_usuario_fk) },
      include: { usuario: { select: { id_usuario: true, nome_completo: true, email: true } } }
    });
  }

  static async getAll() {
    return prisma.denuncia.findMany({
      include: { usuario: { select: { id_usuario: true, nome_completo: true, email: true } } },
      orderBy: { data_registro: 'desc' }
    });
  }
}

module.exports = DenunciaModel;
