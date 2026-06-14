import React, { useState } from 'react';

const Financeiro = () => {
  const [tab, setTab] = useState('pagar');

  return (
    <>
      <header className="topbar">
        <div className="page-title">Financeiro / BPO</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Gestão Financeira</h1>
          <p className="section-subtitle">Módulo BPO integrado com EFI Bank. Contas a pagar, receber e conciliação.</p>
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
            <form onSubmit={(e) => { e.preventDefault(); alert('Pagamento enviado para aprovação do Master!'); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">CPF/CNPJ do Fornecedor</label>
                  <input type="text" className="input-field" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Tipo de Despesa</label>
                  <select className="input-field">
                    <option>Aluguel</option>
                    <option>Água / Energia</option>
                    <option>Telefonia / VOIP</option>
                    <option>Supermercado</option>
                    <option>Outros Pagamentos</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Valor a Pagar (R$)</label>
                  <input type="text" className="input-field" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Chave PIX</label>
                  <input type="text" className="input-field" required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="label">Anexar NF</label>
                  <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label className="label">Anexar Recibo</label>
                  <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '250px' }}>Efetuar Pagamento (API EFI)</button>
            </form>
          </div>
        )}

        {tab === 'receber' && (
          <div className="card">
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1.5rem' }}>Gerar Cobrança para Parceiro</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('Cobrança PIX/Boleto gerada com sucesso!'); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Valor da Cobrança (R$)</label>
                  <input type="text" className="input-field" required />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label">Origem da Dívida</label>
                  <select className="input-field">
                    <option>Royalties Franquia</option>
                    <option>Sistema (SaaS)</option>
                    <option>Tráfego Pago</option>
                    <option>Banco de Dados</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="label flex items-center gap-2"><input type="checkbox" /> É recorrente?</label>
                  <input type="date" className="input-field" placeholder="Data da recorrência" />
                </div>
              </div>
              <button type="submit" className="btn-primary" style={{ width: '250px' }}>Emitir Boleto ou PIX</button>
            </form>
          </div>
        )}

        {tab === 'extrato' && (
          <div className="card" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Não há movimentações recentes na conta corrente deste usuário.
          </div>
        )}

      </div>
    </>
  );
};

export default Financeiro;
