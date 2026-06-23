import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Financeiro = () => {
  const [tab, setTab] = useState('pagar');
  const [transactions, setTransactions] = useState([]);
  const [formPagar, setFormPagar] = useState({ fornecedor: '', descricao: 'Outros Pagamentos', valor: '', vencimento: '' });
  const [formReceber, setFormReceber] = useState({ descricao: 'Sistema (SaaS)', valor: '', vencimento: '' });

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/finance`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(data);
    } catch (error) {
      console.error('Erro ao buscar transações:', error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handlePagar = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/finance`, {
        descricao: formPagar.descricao,
        valor: formPagar.valor,
        tipo: 'PAGAR',
        vencimento: formPagar.vencimento || new Date().toISOString(),
        fornecedor: formPagar.fornecedor
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pagamento solicitado/registrado com sucesso!');
      setFormPagar({ fornecedor: '', descricao: 'Outros Pagamentos', valor: '', vencimento: '' });
      fetchTransactions();
      setTab('extrato');
    } catch (error) {
      toast.error('Erro ao registrar pagamento.');
    }
  };

  const handleReceber = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/finance`, {
        descricao: formReceber.descricao,
        valor: formReceber.valor,
        tipo: 'RECEBER',
        vencimento: formReceber.vencimento || new Date().toISOString()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cobrança gerada com sucesso via Mercado Pago (Sandbox)!');
      setFormReceber({ descricao: 'Sistema (SaaS)', valor: '', vencimento: '' });
      fetchTransactions();
      setTab('extrato');
    } catch (error) {
      toast.error('Erro ao gerar cobrança.');
    }
  };

  const handleEfetivarPagamento = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_URL}/finance/${id}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(response.data.message);
      fetchTransactions();
    } catch (error) {
      toast.error('Erro ao processar o pagamento no Mercado Pago.');
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Financeiro / BPO</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Gestão Financeira</h1>
          <p className="section-subtitle">Módulo integrado via Mercado Pago (Sandbox). Contas a pagar, receber e conciliação.</p>
        </div>

        <div className="tabs-container" style={{ marginBottom: '2rem' }}>
          <div className="tabs-header">
            <div className={`tab ${tab === 'pagar' ? 'active' : ''}`} onClick={() => setTab('pagar')}>Pagar Fornecedor</div>
            <div className={`tab ${tab === 'receber' ? 'active' : ''}`} onClick={() => setTab('receber')}>Gerar Cobrança (Parceiro)</div>
            <div className={`tab ${tab === 'extrato' ? 'active' : ''}`} onClick={() => setTab('extrato')}>Extrato Bancário</div>
          </div>
        </div>

        {tab === 'pagar' && (
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Solicitar Pagamento a Fornecedor</h3>
            <form onSubmit={handlePagar}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">CPF/CNPJ do Fornecedor</label>
                  <input type="text" className="input-field" value={formPagar.fornecedor} onChange={e => setFormPagar({...formPagar, fornecedor: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Tipo de Despesa</label>
                  <select className="input-field" value={formPagar.descricao} onChange={e => setFormPagar({...formPagar, descricao: e.target.value})}>
                    <option>Aluguel</option>
                    <option>Água / Energia</option>
                    <option>Telefonia / VOIP</option>
                    <option>Supermercado</option>
                    <option>Outros Pagamentos</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Valor a Pagar (R$)</label>
                  <input type="number" step="0.01" className="input-field" value={formPagar.valor} onChange={e => setFormPagar({...formPagar, valor: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Data de Vencimento</label>
                  <input type="date" className="input-field" value={formPagar.vencimento} onChange={e => setFormPagar({...formPagar, vencimento: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Registrar Contas a Pagar</button>
            </form>
          </div>
        )}

        {tab === 'receber' && (
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Gerar Cobrança para Parceiro</h3>
            <form onSubmit={handleReceber}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Valor da Cobrança (R$)</label>
                  <input type="number" step="0.01" className="input-field" value={formReceber.valor} onChange={e => setFormReceber({...formReceber, valor: e.target.value})} required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Origem da Dívida</label>
                  <select className="input-field" value={formReceber.descricao} onChange={e => setFormReceber({...formReceber, descricao: e.target.value})}>
                    <option>Royalties Franquia</option>
                    <option>Sistema (SaaS)</option>
                    <option>Tráfego Pago</option>
                    <option>Banco de Dados</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Data de Vencimento</label>
                  <input type="date" className="input-field" value={formReceber.vencimento} onChange={e => setFormReceber({...formReceber, vencimento: e.target.value})} required />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: 'auto', padding: '0.75rem 2rem' }}>Emitir Boleto/Pix (Mercado Pago)</button>
            </form>
          </div>
        )}

        {tab === 'extrato' && (
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Extrato Bancário / Contas</h3>
            {transactions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                Não há movimentações registradas.
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    <th style={{ padding: '1rem 0.5rem' }}>Data/Venc.</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Descrição</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Tipo</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Valor</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Status</th>
                    <th style={{ padding: '1rem 0.5rem' }}>Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem' }}>{new Date(t.vencimento).toLocaleDateString('pt-BR')}</td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 500 }}>{t.descricao} {t.fornecedor ? `(${t.fornecedor})` : ''}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ 
                          padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700,
                          background: t.tipo === 'PAGAR' ? '#fee2e2' : '#dcfce7',
                          color: t.tipo === 'PAGAR' ? 'var(--primary-red)' : 'var(--success-color)'
                        }}>{t.tipo}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontWeight: 600 }}>R$ {t.valor.toFixed(2)}</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.875rem', color: t.status === 'Pago' ? 'var(--success-color)' : 'var(--text-muted)' }}>
                        {t.status}
                      </td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        {t.status !== 'Pago' && t.tipo === 'PAGAR' && (
                          <button onClick={() => handleEfetivarPagamento(t.id)} style={{ padding: '6px 12px', background: '#2563eb', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            Pagar
                          </button>
                        )}
                        {t.status !== 'Pago' && t.tipo === 'RECEBER' && (
                          <button onClick={() => handleEfetivarPagamento(t.id)} style={{ padding: '6px 12px', background: 'var(--success-color)', color: 'white', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                            Marcar Recebido
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>
    </>
  );
};

export default Financeiro;
