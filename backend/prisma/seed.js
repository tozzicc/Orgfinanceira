const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
    { name: 'Alimentação', type: 'expense' },
    { name: 'Transporte', type: 'expense' },
    { name: 'Moradia', type: 'expense' },
    { name: 'Saúde', type: 'expense' },
    { name: 'Educação', type: 'expense' },
    { name: 'Lazer', type: 'expense' },
    { name: 'Salário', type: 'income' },
    { name: 'Rendimentos', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Ações', type: 'investment' },
    { name: 'Fundos', type: 'investment' },
    { name: 'Criptomoedas', type: 'investment' },
];

async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@financeiro.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Administrador';

    console.log('🌱 Criando usuário administrador...');

    const hash = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: { name: adminName, email: adminEmail, password: hash, role: 'admin', active: true },
    });

    console.log(`  ✓ Admin criado: ${admin.email}`);
    console.log(`    Email: ${adminEmail}`);
    console.log(`    Senha: ${adminPassword}`);
    console.log('');
    console.log('✅ Seed concluído!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e.message);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
