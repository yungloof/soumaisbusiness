import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Clock, Truck, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const STATUS_FLOW = ['Novo', 'Em Preparo', 'Saiu para Entrega', 'Entregue'];
const STATUS_COLORS = {
  'Novo': '#3b82f6',
  'Em Preparo': '#f97316',
  'Saiu para Entrega': '#8b5cf6',
  'Entregue': '#10b981',
};

const PedidosManuais = () => {
  const [pedidos, setPedidos] = useState([]);
  const [form, setForm] = useState({ cpf: '', itens: '', total: '' });
  const [tab, setTab] = useState('novo');

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPedidos(data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCriarPedido = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/orders`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Pedido criado com sucesso!');
      setForm({ cpf: '', itens: '', total: '' });
      fetchOrders();
      setTab('lista');
    } catch (error) {
      toast.error('Erro ao criar pedido.');
    }
  };

  const avancarStatus = async (pedido) => {
    const idx = STATUS_FLOW.indexOf(pedido.status);
    if (idx >= STATUS_FLOW.length - 1) return;
    const novoStatus = STATUS_FLOW[idx + 1];
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/orders/${pedido.id}`, { status: novoStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Status atualizado: ${novoStatus}`);
      fetchOrders();
    } catch (error) {
      toast.error('Erro ao atualizar status.');
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Pedidos Manuais</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Gestão de Pedidos Manuais</h1>
          <p className="section-subtitle">Vendas feitas fora das plataformas (balcão, telefone, whatsapp).</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[{ key: 'novo', label: 'Novo Pedido' }, { key: 'lista', label: `Pedidos (${pedidos.length})` }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ padding: '0.6rem 1.5rem', borderRadius: '20px', border: 'none', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', background: tab === t.key ? 'var(--primary-red)' : '#f3f4f6', color: tab === t.key ? 'white' : 'var(--text-main)', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'novo' && (
          <div className="card" style={{ maxWidth: '700px' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Criar Pedido</h3>
            <form onSubmit={handleCriarPedido}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">CPF do Cliente</label>
                  <input type="text" className="input-field" placeholder="000.000.000-00" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Valor Total (R$)</label>
                  <input type="text" className="input-field" placeholder="Ex: 89,90" value={form.total} onChange={e => setForm({...form, total: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Itens do Pedido</label>
                <textarea className="input-field" placeholder="Ex: 1x Pizza Calabresa, 1x Coca-Cola 2L" rows="3" value={form.itens} onChange={e => setForm({...form, itens: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Plus size={18} /> Criar Pedido
              </button>
            </form>
          </div>
        )}

        {tab === 'lista' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pedidos.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <p>Nenhum pedido registrado ainda.</p>
              </div>
            ) : pedidos.map(p => (
              <div key={p.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: STATUS_COLORS[p.status] + '20', color: STATUS_COLORS[p.status], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', flexShrink: 0 }}>
                  #{p.id}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{p.itens}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {p.cpf ? `CPF: ${p.cpf} · ` : ''}{p.total ? `R$ ${p.total} · ` : ''}{new Date(p.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <span style={{ padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, background: STATUS_COLORS[p.status] + '20', color: STATUS_COLORS[p.status] }}>
                  {p.status}
                </span>
                {p.status !== 'Entregue' && (
                  <button onClick={() => avancarStatus(p)} className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                    Avançar →
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PedidosManuais;
