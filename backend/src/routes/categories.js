const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/categories
router.get('/', async (req, res) => {
    try {
        const categories = await prisma.category.findMany({
            where: { userId: req.user.id },
            orderBy: [{ type: 'asc' }, { name: 'asc' }],
        });
        res.json(categories);
    } catch (err) {
        console.error('Erro ao buscar categorias:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// POST /api/categories
router.post('/', async (req, res) => {
    const { name, type, icon } = req.body;

    if (!name || !type) {
        return res.status(400).json({ error: 'Campos obrigatórios: name, type' });
    }

    const validTypes = ['income', 'expense', 'investment'];
    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: `Tipo inválido. Deve ser: ${validTypes.join(', ')}` });
    }

    try {
        const category = await prisma.category.create({
            data: { name, type, icon: icon || null, userId: req.user.id },
        });
        res.status(201).json(category);
    } catch (err) {
        console.error('Erro ao criar categoria:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// DELETE /api/categories/:id
router.delete('/:id', async (req, res) => {
    try {
        await prisma.category.delete({ where: { id: req.params.id, userId: req.user.id } });
        res.json({ message: 'Categoria removida com sucesso', id: req.params.id });
    } catch (err) {
        if (err.code === 'P2025') return res.status(404).json({ error: 'Categoria não encontrada' });
        console.error('Erro ao deletar categoria:', err.message);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
