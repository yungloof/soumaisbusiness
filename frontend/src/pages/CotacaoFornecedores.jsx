import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ClipboardList, Plus, CheckCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const statusConfig = {
  'Rascunho': { color: '#6b7280', bg: '#f3f4f6', icon: Clock },
  'Aguardando': { color: '#f59e0b', bg: '#fef3c7', icon: Clock },
  'Respondido': { color: '#10b981', bg: '#d1fae5', icon: CheckCircle },
  'Urgente': { color: '#ea1d2c', bg: '#fee2e2', icon: AlertCircle },
};

const CotacaoFornecedores = () => {
  const [cotacoes, setCotacoes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titulo: '', itens: '', status: 'Aguardando' });

  const fetchQuotations = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/quotations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCotacoes(data);
    } catch (error) {
      console.error('Erro ao buscar cotações:', error);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  const handleAdd = async () => {
    if (!form.titulo) return toast.error('Preencha o título da cotação');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/quotations`, {
        titulo: form.titulo,
        itens: [form.itens],
        status: form.status
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cotação criada com sucesso!');
      setForm({ titulo: '', itens: '', status: 'Aguardando' });
      setShowModal(false);
      fetchQuotations();
    } catch (error) {
      toast.error('Erro ao criar cotação.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/quotations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Cotação removida.');
      fetchQuotations();
    } catch (error) {
      toast.error('Erro ao remover cotação.');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/quotations/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status atualizado: ${status}`);
      fetchQuotations();
    } catch (error) {
      toast.error('Erro ao atualizar cotação.');
    }
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>TOTAL</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{cotacoes.length}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--success-color)', marginBottom: '0.25rem' }}>RESPONDIDAS</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--success-color)' }}>{cotacoes.filter(c => c.status === 'Respondido').length}</div>
          </div>
          <div className="card" style={{ textAlign: 'center', padding: '1.25rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#f59e0b', marginBottom: '0.25rem' }}>AGUARDANDO</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{cotacoes.filter(c => c.status === 'Aguardando').length}</div>
          </div>
        </div>

        {/* Cotações Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {cotacoes.length === 0 && (
            <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
              <ClipboardList size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
              <p style={{ fontWeight: 600 }}>Nenhuma cotação criada</p>
              <p style={{ fontSize: '0.85rem' }}>Clique em "Nova Cotação" para começar.</p>
            </div>
          )}
          {cotacoes.map(cot => {
            const cfg = statusConfig[cot.status] || statusConfig['Aguardando'];
            const StatusIcon = cfg.icon;
            return (
              <div key={cot.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: 44, height: 44, borderRadius: 10, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ClipboardList size={22} color="var(--text-muted)" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{cot.titulo}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        Criado em {new Date(cot.createdAt).toLocaleDateString('pt-BR')}
                        {cot.melhorPreco && ` · Melhor preço: R$ ${cot.melhorPreco}`}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: cfg.bg, color: cfg.color }}>
                      <StatusIcon size={14} /> {cot.status}
                    </span>
                    {cot.status === 'Aguardando' && (
                      <button onClick={() => updateStatus(cot.id, 'Respondido')} style={{ padding: '0.35rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--success-color)', background: 'white', color: 'var(--success-color)', cursor: 'pointer' }}>
                        ✓ Marcar Respondida
                      </button>
                    )}
                    <button onClick={() => handleDelete(cot.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Nova Cotação */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={() => setShowModal(false)}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Nova Cotação</h3>
            <div className="form-group">
              <label className="label">Título / Item Principal</label>
              <input type="text" className="input-field" placeholder="Ex: Farinha de Trigo 50kg" value={form.titulo} onChange={e => setForm({...form, titulo: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Detalhes / Observações</label>
              <textarea className="input-field" placeholder="Quantidade, especificações, prazo..." rows="3" value={form.itens} onChange={e => setForm({...form, itens: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="label">Prioridade</label>
              <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="Aguardando">Normal</option>
                <option value="Urgente">Urgente</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn-primary" onClick={handleAdd} style={{ flex: 1 }}>Criar Cotação</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '0.75rem', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'white', cursor: 'pointer', fontWeight: 600 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CotacaoFornecedores;
