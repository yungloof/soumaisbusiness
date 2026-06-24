const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await prisma.manualOrder.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// POST new order
router.post('/', async (req, res) => {
  try {
    const { cpf, itens, total } = req.body;
    const order = await prisma.manualOrder.create({
      data: { cpf, itens, total, status: 'Novo' }
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar pedido' });
  }
});

// PUT update order status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await prisma.manualOrder.update({
      where: { id: parseInt(req.params.id) },
      data: { status }
    });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar pedido' });
  }
});

module.exports = router;
