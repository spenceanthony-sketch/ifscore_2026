const prisma = require("../lib/prisma");

class DenunciaModel {
    static async create(data) {
        return await prisma.denuncia.create({
            data: {
                relato_usuario: data.relato_usuario,
                data_registro: new Date(),
                status: data.status || "Pendente",
                id_usuario_fk: data.id_usuario_fk
            }
        });
    }

    static async getAll() {
        return await prisma.denuncia.findMany({
            include: {
                usuario: true
            }
        });
    }

    static async getById(id) {
        return await prisma.denuncia.findUnique({
            where: { id_denuncia: parseInt(id) },
            include: {
                usuario: true
            }
        });
    }

    static async update(id, data) {
        return await prisma.denuncia.update({
            where: { id_denuncia: parseInt(id) },
            data: {
                ...data,
                data_registro: data.data_registro ? new Date(data.data_registro) : undefined
            }
        });
    }

    static async delete(id) {
        return await prisma.denuncia.delete({
            where: { id_denuncia: parseInt(id) }
        });
    }
}

module.exports = DenunciaModel;
