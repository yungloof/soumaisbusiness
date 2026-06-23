import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Building, Mail } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ companyName: '', email: '', password: '' });

  const fetchClientes = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users?role=CLIENTE`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClientes(data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleAdd = async () => {
    if (!form.companyName || !form.email || !form.password) return toast.error('Preencha todos os campos');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users`, {
        companyName: form.companyName,
        email: form.email,
        password: form.password,
        role: 'CLIENTE',
        modules: ['dashboard'] // default modules
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ companyName: '', email: '', password: '' });
      setShowModal(false);
      fetchClientes();
      toast.success('Cliente adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast.error('Erro ao salvar cliente. Verifique se o email já existe.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remover este cliente e seu acesso?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchClientes();
        toast.success('Cliente removido');
      } catch (error) {
        console.error('Erro ao remover cliente:', error);
        toast.error('Erro ao remover');
      }
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Gestão de Clientes / Mentorados</div>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Adicionar Cliente
        </button>
      </header>

      <div className="content-area">
        <div className="tabs-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Login (Email)</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map(cli => (
                  <tr key={cli.id} className="table-row">
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Building size={18} color="var(--text-muted)" />
                        </div>
                        <strong>{cli.company?.razao_social || 'Sem empresa vinculada'}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={16} color="var(--text-muted)" />
                        {cli.email}
                      </div>
                    </td>
                    <td>
                      <button style={{ padding: '6px', borderRadius: 6, background: '#fee2e2', cursor: 'pointer', border: 'none' }} onClick={() => handleDelete(cli.id)}>
                        <Trash2 size={14} color="var(--primary-red)" />
                      </button>
                    </td>
                  </tr>
                ))}
                {clientes.length === 0 && (
                  <tr><td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum cliente cadastrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 450 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Novo Cliente</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Nome da Empresa</label>
                <input className="input-field" type="text" placeholder="Ex: Pizzaria Napolitana" value={form.companyName} onChange={e => setForm({ ...form, companyName: e.target.value })} />
              </div>
              <div>
                <label className="label">E-mail de Acesso</label>
                <input className="input-field" type="email" placeholder="contato@pizzaria.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Senha Inicial</label>
                <input className="input-field" type="password" placeholder="******" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={handleAdd}>Cadastrar</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 6, fontWeight: 600, cursor: 'pointer', flex: 1, background: 'white' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Clientes;
