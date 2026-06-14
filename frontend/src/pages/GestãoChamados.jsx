import React, { useState } from 'react';

const categoriasCor = {
  'suporte': { bg: '#eff6ff', border: '#93c5fd', badge: '#3b82f6', text: '#1d4ed8' },
  'financeiro': { bg: '#fefce8', border: '#fcd34d', badge: '#f59e0b', text: '#92400e' },
  'tecnico': { bg: '#f0fdf4', border: '#86efac', badge: '#22c55e', text: '#15803d' },
  'comercial': { bg: '#fdf4ff', border: '#d8b4fe', badge: '#a855f7', text: '#7e22ce' },
  'rh': { bg: '#fff7ed', border: '#fdba74', badge: '#f97316', text: '#c2410c' },
};

const statusConfig = {
  'aberto': { label: 'Aberto', bg: '#fee2e2', color: 'var(--primary-red)' },
  'em_andamento': { label: 'Em Andamento', bg: '#fef3c7', color: '#92400e' },
  'aguardando': { label: 'Aguardando', bg: '#eff6ff', color: '#1d4ed8' },
  'resolvido': { label: 'Resolvido', bg: 'var(--success-bg)', color: 'var(--success-color)' },
  'fechado': { label: 'Fechado', bg: '#f3f4f6', color: 'var(--text-muted)' },
};

const prioridadeConfig = {
  'baixa': { label: 'Baixa', color: 'var(--success-color)' },
  'media': { label: 'Média', color: '#f59e0b' },
  'alta': { label: 'Alta', color: '#f97316' },
  'urgente': { label: 'Urgente', color: 'var(--primary-red)' },
};

const chamadosDemo = [
  {
    id: 'CHM-001', titulo: 'Erro no módulo de pagamentos EFI Bank', categoria: 'tecnico',
    status: 'em_andamento', prioridade: 'urgente', responsavel: 'Carlos Supervisor',
    abertura: '2026-06-10 09:14', cliente: 'Sushi Lima', descricao: 'O módulo de pagamentos está retornando erro 500 ao tentar emitir boleto. Já tentei mais de 3 vezes hoje.',
    mensagens: [
      { autor: 'Julia Atendimento', data: '2026-06-10 09:30', texto: 'Chamado recebido! Estamos verificando a integração com o EFI Bank.' },
      { autor: 'Carlos Supervisor', data: '2026-06-10 10:00', texto: 'Identificamos o problema: chave API expirada. Atualizando agora.' },
    ]
  },
  {
    id: 'CHM-002', titulo: 'Como cadastrar novo produto no cardápio?', categoria: 'suporte',
    status: 'resolvido', prioridade: 'baixa', responsavel: 'Julia Atendimento',
    abertura: '2026-06-09 14:22', cliente: 'Pizzaria Napolitana', descricao: 'Não consigo entender como adicionar uma nova categoria de produto no cardápio.',
    mensagens: [
      { autor: 'Julia Atendimento', data: '2026-06-09 14:50', texto: 'Olá! Acesse a página Cardápio/Produtos > clique em "+ Novo Produto" e preencha as informações. Qualquer dúvida, responda aqui!' },
    ]
  },
  {
    id: 'CHM-003', titulo: 'Nota fiscal não foi emitida após pedido', categoria: 'financeiro',
    status: 'aberto', prioridade: 'alta', responsavel: null,
    abertura: '2026-06-13 08:55', cliente: 'Hamburgueria do Bairro', descricao: 'O pedido #4521 foi concluído e pago, mas a nota fiscal automática não foi emitida para o cliente.',
    mensagens: []
  },
  {
    id: 'CHM-004', titulo: 'Contratar horas de desenvolvimento (DESV)', categoria: 'comercial',
    status: 'aguardando', prioridade: 'media', responsavel: 'Carlos Supervisor',
    abertura: '2026-06-12 16:30', cliente: 'Padaria Central', descricao: 'Gostaria de solicitar um pacote de horas de desenvolvimento para customizar o sistema conforme nossas necessidades.',
    mensagens: [
      { autor: 'Carlos Supervisor', data: '2026-06-12 17:00', texto: 'Obrigado pelo contato! Vou verificar a disponibilidade da equipe de desenvolvimento e te retorno com um orçamento.' },
    ]
  },
  {
    id: 'CHM-005', titulo: 'Funcionário sem acesso ao módulo de Treinamentos', categoria: 'rh',
    status: 'aberto', prioridade: 'media', responsavel: null,
    abertura: '2026-06-13 11:20', cliente: 'Sushi Lima', descricao: 'A funcionária Beatriz tentou acessar o módulo de Treinamentos e recebeu erro de "sem permissão". O cargo dela é Atendente.',
    mensagens: []
  },
];

const NovoTicketModal = ({ onClose, onSalvar }) => {
  const [form, setForm] = useState({ titulo: '', categoria: 'suporte', prioridade: 'media', descricao: '', cliente: '' });
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '560px', padding: '2rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', fontSize: '1.25rem', color: 'var(--text-muted)', cursor: 'pointer' }}>✕</button>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '1.5rem' }}>🎫 Abrir Novo Chamado</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Título do Chamado</label>
            <input name="titulo" type="text" className="input-field" placeholder="Descreva o problema em poucas palavras" value={form.titulo} onChange={handleChange} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Categoria</label>
              <select name="categoria" className="input-field" value={form.categoria} onChange={handleChange}>
                <option value="suporte">Suporte ao Sistema</option>
                <option value="financeiro">Financeiro / BPO</option>
                <option value="tecnico">Técnico / Integração</option>
                <option value="comercial">Comercial / Serviços</option>
                <option value="rh">RH / Colaboradores</option>
              </select>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Prioridade</label>
              <select name="prioridade" className="input-field" value={form.prioridade} onChange={handleChange}>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
                <option value="urgente">Urgente</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Cliente / Parceiro Afetado</label>
            <input name="cliente" type="text" className="input-field" placeholder="Nome do restaurante ou empresa" value={form.cliente} onChange={handleChange} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Descrição Detalhada</label>
            <textarea name="descricao" className="input-field" rows={4} placeholder="Descreva o problema com o máximo de detalhes possível..." value={form.descricao} onChange={handleChange} style={{ resize: 'vertical' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '0.7rem 1.25rem', border: '1px solid var(--border-color)', borderRadius: '6px', background: 'white', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', color: 'var(--text-muted)' }}>
            Cancelar
          </button>
          <button onClick={() => onSalvar(form)} className="btn-primary" style={{ width: 'auto', padding: '0.7rem 1.5rem' }}>
            Abrir Chamado
          </button>
        </div>
      </div>
    </div>
  );
};

const GestãoChamados = () => {
  const [chamados, setChamados] = useState(chamadosDemo);
  const [selecionado, setSelecionado] = useState(null);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroCat, setFiltroCat] = useState('todos');
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);

  const counts = {
    aberto: chamados.filter(c => c.status === 'aberto').length,
    em_andamento: chamados.filter(c => c.status === 'em_andamento').length,
    aguardando: chamados.filter(c => c.status === 'aguardando').length,
    resolvido: chamados.filter(c => c.status === 'resolvido').length,
  };

  const chamadosFiltrados = chamados.filter(c => {
    const matchStatus = filtroStatus === 'todos' || c.status === filtroStatus;
    const matchCat = filtroCat === 'todos' || c.categoria === filtroCat;
    const matchBusca = c.titulo.toLowerCase().includes(busca.toLowerCase()) || c.id.includes(busca.toUpperCase());
    return matchStatus && matchCat && matchBusca;
  });

  const abrirChamado = (c) => setSelecionado(c);

  const enviarMensagem = () => {
    if (!novaMensagem.trim() || !selecionado) return;
    const msg = { autor: 'Você (Admin)', data: new Date().toLocaleString('pt-BR'), texto: novaMensagem };
    const atualizado = { ...selecionado, mensagens: [...selecionado.mensagens, msg], status: selecionado.status === 'aberto' ? 'em_andamento' : selecionado.status };
    setChamados(prev => prev.map(c => c.id === selecionado.id ? atualizado : c));
    setSelecionado(atualizado);
    setNovaMensagem('');
  };

  const mudarStatus = (novoStatus) => {
    const atualizado = { ...selecionado, status: novoStatus };
    setChamados(prev => prev.map(c => c.id === selecionado.id ? atualizado : c));
    setSelecionado(atualizado);
  };

  const abrirNovoTicket = (form) => {
    const novo = {
      id: `CHM-00${chamados.length + 1}`,
      titulo: form.titulo || 'Novo chamado',
      categoria: form.categoria,
      status: 'aberto',
      prioridade: form.prioridade,
      responsavel: null,
      abertura: new Date().toLocaleString('pt-BR'),
      cliente: form.cliente || 'Não informado',
      descricao: form.descricao,
      mensagens: [],
    };
    setChamados(prev => [novo, ...prev]);
    setModalAberto(false);
    setSelecionado(novo);
  };

  return (
    <>
      {modalAberto && <NovoTicketModal onClose={() => setModalAberto(false)} onSalvar={abrirNovoTicket} />}

      <header className="topbar">
        <div className="page-title">Gestão de Chamados</div>
        <button className="btn-primary" onClick={() => setModalAberto(true)} style={{ width: 'auto', padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>
          + Abrir Chamado
        </button>
      </header>

      <div className="content-area">
        {/* Métricas rápidas */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Abertos', val: counts.aberto, color: 'var(--primary-red)', bg: '#fee2e2', key: 'aberto' },
            { label: 'Em Andamento', val: counts.em_andamento, color: '#92400e', bg: '#fef3c7', key: 'em_andamento' },
            { label: 'Aguardando', val: counts.aguardando, color: '#1d4ed8', bg: '#eff6ff', key: 'aguardando' },
            { label: 'Resolvidos', val: counts.resolvido, color: 'var(--success-color)', bg: 'var(--success-bg)', key: 'resolvido' },
          ].map(m => (
            <button
              key={m.key}
              onClick={() => setFiltroStatus(filtroStatus === m.key ? 'todos' : m.key)}
              style={{
                background: filtroStatus === m.key ? m.bg : 'white',
                border: `1px solid ${filtroStatus === m.key ? m.color : 'var(--border-color)'}`,
                borderRadius: '10px', padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: filtroStatus === m.key ? m.color : 'var(--text-main)' }}>{m.val}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '2px' }}>{m.label}</div>
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '1.5rem', minHeight: '560px' }}>

          {/* Lista de chamados */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Filtros */}
            <div className="card" style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="text" className="input-field" placeholder="🔍  Buscar por título ou ID..." value={busca} onChange={e => setBusca(e.target.value)} style={{ fontSize: '0.8rem' }} />
              <select className="input-field" value={filtroCat} onChange={e => setFiltroCat(e.target.value)} style={{ fontSize: '0.8rem' }}>
                <option value="todos">Todas as categorias</option>
                <option value="suporte">Suporte ao Sistema</option>
                <option value="financeiro">Financeiro / BPO</option>
                <option value="tecnico">Técnico / Integração</option>
                <option value="comercial">Comercial / Serviços</option>
                <option value="rh">RH / Colaboradores</option>
              </select>
            </div>

            {/* Cards de chamados */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto', maxHeight: '500px' }}>
              {chamadosFiltrados.map(c => {
                const cat = categoriasCor[c.categoria] || categoriasCor['suporte'];
                const st = statusConfig[c.status];
                const pr = prioridadeConfig[c.prioridade];
                const isActive = selecionado?.id === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => abrirChamado(c)}
                    style={{
                      display: 'flex', flexDirection: 'column', gap: '0.5rem',
                      padding: '1rem', borderRadius: '8px', cursor: 'pointer', textAlign: 'left',
                      border: isActive ? `2px solid var(--primary-red)` : '1px solid var(--border-color)',
                      background: isActive ? '#fff5f5' : 'white',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: cat.text, background: cat.bg, border: `1px solid ${cat.border}`, padding: '2px 7px', borderRadius: '99px' }}>
                          {c.categoria.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#6b7280' }}>{c.id}</span>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: pr.color, flexShrink: 0 }}>⚡ {pr.label}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{c.titulo}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.72rem', background: st.bg, color: st.color, fontWeight: 600, padding: '2px 8px', borderRadius: '99px' }}>{st.label}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-light)' }}>{c.abertura.split(' ')[0]}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>🏢 {c.cliente}</div>
                  </button>
                );
              })}
              {chamadosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                  Nenhum chamado encontrado.
                </div>
              )}
            </div>
          </div>

          {/* Detalhe do Chamado */}
          {selecionado ? (
            <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280' }}>{selecionado.id}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: prioridadeConfig[selecionado.prioridade].color }}>
                      ⚡ {prioridadeConfig[selecionado.prioridade].label}
                    </span>
                    <span style={{
                      fontSize: '0.75rem', fontWeight: 700,
                      background: statusConfig[selecionado.status].bg, color: statusConfig[selecionado.status].color,
                      padding: '3px 10px', borderRadius: '99px'
                    }}>
                      {statusConfig[selecionado.status].label}
                    </span>
                  </div>
                  <h2 style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-main)', lineHeight: 1.4 }}>{selecionado.titulo}</h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    🏢 {selecionado.cliente} · Aberto em {selecionado.abertura}
                  </div>
                </div>
                {/* Ações de Status */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  {Object.entries(statusConfig).filter(([k]) => k !== selecionado.status).map(([k, v]) => (
                    <button
                      key={k}
                      onClick={() => mudarStatus(k)}
                      style={{
                        padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 600, borderRadius: '6px',
                        border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', color: 'var(--text-muted)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      → {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Descrição */}
              <div style={{ background: '#f8f9fa', borderRadius: '8px', padding: '1rem', fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6, borderLeft: '3px solid var(--border-color)' }}>
                <strong style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.5rem' }}>DESCRIÇÃO DO PROBLEMA</strong>
                {selecionado.descricao}
              </div>

              {/* Responsável */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.875rem' }}>
                  {selecionado.responsavel ? selecionado.responsavel.charAt(0) : '?'}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Responsável pelo Atendimento</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{selecionado.responsavel || 'Não atribuído'}</div>
                </div>
              </div>

              {/* Histórico de Mensagens */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Histórico de Atendimento ({selecionado.mensagens.length} mensagens)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '200px', overflowY: 'auto' }}>
                  {selecionado.mensagens.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', background: '#f8f9fa', borderRadius: '8px' }}>
                      Nenhuma resposta ainda. Inicie o atendimento abaixo.
                    </div>
                  ) : selecionado.mensagens.map((msg, i) => (
                    <div key={i} style={{ background: '#f8f9fa', borderRadius: '8px', padding: '0.875rem', borderLeft: '3px solid var(--primary-red)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>{msg.autor}</span>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{msg.data}</span>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.5 }}>{msg.texto}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Área de Resposta */}
              {selecionado.status !== 'fechado' && selecionado.status !== 'resolvido' && (
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <label className="label">Responder / Adicionar Atualização</label>
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <textarea
                      className="input-field"
                      rows={3}
                      value={novaMensagem}
                      onChange={e => setNovaMensagem(e.target.value)}
                      placeholder="Digite uma resposta ou atualização do status..."
                      style={{ resize: 'none', flex: 1 }}
                      onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) enviarMensagem(); }}
                    />
                    <button
                      onClick={enviarMensagem}
                      className="btn-primary"
                      style={{ width: 'auto', padding: '0.75rem 1.25rem', flexShrink: 0 }}
                    >
                      Enviar
                    </button>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginTop: '0.25rem' }}>Ctrl+Enter para enviar</div>
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <div style={{ fontWeight: 600, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Selecione um chamado
              </div>
              <p style={{ fontSize: '0.875rem', maxWidth: '280px' }}>
                Clique em um chamado na lista para visualizar detalhes, responder e atualizar o status.
              </p>
              <button onClick={() => setModalAberto(true)} className="btn-primary" style={{ width: 'auto', padding: '0.75rem 1.5rem', marginTop: '1.5rem' }}>
                + Abrir Novo Chamado
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default GestãoChamados;
