const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const router = express.Router();

// GET dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalSupervisors,
      totalClientes,
      totalCompanies,
      pendingTransactions,
      totalFaturamento,
      pendingTickets
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'SUPERVISOR' } }),
      prisma.user.count({ where: { role: 'CLIENTE' } }),
      prisma.company.count(),
      prisma.financialTransaction.findMany({ where: { status: 'Pendente' }, orderBy: { createdAt: 'desc' } }),
      prisma.financialTransaction.aggregate({ _sum: { valor: true }, where: { tipo: 'RECEBER', status: 'Pago' } }),
      prisma.ticket.count({ where: { status: { in: ['aberto', 'em_andamento'] } } })
    ]);

    // Build approvals from pending financial transactions (BPO/services only)
    const aprovacoes = pendingTransactions.map(t => ({
      id: t.id,
      tipo: t.tipo === 'PAGAR' ? 'pagamento' : 'cobranca',
      titulo: t.tipo === 'PAGAR' ? `Solicitação BPO — ${t.descricao}` : `Cobrança — ${t.descricao}`,
      detalhe: `R$ ${t.valor.toFixed(2)} · Vencimento: ${new Date(t.vencimento).toLocaleDateString('pt-BR')}${t.fornecedor ? ` · ${t.fornecedor}` : ''}`,
      data: new Date(t.createdAt).toLocaleString('pt-BR'),
      icon: t.tipo === 'PAGAR' ? '💸' : '💰',
      cor: t.tipo === 'PAGAR' ? '#f59e0b' : '#3b82f6',
      bgCor: t.tipo === 'PAGAR' ? '#fef3c7' : '#eff6ff',
    }));

    res.json({
      totalSupervisors,
      totalClientes,
      totalCompanies,
      faturamentoRecebido: totalFaturamento._sum.valor || 0,
      pendingTickets,
      aprovacoes
    });
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

// POST approve/reject a pending transaction
router.post('/aprovacao/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { acao } = req.body; // 'aprovar' ou 'negar'

    if (acao === 'aprovar') {
      await prisma.financialTransaction.update({
        where: { id: parseInt(id) },
        data: { status: 'Aprovado' }
      });
    } else {
      await prisma.financialTransaction.update({
        where: { id: parseInt(id) },
        data: { status: 'Rejeitado' }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar aprovação' });
  }
});

module.exports = router;
