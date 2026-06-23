const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET all suppliers
router.get('/', async (req, res) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar fornecedores' });
  }
});

// POST new supplier
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const supplier = await prisma.supplier.create({
      data: {
        nome: data.nome,
        contato: data.contato,
        telefone: data.telefone,
        email: data.email,
        categoria: data.categoria,
        status: data.status || 'Ativo'
      }
    });
    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar fornecedor' });
  }
});

// PUT update supplier status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const supplier = await prisma.supplier.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(supplier);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar fornecedor' });
  }
});

// DELETE supplier
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.supplier.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar fornecedor' });
  }
});

module.exports = router;
