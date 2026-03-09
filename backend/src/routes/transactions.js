const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/transactions
router.get('/', async (req, res) => {
    try {
        const transactions = await prisma.transaction.findMany({
            where: { userId: req.user.id },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
        });

        res.json(transactions.map(t => ({
            id: t.id,
            date: t.date.toISOString().split('T')[0],
            description: t.description,
            amount: parseFloat(t.amount.toString()),
            type: t.type,
            categoryId: t.categoryId,
        })));
    } catch (err) {
        console.error('Erro ao buscar transações:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/transactions
router.post('/', async (req, res) => {
    const { date, description, amount, type, categoryId } = req.body;

    if (!date || !description || amount === undefined || !type) {
        return res.status(400).json({ error: 'Campos obrigatórios: date, description, amount, type' });
    }

    const validTypes = ['income', 'expense', 'investment'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Tipo inválido. Deve ser: ${validTypes.join(', ')}` });
    }

    try {
        const transaction = await prisma.transaction.create({
            data: {
                date: new Date(date),
                description,
                amount: parseFloat(amount),
                type,
                userId: req.user.id,
                categoryId: categoryId || null,
            },
        });

        res.status(201).json({
            id: transaction.id,
            date: transaction.date.toISOString().split('T')[0],
            description: transaction.description,
            amount: parseFloat(transaction.amount.toString()),
            type: transaction.type,
            categoryId: transaction.categoryId,
        });
    } catch (err) {
        console.error('Erro ao criar transação:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res) => {
    const { date, description, amount, type, categoryId } = req.body;
    try {
        const transaction = await prisma.transaction.update({
            where: { id: req.params.id, userId: req.user.id },
            data: {
                ...(date && { date: new Date(date) }),
                ...(description && { description }),
                ...(amount !== undefined && { amount: parseFloat(amount) }),
                ...(type && { type }),
                ...(categoryId !== undefined && { categoryId: categoryId || null }),
            },
        });

        res.json({
            id: transaction.id,
            date: transaction.date.toISOString().split('T')[0],
            description: transaction.description,
            amount: parseFloat(transaction.amount.toString()),
            type: transaction.type,
            categoryId: transaction.categoryId,
        });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Transação não encontrada' });
        console.error('Erro ao atualizar transação:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.transaction.delete({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Transação removida com sucesso', id: req.params.id });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Transação não encontrada' });
        console.error('Erro ao deletar transação:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
