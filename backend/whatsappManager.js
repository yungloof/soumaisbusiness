const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Memory store for clients and their statuses
const sessions = {}; 
// { companyId: { client: Client, status: 'DISCONNECTED'|'INITIALIZING'|'QR_READY'|'CONNECTED', qrCodeBase64: null } }

class WhatsAppManager {
  static io = null;

  static setIo(ioInstance) {
    this.io = ioInstance;
  }

  static async startSession(companyId) {
    if (sessions[companyId]) {
      return sessions[companyId].status;
    }

    sessions[companyId] = {
      client: null,
      status: 'INITIALIZING',
      qrCodeBase64: null
    };

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: `company_${companyId}` }),
      puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu'
        ]
      }
    });

    sessions[companyId].client = client;

    client.on('qr', async (qr) => {
      console.log(`[WhatsApp] QR Code generated for company ${companyId}`);
      try {
        const base64 = await qrcode.toDataURL(qr);
        sessions[companyId].status = 'QR_READY';
        sessions[companyId].qrCodeBase64 = base64;
      } catch (err) {
        console.error('Error generating QR base64:', err);
      }
    });

    client.on('ready', () => {
      console.log(`[WhatsApp] Client is ready for company ${companyId}`);
      sessions[companyId].status = 'CONNECTED';
      sessions[companyId].qrCodeBase64 = null;
    });

    client.on('authenticated', () => {
      console.log(`[WhatsApp] Authenticated for company ${companyId}`);
    });

    client.on('auth_failure', msg => {
      console.error(`[WhatsApp] Authentication failure for company ${companyId}:`, msg);
      sessions[companyId].status = 'DISCONNECTED';
    });

    client.on('disconnected', (reason) => {
      console.log(`[WhatsApp] Client disconnected for company ${companyId}:`, reason);
      sessions[companyId].status = 'DISCONNECTED';
      sessions[companyId].qrCodeBase64 = null;
      if (sessions[companyId].client) {
        sessions[companyId].client.destroy();
      }
      delete sessions[companyId];
    });

    client.on('message', async msg => {
      // Broadcast incoming message via Socket.io
      if (WhatsAppManager.io) {
        WhatsAppManager.io.emit('whatsapp-message', {
          companyId,
          message: {
            id: msg.id._serialized,
            chatId: msg.from,
            body: msg.body,
            fromMe: msg.fromMe,
            timestamp: msg.timestamp,
            type: msg.type
          }
        });
      }
    });

    client.on('message_create', async msg => {
      // Broadcast messages sent by me (e.g. from the physical phone)
      if (msg.fromMe && WhatsAppManager.io) {
        WhatsAppManager.io.emit('whatsapp-message', {
          companyId,
          message: {
            id: msg.id._serialized,
            chatId: msg.to,
            body: msg.body,
            fromMe: msg.fromMe,
            timestamp: msg.timestamp,
            type: msg.type
          }
        });
      }
    });

    try {
      await client.initialize();
    } catch (err) {
      console.error(`[WhatsApp] Failed to initialize for company ${companyId}:`, err);
      delete sessions[companyId];
    }

    return sessions[companyId]?.status || 'DISCONNECTED';
  }

  static getStatus(companyId) {
    if (!sessions[companyId]) return 'DISCONNECTED';
    return sessions[companyId].status;
  }

  static getQrCode(companyId) {
    if (!sessions[companyId]) return null;
    return sessions[companyId].qrCodeBase64;
  }

  static async logoutSession(companyId) {
    if (sessions[companyId] && sessions[companyId].client) {
      try {
        // Send logout command to WhatsApp servers (unlinks from the phone)
        await sessions[companyId].client.logout();
      } catch (err) {
        console.error('Error logging out:', err);
      } finally {
        try {
          await sessions[companyId].client.destroy();
        } catch(e) {}
      }
      delete sessions[companyId];
    }
    
    // Force delete the local auth folder to ensure a clean state
    try {
      const authPath = path.join(__dirname, '.wwebjs_auth', `session-company_${companyId}`);
      if (fs.existsSync(authPath)) {
        fs.rmSync(authPath, { recursive: true, force: true });
      }
    } catch (err) {
      console.error('Error deleting auth folder:', err);
    }
  }

  static async getChats(companyId, retries = 2) {
    if (!sessions[companyId] || sessions[companyId].status !== 'CONNECTED' || !sessions[companyId].client) {
      throw new Error('WhatsApp not connected');
    }
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const chats = await Promise.race([
          sessions[companyId].client.getChats(),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching chats')), 180000))
        ]);
        return chats
          .filter(c => c.id._serialized !== 'status@broadcast')
          .map(c => ({
            id: c.id._serialized,
            name: c.name || c.id.user,
            unreadCount: c.unreadCount,
            timestamp: c.timestamp,
            lastMessage: c.lastMessage ? { body: c.lastMessage.body } : null,
            isGroup: c.isGroup
          }));
      } catch (err) {
        console.error(`getChats attempt ${attempt + 1} error:`, err.message);
        if (attempt < retries) {
          await new Promise(r => setTimeout(r, 3000));
        } else {
          throw err;
        }
      }
    }
  }

  static async getMessages(companyId, chatId, limit = 50) {
    if (!sessions[companyId] || sessions[companyId].status !== 'CONNECTED' || !sessions[companyId].client) {
      throw new Error('WhatsApp not connected');
    }
    try {
      const chat = await Promise.race([
        sessions[companyId].client.getChatById(chatId),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout getting chat')), 60000))
      ]);
      const messages = await Promise.race([
        chat.fetchMessages({ limit }),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching messages')), 180000))
      ]);
      return messages.map(m => ({
        id: m.id._serialized,
        body: m.body,
        fromMe: m.fromMe,
        timestamp: m.timestamp,
        type: m.type,
        author: m.author
      }));
    } catch (err) {
      console.error('getMessages error:', err);
      throw err;
    }
  }

  static async sendMessage(companyId, chatId, text) {
    if (!sessions[companyId] || sessions[companyId].status !== 'CONNECTED') {
      throw new Error('WhatsApp not connected');
    }
    const msg = await sessions[companyId].client.sendMessage(chatId, text);
    return {
      id: msg.id._serialized,
      body: msg.body,
      fromMe: msg.fromMe,
      timestamp: msg.timestamp
    };
  }
}

module.exports = WhatsAppManager;
