require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const http = require('http');
const { Server } = require('socket.io');
const WhatsAppManager = require('./whatsappManager');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Seed default master user
async function seedMaster() {
  try {
    const masterEmail = 'master@soublu.com';
    const existingUser = await prisma.user.findUnique({ where: { email: masterEmail } });
    if (!existingUser) {
      const hashedPw = await bcrypt.hash('123456', 10);
      await prisma.user.create({
        data: { email: masterEmail, password: hashedPw, role: 'MASTER' }
      });
      console.log('Master user seeded with Prisma.');
    }
  } catch (err) {
    console.error('Error seeding master user:', err);
  }
}
seedMaster();

// Middleware for JWT Verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Não autorizado (Token ausente)' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Acesso negado (Token inválido)' });
    req.user = user;
    next();
  });
};

// Auth Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true }
    });

    if (!user) return res.status(401).json({ error: 'User not found' });
    
    // In a real app we'd compare hashes, since we are moving from mock to real, we check both raw and hashed for now.
    const isMatch = await bcrypt.compare(password, user.password) || password === user.password;
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const modules = user.company?.modules_allowed ? JSON.parse(user.company.modules_allowed) : ['all'];
    const token = jwt.sign({ id: user.id, role: user.role, modules }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ token, role: user.role, modules });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// FonteData Proxy Configuration
const fontedata = axios.create({
  baseURL: 'https://app.fontedata.com/api/v1',
  headers: { 'X-API-Key': process.env.FONTEDATA_API_KEY }
});

// Proxy Route: CNPJ
app.get('/api/fontedata/cnpj/:cnpj', authenticateToken, async (req, res) => {
  try {
    // Using cadastro-pj-plus to get partner (sócio) data as requested
    const response = await fontedata.get(`/consulta/cadastro-pj-plus`, { params: { cnpj: req.params.cnpj } });
    res.json(response.data);
  } catch (error) {
    console.error("FonteData API Error:", error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'FonteData API error' });
  }
});

// Proxy Route: CPF
app.get('/api/fontedata/cpf/:cpf', authenticateToken, async (req, res) => {
  try {
    const response = await fontedata.get(`/consulta/receita-federal-pf`, { params: { cpf: req.params.cpf } });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'FonteData API error' });
  }
});

// Proxy Route: PGFN
app.get('/api/fontedata/pgfn/:cnpj', authenticateToken, async (req, res) => {
  try {
    const response = await fontedata.get(`/consulta/pgfn-devedores`, { params: { cnpj: req.params.cnpj } });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'FonteData API error' });
  }
});

// Proxy Route: Score Quod
app.get('/api/fontedata/score/:documento', authenticateToken, async (req, res) => {
  try {
    const response = await fontedata.get(`/consulta/score-credito-quod`, { params: { cnpj: req.params.documento } });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'FonteData API error' });
  }
});

const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/socket.io',
  cors: {
    origin: '*', // Adjust for production
    methods: ['GET', 'POST']
  }
});

// Expose io to the request object if needed, and to WhatsAppManager
app.use((req, res, next) => {
  req.io = io;
  next();
});
WhatsAppManager.setIo(io);

server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});

// Generic Proxy Route for ConsultasCredito page
// Maps our internal endpoint names to FonteData API endpoints
const endpointMap = {
  'antifraude-pix':          { path: '/consulta/antifraude-chave-pix', paramMap: { chave: 'chave' } },
  'validacao-cadastral':     { path: '/consulta/validacao-cadastral-brasil', paramMap: { documento: 'documento' } },
  'certidao-conjunta-pf':    { path: '/consulta/certidao-conjunta-debitos-pf', paramMap: { cpf: 'cpf' } },
  'certidao-conjunta-pj':    { path: '/consulta/certidao-conjunta-debitos-pj', paramMap: { cnpj: 'cnpj' } },
  'historico-scr':           { path: '/consulta/historico-credito-scr', paramMap: { documento: 'documento' } },
  'protestos':               { path: '/consulta/protestos-brasil', paramMap: { documento: 'documento' } },
  'restricoes-negativacoes': { path: '/consulta/restricoes-negativacoes', paramMap: { documento: 'documento' } },
  'risco-positivo-pj':       { path: '/consulta/analise-risco-positivo-pj', paramMap: { cnpj: 'cnpj' } },
  'risco-positivo-pf':       { path: '/consulta/analise-risco-positivo-pf', paramMap: { cpf: 'cpf' } },
  'cadastro-pf':             { path: '/consulta/cadastro-pj-plus', paramMap: { cpf: 'cpf' } },
  'cadastro-pj':             { path: '/consulta/cadastro-pj-plus', paramMap: { cnpj: 'cnpj' } },
  'vinculo-emprego':         { path: '/consulta/vinculo-empregado', paramMap: { cpf: 'cpf' } },
  'certidao-tj':             { path: '/consulta/certidao-tj', paramMap: { documento: 'documento' } },
  'consulta-veiculo':        { path: '/consulta/consulta-veicular', paramMap: { placa: 'placa' } },
  'processos-judiciais':     { path: '/consulta/processos-judiciais-completo', paramMap: { documento: 'documento' } },
};

app.get('/api/fontedata/consulta/:endpoint', authenticateToken, async (req, res) => {
  const mapped = endpointMap[req.params.endpoint];
  if (!mapped) return res.status(404).json({ error: 'Endpoint de consulta não encontrado' });
  
  try {
    // Build params from query string, mapping our param names to FonteData param names
    const params = {};
    Object.entries(mapped.paramMap).forEach(([ourKey, theirKey]) => {
      if (req.query[ourKey]) params[theirKey] = req.query[ourKey];
    });
    const response = await fontedata.get(mapped.path, { params });
    res.json(response.data);
  } catch (error) {
    console.error(`FonteData Consulta Error [${req.params.endpoint}]:`, error.response?.status, error.response?.data);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'FonteData API error' });
  }
});

// WhatsApp API Routes
// Helper: resolve the whatsapp session key from the JWT.
// For now, every user gets their own session keyed by their user.id.
// If a MASTER wants to manage a specific company, they can still pass companyId.
function getWaCompanyId(req) {
  if (req.user.role === 'MASTER') {
    // Check body first (POST), then query (GET)
    const fromBody = req.body?.companyId;
    const fromQuery = req.query?.companyId;
    return fromBody || fromQuery || req.user.id;
  }
  return req.user.id;
}

app.post('/api/whatsapp/start', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  try {
    const status = await WhatsAppManager.startSession(companyId);
    res.json({ status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/whatsapp/status', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  const status = WhatsAppManager.getStatus(companyId);
  res.json({ status, companyId });
});

app.get('/api/whatsapp/qr', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  const qrCodeBase64 = WhatsAppManager.getQrCode(companyId);
  res.json({ qrCodeBase64 });
});

app.post('/api/whatsapp/logout', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  try {
    await WhatsAppManager.logoutSession(companyId);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/whatsapp/chats', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  try {
    const chats = await WhatsAppManager.getChats(companyId);
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/whatsapp/chats/:chatId/messages', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = await WhatsAppManager.getMessages(companyId, req.params.chatId, limit);
    res.json({ messages });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/whatsapp/chats/:chatId/send', authenticateToken, async (req, res) => {
  const companyId = getWaCompanyId(req);
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    const sentMsg = await WhatsAppManager.sendMessage(companyId, req.params.chatId, message);
    res.json({ success: true, message: sentMsg });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

