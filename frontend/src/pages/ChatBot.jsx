import React, { useState, useEffect } from 'react';
import { MessageCircle, QrCode, LogOut, Loader2 } from 'lucide-react';

const ChatBot = () => {
  
  const [waStatus, setWaStatus] = useState('DISCONNECTED');
  const [qrCode, setQrCode] = useState(null);
  const [loadingWa, setLoadingWa] = useState(false);

  // Define isMaster based on user role
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isMaster = user.role === 'MASTER';

  useEffect(() => {
    pollWaStatus();
    const interval = setInterval(pollWaStatus, 3000);
    return () => clearInterval(interval);
  }, [isMaster]);

  const pollWaStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      // For now, if master, we pass a dummy companyId or select one. For simplicity, we use 1 for demo.
      const companyIdQuery = isMaster ? '?companyId=1' : '';
      
      const res = await fetch(`/api/whatsapp/status${companyIdQuery}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.status) {
        setWaStatus(data.status);
        if (data.status === 'QR_READY') {
          fetchQrCode(companyIdQuery);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQrCode = async (query) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/whatsapp/qr${query}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.qrCodeBase64) {
        setQrCode(data.qrCodeBase64);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startWaSession = async () => {
    setLoadingWa(true);
    try {
      const token = localStorage.getItem('token');
      const body = isMaster ? JSON.stringify({ companyId: 1 }) : '{}';
      await fetch('/api/whatsapp/start', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body
      });
      // the polling will pick up the state change
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingWa(false);
    }
  };

  const logoutWaSession = async () => {
    try {
      const token = localStorage.getItem('token');
      const body = isMaster ? JSON.stringify({ companyId: 1 }) : '{}';
      await fetch('/api/whatsapp/logout', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body
      });
      setWaStatus('DISCONNECTED');
      setQrCode(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Chat / WhatsApp Bot</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Pareamento do WhatsApp</h1>
          <p className="section-subtitle">Conecte o número de atendimento para ativar o Bot SOU+BLU.</p>
        </div>

        <div className="card" style={{ padding: '3rem', maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: waStatus === 'CONNECTED' ? '#dcfce7' : '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
              <MessageCircle size={32} color={waStatus === 'CONNECTED' ? '#16a34a' : 'var(--text-muted)'} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {waStatus === 'DISCONNECTED' && 'Nenhum WhatsApp Conectado'}
              {waStatus === 'INITIALIZING' && 'Iniciando Sessão...'}
              {waStatus === 'QR_READY' && 'Leia o QR Code'}
              {waStatus === 'CONNECTED' && 'WhatsApp Conectado com Sucesso!'}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              {waStatus === 'DISCONNECTED' && 'Clique abaixo para gerar um QR Code e parear seu WhatsApp.'}
              {waStatus === 'INITIALIZING' && 'Aguarde enquanto geramos o código de pareamento exclusivo.'}
              {waStatus === 'QR_READY' && 'Abra o WhatsApp no seu celular, vá em "Aparelhos Conectados" e aponte a câmera para o QR Code abaixo.'}
              {waStatus === 'CONNECTED' && 'Seu assistente virtual está ativo e pronto para atender seus clientes.'}
            </p>
          </div>

          {waStatus === 'DISCONNECTED' && (
            <button
              onClick={startWaSession}
              disabled={loadingWa}
              className="btn-primary"
              style={{ padding: '0.875rem 2rem', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              {loadingWa ? <Loader2 className="animate-spin" size={20} /> : <QrCode size={20} />}
              {loadingWa ? 'Iniciando...' : 'Gerar QR Code'}
            </button>
          )}

          {(waStatus === 'INITIALIZING' || (waStatus === 'QR_READY' && !qrCode)) && (
            <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
              <Loader2 className="animate-spin" size={48} color="var(--primary-red)" />
            </div>
          )}

          {waStatus === 'QR_READY' && qrCode && (
            <div style={{ display: 'inline-block', padding: '1rem', background: 'white', border: '1px solid var(--border-color)', borderRadius: 12, boxShadow: 'var(--shadow-sm)' }}>
              <img src={qrCode} alt="WhatsApp QR Code" style={{ width: 256, height: 256 }} />
            </div>
          )}

          {waStatus === 'CONNECTED' && (
            <button
              onClick={logoutWaSession}
              style={{ padding: '0.75rem 1.5rem', background: 'white', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <LogOut size={18} />
              Desconectar WhatsApp
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatBot;
