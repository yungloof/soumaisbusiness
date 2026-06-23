const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

async function test() {
  const master = await prisma.user.findFirst({ where: { role: 'MASTER' } });
  if (!master) { console.log('No master found'); return; }

  const token = jwt.sign(
    { userId: master.id, role: master.role },
    process.env.JWT_SECRET || 'super_secret_soublu_2026',
    { expiresIn: '24h' }
  );

  const payload = {
    descricao: "Serviço Marketplace: Teste",
    valor: 100,
    tipo: 'PAGAR',
    vencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    fornecedor: 'SOU+BUSINESS Serviços',
    status: 'Pendente'
  };

  try {
    const res = await fetch('http://localhost:3001/api/finance', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Response Status:', res.status);
    console.log('Response Data:', data);
  } catch (err) {
    console.error('Fetch Error:', err);
  }
}

test();
