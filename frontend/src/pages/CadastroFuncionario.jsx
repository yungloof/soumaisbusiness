import React, { useState } from 'react';

const CadastroFuncionario = () => {
  const [formData, setFormData] = useState({
    cpf: '',
    cnpjRegistro: '',
    matriculaEsocial: '',
    contato: '',
    emailPessoal: '',
    protocoloEntrevista: '',
    dataAdmissao: '',
    departamento: '',
    chavePix: '',
    cargo: '',
    supervisor: '',
    gerenteDpto: '',
    diretorDpto: '',
    cargoConfianca: 'NÃO',
    nomeEmergencia1: '',
    contatoEmergencia1: '',
    nomeEmergencia2: '',
    contatoEmergencia2: ''
  });

  const [cpfData, setCpfData] = useState(null);
  const [loadingCpf, setLoadingCpf] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchCpf = async () => {
    if (!formData.cpf) return alert('Digite o CPF primeiro');
    setLoadingCpf(true);
    setCpfData(null);
    try {
      const cleanCpf = formData.cpf.replace(/\D/g, '');
      const response = await fetch(`http://localhost:3001/api/fontedata/cpf/${cleanCpf}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      if (response.ok && !data.error) {
        setCpfData(data);
        alert('CPF Encontrado!');
      } else {
        const errorMsg = data.error?.message || data.error || 'Erro ao buscar CPF';
        alert(typeof errorMsg === 'object' ? JSON.stringify(errorMsg) : errorMsg);
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setLoadingCpf(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Funcionário cadastrado com sucesso!');
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Novo Funcionário / Supervisor</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Cadastro Completo de Colaborador</h1>
          <p className="section-subtitle">Preencha os dados pessoais, corporativos, hierarquia e anexe todos os documentos do RH.</p>
        </div>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            
            {/* Bloco 1: Dados Pessoais */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>1. Dados Pessoais</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">CPF (Consulta API)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" name="cpf" className="input-field" placeholder="000.000.000-00" onChange={handleChange} required />
                  <button type="button" className="btn-primary" style={{ width: 'auto' }} onClick={fetchCpf} disabled={loadingCpf}>
                    {loadingCpf ? '...' : 'Buscar'}
                  </button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">E-mail Pessoal</label>
                <input type="email" name="emailPessoal" className="input-field" placeholder="email@exemplo.com" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Contato (WhatsApp)</label>
                <input type="text" name="contato" className="input-field" placeholder="(00) 00000-0000" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Matrícula E-Social</label>
                <input type="text" name="matriculaEsocial" className="input-field" placeholder="Número de Matrícula" onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Chave PIX</label>
                <input type="text" name="chavePix" className="input-field" placeholder="Chave para pagamento" onChange={handleChange} />
              </div>
            </div>

            {cpfData && (
              <div style={{ background: '#f8f9fa', border: '1px solid var(--border-color)', borderRadius: 8, padding: '1.5rem', marginBottom: '2rem' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>📋 Dados Receita Federal</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div><strong>Nome:</strong> {cpfData.nomePessoaFisica || '-'}</div>
                  <div>
                    <strong>Situação Cadastral:</strong> 
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      background: cpfData.situacaoCadastral === 'REGULAR' ? 'var(--success-bg)' : '#fee2e2', 
                      color: cpfData.situacaoCadastral === 'REGULAR' ? 'var(--success-color)' : 'var(--primary-red)',
                      padding: '2px 8px', borderRadius: 4, fontWeight: 600
                    }}>
                      {cpfData.situacaoCadastral || '-'}
                    </span>
                  </div>
                  <div><strong>Data de Nascimento:</strong> {cpfData.dataNascimento ? cpfData.dataNascimento.split(' ')[0] : '-'}</div>
                  <div><strong>Ano do Óbito:</strong> {cpfData.possuiObito ? cpfData.anoObito : 'Não (Vivo)'}</div>
                </div>
              </div>
            )}

            {/* Bloco 2: Vínculo Empregatício */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>2. Vínculo Empregatício</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">CNPJ Registro (Base de Dados)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" name="cnpjRegistro" className="input-field" placeholder="00.000.000/0000-00" onChange={handleChange} required />
                  <button type="button" className="btn-primary" style={{ width: 'auto' }}>Buscar</button>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Data de Admissão</label>
                <input type="date" name="dataAdmissao" className="input-field" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Protocolo Entrevista</label>
                <input type="text" name="protocoloEntrevista" className="input-field" placeholder="Nº do Protocolo" onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Departamento</label>
                <input type="text" name="departamento" className="input-field" placeholder="Ex: Comercial, RH, TI" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Cargo</label>
                <input type="text" name="cargo" className="input-field" placeholder="Ex: Desenvolvedor Senior" onChange={handleChange} required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Cargo de Confiança?</label>
                <select name="cargoConfianca" className="input-field" onChange={handleChange}>
                  <option value="NÃO">NÃO</option>
                  <option value="SIM">SIM</option>
                </select>
              </div>
            </div>

            {/* Bloco 3: Hierarquia */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>3. Hierarquia</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Supervisor do Colaborador</label>
                <select name="supervisor" className="input-field" onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="sup_1">Carlos Supervisor</option>
                  <option value="sup_2">Ana Supervisora</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Responsável pelo Dpto (Gerente)</label>
                <select name="gerenteDpto" className="input-field" onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="ger_1">Marcos Gerente</option>
                  <option value="ger_2">Juliana Gerente</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Diretor do Departamento</label>
                <select name="diretorDpto" className="input-field" onChange={handleChange}>
                  <option value="">Selecione...</option>
                  <option value="dir_1">Ricardo Diretor</option>
                  <option value="dir_2">Silvia Diretora</option>
                </select>
              </div>
            </div>

            {/* Bloco 4: Emergência */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>4. Contatos de Emergência</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Nome Contato Emergência 1</label>
                <input type="text" name="nomeEmergencia1" className="input-field" placeholder="Nome do familiar/amigo" onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Telefone Emergência 1</label>
                <input type="text" name="contatoEmergencia1" className="input-field" placeholder="(00) 00000-0000" onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Nome Contato Emergência 2</label>
                <input type="text" name="nomeEmergencia2" className="input-field" placeholder="Nome do familiar/amigo" onChange={handleChange} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Telefone Emergência 2</label>
                <input type="text" name="contatoEmergencia2" className="input-field" placeholder="(00) 00000-0000" onChange={handleChange} />
              </div>
            </div>

            {/* Bloco 5: Permissões */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>5. Permissões de Acesso ao Sistema</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: 8, border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Dashboard
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Clientes (Restaurantes)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Fornecedores
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Consultas de Crédito
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> ChatBot
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Financeiro / BPO
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" /> Pedidos Manuais
              </label>
            </div>

            {/* Bloco 6: Documentos e Anexos */}
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--primary-red)' }}>6. Documentos e Anexos (RH)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              <div className="form-group">
                <label className="label">Anexo Ficha Entrevista RH</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Ficha RH</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Documento RG</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Exame Admissional</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Contrato de Trabalho</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Aditivo de Contrato 1</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Aditivo de Contrato 2</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
              <div className="form-group">
                <label className="label">Anexo Aditivo de Contrato 3</label>
                <input type="file" className="input-field" style={{ padding: '0.5rem' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
              <button type="submit" className="btn-primary" style={{ width: '250px' }}>Salvar Cadastro de Funcionário</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CadastroFuncionario;
