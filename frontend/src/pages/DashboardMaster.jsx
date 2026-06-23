import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, UsersRound, LogOut } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import './DashboardMaster.css';

const chartData = [
  { name: 'Carlos Supervisor', value: 351779 }
];

const supervisors = [
  {
    name: 'Carlos Supervisor',
    email: 'supervisor@soublu.com',
    clients: 3,
    faturamento: 'R$ 351.779',
    crescimento: '+58.8%'
  }
];

const DashboardMaster = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Supervisores');

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="login-logo" style={{ marginBottom: 0 }}>
            <img src="/logo-mono.png" alt="SOU+BUSINESS Logo" style={{ height: '40px', objectFit: 'contain' }} />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <span style={{ backgroundColor: '#1a1a1a', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>MASTER</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <LayoutDashboard /> Dashboard
          </button>
          <button className="nav-item">
            <Users /> Supervisores
          </button>
          <button className="nav-item">
            <UsersRound /> Todos os clientes
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="user-avatar">R</div>
          <div className="user-info">
            <div className="user-name">Renata Master</div>
            <div className="user-role">Master</div>
          </div>
          <button onClick={() => navigate('/login')} className="text-muted" style={{ padding: '0.5rem' }}>
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <div className="page-title">Painel Master</div>
          <button className="btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem' }}>+ Novo supervisor</button>
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
      </main>
    </div>
  );
};

export default DashboardMaster;
