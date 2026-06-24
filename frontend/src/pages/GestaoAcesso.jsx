import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Lista de módulos do sistema baseada na planilha PROJETO PJ PROSPECÇÃO
const MODULOS_SISTEMA = [
  { id: 'dashboard', label: 'Dashboard', descricao: 'Painel mestre com métricas e gráficos', icon: '📊' },
  { id: 'funcionarios', label: 'Funcionários', descricao: 'Cadastro e gestão de colaboradores', icon: '👤' },
  { id: 'clientes', label: 'Clientes', descricao: 'Cadastro e acompanhamento de clientes PJ', icon: '🏢' },
  { id: 'cardapio', label: 'Cadastrar Produtos / Cardápio', descricao: 'Gerenciar produtos e cardápio iFood/99Pop', icon: '🍽️' },
  { id: 'pedidos', label: 'Gerar Pedido Manual', descricao: 'Criar pedidos manuais para o delivery', icon: '🧾' },
  { id: 'chatbot', label: 'Chat / WhatsApp Bot', descricao: 'Canal de atendimento automatizado', icon: '💬' },
  { id: 'treinamentos', label: 'Treinamentos', descricao: 'Base de vídeos e cursos da rede', icon: '🎓' },
  { id: 'consultas-credito', label: 'Consultas de Dados Cadastrais', descricao: 'Antifraude, Serasa, SCR e Certidões', icon: '🔍' },
  { id: 'chamados', label: 'Gestão de Chamados', descricao: 'Abertura e acompanhamento de tickets', icon: '🎫' },
  { id: 'financeiro', label: 'BPO Financeiro', descricao: 'Pagamentos, cobranças e extrato', icon: '💰' },
  { id: 'marketplace', label: 'Marketplace SOU+BUSINESS', descricao: 'Loja de serviços e produtos parceiros', icon: '🛒' },
  { id: 'fornecedores', label: 'Fornecedor', descricao: 'Cadastro, cotação e pagamento de fornecedores', icon: '📦' },
];

const PERFIS_PRESET = {
  'Supervisor': ['dashboard', 'funcionarios', 'clientes', 'chamados'],
  'Vendedor': ['dashboard', 'clientes', 'pedidos', 'chatbot'],
  'Gerente Comercial': ['dashboard', 'clientes', 'funcionarios', 'consultas-credito', 'chamados', 'financeiro'],
  'Analista Financeiro': ['dashboard', 'financeiro', 'fornecedores', 'chamados'],
  'Acesso Total': MODULOS_SISTEMA.map(m => m.id),
};

const GestaoAcesso = () => {
  const [funcionarios, setFuncionarios] = useState([]);
  const [selecionado, setSelecionado] = useState(null);
  const [permissoesPendentes, setPermissoesPendentes] = useState({});
  const [busca, setBusca] = useState('');
  const [filtroRole, setFiltroRole] = useState('todos');
  const [perfilAplicado, setPerfilAplicado] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Map users to the format the UI expects
      const mapped = data
        .filter(u => u.role !== 'MASTER')
        .map(u => {
          const modules = u.company?.modules_allowed ? JSON.parse(u.company.modules_allowed) : [];
          return {
            id: u.id,
            nome: u.company?.razao_social || u.email.split('@')[0],
            email: u.email,
            cargo: u.role === 'SUPERVISOR' ? 'Supervisor' : u.role === 'CLIENTE' ? 'Parceiro' : u.role,
            role: u.role,
            status: 'ativo',
            permissoes: modules.includes('all') ? MODULOS_SISTEMA.map(m => m.id) : modules,
            companyId: u.company_id
          };
        });
      setFuncionarios(mapped);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const funcionariosFiltrados = funcionarios.filter(f => {
    const matchBusca = f.nome.toLowerCase().includes(busca.toLowerCase()) || f.email.toLowerCase().includes(busca.toLowerCase());
    const matchRole = filtroRole === 'todos' || f.role === filtroRole;
    return matchBusca && matchRole;
  });

  const abrirFuncionario = (func) => {
    setSelecionado(func);
    setPermissoesPendentes({ ...func.permissoes.reduce((acc, p) => ({ ...acc, [p]: true }), {}) });
    setPerfilAplicado('');
  };

  const togglePermissao = (modId) => {
    setPermissoesPendentes(prev => ({ ...prev, [modId]: !prev[modId] }));
    setPerfilAplicado('');
  };

  const aplicarPerfil = (perfil) => {
    const mods = PERFIS_PRESET[perfil];
    const novas = mods.reduce((acc, m) => ({ ...acc, [m]: true }), {});
    setPermissoesPendentes(novas);
    setPerfilAplicado(perfil);
  };

  const salvarPermissoes = async () => {
    setSalvando(true);
    try {
      const novasPermissoes = Object.entries(permissoesPendentes).filter(([, v]) => v).map(([k]) => k);
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/users/${selecionado.id}/modules`, {
        modules: novasPermissoes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Update local state
      setFuncionarios(prev => prev.map(f => f.id === selecionado.id ? { ...f, permissoes: novasPermissoes } : f));
      setSelecionado(prev => ({ ...prev, permissoes: novasPermissoes }));
      setSavedId(selecionado.id);
      toast.success('Permissões salvas com sucesso!');
      setTimeout(() => setSavedId(null), 2500);
    } catch (error) {
      toast.error('Erro ao salvar permissões.');
    } finally {
      setSalvando(false);
    }
  };

  const totalAtivos = funcionarios.length;
  const permissoesSel = selecionado ? Object.values(permissoesPendentes).filter(Boolean).length : 0;

  return (
    <>
      <header className="topbar">
        <div className="page-title">Gestão de Permissões e Acesso</div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{totalAtivos} usuários cadastrados</span>
        </div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Controle de Acesso ao Sistema</h1>
          <p className="section-subtitle">
            Defina quais módulos cada parceiro ou supervisor pode acessar.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', minHeight: '600px' }}>

          {/* Painel Esquerdo — Lista de Usuários */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="🔍  Buscar por nome ou email..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
              <select
                className="input-field"
                value={filtroRole}
                onChange={e => setFiltroRole(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="todos">Todos os perfis</option>
                <option value="SUPERVISOR">Supervisores</option>
                <option value="CLIENTE">Parceiros</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '520px' }}>
              {funcionariosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <p style={{ fontSize: '0.875rem' }}>Nenhum usuário encontrado.</p>
                  <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Cadastre supervisores ou parceiros primeiro.</p>
                </div>
              )}
              {funcionariosFiltrados.map(func => (
                <button
                  key={func.id}
                  onClick={() => abrirFuncionario(func)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    padding: '0.75rem 1rem', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--border-radius-sm)', background: selecionado?.id === func.id ? '#fee2e2' : 'white',
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left', width: '100%'
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: selecionado?.id === func.id ? 'var(--primary-red)' : '#f3f4f6', color: selecionado?.id === func.id ? 'white' : 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                    {func.nome.substring(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{func.nome}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{func.cargo} · {func.permissoes.length} módulos</div>
                  </div>
                  {savedId === func.id && <span style={{ color: 'var(--success-color)', fontSize: '0.75rem', fontWeight: 600 }}>✓ Salvo</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Painel Direito — Permissões */}
          <div className="card" style={{ padding: '1.5rem' }}>
            {!selecionado ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', gap: '1rem' }}>
                <div style={{ fontSize: '3rem', opacity: 0.2 }}>🔐</div>
                <h3 style={{ fontWeight: 600 }}>Selecione um usuário</h3>
                <p style={{ fontSize: '0.875rem', textAlign: 'center', maxWidth: 360 }}>Clique em um usuário na lista ao lado para configurar suas permissões de acesso ao sistema.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{selecionado.nome}</h2>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{selecionado.email} · {selecionado.cargo}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{permissoesSel}/{MODULOS_SISTEMA.length} módulos</span>
                    <button
                      className="btn-primary"
                      onClick={salvarPermissoes}
                      disabled={salvando}
                      style={{ padding: '0.5rem 1.5rem', fontSize: '0.85rem' }}
                    >
                      {salvando ? 'Salvando...' : '💾 Salvar Permissões'}
                    </button>
                  </div>
                </div>

                {/* Perfis Rápidos */}
                <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9fafb', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ⚡ Aplicar Perfil Rápido
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {Object.keys(PERFIS_PRESET).map(perfil => (
                      <button
                        key={perfil}
                        onClick={() => aplicarPerfil(perfil)}
                        style={{
                          padding: '0.4rem 0.75rem', fontSize: '0.8rem', fontWeight: 600,
                          border: '1px solid var(--border-color)', borderRadius: '20px',
                          background: perfilAplicado === perfil ? 'var(--primary-red)' : 'white',
                          color: perfilAplicado === perfil ? 'white' : 'var(--text-main)',
                          cursor: 'pointer', transition: 'all 0.15s'
                        }}
                      >
                        {perfil}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Grid de Módulos */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.75rem' }}>
                  {MODULOS_SISTEMA.map(mod => {
                    const ativo = permissoesPendentes[mod.id] || false;
                    return (
                      <button
                        key={mod.id}
                        onClick={() => togglePermissao(mod.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '1rem', border: `2px solid ${ativo ? 'var(--primary-red)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--border-radius-sm)', background: ativo ? '#fef2f2' : 'white',
                          cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left'
                        }}
                      >
                        <span style={{ fontSize: '1.5rem' }}>{mod.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: ativo ? 'var(--primary-red)' : 'var(--text-main)' }}>{mod.label}</div>
                          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{mod.descricao}</div>
                        </div>
                        <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${ativo ? 'var(--primary-red)' : '#d1d5db'}`, background: ativo ? 'var(--primary-red)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0 }}>
                          {ativo ? '✓' : ''}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GestaoAcesso;
