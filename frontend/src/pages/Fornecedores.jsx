import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Phone, Mail, Package } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const categorias = ['Todos', 'Alimentos', 'Bebidas', 'Embalagens', 'Descartáveis', 'Limpeza', 'Outros'];

const Fornecedores = () => {
  const [fornecedores, setFornecedores] = useState([]);
  const [busca, setBusca] = useState('');
  const [categoriaFiltro, setCategoriaFiltro] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nome: '', contato: '', telefone: '', email: '', categoria: 'Alimentos' });

  const filtrados = fornecedores.filter(f => {
    const matchBusca = f.nome.toLowerCase().includes(busca.toLowerCase()) || f.contato.toLowerCase().includes(busca.toLowerCase());
    const matchCat = categoriaFiltro === 'Todos' || f.categoria === categoriaFiltro;
    return matchBusca && matchCat;
  });

  const fetchFornecedores = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFornecedores(data);
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const handleAdd = async () => {
    if (!form.nome) return toast.error('Informe o nome do fornecedor');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/suppliers`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ nome: '', contato: '', telefone: '', email: '', categoria: 'Alimentos' });
      setShowModal(false);
      fetchFornecedores();
      toast.success('Fornecedor adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar fornecedor:', error);
      toast.error('Erro ao salvar fornecedor');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remover este fornecedor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/suppliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFornecedores();
        toast.success('Fornecedor removido com sucesso!');
      } catch (error) {
        console.error('Erro ao remover fornecedor:', error);
        toast.error('Erro ao remover fornecedor');
      }
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Fornecedores</div>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Novo Fornecedor
        </button>
      </header>

      <div className="content-area">
        {/* Stats */}
        <div className="metrics-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
          {[
            { label: 'Total de Fornecedores', value: fornecedores.length, color: 'blue' },
            { label: 'Ativos', value: fornecedores.filter(f => f.status === 'Ativo').length, color: 'green' },
            { label: 'Inativos', value: fornecedores.filter(f => f.status === 'Inativo').length, color: 'red' },
          ].map((m, i) => (
            <div key={i} className="metric-card">
              <div className={`metric-label ${m.color}`}>{m.label}</div>
              <div className="metric-value">{m.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input-field"
                style={{ paddingLeft: '2.25rem' }}
                placeholder="Buscar por nome ou contato..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categorias.map(cat => (
                <button key={cat} onClick={() => setCategoriaFiltro(cat)}
                  style={{
                    padding: '0.4rem 0.85rem', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', border: '1px solid',
                    backgroundColor: categoriaFiltro === cat ? 'var(--primary-red)' : 'white',
                    color: categoriaFiltro === cat ? 'white' : 'var(--text-muted)',
                    borderColor: categoriaFiltro === cat ? 'var(--primary-red)' : 'var(--border-color)',
                  }}>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="tabs-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Fornecedor</th>
                  <th>Contato</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Categoria</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map(f => (
                  <tr key={f.id} className="table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={18} color="var(--text-muted)" />
                        </div>
                        <strong>{f.nome}</strong>
                      </div>
                    </td>
                    <td>{f.contato}</td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Phone size={14} /> {f.telefone}</span></td>
                    <td><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Mail size={14} /> {f.email}</span></td>
                    <td>
                      <span style={{ background: '#e0f2fe', color: '#0284c7', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600 }}>{f.categoria}</span>
                    </td>
                    <td>
                      <span style={{
                        background: f.status === 'Ativo' ? 'var(--success-bg)' : '#fee2e2',
                        color: f.status === 'Ativo' ? 'var(--success-color)' : 'var(--primary-red)',
                        padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600
                      }}>{f.status}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button style={{ padding: '6px', borderRadius: 6, background: '#f3f4f6', cursor: 'pointer' }}>
                          <Edit2 size={14} color="var(--text-muted)" />
                        </button>
                        <button style={{ padding: '6px', borderRadius: 6, background: '#fee2e2', cursor: 'pointer' }} onClick={() => handleDelete(f.id)}>
                          <Trash2 size={14} color="var(--primary-red)" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtrados.length === 0 && (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum fornecedor encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 520 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Novo Fornecedor</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { label: 'Nome da Empresa *', key: 'nome', placeholder: 'Ex: Distribuidora X' },
                { label: 'Nome do Contato', key: 'contato', placeholder: 'Ex: João Silva' },
                { label: 'Telefone', key: 'telefone', placeholder: '(62) 9999-9999' },
                { label: 'E-mail', key: 'email', placeholder: 'contato@empresa.com' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="label">{label}</label>
                  <input className="input-field" placeholder={placeholder} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div style={{ gridColumn: '1 / -1' }}>
                <label className="label">Categoria</label>
                <select className="input-field" value={form.categoria} onChange={e => setForm({ ...form, categoria: e.target.value })}>
                  {categorias.filter(c => c !== 'Todos').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={handleAdd}>Salvar Fornecedor</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 6, fontWeight: 600, cursor: 'pointer', flex: 1 }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Fornecedores;
