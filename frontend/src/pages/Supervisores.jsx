import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Trash2, Shield, User } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const Supervisores = () => {
  const [supervisores, setSupervisores] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const fetchSupervisores = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/users?role=SUPERVISOR`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSupervisores(data);
    } catch (error) {
      console.error('Erro ao buscar supervisores:', error);
    }
  };

  useEffect(() => {
    fetchSupervisores();
  }, []);

  const handleAdd = async () => {
    if (!form.email || !form.password) return toast.error('Preencha email e senha');
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/users`, {
        email: form.email,
        password: form.password,
        role: 'SUPERVISOR'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setForm({ email: '', password: '' });
      setShowModal(false);
      fetchSupervisores();
      toast.success('Supervisor adicionado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar supervisor:', error);
      toast.error('Erro ao salvar supervisor. Verifique se o email já existe.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Remover este supervisor?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchSupervisores();
        toast.success('Supervisor removido');
      } catch (error) {
        console.error('Erro ao remover supervisor:', error);
        toast.error('Erro ao remover');
      }
    }
  };

  return (
    <>
      <header className="topbar">
        <div className="page-title">Gestão de Supervisores</div>
        <button className="btn-primary" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setShowModal(true)}>
          <Plus size={16} /> Adicionar Supervisor
        </button>
      </header>

      <div className="content-area">
        <div className="tabs-container">
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Nível de Acesso</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {supervisores.map(sup => (
                  <tr key={sup.id} className="table-row">
                    <td><strong>#{sup.id}</strong></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <User size={16} color="var(--text-muted)" />
                        {sup.email}
                      </div>
                    </td>
                    <td>
                      <span style={{ background: '#fefce8', color: '#a16207', padding: '2px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                        <Shield size={12} /> SUPERVISOR
                      </span>
                    </td>
                    <td>
                      <button style={{ padding: '6px', borderRadius: 6, background: '#fee2e2', cursor: 'pointer', border: 'none' }} onClick={() => handleDelete(sup.id)}>
                        <Trash2 size={14} color="var(--primary-red)" />
                      </button>
                    </td>
                  </tr>
                ))}
                {supervisores.length === 0 && (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Nenhum supervisor encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="card" style={{ width: '100%', maxWidth: 400 }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Novo Supervisor</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">E-mail de Acesso</label>
                <input className="input-field" type="email" placeholder="supervisor@soumaisbusiness.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Senha</label>
                <input className="input-field" type="password" placeholder="******" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button className="btn-primary" onClick={handleAdd}>Salvar</button>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', borderRadius: 6, fontWeight: 600, cursor: 'pointer', flex: 1, background: 'white' }}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Supervisores;
