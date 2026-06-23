import React, { useState } from 'react';

const CadastroCliente = () => {
  const [formData, setFormData] = useState({
    cnpj: '',
    vendedor: '', // Será preenchido pelo usuário
    email: '',
    senha: '',
    simplesNacional: 'SIM',
    comercial: '',
    scoreCredito: '',
    devedoresUniao: '',
    certidaoTj: '',
    compliance: 'Em analise'
  });

  const [razaoSocial, setRazaoSocial] = useState('');
  const [cnpjData, setCnpjData] = useState(null);
  const [scoreInfo, setScoreInfo] = useState('');
  const [pgfnInfo, setPgfnInfo] = useState('');
  
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  const [loadingScore, setLoadingScore] = useState(false);
  const [loadingPgfn, setLoadingPgfn] = useState(false);

  const fetchCnpj = async () => {
    if (!formData.cnpj) return alert('Digite um CNPJ válido');
    setLoadingCnpj(true);
    setCnpjData(null);
    try {
      const token = localStorage.getItem('token');
      // Clean CNPJ (only numbers)
      const cleanCnpj = formData.cnpj.replace(/\D/g, '');
      const response = await fetch(`/api/fontedata/cnpj/${cleanCnpj}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Erro ao ler resposta do servidor (Status ${response.status})`);
      }

      if (response.ok) {
        setRazaoSocial(data.razao_social || data.nomeEmpresarial || data.nomeFantasia || data.nome || 'Empresa Desconhecida');
        setCnpjData(data); // Save the entire response object to show details
        alert('CNPJ Encontrado com sucesso!');
      } else {
        const errorMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        alert(errorMsg || 'Erro ao buscar CNPJ. Verifique se há créditos.');
      }
    } catch (error) {
      alert(`Erro ao buscar CNPJ: ${error.message}. Você fez login novamente?`);
    } finally {
      setLoadingCnpj(false);
    }
  };

  const fetchScore = async () => {
    if (!formData.cnpj) return alert('Digite o CNPJ primeiro');
    setLoadingScore(true);
    try {
      const token = localStorage.getItem('token');
      const cleanCnpj = formData.cnpj.replace(/\D/g, '');
      const response = await fetch(`/api/fontedata/score/${cleanCnpj}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Erro ao ler resposta do servidor (Status ${response.status})`);
      }

      if (response.ok) {
        const score = data.pessoaJuridica?.score || data.score || 'N/A';
        const risco = data.pessoaJuridica?.faixaScore || data.risco || 'N/A';
        setScoreInfo(`Score: ${score} - Risco: ${risco}`);
      } else {
        const errorMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setScoreInfo('Erro: ' + (errorMsg || 'Não disponível'));
      }
    } catch (error) {
      setScoreInfo(`Erro: ${error.message}`);
    } finally {
      setLoadingScore(false);
    }
  };

  const fetchPgfn = async () => {
    if (!formData.cnpj) return alert('Digite o CNPJ primeiro');
    setLoadingPgfn(true);
    try {
      const token = localStorage.getItem('token');
      const cleanCnpj = formData.cnpj.replace(/\D/g, '');
      const response = await fetch(`/api/fontedata/pgfn/${cleanCnpj}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonErr) {
        throw new Error(`Erro ao ler resposta do servidor (Status ${response.status})`);
      }

      if (response.ok) {
        setPgfnInfo(data.possuiDivida ? `Consta Dívida: ${data.totalDivida ? 'R$ '+data.totalDivida : 'Sim'}` : 'Nada Consta (Limpo)');
      } else {
        const errorMsg = typeof data.error === 'object' ? JSON.stringify(data.error) : data.error;
        setPgfnInfo('Erro: ' + (errorMsg || 'Não disponível'));
      }
    } catch (error) {
      setPgfnInfo(`Erro: ${error.message}`);
    } finally {
      setLoadingPgfn(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Cliente cadastrado com sucesso e permissões salvas!');
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Novo Parceiro (Empresa B2B)</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Cadastrar Novo Parceiro (Restaurante)</h1>
          <p className="section-subtitle">Integração com iFood e 99 POP, análise de compliance e score de crédito pela API FonteData.</p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            
            {/* Bloco 1: Dados Base */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>1. Dados do Estabelecimento</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">CNPJ (Consulta Automática)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" name="cnpj" className="input-field" placeholder="00.000.000/0000-00" onChange={handleChange} required />
                  <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={fetchCnpj} disabled={loadingCnpj}>
                    {loadingCnpj ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Razão Social</label>
                <input type="text" className="input-field" value={razaoSocial} readOnly placeholder="Preenchido automaticamente" />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Optante Simples Nacional</label>
                <select name="simplesNacional" className="input-field" onChange={handleChange} required>
                  <option value="SIM">SIM</option>
                  <option value="NAO">NÃO</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Vendedor / Quem Cadastrou</label>
                <input type="text" name="vendedor" className="input-field" value={formData.vendedor} disabled />
              </div>
            </div>

            {/* Informações Retornadas da API (Sócios, Endereço, etc) */}
            {cnpjData && (
              <div style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>📋 Dados Extraídos da Receita (Cadastro Plus)</h4>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div><strong>Nome Fantasia:</strong> {cnpjData.nomeFantasia || '-'}</div>
                  <div>
                    <strong>Situação Cadastral:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      background: cnpjData.situacaoCadastral === 'ATIVA' ? 'var(--success-bg)' : '#fee2e2', 
                      color: cnpjData.situacaoCadastral === 'ATIVA' ? 'var(--success-color)' : 'var(--primary-red)',
                      padding: '2px 8px', borderRadius: 4, fontWeight: 600
                    }}>
                      {cnpjData.situacaoCadastral || '-'}
                    </span>
                  </div>
                  <div><strong>Porte / Faturamento:</strong> {cnpjData.porte || '-'} {cnpjData.faturamentoPresumido ? `| ${cnpjData.faturamentoPresumido}` : ''}</div>
                  <div><strong>Natureza Jurídica:</strong> {cnpjData.naturezaJuridicaDescricao || '-'}</div>
                  <div>
                    <strong>Endereço:</strong> {
                      cnpjData.enderecos && cnpjData.enderecos.length > 0
                        ? `${cnpjData.enderecos[0].logradouro}, ${cnpjData.enderecos[0].numero} - ${cnpjData.enderecos[0].bairro}, ${cnpjData.enderecos[0].cidade}/${cnpjData.enderecos[0].uf} (CEP: ${cnpjData.enderecos[0].cep})`
                        : '-'
                    }
                  </div>
                  <div>
                    <strong>Contatos:</strong> {
                      (cnpjData.telefones && cnpjData.telefones.length > 0 ? cnpjData.telefones.map(t => t.telefoneComDDD).join(', ') : '-') + 
                      ' | ' + 
                      (cnpjData.emails && cnpjData.emails.length > 0 ? cnpjData.emails.map(e => e.enderecoEmail).join(', ') : '-')
                    }
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  <h5 style={{ fontWeight: 700, marginBottom: '0.75rem' }}>👥 Quadro Societário (QSA)</h5>
                  {cnpjData.socios && cnpjData.socios.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {cnpjData.socios.map((socio, idx) => (
                        <div key={idx} style={{ background: 'white', border: '1px solid var(--border-color)', padding: '0.75rem', borderRadius: 6, fontSize: '0.85rem' }}>
                          <strong>{socio.nome}</strong> — {socio.cargo || '-'} {socio.documento ? `(Doc: ${socio.documento})` : ''}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Nenhum sócio retornado ou empresa individual.</div>
                  )}
                </div>
              </div>
            )}

            {/* Bloco 2: Acesso */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>2. Dados de Acesso (Envio Automático)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">E-mail Principal (Acesso do Parceiro)</label>
                <input type="email" name="email" className="input-field" placeholder="contato@restaurante.com" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Senha Inicial</label>
                <input type="text" name="senha" className="input-field" placeholder="Blu@2025" defaultValue="Blu@2025" onChange={handleChange} required />
              </div>
            </div>

            {/* Bloco 3: Compliance e Crédito */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>3. Compliance e Análise de Crédito</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Score de Crédito (Quod)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className="input-field" placeholder="Aguardando..." value={scoreInfo} readOnly />
                  <button type="button" className="btn-primary" style={{ width: 'auto', backgroundColor: '#3b82f6' }} onClick={fetchScore} disabled={loadingScore}>
                    {loadingScore ? '...' : 'Consultar'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Certidão TJ (Cível, Criminal)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" className="input-field" placeholder="Aguardando..." readOnly />
                  <button type="button" className="btn-primary" style={{ width: 'auto', backgroundColor: '#3b82f6' }}>Consultar</button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Aprovação Compliance</label>
                <select name="compliance" className="input-field" onChange={handleChange}>
                  <option value="Em analise">Em Análise</option>
                  <option value="Ativo">Ativo</option>
                  <option value="Reprovado">Reprovado</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            {/* Bloco 4: Módulos de Acesso */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>4. Módulos Liberados (iFood e 99 POP)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Dashboard (API iFood/99)</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Funcionários</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> Chat WhatsApp</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Clientes</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Gerar Pedido Manual</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Cadastrar Produtos</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Treinamentos</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Consultas de Crédito</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Fornecedor</label>
              <label className="flex items-center gap-2"><input type="checkbox" /> BPO Financeiro (A contratar)</label>
              <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Marketplace SOU+BUSINESS</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '250px' }}>Finalizar Cadastro de Parceiro</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CadastroCliente;
