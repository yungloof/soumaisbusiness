const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// Memory store for clients and their statuses
const sessions = {}; 
// { companyId: { client: Client, status: 'DISCONNECTED'|'INITIALIZING'|'QR_READY'|'CONNECTED', qrCodeBase64: null } }

class WhatsAppManager {
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
        args: ['--no-sandbox', '--disable-setuid-sandbox']
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
      // Manual conversations for now. A future flow system will be built here.
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
        await sessions[companyId].client.logout();
      } catch (err) {
        console.error('Error logging out:', err);
        sessions[companyId].client.destroy();
      }
      delete sessions[companyId];
    }
  }
}

module.exports = WhatsAppManager;
