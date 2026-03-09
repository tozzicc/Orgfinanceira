const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/budgets/:year/:month
router.get('/:year/:month', async (req, res) => {
    const year = parseInt(req.params.year);
    const month = parseInt(req.params.month);

    try {
        const budgets = await prisma.monthlyBudget.findMany({
            where: { userId: req.user.id, year, month },
            orderBy: { categoryId: 'asc' },
        });

        res.json(budgets.map(b => ({
            id: b.id,
            categoryId: b.categoryId,
            amount: parseFloat(b.amount.toString()),
            month: b.month,
            year: b.year,
        })));
    } catch (err) {
        console.error('Erro ao buscar orçamentos:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/budgets — upsert
router.post('/', async (req, res) => {
    const { categoryId, amount, month, year } = req.body;

    if (!categoryId || amount === undefined || !month || !year) {
        return res.status(400).json({ error: 'Campos obrigatórios: categoryId, amount, month, year' });
    }

    try {
        const budget = await prisma.monthlyBudget.upsert({
            where: {
                userId_categoryId_month_year: {
                    userId: req.user.id,
                    categoryId,
                    month: parseInt(month),
                    year: parseInt(year),
                },
            },
            update: { amount: parseFloat(amount) },
            create: {
                userId: req.user.id,
                categoryId,
                amount: parseFloat(amount),
                month: parseInt(month),
                year: parseInt(year),
            },
        });

        res.status(201).json({
            id: budget.id,
            categoryId: budget.categoryId,
            amount: parseFloat(budget.amount.toString()),
            month: budget.month,
            year: budget.year,
        });
    } catch (err) {
        console.error('Erro ao salvar orçamento:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/budgets/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.monthlyBudget.delete({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Orçamento removido com sucesso', id: req.params.id });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Orçamento não encontrado' });
        console.error('Erro ao deletar orçamento:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
