import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Building2, UserPlus, FilePlus, MenuSquare, X,
  Receipt, Store, GraduationCap, DollarSign, LogOut, Package,
  ClipboardList, MessageSquare, CreditCard, ChevronDown, ChevronRight,
  ShieldCheck, LifeBuoy
} from 'lucide-react';
import '../pages/DashboardMaster.css';

const navMaster = [
  {
    label: null,
    items: [
      { id: 'dashboard', path: '/master', icon: LayoutDashboard, label: 'Painel Master', module: 'all' },
      { id: 'clientes-novo', path: '/master/clientes/novo', icon: Building2, label: 'Parceiros (Empresas)', module: 'all' },
    ]
  },
  {
    label: 'ADMINISTRAÇÃO',
    items: [
      { id: 'supervisores', path: '/master/supervisores', icon: Users, label: 'Gestão de Supervisores', module: 'all' },
      { id: 'funcionarios-novo', path: '/master/funcionarios/novo', icon: UserPlus, label: 'Novo Colaborador Interno', module: 'all' },
      { id: 'financeiro', path: '/master/financeiro', icon: DollarSign, label: 'Faturamento / Recebimentos', module: 'financeiro' },
      { id: 'chamados', path: '/master/chamados', icon: LifeBuoy, label: 'Gestão de Chamados (Suporte)', module: 'chamados' },
      { id: 'acesso', path: '/master/acesso', icon: ShieldCheck, label: 'Permissões de Acesso Interno', module: 'all' },
      { id: 'consultas-credito', path: '/master/consultas-credito', icon: CreditCard, label: 'Consultas de Crédito', module: 'all' },
    ]
  }
];

const navParceiro = [
  {
    label: null,
    items: [
      { id: 'dashboard-parceiro', path: '/master', icon: LayoutDashboard, label: 'Meu Painel', module: 'all' },
    ]
  },
  {
    label: 'OPERAÇÃO DO NEGÓCIO',
    items: [
      { id: 'cardapio', path: '/master/cardapio', icon: MenuSquare, label: 'Cardápio / Produtos', module: 'cardapio' },
      { id: 'pedidos', path: '/master/pedidos', icon: Receipt, label: 'Pedidos Manuais', module: 'pedidos' },
      { id: 'clientes', path: '/master/clientes', icon: Users, label: 'Meus Clientes (Consumidores)', module: 'all' },
    ]
  },
  {
    label: 'SUPRIMENTOS E NEGÓCIOS',
    items: [
      { id: 'fornecedores', path: '/master/fornecedores', icon: Package, label: 'Meus Fornecedores', module: 'all' },
      { id: 'cotacao', path: '/master/cotacao', icon: ClipboardList, label: 'Sistema de Cotação', module: 'all' },
      { id: 'marketplace', path: '/master/marketplace', icon: Store, label: 'Marketplace SOU+BUSINESS', module: 'marketplace' },
      { id: 'chatbot', path: '/master/chatbot', icon: MessageSquare, label: 'Caixa de Entrada / WhatsApp', module: 'all' },
    ]
  },
  {
    label: 'ADMINISTRAÇÃO DA LOJA',
    items: [
      { id: 'financeiro-loja', path: '/master/financeiro', icon: DollarSign, label: 'Contas a Pagar / BPO', module: 'financeiro' },
      { id: 'treinamentos', path: '/master/treinamentos', icon: GraduationCap, label: 'Meus Treinamentos', module: 'treinamentos' },
      { id: 'acesso-loja', path: '/master/acesso', icon: ShieldCheck, label: 'Gestão de Acesso (Equipe)', module: 'all' },
      { id: 'chamados-loja', path: '/master/chamados', icon: LifeBuoy, label: 'Abrir Chamado (Suporte)', module: 'chamados' },
    ]
  }
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [simularParceiro, setSimularParceiro] = useState(false);
  
  const user = JSON.parse(localStorage.getItem('user')) || { role: 'MASTER', modules: ['all'] };

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isVisible = (module) => user.role === 'MASTER' || user.modules?.includes('all') || user.modules?.includes(module);

  const isCliente = user.role === 'CLIENTE';
  const activeNavGroups = (simularParceiro || isCliente) ? navParceiro : navMaster;

  return (
    <div className="dashboard-layout">
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)}></div>}

      <aside className={`sidebar ${mobileMenuOpen ? 'open' : ''}`} style={{ overflowY: 'auto' }}>
        <div className="sidebar-header">
          <div className="logo-container" style={{ padding: '0.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <img src="/logo-mono.png" alt="SOU+BUSINESS Logo" style={{ height: '44px', objectFit: 'contain' }} />
            <button className="mobile-close-btn d-lg-none" onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
              <X size={24} />
            </button>
          </div>
          <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ backgroundColor: simularParceiro ? '#f59e0b' : '#1a1a1a', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 'bold' }}>
              {simularParceiro ? 'VISÃO PARCEIRO' : user.role}
            </span>
          </div>
        </div>

        {user.role === 'MASTER' && (
          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', backgroundColor: '#fafafa' }}>
            <label 
              onClick={() => setSimularParceiro(!simularParceiro)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer' }}
            >
              <div style={{
                width: '32px', height: '18px', borderRadius: '99px',
                background: simularParceiro ? 'var(--primary-red)' : '#d1d5db',
                position: 'relative', transition: 'background 0.2s ease',
              }}>
                <div style={{
                  position: 'absolute', top: '2px',
                  left: simularParceiro ? '16px' : '2px',
                  width: '14px', height: '14px',
                  borderRadius: '50%', background: 'white',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.2)', transition: 'left 0.2s ease',
                }} />
              </div>
              Simular Visão de Restaurante
            </label>
          </div>
        )}

        <nav className="sidebar-nav">
          {activeNavGroups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <div style={{ padding: '0.75rem 1rem 0.25rem', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-light)', letterSpacing: '0.08em', marginTop: gi > 0 ? '0.5rem' : 0 }}>
                  {group.label}
                </div>
              )}
              {group.items.filter(item => isVisible(item.module)).map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path || (item.path === '/master' && location.pathname === '/master/');
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`nav-item ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span className="nav-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <LogOut size={18} />
            <span className="nav-label">Sair</span>
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="mobile-header">
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <MenuSquare size={24} />
          </button>
          <span className="mobile-header-title">{user.role === 'MASTER' ? 'Painel Master' : 'Painel Parceiro'}</span>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
