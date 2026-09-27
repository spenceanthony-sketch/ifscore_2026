const prisma = require('../lib/prisma');

const publicUserSelect = {
  id_usuario: true,
  nome_completo: true,
  email: true,
  data_registro: true,
  perfil: true,
  papel: { select: { id_papel: true, nome_papel: true } }
};

class UserModel {
  static async getAll() {
    return prisma.usuario.findMany({
      select: publicUserSelect,
      orderBy: { id_usuario: 'asc' }
    });
  }

  static async create(data) {
    return prisma.usuario.create({
      data: {
        senha: data.senha,
        nome_completo: data.nome_completo,
        email: data.email,
        perfil: data.perfil || 'P02'
      },
      select: publicUserSelect
    });
  }

  static async findByEmail(email) {
    return prisma.usuario.findUnique({
      where: { email },
      include: { papel: true }
    });
  }

  static async findById(id) {
    return prisma.usuario.findUnique({
      where: { id_usuario: Number(id) },
      select: publicUserSelect
    });
  }

  // Usado para converter senhas antigas em texto puro para bcrypt. Usado para primeira conta test "Adm Demo"
  static async updatePassword(id, senha) {
    return prisma.usuario.update({
      where: { id_usuario: Number(id) },
      data: { senha }
    });
  }

  static async delete(id) {
    return prisma.usuario.delete({
      where: { id_usuario: Number(id) }
    });
  }
}

module.exports = UserModel;