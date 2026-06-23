import React from 'react';
import { GraduationCap } from 'lucide-react';

const Treinamentos = () => {
  return (
    <>
      <header className="topbar">
        <div className="page-title">Treinamentos e Capacitação</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">Base de Vídeos e Treinamentos</h1>
          <p className="section-subtitle">Capacitação contínua para sua equipe e parceiros em vendas, delivery e gestão.</p>
        </div>

        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-muted)' }}>
          <GraduationCap size={56} style={{ margin: '0 auto 1.5rem', opacity: 0.25, display: 'block' }} />
          <h3 style={{ fontWeight: 700, fontSize: '1.125rem', marginBottom: '0.5rem', color: 'var(--text-main)' }}>Nenhum treinamento cadastrado</h3>
          <p style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.6 }}>
            Em breve, conteúdos exclusivos de vendas, gestão e operação para restaurantes estarão disponíveis aqui.
          </p>
        </div>
      </div>
    </>
  );
};

export default Treinamentos;
