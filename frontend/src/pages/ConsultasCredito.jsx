import React, { useState } from 'react';
import { Search, CreditCard, Shield, FileCheck, AlertTriangle, User, Car, Briefcase, Loader2 } from 'lucide-react';

const consultas = [
  {
    categoria: 'Anti Fraude',
    icon: Shield,
    cor: '#dc2626',
    bg: '#fee2e2',
    itens: [
      { nome: 'Antifraude — Chave PIX', preco: 5.00, endpoint: 'antifraude-pix', param: 'chave', placeholder: 'Digite a chave PIX (CPF, CNPJ, e-mail ou telefone)' },
      { nome: 'Validação Cadastral — Brasil', preco: 1.25, endpoint: 'validacao-cadastral', param: 'documento', placeholder: 'CPF ou CNPJ' },
    ]
  },
  {
    categoria: 'Certidões',
    icon: FileCheck,
    cor: '#7c3aed',
    bg: '#f5f3ff',
    itens: [
      { nome: 'Certidão Conjunta de Débitos — PF', preco: 1.25, endpoint: 'certidao-conjunta-pf', param: 'cpf', placeholder: 'CPF do contribuinte' },
      { nome: 'Certidão Conjunta de Débitos — PJ', preco: 1.25, endpoint: 'certidao-conjunta-pj', param: 'cnpj', placeholder: 'CNPJ da empresa' },
    ]
  },
  {
    categoria: 'Análise de Crédito',
    icon: CreditCard,
    cor: '#0284c7',
    bg: '#e0f2fe',
    itens: [
      { nome: 'Histórico de Crédito — SCR', preco: 15.00, endpoint: 'historico-scr', param: 'documento', placeholder: 'CPF ou CNPJ' },
      { nome: 'Protestos — Brasil', preco: 15.00, endpoint: 'protestos', param: 'documento', placeholder: 'CPF ou CNPJ' },
      { nome: 'Restrições e Negativações', preco: 8.00, endpoint: 'restricoes-negativacoes', param: 'documento', placeholder: 'CPF ou CNPJ' },
      { nome: 'Análise de Risco Positivo — PJ', preco: 40.00, endpoint: 'risco-positivo-pj', param: 'cnpj', placeholder: 'CNPJ da empresa' },
      { nome: 'Análise de Risco Positivo — PF', preco: 40.00, endpoint: 'risco-positivo-pf', param: 'cpf', placeholder: 'CPF do cliente' },
    ]
  },
  {
    categoria: 'Consulta de Dados',
    icon: User,
    cor: '#059669',
    bg: '#d1fae5',
    itens: [
      { nome: 'Cadastro Pessoal — Completo', preco: 1.25, endpoint: 'cadastro-pf', param: 'cpf', placeholder: 'CPF do cliente' },
      { nome: 'Cadastro Empresarial — Completo', preco: 3.00, endpoint: 'cadastro-pj', param: 'cnpj', placeholder: 'CNPJ da empresa' },
      { nome: 'Vínculo Empregatício', preco: 2.00, endpoint: 'vinculo-emprego', param: 'cpf', placeholder: 'CPF do colaborador' },
      { nome: 'Certidão TJ — Cível, Criminal e Fiscal', preco: 2.00, endpoint: 'certidao-tj', param: 'documento', placeholder: 'CPF ou CNPJ' },
      { nome: 'Consulta Veicular', preco: 5.00, endpoint: 'consulta-veiculo', param: 'placa', placeholder: 'Placa do veículo (ex: ABC1234)' },
      { nome: 'Processos Judiciais — Completo', preco: 15.00, endpoint: 'processos-judiciais', param: 'documento', placeholder: 'CPF ou CNPJ' },
    ]
  },
];

const ConsultasCredito = () => {
  const [consultaAtiva, setConsultaAtiva] = useState(null);
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [historico, setHistorico] = useState([]);

  const handleConsultar = async (item) => {
    if (!inputVal.trim()) return alert('Digite o documento para consultar');

    const token = localStorage.getItem('token');
    const cleanDoc = inputVal.replace(/\D/g, '');

    setLoading(true);
    setResultado(null);

    try {
      const response = await fetch(`/api/fontedata/consulta/${item.endpoint}?${item.param}=${cleanDoc}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();

      setResultado({ item, documento: inputVal, data, ok: response.ok });
      setHistorico(prev => [{
        nome: item.nome, documento: inputVal, preco: item.preco,
        data: new Date().toLocaleString('pt-BR'), status: response.ok ? 'Sucesso' : 'Erro'
      }, ...prev]);
    } catch (err) {
      setResultado({ item, documento: inputVal, data: { erro: err.message }, ok: false });
    } finally {
      setLoading(false);
    }
  };

  const totalGasto = historico.filter(h => h.status === 'Sucesso').reduce((acc, h) => acc + h.preco, 0);

  return (
    <>
      <header className="topbar">
        <div className="page-title">Consultas de Crédito & Dados</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f0fdf4', padding: '0.4rem 1rem', borderRadius: 8, border: '1px solid #bbf7d0' }}>
          <CreditCard size={16} color="#10b981" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#10b981' }}>R$ {totalGasto.toFixed(2).replace('.', ',')} consumido hoje</span>
        </div>
      </header>

      <div className="content-area">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Painel principal */}
          <div>
            <div className="section-header">
              <h1 className="section-title">Central de Consultas</h1>
              <p className="section-subtitle">Selecione uma consulta, insira o documento e clique em consultar. O custo por consulta é debitado automaticamente.</p>
            </div>

            {consultas.map(cat => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.categoria} style={{ marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <div style={{ background: cat.bg, borderRadius: 8, padding: 7, display: 'flex' }}>
                      <CatIcon size={18} color={cat.cor} />
                    </div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 700 }}>{cat.categoria}</h2>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {cat.itens.map((item, idx) => {
                      const isAtiva = consultaAtiva?.nome === item.nome;
                      return (
                        <div key={idx} style={{
                          background: 'white', border: `1px solid ${isAtiva ? cat.cor : 'var(--border-color)'}`,
                          borderRadius: 10, padding: '1rem 1.25rem', transition: 'all 0.2s',
                          boxShadow: isAtiva ? `0 0 0 3px ${cat.cor}22` : 'none'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isAtiva ? '1rem' : 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.nome}</div>
                                <div style={{ color: cat.cor, fontSize: '0.85rem', fontWeight: 700 }}>R$ {item.preco.toFixed(2).replace('.', ',')} / consulta</div>
                              </div>
                            </div>
                            <button
                              onClick={() => { setConsultaAtiva(isAtiva ? null : item); setInputVal(''); setResultado(null); }}
                              style={{
                                padding: '0.45rem 1rem', borderRadius: 6, fontWeight: 600, fontSize: '0.85rem',
                                background: isAtiva ? cat.cor : 'white', color: isAtiva ? 'white' : cat.cor,
                                border: `1px solid ${cat.cor}`, cursor: 'pointer', whiteSpace: 'nowrap'
                              }}
                            >
                              {isAtiva ? 'Fechar' : 'Selecionar'}
                            </button>
                          </div>

                          {isAtiva && (
                            <div>
                              <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                  className="input-field"
                                  placeholder={item.placeholder}
                                  value={inputVal}
                                  onChange={e => setInputVal(e.target.value)}
                                  style={{ flex: 1 }}
                                />
                                <button
                                  onClick={() => handleConsultar(item)}
                                  disabled={loading}
                                  style={{
                                    padding: '0 1.25rem', background: cat.cor, color: 'white', borderRadius: 6,
                                    fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    gap: '0.4rem', border: 'none', whiteSpace: 'nowrap', fontSize: '0.875rem'
                                  }}
                                >
                                  {loading ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={16} />}
                                  Consultar
                                </button>
                              </div>

                              {resultado && resultado.item.nome === item.nome && (
                                <div style={{ marginTop: '1rem', background: resultado.ok ? '#f0fdf4' : '#fff1f2', border: `1px solid ${resultado.ok ? '#bbf7d0' : '#fecdd3'}`, borderRadius: 8, padding: '1rem' }}>
                                  <div style={{ fontWeight: 700, color: resultado.ok ? '#10b981' : '#dc2626', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                                    {resultado.ok ? '✅ Consulta realizada com sucesso' : '❌ Erro na consulta'}
                                  </div>
                                  <pre style={{ fontSize: '0.78rem', color: 'var(--text-main)', whiteSpace: 'pre-wrap', wordBreak: 'break-all', maxHeight: 300, overflow: 'auto', margin: 0 }}>
                                    {JSON.stringify(resultado.data, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar de histórico */}
          <div style={{ position: 'sticky', top: '1rem' }}>
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertTriangle size={16} color="#f59e0b" /> Histórico do Dia
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: 500, overflowY: 'auto' }}>
                {historico.map((h, i) => (
                  <div key={i} style={{ padding: '0.75rem', background: '#f9fafb', borderRadius: 8, borderLeft: `3px solid ${h.status === 'Sucesso' ? 'var(--success-color)' : 'var(--primary-red)'}` }}>
                    <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: 2 }}>{h.nome}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{h.documento}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: '0.78rem' }}>
                      <span style={{ color: 'var(--primary-red)', fontWeight: 700 }}>R$ {h.preco.toFixed(2).replace('.', ',')}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{h.data}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                  <span>Total consumido</span>
                  <span style={{ color: 'var(--primary-red)' }}>R$ {totalGasto.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsultasCredito;
