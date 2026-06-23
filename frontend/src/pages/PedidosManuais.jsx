import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

const PedidosManuais = () => {
  const [pedido, setPedido] = useState({
    cpf: '',
    itens: '',
    status: 'Novo'
  });

  const handleChange = (e) => {
    setPedido({ ...pedido, [e.target.name]: e.target.value });
  };

  const handleGerarCobranca = () => {
    toast.success('Cobrança gerada e enviada via WhatsApp automático! Status: EM PREPARO');
    setPedido({ ...pedido, status: 'Em Preparo' });
  };

  const handleGerarPedido = () => {
    toast.success('Pedido despachado! Status: SAIU PARA ENTREGA');
    setPedido({ ...pedido, status: 'Saiu para Entrega' });
  };

  const handleEmitirCupom = () => {
    toast.success('Cupom Fiscal emitido com sucesso! Status: ENTREGUE');
    setPedido({ ...pedido, status: 'Entregue' });
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Pedidos Manuais</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Gerar Pedido Manual</h1>
          <p className="section-subtitle">Gestão de vendas feitas fora das plataformas (balcão, telefone, whatsapp).</p>
        </div>

        <div className="card" style={{ maxWidth: '800px' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Dados do Pedido</h3>
            <span className={`badge-success`} style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
              Status: {pedido.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">CPF do Cliente (Busca BD API)</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" name="cpf" className="input-field" placeholder="000.000.000-00" onChange={handleChange} />
                <button type="button" className="btn-primary" style={{ width: 'auto' }}>Buscar</button>
              </div>
            </div>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="label">Itens do Pedido (Ex: 1x Pizza, 1x Coca)</label>
              <input type="text" name="itens" className="input-field" placeholder="Selecione os produtos..." onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, color: 'var(--text-muted)' }}>Ações do Pedido (Workflow)</h4>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={handleGerarCobranca} className="btn-primary" style={{ flex: 1, backgroundColor: '#f97316' }}>
                1. Gerar Cobrança (WhatsApp)
              </button>
              <button onClick={handleGerarPedido} className="btn-primary" style={{ flex: 1, backgroundColor: '#3b82f6' }}>
                2. Gerar Pedido (Saiu p/ Entrega)
              </button>
              <button onClick={handleEmitirCupom} className="btn-primary" style={{ flex: 1, backgroundColor: 'var(--success-color)' }}>
                3. Emitir Cupom Fiscal (Entregue)
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default PedidosManuais;
