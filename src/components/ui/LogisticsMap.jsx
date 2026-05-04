import React, { useState } from 'react';

export default function LogisticsMap() {
  const [hovered, setHovered] = useState(null);

  const schools = [
    { id: 1, x: 20, y: 30, status: 'ok', name: 'EMEF João Silva', lot: '#8493' },
    { id: 2, x: 55, y: 70, status: 'warning', name: 'EMEF Paulo Freire', lot: 'Aguardando' },
    { id: 3, x: 80, y: 40, status: 'danger', name: 'CMEI Cantinho', lot: 'Atrasado' },
    { id: 4, x: 65, y: 20, status: 'ok', name: 'EMEF Darci Ribeiro', lot: '#8491' },
    { id: 5, x: 35, y: 80, status: 'ok', name: 'Creche Alegria', lot: '#8495' },
    { id: 6, x: 15, y: 65, status: 'ok', name: 'EMEF Machado de Assis', lot: '#8496' },
  ];

  const statusColors = {
    ok: 'var(--alert-green)',
    warning: 'var(--alert-yellow)',
    danger: 'var(--alert-red)'
  };

  return (
    <div className="glass-panel" style={{ padding: 24, position: 'relative', overflow: 'hidden' }}>
      <h3 style={{ fontFamily: 'Outfit', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
        <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)' }}></i>
        Radar Logístico Municipal
      </h3>
      
      {/* Container do Mapa Artístico */}
      <div style={{ 
        width: '100%', 
        height: 350, 
        background: 'radial-gradient(circle at center, rgba(30,41,59,0.8) 0%, rgba(15,23,42,1) 100%)',
        borderRadius: 16,
        position: 'relative',
        border: '1px solid rgba(255,255,255,0.05)',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
      }}>
        
        {/* Efeito de Radar Giratório */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', width: '100%', height: '100%',
          background: 'conic-gradient(from 0deg, transparent 70%, rgba(16,185,129,0.2) 100%)',
          borderRadius: '50%', transformOrigin: '0 0',
          animation: 'radarSpin 4s linear infinite',
          zIndex: 1, pointerEvents: 'none'
        }}></div>

        {/* Círculos do radar */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '20%', height: '40%', border: '1px dashed rgba(16,185,129,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '40%', height: '80%', border: '1px dashed rgba(16,185,129,0.1)', borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '60%', height: '120%', border: '1px dashed rgba(16,185,129,0.1)', borderRadius: '50%' }}></div>

        {/* Pontos (Escolas) */}
        {schools.map(school => (
          <div 
            key={school.id}
            style={{
              position: 'absolute',
              left: `${school.x}%`,
              top: `${school.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHovered(school.id)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* O ponto brilhante */}
            <div style={{
              width: 14, height: 14,
              borderRadius: '50%',
              background: statusColors[school.status],
              boxShadow: `0 0 15px ${statusColors[school.status]}`,
              border: '2px solid var(--bg-surface)'
            }}></div>
            
            {/* Pulso de onda para dar movimento */}
            <div style={{
              position: 'absolute', top: -3, left: -3, width: 20, height: 20,
              borderRadius: '50%',
              border: `1px solid ${statusColors[school.status]}`,
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            }}></div>

            {/* Tooltip flutuante e artística */}
            {hovered === school.id && (
              <div style={{
                position: 'absolute', bottom: 25, left: '50%', transform: 'translateX(-50%)',
                background: 'rgba(15,23,42,0.9)', backdropFilter: 'blur(10px)',
                border: `1px solid ${statusColors[school.status]}50`,
                padding: '10px 14px', borderRadius: 10,
                width: 180, pointerEvents: 'none',
                boxShadow: '0 10px 20px rgba(0,0,0,0.5)',
                zIndex: 20
              }} className="animate-fade-in">
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff', marginBottom: 4 }}>{school.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Status Lote: <span style={{ color: statusColors[school.status], fontWeight: 700 }}>{school.lot}</span></div>
              </div>
            )}
          </div>
        ))}

        {/* Legenda do Mapa */}
        <div style={{ position: 'absolute', bottom: 16, right: 16, background: 'rgba(0,0,0,0.4)', padding: '8px 12px', borderRadius: 8, display: 'flex', gap: 12, fontSize: '0.75rem', zIndex: 5, border: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--alert-green)' }}></span> Entregue</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--alert-yellow)' }}></span> Em trânsito</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--alert-red)' }}></span> Atraso</span>
        </div>
      </div>

      <style>{`
        @keyframes radarSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
