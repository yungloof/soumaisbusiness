import React from 'react';

const videos = [
  { id: 1, title: 'Técnicas Avançadas de Vendas no Delivery', category: 'Nicho Delivery', duration: '15:20' },
  { id: 2, title: 'Como rankear seu restaurante no topo do iFood', category: 'Estratégias de Vendas', duration: '22:10' },
  { id: 3, title: 'Atendimento via WhatsApp que converte 3x mais', category: 'Estratégias de Vendas', duration: '18:45' },
  { id: 4, title: 'Precificação correta para lucrar nas promoções', category: 'Financeiro', duration: '30:05' },
];

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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
          {videos.map(video => (
            <div key={video.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#1a1a1a', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: '50px', height: '50px', backgroundColor: 'rgba(234, 29, 44, 0.9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                  ▶
                </div>
                <div style={{ position: 'absolute', bottom: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)', color: 'white', fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px' }}>
                  {video.duration}
                </div>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <span className="badge-success" style={{ backgroundColor: '#fee2e2', color: 'var(--primary-red)', marginBottom: '0.5rem', display: 'inline-block' }}>{video.category}</span>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 }}>{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Treinamentos;
