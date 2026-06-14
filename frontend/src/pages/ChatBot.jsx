import React, { useState } from 'react';
import { MessageCircle, Bot, Zap, Users, BarChart3, Settings, CheckCircle, ChevronRight, Smartphone } from 'lucide-react';

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
          >Gestão</button>
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
              <h1 className="section-title">Gestão de Bots</h1>
              <p className="section-subtitle">Monitore todos os WhatsApp Bots ativos na rede.</p>
            </div>
            <div className="metrics-grid" style={{ marginBottom: '2rem' }}>
              {metricas.map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="metric-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <span className={`metric-label ${i === 0 ? 'blue' : i < 3 ? 'green' : 'blue'}`}>{m.label}</span>
                      <Icon size={20} color={m.color} />
                    </div>
                    <div className="metric-value">{m.value}</div>
                  </div>
                );
              })}
            </div>

            <div className="tabs-container">
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Plano</th>
                      <th>Status</th>
                      <th>Conversas/Mês</th>
                      <th>Resolução</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { cliente: 'Pizzaria Bella Napoli', plano: 'Pro', status: 'Ativo', conversas: 1243, resolucao: '91%' },
                      { cliente: 'Hamburgueria Top Grill', plano: 'Starter', status: 'Ativo', conversas: 342, resolucao: '78%' },
                      { cliente: 'Sushi Sensei', plano: 'Enterprise', status: 'Ativo', conversas: 3891, resolucao: '94%' },
                      { cliente: 'Churrascaria Gaúcha', plano: 'Pro', status: 'Suspenso', conversas: 0, resolucao: '-' },
                    ].map((row, i) => (
                      <tr key={i} className="table-row">
                        <td><strong>{row.cliente}</strong></td>
                        <td>
                          <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>{row.plano}</span>
                        </td>
                        <td>
                          <span style={{
                            background: row.status === 'Ativo' ? 'var(--success-bg)' : '#fee2e2',
                            color: row.status === 'Ativo' ? 'var(--success-color)' : 'var(--primary-red)',
                            padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600
                          }}>{row.status}</span>
                        </td>
                        <td><strong>{row.conversas.toLocaleString('pt-BR')}</strong></td>
                        <td style={{ color: 'var(--success-color)', fontWeight: 700 }}>{row.resolucao}</td>
                        <td>
                          <button style={{ padding: '4px 10px', border: '1px solid var(--border-color)', borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                            <Settings size={13} /> Configurar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatBot;
