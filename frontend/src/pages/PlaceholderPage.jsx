import React from 'react';

const PlaceholderPage = ({ title, subtitle }) => {
  return (
    <>
      <header className="topbar">
        <div className="page-title">{title}</div>
      </header>

      <div className="content-area">
        <div className="section-header">
          <h1 className="section-title">{title}</h1>
          <p className="section-subtitle">{subtitle}</p>
        </div>
        
        <div className="card" style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>
          <p>Este módulo está em desenvolvimento conforme a especificação do MVP.</p>
        </div>
      </div>
    </>
  );
};

export default PlaceholderPage;
