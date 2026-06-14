import React, { useState } from 'react';

const GestaoCardapio = () => {
  const [produtos, setProdutos] = useState([
    { id: 1, nome: 'Hambúrguer Artesanal', descricao: 'Pão brioche, carne 180g, queijo prato', valor: 'R$ 35,00', imagem: '🍔' }
  ]);

  const [novoProduto, setNovoProduto] = useState({ nome: '', descricao: '', valor: '' });

  const handleAdd = (e) => {
    e.preventDefault();
    setProdutos([...produtos, { id: Date.now(), ...novoProduto, imagem: '🍽️' }]);
    setNovoProduto({ nome: '', descricao: '', valor: '' });
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
                <textarea className="input-field" placeholder="Ingredientes e detalhes..." rows="3" value={novoProduto.descricao} onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})} required></textarea>
              </div>
              <div className="form-group">
                <label className="label">Valor (R$)</label>
                <input type="text" className="input-field" placeholder="00,00" value={novoProduto.valor} onChange={(e) => setNovoProduto({...novoProduto, valor: e.target.value})} required />
              </div>
              <div className="form-group">
                <label className="label">Imagem (Upload)</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <button type="submit" className="btn-primary">Adicionar ao Cardápio</button>
            </form>
          </div>

          {/* Lista */}
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Produtos Cadastrados</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {produtos.map(p => (
                <div key={p.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    {p.imagem}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 600 }}>{p.nome}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{p.descricao}</p>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-red)' }}>
                    {p.valor}
                  </div>
                  <div>
                    <button className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', backgroundColor: '#6b7280' }}>Editar</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default GestaoCardapio;
