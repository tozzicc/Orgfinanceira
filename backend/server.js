const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouter = require('./src/routes/auth');
const adminRouter = require('./src/routes/admin');
const transactionsRouter = require('./src/routes/transactions');
const categoriesRouter = require('./src/routes/categories');
const budgetsRouter = require('./src/routes/budgets');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middlewares ────────────────────────────────────────────────
const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000',
        'http://127.0.0.1:5173',
        'http://127.0.0.1:5174',
    ];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health check ───────────────────────────────────────────────
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Rotas ──────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/budgets', budgetsRouter);

// ── Error handler ──────────────────────────────────────────────
app.use((err, req, res, next) => {
    console.error('Erro não tratado:', err.stack);
    res.status(500).json({ error: 'Erro interno do servidor' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`   Auth:         POST /api/auth/login`);
    console.log(`   Admin:        /api/admin/users`);
    console.log(`   Transactions: /api/transactions`);
    console.log(`   Categories:   /api/categories`);
});

module.exports = app;
