import { useState, useEffect } from 'react';

export default function Footer() {
  const [online, setOnline] = useState(navigator.onLine);
  const [hora, setHora] = useState('');

  // Monitora conexão real
  useEffect(() => {
    const handleOnline  = () => setOnline(true);
    const handleOffline = () => setOnline(false);
    window.addEventListener('online',  handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online',  handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Atualiza hora a cada minuto
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setHora(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    fmt();
    const id = setInterval(fmt, 60_000);
    return () => clearInterval(id);
  }, []);

  return (
    <footer
      className="app-footer"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 8,
      }}
    >
      <span style={{ fontSize: '0.8rem' }}>© 2026 Merenda Check — Secretaria Municipal de Educação</span>

      {/* Barra de status do sistema */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: '0.78rem' }}>
        {/* Indicador online/offline */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: online ? 'var(--primary)' : 'var(--alert-red)' }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: online ? 'var(--primary)' : 'var(--alert-red)',
            display: 'inline-block',
            animation: online ? 'pulse-dot 2.5s infinite' : 'none',
          }}></span>
          {online ? 'Online' : 'Sem conexão'}
        </span>

        {/* Sincronização */}
        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--text-muted)' }}>
          <i className="fa-solid fa-arrows-rotate" style={{ fontSize: '0.7rem' }}></i>
          Sincronizado · {hora}
        </span>

        {/* LGPD */}
        <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 5 }}>
          <i className="fa-solid fa-lock" style={{ fontSize: '0.7rem' }}></i>
          LGPD
        </span>
      </div>
    </footer>
  );
}
