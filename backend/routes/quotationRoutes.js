const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET all quotations
router.get('/', async (req, res) => {
  try {
    const quotations = await prisma.quotation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cotações' });
  }
});

// POST new quotation
router.post('/', async (req, res) => {
  try {
    const { titulo, fornecedores, itens, status } = req.body;
    const quotation = await prisma.quotation.create({
      data: {
        titulo,
        fornecedores: JSON.stringify(fornecedores || []),
        itens: JSON.stringify(itens || []),
        status: status || 'Rascunho'
      }
    });
    res.status(201).json(quotation);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar cotação' });
  }
});

// PUT update quotation status
router.put('/:id', async (req, res) => {
  try {
    const { status, melhorPreco } = req.body;
    const quotation = await prisma.quotation.update({
      where: { id: parseInt(req.params.id) },
      data: { status, melhorPreco }
    });
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar cotação' });
  }
});

// DELETE quotation
router.delete('/:id', async (req, res) => {
  try {
    await prisma.quotation.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar cotação' });
  }
});

module.exports = router;
