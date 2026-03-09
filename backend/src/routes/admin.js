const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const prisma = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Todas as rotas requerem autenticação + role admin
router.use(requireAuth, requireAdmin);

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

// GET /api/admin/users — listar todos
router.get('/users', async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'asc' },
            select: {
                id: true, name: true, email: true, role: true, active: true, createdAt: true,
                _count: { select: { transactions: true } },
            },
        });
        res.json(users);
    } catch (err) {
        console.error('Erro ao listar usuários:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/admin/users — criar usuário
router.post('/users', async (req, res) => {
    const { name, email, password, role = 'user' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Campos obrigatórios: name, email, password' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash, role },
            select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
        });

        // Criar categorias padrão para o novo usuário
        await prisma.category.createMany({
            data: DEFAULT_CATEGORIES.map(c => ({ ...c, userId: user.id })),
        });

        res.status(201).json(user);
    } catch (err) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Email já cadastrado' });
        }
        console.error('Erro ao criar usuário:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PATCH /api/admin/users/:id/toggle — ativar/desativar
router.patch('/users/:id/toggle', async (req, res) => {
    try {
        const current = await prisma.user.findUnique({ where: { id: req.params.id } });
        if (!current) return res.status(404).json({ error: 'Usuário não encontrado' });

        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data: { active: !current.active },
            select: { id: true, name: true, email: true, role: true, active: true },
        });
        res.json(updated);
    } catch (err) {
        console.error('Erro ao alternar status:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/admin/users/:id — atualizar dados do usuário
router.put('/users/:id', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const data = {};
        if (name) data.name = name;
        if (email) data.email = email;
        if (password) data.password = await bcrypt.hash(password, 10);

        const updated = await prisma.user.update({
            where: { id: req.params.id },
            data,
            select: { id: true, name: true, email: true, role: true, active: true },
        });
        res.json(updated);
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Usuário não encontrado' });
        if (err.code === 'P2002') return res.status(409).json({ error: 'Email já cadastrado' });
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/admin/users/:id — remover usuário e todos seus dados
router.delete('/users/:id', async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'Usuário removido com sucesso', id: req.params.id });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Usuário não encontrado' });
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
