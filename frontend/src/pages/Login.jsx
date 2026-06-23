import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('master@soublu.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao realizar login');
      }

      // Save token and info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ role: data.role, modules: data.modules }));
      
      // Navigate to master dashboard
      navigate('/master');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Left Side - Presentation */}
        <div className="login-left">
          <div className="login-logo" style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <img src="/logo-color.png" alt="SOU+BUSINESS Logo" style={{ height: '72px', objectFit: 'contain' }} />
          </div>
          
          <div className="badge-mentoria">MENTORIA IFOOD</div>
          
          <h1 className="login-title">
            Cresça nas <span className="highlight">vendas.</span><br />
            Lidere no <span className="highlight">ranking.</span>
          </h1>
          
          <p className="login-subtitle">
            Plataforma que conecta supervisores e donos de restaurante para destravar resultado mês a mês no iFood.
          </p>

          <div className="mock-chart-card">
            <div className="mock-chart-header">
              <div>
                <div className="mock-chart-title">FATURAMENTO</div>
                <div className="mock-chart-value">R$ 76,4k</div>
              </div>
              <div className="badge-success">+38%</div>
            </div>
            <div className="mock-chart-bars">
              <div className="mock-bar"></div>
              <div className="mock-bar"></div>
              <div className="mock-bar"></div>
              <div className="mock-bar"></div>
              <div className="mock-bar active"></div>
            </div>
          </div>
          
          <div className="flex gap-6 mt-8">
            <div>
              <div className="font-extrabold text-xl">+38%</div>
              <div className="text-xs text-muted font-medium">FATURAMENTO MÉDIO</div>
            </div>
            <div>
              <div className="font-extrabold text-xl">120+</div>
              <div className="text-xs text-muted font-medium">RESTAURANTES</div>
            </div>
            <div>
              <div className="font-extrabold text-xl">4,9</div>
              <div className="text-xs text-muted font-medium">AVALIAÇÃO</div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-right">
          <h2 className="form-title">Entrar na plataforma</h2>
          <p className="form-subtitle">Acesso para supervisores, gerentes e clientes mentorados.</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="label">E-mail</label>
              <input 
                type="email" 
                className="input-field" 
                placeholder="Ex: master@soublu.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="label">Senha</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="******" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div style={{ color: 'var(--primary-red)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

            <div className="form-options">
              <label className="flex items-center gap-2">
                <input type="checkbox" /> Lembrar
              </label>
              <a href="#" className="forgot-password">Esqueci a senha</a>
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>{isLoading ? 'Entrando...' : 'Entrar'}</button>
          </form>

          <div className="demo-access">
            <div className="demo-access-title">ACESSOS DE DEMONSTRAÇÃO</div>
            <div className="demo-row">
              <span className="demo-label">Master</span>
              <span className="demo-value">master@soublu.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-label">Supervisor</span>
              <span className="demo-value">supervisor@soublu.com</span>
            </div>
            <div className="demo-row">
              <span className="demo-label">Cliente</span>
              <span className="demo-value">joao@pizzaria.com</span>
            </div>
            <div className="demo-row" style={{ marginTop: '0.5rem', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
              <span className="demo-label text-muted">Senha (todos)</span>
              <span className="demo-value">123456</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
