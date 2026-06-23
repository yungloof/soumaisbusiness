const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { MercadoPagoConfig, Preference } = require('mercadopago');
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
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Erro ao criar transação' });
  }
});

// PUT update transaction status and generate Mercado Pago Payment Link
router.put('/:id/pay', async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await prisma.financialTransaction.findUnique({ where: { id: parseInt(id) } });
    
    if (!transaction) return res.status(404).json({ error: 'Transação não encontrada' });

    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    
    // Fallback/Validation if token is not set yet
    if (!accessToken || accessToken === 'APP_USR-coloque_seu_access_token_aqui') {
      return res.status(400).json({ 
        error: 'Mercado Pago não configurado. Por favor, cole o seu Access Token no arquivo .env para gerar cobranças reais.' 
      });
    }

    // Initialize Mercado Pago
    const client = new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } });
    const preference = new Preference(client);

    const body = {
      items: [
        {
          id: transaction.id.toString(),
          title: transaction.descricao,
          quantity: 1,
          unit_price: Number(transaction.valor),
          currency_id: 'BRL',
        }
      ],
      external_reference: transaction.id.toString(),
      // Webhook URL must be a public HTTPS URL. For now, we will leave it commented or use a placeholder
      // notification_url: 'https://seusite.com/api/finance/webhook' 
    };

    const response = await preference.create({ body });

    res.json({ 
      success: true, 
      init_point: response.init_point, 
      message: 'Link de pagamento gerado com sucesso!' 
    });
  } catch (error) {
    console.error('Mercado Pago Error:', error);
    res.status(500).json({ error: 'Erro ao processar pagamento com o Mercado Pago' });
  }
});

// POST Webhook for Mercado Pago IPN
router.post('/webhook', async (req, res) => {
  try {
    // This is where Mercado Pago sends the payment status update
    // req.body.data.id contains the payment ID
    // We would fetch the payment details from MP and update our DB
    console.log('Webhook Received:', req.body);
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).send('Error handling webhook');
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
