import React, { useState } from 'react';
import { ShoppingBag, ExternalLink, Tag, Briefcase, Scale, Building2, Palette, TrendingUp, Landmark, Shield, BookOpen } from 'lucide-react';

const categorias = [
  {
    id: 'tecnologia',
    nome: 'Tecnologia & Digital',
    icon: TrendingUp,
    cor: '#3b82f6',
    bg: '#eff6ff',
    servicos: [
      { nome: 'Gestão de Tráfego Pago Mensal', valor: 'A DEFINIR', descricao: 'Anúncios no Google e Instagram gerenciados por especialistas.', acao: 'Contratar' },
      { nome: 'Gestão de Redes Sociais e Marketing', valor: 'R$ 1.000,00/mês', descricao: 'Criação de conteúdo, posts diários e engajamento.', acao: 'Contratar' },
      { nome: 'Kit Artes — 10 Artes', valor: 'R$ 250,00', descricao: 'Peças gráficas profissionais para delivery e redes sociais.', acao: 'Solicitar' },
      { nome: 'Contratar Horas de Desenvolvimento', valor: 'A DEFINIR', descricao: 'Banco de horas técnicas para customizações e sistemas.', acao: 'Contratar' },
      { nome: 'Certificado Digital A1', valor: 'R$ 120,00', descricao: 'Certificado digital para emissão de NF-e.', acao: 'Comprar' },
      { nome: 'Buscador de Notas Fiscais (XML)', valor: 'Grátis', descricao: 'Acesso ao portal de busca e gestão de NF-e da empresa.', acao: 'Acessar' },
    ]
  },
  {
    id: 'financeiro',
    nome: 'Financeiro & Crédito',
    icon: Landmark,
    cor: '#10b981',
    bg: '#f0fdf4',
    servicos: [
      { nome: 'Recuperação de Crédito PJ', valor: 'R$ 1.000,00', descricao: 'Assessoria para recuperar crédito e limpar o nome da empresa.', acao: 'Contratar' },
      { nome: 'Contratação de Capital de Giro', valor: 'Grátis', descricao: 'Agendamento e assessoria para obter capital de giro com bancos parceiros.', acao: 'Agendar' },
      { nome: 'Contratação de Empréstimo com Garantia', valor: 'Grátis', descricao: 'Crédito com garantia de imóvel ou veículo — melhores taxas.', acao: 'Agendar' },
      { nome: 'Oferecer Serviços Bancários', valor: 'Grátis', descricao: 'Abertura de conta PJ, cartão empresarial e conta digital.', acao: 'Acessar' },
      { nome: 'Apoio Contábil', valor: 'R$ 150,00/mês', descricao: 'Revisão e organização das finanças com suporte de contador.', acao: 'Contratar' },
      { nome: 'Contratação de Serviços Contábeis', valor: 'A DEFINIR', descricao: 'Contabilidade completa: DRE, balanço e obrigações acessórias.', acao: 'Contratar' },
    ]
  },
  {
    id: 'juridico',
    nome: 'Jurídico & Compliance',
    icon: Scale,
    cor: '#7c3aed',
    bg: '#f5f3ff',
    servicos: [
      { nome: 'Assessoria Jurídica Mensal', valor: 'R$ 1.621,00/mês', descricao: 'Acompanhamento jurídico completo com advogado dedicado.', acao: 'Contratar' },
      { nome: 'Consultoria Direito Tributário', valor: 'R$ 1.000,00', descricao: 'Análise e planejamento tributário para economizar impostos.', acao: 'Contratar' },
      { nome: 'Consultoria Direito Empresarial', valor: 'R$ 1.000,00', descricao: 'Contratos, sócios e proteção do patrimônio empresarial.', acao: 'Contratar' },
      { nome: 'Consultoria Direito Trabalhista', valor: 'R$ 1.000,00', descricao: 'CLT, contratações, demissões e obrigações com funcionários.', acao: 'Contratar' },
      { nome: 'Assessoria Direito Consumidor', valor: 'R$ 500,00', descricao: 'Proteção contra reclamações de clientes e órgãos reguladores.', acao: 'Contratar' },
      { nome: 'Defesa Processual', valor: 'A DEFINIR', descricao: 'Representação em processos judiciais e administrativos.', acao: 'Solicitar' },
      { nome: 'Consultoria Registro de Marca', valor: 'R$ 1.000,00', descricao: 'Proteção do nome e marca da sua empresa no INPI.', acao: 'Contratar' },
    ]
  },
  {
    id: 'operacional',
    nome: 'Operacional & Gestão',
    icon: Briefcase,
    cor: '#f97316',
    bg: '#fff7ed',
    servicos: [
      { nome: 'BPO Financeiro', valor: 'A DEFINIR', descricao: 'Terceirize todo o financeiro: contas a pagar, receber e fluxo de caixa.', acao: 'Contratar' },
      { nome: 'Execução de Cobrança', valor: 'A DEFINIR', descricao: 'Gestão profissional da inadimplência dos seus clientes.', acao: 'Contratar' },
      { nome: 'Mentoria Estratégica', valor: 'A DEFINIR', descricao: 'Sessões individuais com especialistas em gestão de delivery.', acao: 'Agendar' },
      { nome: 'Contratar Seguro ou Consórcio', valor: 'Grátis', descricao: 'Seguro empresarial, veicular ou consórcio com parceiros.', acao: 'Agendar' },
    ]
  },
  {
    id: 'telefonia',
    nome: 'Telefonia & Comunicação',
    icon: Building2,
    cor: '#06b6d4',
    bg: '#ecfeff',
    servicos: [
      { nome: 'Contratar Números WhatsApp', valor: 'R$ 12,99/mês', descricao: 'Chip e número virtual para o WhatsApp Business da loja.', acao: 'Contratar' },
      { nome: 'Compra BM + WhatsApp Verificado', valor: 'R$ 1.000,00', descricao: 'Business Manager verificado com perfil profissional no WhatsApp.', acao: 'Contratar' },
      { nome: 'Contratar Plano TIM', valor: 'Grátis', descricao: 'Planos corporativos TIM com condições exclusivas para a rede.', acao: 'Consultar' },
    ]
  },
];

const Marketplace = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('todos');
  const [busca, setBusca] = useState('');

  const todasCategorias = [{ id: 'todos', nome: 'Todos', icon: ShoppingBag, cor: '#6b7280', bg: '#f9fafb' }, ...categorias];

  const servicosFiltrados = categorias
    .filter(cat => categoriaAtiva === 'todos' || cat.id === categoriaAtiva)
    .map(cat => ({
      ...cat,
      servicos: cat.servicos.filter(s => s.nome.toLowerCase().includes(busca.toLowerCase()) || s.descricao.toLowerCase().includes(busca.toLowerCase()))
    }))
    .filter(cat => cat.servicos.length > 0);

  const totalServicos = categorias.reduce((acc, c) => acc + c.servicos.length, 0);

  return (
    <>
      <header className="topbar">
        <div className="page-title">Marketplace BLU</div>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{totalServicos} serviços disponíveis</span>
      </header>

      <div className="content-area">
        {/* Banner */}
        <div style={{ background: 'linear-gradient(135deg, #ea1d2c 0%, #c41824 100%)', borderRadius: 16, padding: '2rem', marginBottom: '2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>Serviços & Parceiros SOU+BLU</h1>
            <p style={{ opacity: 0.9, maxWidth: 480 }}>Contrate serviços extras para impulsionar a operação de cada restaurante da sua rede.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            {[
              { label: 'Categorias', value: categorias.length },
              { label: 'Serviços', value: totalServicos },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '0.75rem 1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ opacity: 0.8, fontSize: '0.8rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Busca + Filtros */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              className="input-field"
              placeholder="🔍 Buscar serviço..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {todasCategorias.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaAtiva(cat.id)}
                  style={{
                    padding: '0.4rem 1rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer',
                    background: categoriaAtiva === cat.id ? cat.cor : 'white',
                    color: categoriaAtiva === cat.id ? 'white' : 'var(--text-muted)',
                    border: `1px solid ${categoriaAtiva === cat.id ? cat.cor : 'var(--border-color)'}`,
                    transition: 'all 0.2s',
                  }}
                >
                  <Icon size={13} /> {cat.nome}
                </button>
              );
            })}
          </div>
        </div>

        {/* Serviços por categoria */}
        {servicosFiltrados.map(cat => {
          const Icon = cat.icon;
          return (
            <div key={cat.id} style={{ marginBottom: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ background: cat.bg, borderRadius: 10, padding: 8, display: 'flex' }}>
                  <Icon size={20} color={cat.cor} />
                </div>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{cat.nome}</h2>
                <span style={{ background: cat.bg, color: cat.cor, padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>{cat.servicos.length}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {cat.servicos.map((svc, idx) => (
                  <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem', border: `1px solid ${cat.bg === '#f9fafb' ? 'var(--border-color)' : cat.bg}`, transition: 'box-shadow 0.2s' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '0.925rem', fontWeight: 700, lineHeight: 1.4 }}>{svc.nome}</h3>
                        <Tag size={14} color={cat.cor} style={{ flexShrink: 0, marginLeft: 8, marginTop: 2 }} />
                      </div>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>{svc.descricao}</p>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cat.cor }}>{svc.valor}</div>
                    </div>
                    <button
                      onClick={() => alert(`Solicitação de "${svc.nome}" enviada para a central! Entraremos em contato em breve.`)}
                      style={{ width: '100%', padding: '0.65rem', background: cat.cor, color: 'white', borderRadius: 8, fontWeight: 700, cursor: 'pointer', border: 'none', fontSize: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      {svc.acao} <ExternalLink size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {servicosFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            <ShoppingBag size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
            <p>Nenhum serviço encontrado para "{busca}"</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Marketplace;
