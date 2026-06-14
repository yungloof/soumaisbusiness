import React, { useState } from 'react';

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
  { id: 'marketplace', label: 'Marketplace BLU', descricao: 'Loja de serviços e produtos parceiros', icon: '🛒' },
  { id: 'fornecedores', label: 'Fornecedor', descricao: 'Cadastro, cotação e pagamento de fornecedores', icon: '📦' },
];

const PERFIS_PRESET = {
  'Supervisor': ['dashboard', 'funcionarios', 'clientes', 'chamados'],
  'Vendedor': ['dashboard', 'clientes', 'pedidos', 'chatbot'],
  'Gerente Comercial': ['dashboard', 'clientes', 'funcionarios', 'consultas-credito', 'chamados', 'financeiro'],
  'Analista Financeiro': ['dashboard', 'financeiro', 'fornecedores', 'chamados'],
  'Acesso Total': MODULOS_SISTEMA.map(m => m.id),
};

const funcionariosDemo = [
  { id: 1, nome: 'Carlos Supervisor', cargo: 'Supervisor', departamento: 'Comercial', email: 'carlos@soublu.com', permissoes: ['dashboard', 'funcionarios', 'clientes', 'chamados'], status: 'ativo' },
  { id: 2, nome: 'Ana Vendas', cargo: 'Vendedora', departamento: 'Comercial', email: 'ana@soublu.com', permissoes: ['dashboard', 'clientes', 'pedidos'], status: 'ativo' },
  { id: 3, nome: 'Marcos Financeiro', cargo: 'Analista Financeiro', departamento: 'Financeiro', email: 'marcos@soublu.com', permissoes: ['dashboard', 'financeiro', 'fornecedores'], status: 'ativo' },
  { id: 4, nome: 'Julia Atendimento', cargo: 'Atendente', departamento: 'Suporte', email: 'julia@soublu.com', permissoes: ['dashboard', 'chamados', 'chatbot', 'treinamentos'], status: 'inativo' },
];

const GestaoAcesso = () => {
  const [funcionarios, setFuncionarios] = useState(funcionariosDemo);
  const [selecionado, setSelecionado] = useState(null);
  const [permissoesPendentes, setPermissoesPendentes] = useState({});
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [perfilAplicado, setPerfilAplicado] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [savedId, setSavedId] = useState(null);

  const funcionariosFiltrados = funcionarios.filter(f => {
    const matchBusca = f.nome.toLowerCase().includes(busca.toLowerCase()) || f.cargo.toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || f.status === filtroStatus;
    return matchBusca && matchStatus;
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
    await new Promise(r => setTimeout(r, 800));
    const novasPermissoes = Object.entries(permissoesPendentes).filter(([, v]) => v).map(([k]) => k);
    setFuncionarios(prev => prev.map(f => f.id === selecionado.id ? { ...f, permissoes: novasPermissoes } : f));
    setSelecionado(prev => ({ ...prev, permissoes: novasPermissoes }));
    setSalvando(false);
    setSavedId(selecionado.id);
    setTimeout(() => setSavedId(null), 2500);
  };

  const totalAtivos = funcionarios.filter(f => f.status === 'ativo').length;
  const permissoesSel = selecionado ? Object.values(permissoesPendentes).filter(Boolean).length : 0;

  return (
    <>
      <header className="topbar">
        <div className="page-title">Gestão de Permissões e Acesso</div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{totalAtivos} funcionários ativos</span>
        </div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Controle de Acesso ao Sistema</h1>
          <p className="section-subtitle">
            Defina quais módulos cada funcionário pode acessar. Baseado na estrutura hierárquica da planilha de funcionários.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: '1.5rem', minHeight: '600px' }}>

          {/* Painel Esquerdo — Lista de Funcionários */}
          <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                className="input-field"
                placeholder="🔍  Buscar funcionário..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              />
              <select
                className="input-field"
                value={filtroStatus}
                onChange={e => setFiltroStatus(e.target.value)}
                style={{ fontSize: '0.875rem' }}
              >
                <option value="todos">Todos os status</option>
                <option value="ativo">Somente ativos</option>
                <option value="inativo">Somente inativos</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '520px' }}>
              {funcionariosFiltrados.map(func => (
                <button
                  key={func.id}
                  onClick={() => abrirFuncionario(func)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    borderRadius: '8px',
                    border: selecionado?.id === func.id ? '2px solid var(--primary-red)' : '1px solid var(--border-color)',
                    background: selecionado?.id === func.id ? '#fff5f5' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{
                    width: '38px', height: '38px', borderRadius: '50%',
                    background: func.status === 'ativo' ? 'var(--primary-red)' : '#d1d5db',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                  }}>
                    {func.nome.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {func.nome}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{func.cargo}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, padding: '2px 6px', borderRadius: '99px',
                      background: func.status === 'ativo' ? 'var(--success-bg)' : '#f3f4f6',
                      color: func.status === 'ativo' ? 'var(--success-color)' : 'var(--text-muted)',
                    }}>
                      {func.status === 'ativo' ? 'ATIVO' : 'INATIVO'}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-light)' }}>{func.permissoes.length} módulos</span>
                  </div>
                  {savedId === func.id && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--success-color)', fontWeight: 700 }}>✓</span>
                  )}
                </button>
              ))}
              {funcionariosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Nenhum funcionário encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Painel Direito — Configuração de Permissões */}
          {selecionado ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Header do funcionário */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '50%',
                    background: 'var(--primary-red)', color: 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: '1.25rem'
                  }}>
                    {selecionado.nome.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.125rem' }}>{selecionado.nome}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{selecionado.cargo} · {selecionado.departamento}</div>
                    <div style={{ color: 'var(--text-light)', fontSize: '0.75rem' }}>{selecionado.email}</div>
                  </div>
                  <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-red)' }}>{permissoesSel}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>módulos habilitados</div>
                  </div>
                </div>
              </div>

              {/* Perfis Pré-definidos */}
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🎯 Aplicar Perfil de Acesso Pré-definido
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {Object.keys(PERFIS_PRESET).map(perfil => (
                    <button
                      key={perfil}
                      onClick={() => aplicarPerfil(perfil)}
                      style={{
                        padding: '0.4rem 0.875rem',
                        borderRadius: '99px',
                        border: '1px solid',
                        borderColor: perfilAplicado === perfil ? 'var(--primary-red)' : 'var(--border-color)',
                        background: perfilAplicado === perfil ? '#fee2e2' : 'white',
                        color: perfilAplicado === perfil ? 'var(--primary-red)' : 'var(--text-muted)',
                        fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {perfil}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid de Módulos */}
              <div className="card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  🔐 Módulos e Permissões Individuais
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                  {MODULOS_SISTEMA.map(mod => {
                    const ativo = !!permissoesPendentes[mod.id];
                    return (
                      <label
                        key={mod.id}
                        onClick={() => togglePermissao(mod.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem 1.25rem',
                          borderRadius: '8px',
                          border: '1px solid',
                          borderColor: ativo ? 'var(--primary-red)' : 'var(--border-color)',
                          background: ativo ? '#fff5f5' : '#fafafa',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Toggle Switch */}
                        <div style={{
                          width: '40px', height: '22px', borderRadius: '99px',
                          background: ativo ? 'var(--primary-red)' : '#d1d5db',
                          position: 'relative', flexShrink: 0,
                          transition: 'background 0.2s ease',
                        }}>
                          <div style={{
                            position: 'absolute', top: '3px',
                            left: ativo ? '21px' : '3px',
                            width: '16px', height: '16px',
                            borderRadius: '50%', background: 'white',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            transition: 'left 0.2s ease',
                          }} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <span style={{ fontSize: '1rem' }}>{mod.icon}</span>
                            <span style={{ fontWeight: 600, fontSize: '0.875rem', color: ativo ? 'var(--primary-red)' : 'var(--text-main)' }}>
                              {mod.label}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                            {mod.descricao}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', gap: '0.75rem' }}>
                  <button
                    onClick={() => setSelecionado(null)}
                    style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={salvarPermissoes}
                    disabled={salvando}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '0.75rem 2rem', opacity: salvando ? 0.7 : 1 }}
                  >
                    {salvando ? 'Salvando...' : '✓ Salvar Permissões'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
              <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Selecione um funcionário
              </div>
              <p style={{ fontSize: '0.875rem', maxWidth: '280px' }}>
                Escolha um colaborador na lista ao lado para configurar seus módulos e permissões de acesso ao sistema.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GestaoAcesso;
