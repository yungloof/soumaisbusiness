import React, { useState, useEffect } from 'react';
import { MessageCircle, Bot, Zap, Users, BarChart3, Settings, CheckCircle, ChevronRight, Smartphone, QrCode, LogOut, Loader2 } from 'lucide-react';

const planos = [
  {
    nome: 'Starter',
    preco: 'R$ 100,00',
    periodo: '/mês',
    descricao: 'Ideal para restaurantes que estão começando a automatizar o atendimento.',
    cor: '#3b82f6',
    bg: '#eff6ff',
    recursos: [
      'Até 500 conversas/mês',
      '1 número WhatsApp conectado',
      'Menu digital automatizado',
      'Respostas automáticas básicas',
      'Relatório semanal',
    ]
  },
  {
    nome: 'Pro',
    preco: 'R$ 200,00',
    periodo: '/mês',
    descricao: 'Para delivery com alto volume de pedidos e atendimento profissional.',
    cor: 'var(--primary-red)',
    bg: '#fee2e2',
    destaque: true,
    recursos: [
      'Até 2.000 conversas/mês',
      '3 números WhatsApp conectados',
      'Pedidos via WhatsApp integrados',
      'Funil de vendas automatizado',
      'Notificações de status do pedido',
      'Dashboard de métricas em tempo real',
      'Suporte prioritário',
    ]
  },
  {
    nome: 'Enterprise',
    preco: 'R$ 300,00',
    periodo: '/mês',
    descricao: 'Para redes e franquias que precisam de automação completa e personalizada.',
    cor: '#7c3aed',
    bg: '#f5f3ff',
    recursos: [
      'Conversas ilimitadas',
      'Números ilimitados',
      'Fluxos de atendimento personalizados',
      'Integração com sistemas ERP',
      'Agente de IA personalizado',
      'Relatório gerencial avançado',
      'Gerente de conta dedicado',
      'Treinamento da equipe incluso',
    ]
  },
];

const metricas = [
  { label: 'Bots Ativos na Rede', value: '23', icon: Bot, color: '#3b82f6' },
  { label: 'Conversas este mês', value: '14.872', icon: MessageCircle, color: '#10b981' },
  { label: 'Taxa de Resolução', value: '87%', icon: CheckCircle, color: '#10b981' },
  { label: 'Clientes com Bot', value: '23', icon: Users, color: '#7c3aed' },
];

const ChatBot = () => {
  const [planSelecionado, setPlanSelecionado] = useState(null);
  const [tab, setTab] = useState('planos');
  
  const [waStatus, setWaStatus] = useState('DISCONNECTED');
  const [qrCode, setQrCode] = useState(null);
  const [loadingWa, setLoadingWa] = useState(false);

  // Define isMaster based on user role
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const isMaster = user.role === 'MASTER';

  useEffect(() => {
    // If not master or viewing gestao, poll status
    if (tab === 'gestao' || !isMaster) {
      pollWaStatus();
      const interval = setInterval(pollWaStatus, 3000);
      return () => clearInterval(interval);
    }
  }, [tab, isMaster]);

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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => setTab('planos')}
            style={{ padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', background: tab === 'planos' ? 'var(--primary-red)' : 'white', color: tab === 'planos' ? 'white' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}
          >Planos</button>
          <button
            onClick={() => setTab('gestao')}
            style={{ padding: '0.5rem 1rem', borderRadius: 6, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer', background: tab === 'gestao' ? 'var(--primary-red)' : 'white', color: tab === 'gestao' ? 'white' : 'var(--text-muted)', border: '1px solid var(--border-color)' }}
          >Conexão (Gestão)</button>
        </div>
      </header>

      <div className="content-area">

        {tab === 'planos' && (
          <>
            {/* Hero */}
            <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', borderRadius: 16, padding: '2.5rem', marginBottom: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div style={{ background: '#25D366', borderRadius: 10, padding: 8, display: 'flex' }}><MessageCircle size={24} color="white" /></div>
                  <span style={{ fontWeight: 700, fontSize: '1.5rem' }}>WhatsApp Bot SOU+BLU</span>
                </div>
                <p style={{ opacity: 0.8, maxWidth: 480, lineHeight: 1.6 }}>
                  Automatize o atendimento dos seus clientes com inteligência artificial. Pedidos, confirmações, status — tudo sem precisar de atendente humano 24/7.
                </p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: '1rem 1.5rem', textAlign: 'center', minWidth: 160 }}>
                <Smartphone size={32} style={{ margin: '0 auto 0.5rem', display: 'block', opacity: 0.9 }} />
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>87%</div>
                <div style={{ opacity: 0.7, fontSize: '0.85rem' }}>taxa de resolução automática</div>
              </div>
            </div>

            {/* Planos */}
            <div className="section-header">
              <h1 className="section-title">Escolha o Plano Ideal</h1>
              <p className="section-subtitle">Contrate para qualquer cliente da sua rede diretamente pelo sistema.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {planos.map((plano) => (
                <div key={plano.nome} style={{
                  background: 'white',
                  borderRadius: 16,
                  padding: '2rem',
                  border: `2px solid ${plano.destaque ? plano.cor : 'var(--border-color)'}`,
                  position: 'relative',
                  boxShadow: plano.destaque ? '0 8px 30px rgba(234,29,44,0.15)' : 'var(--shadow-sm)',
                  transition: 'transform 0.2s',
                }}>
                  {plano.destaque && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plano.cor, color: 'white', padding: '4px 16px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                      ⭐ MAIS POPULAR
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: plano.bg, borderRadius: 10, padding: 8, display: 'flex' }}>
                      <Zap size={20} color={plano.cor} />
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem', color: plano.cor }}>{plano.nome}</span>
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{plano.preco}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{plano.periodo}</span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>{plano.descricao}</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
                    {plano.recursos.map((r, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                        <CheckCircle size={15} color={plano.cor} style={{ flexShrink: 0 }} />
                        {r}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => { setPlanSelecionado(plano.nome); alert(`Solicitação do plano ${plano.nome} enviada! A central vai entrar em contato para ativar o bot.`); }}
                    style={{ width: '100%', padding: '0.875rem', background: plano.cor, color: 'white', borderRadius: 8, fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    Contratar {plano.nome} <ChevronRight size={16} />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === 'gestao' && (
          <>
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
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
