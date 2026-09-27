const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  await prisma.papel.upsert({ where: { id_papel: 'P01' }, update: {}, create: { id_papel: 'P01', nome_papel: 'Administrador' } });
  await prisma.papel.upsert({ where: { id_papel: 'P02' }, update: {}, create: { id_papel: 'P02', nome_papel: 'Usuario' } });
  const senhaDemo = await bcrypt.hash('123456', 12);
  await prisma.usuario.upsert({
    where: { email: 'demo@ifscore.com' },
    update: { senha: senhaDemo, perfil: 'P01' },
    create: { nome_completo: 'Admin Demo', email: 'demo@ifscore.com', senha: senhaDemo, perfil: 'P01' }
  });
  await prisma.jogo.create({ data: { time_casa: 'Flamengo', time_fora: 'Palmeiras', placar_casa: 2, placar_fora: 1, data_jogo: new Date('2026-03-25'), status: 'Finalizado' } });
  console.log('Seed concluído com sucesso!');
}

main().catch(console.error).finally(() => prisma.$disconnect());