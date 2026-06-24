const express = require('express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();
const router = express.Router();

// GET users by role
router.get('/', async (req, res) => {
  try {
    const { role } = req.query; // 'SUPERVISOR' or 'CLIENTE'
    const query = role ? { role } : {};
    
    const users = await prisma.user.findMany({
      where: query,
      include: { company: true },
      orderBy: { id: 'desc' }
    });
    
    // Omit passwords
    const safeUsers = users.map(u => {
      const { password, ...rest } = u;
      return rest;
    });
    
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// POST new user
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    const hashedPw = await bcrypt.hash(data.password || '123456', 10); // Default password if none provided
    
    // Create company if it's a client
    let companyId = null;
    if (data.role === 'CLIENTE' && data.companyName) {
      const company = await prisma.company.create({
        data: {
          razao_social: data.companyName,
          modules_allowed: JSON.stringify(data.modules || [])
        }
      });
      companyId = company.id;
    }

    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPw,
        role: data.role,
        company_id: companyId
      }
    });
    
    const { password, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (error) {
    if (error.code === 'P2002') return res.status(400).json({ error: 'Email já cadastrado' });
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Do not allow deleting the master user
    const user = await prisma.user.findUnique({ where: { id: parseInt(id) }});
    if (user && user.role === 'MASTER') {
      return res.status(403).json({ error: 'Não é possível deletar o usuário MASTER' });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// PUT update user modules (permissions)
router.put('/:id/modules', async (req, res) => {
  try {
    const { id } = req.params;
    const { modules } = req.body; // array of module IDs

    const user = await prisma.user.findUnique({ where: { id: parseInt(id) }, include: { company: true } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (user.company_id) {
      await prisma.company.update({
        where: { id: user.company_id },
        data: { modules_allowed: JSON.stringify(modules) }
      });
    }

    res.json({ success: true, modules });
  } catch (error) {
    console.error('Error updating modules:', error);
    res.status(500).json({ error: 'Erro ao atualizar permissões' });
  }
});

module.exports = router;
