import React, { useState } from 'react';
import { ClipboardList, Plus, Send, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const fornecedoresList = [];

const statusConfig = {
  'Aguardando': { color: '#f59e0b', bg: '#fef3c7', icon: Clock },
  'Respondido': { color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  'Urgente': { color: '#ea1d2c', bg: '#fee2e2', icon: AlertCircle },
};

const cotacoesIniciais = [];

const CotacaoFornecedores = () => {
  const [cotacoes, setCotacoes] = useState(cotacoesIniciais);
  const [showModal, setShowModal] = useState(false);
  const [showResultados, setShowResultados] = useState(null);
  const [form, setForm] = useState({ item: '', quantidade: '', unidade: 'un', status: 'Aguardando', fornecedores: [] });

  const handleAdd = () => {
    if (!form.item || !form.quantidade) return alert('Preencha o item e a quantidade');
    setCotacoes([...cotacoes, { ...form, id: Date.now(), fornecedores: [] }]);
    setForm({ item: '', quantidade: '', unidade: 'un', status: 'Aguardando', fornecedores: [] });
    setShowModal(false);
  };

  const melhorFornecedor = (cotacao) => {
    if (!cotacao.fornecedores.length) return null;
    return cotacao.fornecedores.reduce((a, b) => a.valor < b.valor ? a : b);
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Sistema de Cotação</div>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nova Cotação
        </button>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Cotações de Fornecedores</h1>
          <p className="section-subtitle">Compare preços e condições de diferentes fornecedores para cada item.</p>
        </div>

        {/* Summary */}
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
          <div className="metric-card"><div className="metric-label blue">Total de Cotações</div><div className="metric-value">{cotacoes.length}</div></div>
          <div className="metric-card"><div className="metric-label green">Respondidas</div><div className="metric-value">{cotacoes.filter(c => c.status === 'Respondido').length}</div></div>
          <div className="metric-card"><div className="metric-label orange">Aguardando</div><div className="metric-value">{cotacoes.filter(c => c.status === 'Aguardando').length}</div></div>
        </div>

        {/* Cards de cotações */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cotacoes.map(cot => {
            const StatusIcon = statusConfig[cot.status].icon;
            const melhor = melhorFornecedor(cot);
            return (
              <div key={cot.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClipboardList size={22} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{cot.item}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Quantidade: <strong>{cot.quantidade} {cot.unidade}</strong> • {cot.fornecedores.length} respostas</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    {melhor && (
                      <div style={{ background: '#f0fdf4', padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #bbf7d0' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 2 }}>MELHOR PREÇO</div>
                        <div style={{ fontWeight: 700, color: 'var(--success-color)', fontSize: '0.95rem' }}>
                          {melhor.nome} — R$ {melhor.valor.toFixed(2)}/{cot.unidade}
                        </div>
                      </div>
                    )}
                    <span style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      background: statusConfig[cot.status].bg, color: statusConfig[cot.status].color,
                      padding: '4px 12px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700
                    }}>
                      <StatusIcon size={13} /> {cot.status}
                    </span>
                    <button
                      onClick={() => setShowResultados(showResultados === cot.id ? null : cot.id)}
                      style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: 'white' }}
                    >
                      {showResultados === cot.id ? 'Fechar' : 'Ver Respostas'}
                    </button>
                    <button style={{ padding: '0.5rem 1rem', background: 'var(--primary-red)', color: 'white', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <Send size={13} /> Enviar
                    </button>
                  </div>
                </div>

                {showResultados === cot.id && (
                  <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                    {cot.fornecedores.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem' }}>Nenhuma resposta recebida ainda.</p>
                    ) : (
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr>
                            {['Fornecedor', 'Valor Unit.', 'Valor Total', 'Prazo', 'Observações', 'Ação'].map(h => (
                              <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', borderBottom: '1px solid var(--border-color)' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {cot.fornecedores.map((f, i) => (
                            <tr key={i} style={{ background: melhor && f.nome === melhor.nome ? '#f0fdf4' : 'transparent' }}>
                              <td style={{ padding: '0.75rem', fontWeight: 600 }}>{f.nome} {melhor && f.nome === melhor.nome && <span style={{ background: 'var(--success-color)', color: 'white', fontSize: '0.65rem', padding: '1px 6px', borderRadius: 4, marginLeft: 4 }}>MELHOR</span>}</td>
                              <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-red)' }}>R$ {f.valor.toFixed(2)}</td>
                              <td style={{ padding: '0.75rem' }}>R$ {(f.valor * cot.quantidade).toFixed(2)}</td>
                              <td style={{ padding: '0.75rem' }}>{f.prazo}</td>
                              <td style={{ padding: '0.75rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.obs || '-'}</td>
                              <td style={{ padding: '0.75rem' }}>
                                <button style={{ padding: '4px 12px', background: 'var(--primary-red)', color: 'white', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>Escolher</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 480 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nova Cotação</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Item a Cotar *</label>
                <input className="input-field" placeholder="Ex: Caixas de Pizza 40cm" value={form.item} onChange={e => setForm({ ...form, item: e.target.value })} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="label">Quantidade *</label>
                  <input className="input-field" type="number" placeholder="500" value={form.quantidade} onChange={e => setForm({ ...form, quantidade: e.target.value })} />
                </div>
                <div>
                  <label className="label">Unidade</label>
                  <select className="input-field" value={form.unidade} onChange={e => setForm({ ...form, unidade: e.target.value })}>
                    {['un', 'kg', 'cx', 'L', 'pct'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Status</label>
                <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                  {Object.keys(statusConfig).map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={handleAdd}>Criar Cotação</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 6, fontWeight: 600, cursor: 'pointer' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CotacaoFornecedores;
