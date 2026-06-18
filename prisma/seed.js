const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // Seed de Papéis
    await prisma.papel.upsert({
        where: { id_papel: 'P01' },
        update: {},
        create: { id_papel: 'P01', nome_papel: 'Administrador' }
    });
    await prisma.papel.upsert({
        where: { id_papel: 'P02' },
        update: {},
        create: { id_papel: 'P02', nome_papel: 'Usuario' }
    });

    // Seed de Usuário Demo
    await prisma.usuario.upsert({
        where: { email: 'demo@ifscore.com' },
        update: {},
        create: {
            nome_completo: 'Admin Demo',
            email: 'demo@ifscore.com',
            senha: '123456',
            perfil: 'P01'
        }
    });

    // Seed de Jogo Inicial
    await prisma.jogo.create({
        data: {
            time_casa: 'Flamengo',
            time_fora: 'Palmeiras',
            placar_casa: 2,
            placar_fora: 1,
            data_jogo: new Date('2026-03-25'),
            status: 'Finalizado'
        }
    });

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
