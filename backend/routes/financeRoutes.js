const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await prisma.financialTransaction.findMany({
      orderBy: { vencimento: 'asc' }
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar transações' });
  }
});

// POST new transaction
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const transaction = await prisma.financialTransaction.create({
      data: {
        descricao: data.descricao,
        valor: parseFloat(data.valor),
        tipo: data.tipo,
        vencimento: new Date(data.vencimento),
        status: data.status || 'Pendente',
        fornecedor: data.fornecedor
      }
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// PUT update transaction status (Simulate Payment via Mercado Pago)
router.put('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    
    // In a real MVP with Mercado Pago API, we would create a payment intent here.
    // Since we are simulating, we just mark it as paid.
    const transaction = await prisma.financialTransaction.update({
      where: { id: parseInt(id) },
      data: { status: 'Pago' }
    });
    
    res.json({ success: true, transaction, message: 'Pagamento processado via Mercado Pago (Sandbox)' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar pagamento' });
  }
});

// DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.financialTransaction.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar transação' });
  }
});

module.exports = router;
