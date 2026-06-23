const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar chamados' });
  }
});

// POST new ticket
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const ticket = await prisma.ticket.create({
      data: {
        titulo: data.titulo,
        categoria: data.categoria,
        autor: data.autor,
        status: 'aberto'
      }
    });
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar chamado' });
  }
});

// PUT update ticket status
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const ticket = await prisma.ticket.update({
      where: { id: parseInt(id) },
      data
    });
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar chamado' });
  }
});

// DELETE ticket
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.ticket.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar chamado' });
  }
});

module.exports = router;
