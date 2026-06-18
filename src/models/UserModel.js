const prisma = require('../lib/prisma');

class UserModel {
    static async getAll() {
        return await prisma.usuario.findMany({
            include: {
                papel: true
            }
        });
    }

    static async create(data) {
        return await prisma.usuario.create({
            data: {
                senha: data.senha,
                nome_completo: data.nome_completo,
                email: data.email,
                perfil: data.perfil, // Deve ser um ID de papel existente
                data_registro: new Date()
            }
        });
    }

    static async findByEmail(email) {
        return await prisma.usuario.findUnique({
            where: { email }
        });
    }
}

module.exports = UserModel;
