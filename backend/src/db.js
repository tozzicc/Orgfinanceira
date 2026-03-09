const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development'
        ? ['query', 'info', 'warn', 'error']
        : ['error'],
});

// Teste de conexão ao iniciar
prisma.$connect()
    .then(() => console.log('✅ Prisma conectado ao PostgreSQL!'))
    .catch((err) => console.error('❌ Erro ao conectar via Prisma:', err.message));

module.exports = prisma;
