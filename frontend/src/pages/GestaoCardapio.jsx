import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const GestaoCardapio = () => {
  const [produtos, setProdutos] = useState([]);
  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', valor: '' });

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProdutos(data);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/products`, novoProduto, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produto adicionado ao cardápio!');
      setNovoProduto({ nome: '', descricao: '', valor: '' });
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao adicionar produto.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produto removido.');
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao remover produto.');
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Gestão de Cardápio / Produtos</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Cardápio e Produtos</h1>
          <p className="section-subtitle">Cadastre os produtos que serão integrados aos pedidos manuais e iFood/99 POP.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Formulário */}
          <div className="card" style={{ alignSelf: 'start' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Adicionar Novo Produto</h3>
            <form onSubmit={handleAdd}>
              <div className="form-group">
                <label className="label">Nome do Produto</label>
                <input type="text" className="input-field" placeholder="Ex: Pizza Calabresa" value={novoProduto.nome} onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">Descrição</label>
                <textarea className="input-field" placeholder="Ingredientes e detalhes..." rows="3" value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label className="label">Valor (R$)</label>
                <input type="text" className="input-field" placeholder="Ex: R$ 39,90" value={novoProduto.valor} onChange={(e) => setNovoProduto({...novoProduto, valor: e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                <Plus size={18} /> Adicionar ao Cardápio
              </button>
            </form>
          </div>

          {/* Lista */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Produtos Cadastrados ({produtos.length})</h3>
            {produtos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <p>Nenhum produto cadastrado ainda.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Use o formulário ao lado para adicionar.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {produtos.map(p => (
                  <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', alignItems: 'center' }}>
                    <div style={{ width: '60px', height: '60px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                      🍽️
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontWeight: 600 }}>{p.nome}</h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{p.descricao || 'Sem descrição'}</p>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-red)' }}>
                      {p.valor}
                    </div>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default GestaoCardapio;
