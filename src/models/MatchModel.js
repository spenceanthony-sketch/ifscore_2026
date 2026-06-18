const prisma = require('../lib/prisma');

class MatchModel {
    static async getAll() {
        return await prisma.jogo.findMany({
            include: {
                estatisticas: true
            }
        });
    }

    static async create(data) {
        return await prisma.jogo.create({
            data: {
                time_casa: data.time_casa,
                time_fora: data.time_fora,
                placar_casa: data.placar_casa || 0,
                placar_fora: data.placar_fora || 0,
                data_jogo: new Date(data.data_jogo),
                status: data.status || 'Agendado'
            }
        });
    }

    static async update(id, data) {
        return await prisma.jogo.update({
            where: { id_jogo: parseInt(id) },
            data: {
                ...data,
                data_jogo: data.data_jogo ? new Date(data.data_jogo) : undefined
            }
        });
    }

    static async delete(id) {
        return await prisma.jogo.delete({
            where: { id_jogo: parseInt(id) }
        });
    }
}

module.exports = MatchModel;
