import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import './DashboardMaster.css';

const chartData = [
  { name: 'Carlos Supervisor', value: 351779 }
];

const supervisores = [
  {
    name: 'Carlos Supervisor',
    email: 'supervisor@soublu.com',
    clients: 3,
    faturamento: 'R$ 351.779',
    crescimento: '+58.8%'
  }
];

// ─── Aprovações Pendentes (dados demo baseados na planilha) ────────────────────
const aprovacoesPendentes = [
  {
    id: 'APR-001',
    tipo: 'pagamento',
    titulo: 'Pagamento a Fornecedor — Aluguel',
    detalhe: 'Pizzaria Napolitana · R$ 3.500,00 · Chave PIX: *****2309',
    solicitante: 'Marcos Financeiro',
    data: '2026-06-13 08:30',
    icon: '💸',
    cor: '#f59e0b',
    bgCor: '#fef3c7',
  },
  {
    id: 'APR-002',
    tipo: 'cadastro_cliente',
    titulo: 'Aprovação de Cadastro — Novo Parceiro PJ',
    detalhe: 'Hamburgueria Central LTDA · CNPJ: 12.345.678/0001-99 · Compliance: Pendente',
    solicitante: 'Ana Vendas',
    data: '2026-06-13 09:15',
    icon: '🏢',
    cor: '#3b82f6',
    bgCor: '#eff6ff',
  },
  {
    id: 'APR-003',
    tipo: 'pagamento',
    titulo: 'Solicitação BPO — Energia + Água',
    detalhe: 'Sushi Lima · R$ 1.200,00 · Vencimento: 15/06/2026',
    solicitante: 'Julia Atendimento',
    data: '2026-06-12 17:45',
    icon: '💡',
    cor: '#f59e0b',
    bgCor: '#fef3c7',
  },
  {
    id: 'APR-004',
    tipo: 'desbloqueio',
    titulo: 'Solicitação de Desbloqueio de Conta',
    detalhe: 'Vendedor: Pedro Sales · Meta não atingida em 13/06/2026',
    solicitante: 'Carlos Supervisor',
    data: '2026-06-13 10:00',
    icon: '🔓',
    cor: 'var(--primary-red)',
    bgCor: '#fee2e2',
  },
];

const DashboardHome = () => {
  const [activeTab, setActiveTab] = useState('Supervisores');
  const [aprovacoes, setAprovacoes] = useState(aprovacoesPendentes);
  const [decidindoId, setDecididndoId] = useState(null);

  const decidirAprovacao = (id, acao) => {
    setDecididndoId(id);
    setTimeout(() => {
      setAprovacoes(prev => prev.filter(a => a.id !== id));
      setDecididndoId(null);
    }, 600);
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Painel Master</div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {aprovacoes.length > 0 && (
            <span style={{
              background: 'var(--primary-red)', color: 'white',
              borderRadius: '99px', padding: '0.25rem 0.65rem',
              fontSize: '0.75rem', fontWeight: 700
            }}>
              {aprovacoes.length} aprovação{aprovacoes.length > 1 ? 'ões' : ''} pendente{aprovacoes.length > 1 ? 's' : ''}
            </span>
          )}
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>+ Novo supervisor</button>
        </div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Visão geral da operação</h1>
          <p className="section-subtitle">Consolidado de toda a rede — supervisores, clientes e desempenho.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label red">Faturamento da rede</div>
            <div className="metric-value">R$ 351.779</div>
            <div className="metric-subtext">5 meses - 3 restaurantes</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label orange">Supervisores ativos</div>
            <div className="metric-value">1</div>
            <div className="metric-subtext">Mentores em atividade</div>
          </div>

          <div className="metric-card">
            <div className="metric-label green">Crescimento médio</div>
            <div className="metric-value">+58.8%</div>
            <div className="metric-subtext"><span className="metric-highlight">Mês 1 → Mês 5</span></div>
          </div>

          <div className="metric-card">
            <div className="metric-label blue">Top 1 da rede</div>
            <div className="metric-value" style={{ fontSize: '1.5rem' }}>Sushi Lima</div>
            <div className="metric-subtext">R$ 172.793</div>
          </div>
        </div>

        {/* ─── Painel de Aprovações ───────────────────────────────────────────── */}
        {aprovacoes.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700 }}>⚠️ Aprovações Pendentes</h2>
              <span style={{
                background: '#fee2e2', color: 'var(--primary-red)',
                borderRadius: '99px', padding: '0.2rem 0.6rem',
                fontSize: '0.75rem', fontWeight: 700
              }}>
                {aprovacoes.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aprovacoes.map(apr => (
                <div
                  key={apr.id}
                  style={{
                    background: 'white',
                    border: `1px solid ${apr.cor}33`,
                    borderLeft: `4px solid ${apr.cor}`,
                    borderRadius: '10px',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    opacity: decidindoId === apr.id ? 0.4 : 1,
                    transition: 'opacity 0.3s ease',
                  }}
                >
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '10px',
                    background: apr.bgCor, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '1.25rem', flexShrink: 0
                  }}>
                    {apr.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{apr.titulo}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{apr.detalhe}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
                      Solicitado por <strong>{apr.solicitante}</strong> · {apr.data}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <button
                      onClick={() => decidirAprovacao(apr.id, 'negar')}
                      style={{
                        padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #fca5a5',
                        background: '#fee2e2', color: 'var(--primary-red)', fontWeight: 600,
                        fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      ✕ Negar
                    </button>
                    <button
                      onClick={() => decidirAprovacao(apr.id, 'aprovar')}
                      style={{
                        padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #86efac',
                        background: 'var(--success-bg)', color: 'var(--success-color)', fontWeight: 600,
                        fontSize: '0.8rem', cursor: 'pointer'
                      }}
                    >
                      ✓ Aprovar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {aprovacoes.length === 0 && (
          <div style={{
            background: 'var(--success-bg)', border: '1px solid #86efac',
            borderRadius: '10px', padding: '1rem 1.5rem', marginBottom: '2rem',
            display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem',
            color: 'var(--success-color)', fontWeight: 600,
          }}>
            ✓ Nenhuma aprovação pendente no momento. Tudo em ordem!
          </div>
        )}

        <div className="chart-card">
          <h2 className="chart-title">Faturamento por supervisor (5 meses)</h2>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(val) => `R$ ${val/1000}k`} />
                <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                <Bar dataKey="value" fill="#ea1d2c" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="tabs-container">
          <div className="tabs-header">
            <div 
              className={`tab ${activeTab === 'Supervisores' ? 'active' : ''}`}
              onClick={() => setActiveTab('Supervisores')}
            >
              Supervisores
            </div>
            <div 
              className={`tab ${activeTab === 'Ranking' ? 'active' : ''}`}
              onClick={() => setActiveTab('Ranking')}
            >
              Ranking geral de clientes
            </div>
          </div>
          
          <div className="table-wrapper">
            {activeTab === 'Supervisores' && (
              <table>
                <thead>
                  <tr>
                    <th>SUPERVISOR</th>
                    <th>E-MAIL</th>
                    <th>CLIENTES</th>
                    <th>FATURAMENTO (5M)</th>
                    <th>CRESCIMENTO MÉDIO</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisores.map((sup, idx) => (
                    <tr key={idx} className="table-row">
                      <td style={{ fontWeight: 600 }}>{sup.name}</td>
                      <td style={{ color: '#6b7280' }}>{sup.email}</td>
                      <td>{sup.clients}</td>
                      <td style={{ fontWeight: 600 }}>{sup.faturamento}</td>
                      <td className="text-success">{sup.crescimento}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'Ranking' && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                Nenhum dado de ranking disponível no momento.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
