/**
 * Script para criar o banco de dados e executar o schema SQL.
 * Execute com: node database/create-db.js
 *
 * Requer que o PostgreSQL esteja rodando e as variáveis de ambiente
 * configuradas no arquivo .env
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const DB_NAME = process.env.DB_NAME || 'org_financeira';

async function createDatabase() {
    // Conectar ao banco padrão "postgres" para criar o novo banco
    const adminClient = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: 'postgres',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
        await adminClient.connect();
        console.log('✅ Conectado ao PostgreSQL');

        // Verificar se o banco já existe
        const checkResult = await adminClient.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [DB_NAME]
        );

        if (checkResult.rowCount === 0) {
            await adminClient.query(`CREATE DATABASE "${DB_NAME}" ENCODING 'UTF8'`);
            console.log(`✅ Banco de dados "${DB_NAME}" criado com sucesso!`);
        } else {
            console.log(`ℹ️  Banco de dados "${DB_NAME}" já existe, pulando criação.`);
        }
    } finally {
        await adminClient.end();
    }
}

async function runSchema() {
    const dbClient = new Client({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: DB_NAME,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
    });

    try {
        await dbClient.connect();
        console.log(`✅ Conectado ao banco "${DB_NAME}"`);

        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

        await dbClient.query(schemaSql);
        console.log('✅ Schema criado com sucesso! Tabelas e dados iniciais inseridos.');

        // Confirmar tabelas criadas
        const tablesResult = await dbClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
        console.log('\n📋 Tabelas criadas:');
        tablesResult.rows.forEach(row => console.log(`   • ${row.table_name}`));

        // Confirmar categorias inseridas
        const catResult = await dbClient.query('SELECT name, type FROM categories ORDER BY type, name');
        console.log('\n🏷️  Categorias inseridas:');
        catResult.rows.forEach(row => console.log(`   • [${row.type}] ${row.name}`));

    } finally {
        await dbClient.end();
    }
}

(async () => {
    console.log('🚀 Iniciando configuração do banco de dados...\n');
    try {
        await createDatabase();
        await runSchema();
        console.log('\n🎉 Banco de dados configurado com sucesso!');
        console.log(`\nPróximos passos:`);
        console.log(`  1. Inicie o backend: node server.js`);
        console.log(`  2. Inicie o frontend: npm run dev (na pasta raiz do projeto)`);
    } catch (err) {
        console.error('\n❌ Erro ao configurar banco de dados:');
        console.error(err.message);
        console.error('\nVerifique se:');
        console.error('  • O PostgreSQL está rodando');
        console.error('  • As credenciais no arquivo .env estão corretas');
        console.error('  • O usuário tem permissão para criar bancos de dados');
        process.exit(1);
    }
})();
