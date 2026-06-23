import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useNavigate } from 'react-router-dom';
import './DashboardMaster.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [aprovacoes, setAprovacoes] = useState([]);
  const [decidindoId, setDecididndoId] = useState(null);
  const [activeTab, setActiveTab] = useState('Supervisores');
  const [supervisores, setSupervisores] = useState([]);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const [dashRes, supRes] = await Promise.all([
        axios.get(`${API_URL}/dashboard/stats`, { headers }),
        axios.get(`${API_URL}/users?role=SUPERVISOR`, { headers })
      ]);
      setStats(dashRes.data);
      setAprovacoes(dashRes.data.aprovacoes || []);
      setSupervisores(supRes.data);
    } catch (error) {
      console.error('Erro ao buscar dashboard:', error);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const decidirAprovacao = async (id, acao) => {
    setDecididndoId(id);
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/dashboard/aprovacao/${id}`, { acao }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTimeout(() => {
        setAprovacoes(prev => prev.filter(a => a.id !== id));
        setDecididndoId(null);
      }, 400);
    } catch (error) {
      console.error('Erro ao processar aprovação:', error);
      setDecididndoId(null);
    }
  };

  const faturamento = stats?.faturamentoRecebido || 0;
  const chartData = supervisores.length > 0
    ? supervisores.map(s => ({ name: s.email.split('@')[0], value: Math.round(faturamento / supervisores.length) }))
    : [{ name: 'Nenhum supervisor', value: 0 }];

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
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }} onClick={() => navigate('/master/supervisores')}>+ Novo supervisor</button>
        </div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Visão geral da operação</h1>
          <p className="section-subtitle">Consolidado de toda a rede — supervisores, clientes e desempenho.</p>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label red">Faturamento recebido</div>
            <div className="metric-value">R$ {faturamento.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="metric-subtext">Cobranças pagas</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-label orange">Supervisores ativos</div>
            <div className="metric-value">{stats?.totalSupervisors || 0}</div>
            <div className="metric-subtext">Mentores em atividade</div>
          </div>

          <div className="metric-card">
            <div className="metric-label green">Parceiros (Empresas)</div>
            <div className="metric-value">{stats?.totalCompanies || 0}</div>
            <div className="metric-subtext">Empresas ativas na rede</div>
          </div>

          <div className="metric-card">
            <div className="metric-label blue">Chamados abertos</div>
            <div className="metric-value">{stats?.pendingTickets || 0}</div>
            <div className="metric-subtext">Suporte em andamento</div>
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
                      Registrado em {apr.data}
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
          <h2 className="chart-title">Faturamento por supervisor</h2>
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
                    <th>NÍVEL</th>
                  </tr>
                </thead>
                <tbody>
                  {supervisores.length > 0 ? supervisores.map((sup) => (
                    <tr key={sup.id} className="table-row">
                      <td style={{ fontWeight: 600 }}>{sup.email.split('@')[0]}</td>
                      <td style={{ color: '#6b7280' }}>{sup.email}</td>
                      <td>
                        <span style={{ background: '#fefce8', color: '#a16207', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>
                          SUPERVISOR
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: '#6b7280' }}>
                        Nenhum supervisor cadastrado. <span style={{ color: 'var(--primary-red)', cursor: 'pointer', fontWeight: 600 }} onClick={() => navigate('/master/supervisores')}>Adicionar →</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {activeTab === 'Ranking' && (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                O ranking será preenchido conforme dados de faturamento forem registrados.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
