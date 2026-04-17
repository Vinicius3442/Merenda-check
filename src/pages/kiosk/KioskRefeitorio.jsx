import { useState } from 'react';

export default function KioskRefeitorio() {
  const [estado, setEstado] = useState('aguardando'); // 'aguardando', 'sucesso', 'erro'

  const simularLeitura = (tipo) => {
    setEstado(tipo);
    setTimeout(() => setEstado('aguardando'), 3000);
  };

  if (estado === 'sucesso') {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#059669', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <i className="fa-solid fa-circle-check animate-bounce" style={{ fontSize: '8rem', marginBottom: 24 }}></i>
        <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>Liberado</h1>
        <p style={{ fontSize: '2rem', opacity: 0.9 }}>Refeição Registrada</p>
      </div>
    );
  }

  if (estado === 'erro') {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#dc2626', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
        <i className="fa-solid fa-circle-xmark animate-bounce" style={{ fontSize: '8rem', marginBottom: 24 }}></i>
        <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>Bloqueado</h1>
        <p style={{ fontSize: '2rem', opacity: 0.9 }}>Aluno já almoçou hoje</p>
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
      <img src="/logo.png" alt="Merenda Check" style={{ height: 60, position: 'absolute', top: 40, opacity: 0.5 }} />
      
      <div style={{ padding: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: 40, animation: 'pulse 2s infinite' }}>
        <i className="fa-solid fa-fingerprint" style={{ fontSize: '8rem', color: 'var(--primary)' }}></i>
      </div>
      
      <h1 style={{ fontSize: '3.5rem', margin: '0 0 16px 0', fontWeight: 800 }}>Aguardando Leitura</h1>
      <p style={{ fontSize: '1.5rem', color: '#94a3b8', margin: 0 }}>Posicione sua digital ou cartão no leitor</p>

      {/* Botões de simulação visíveis apenas para nós testarmos as telas */}
      <div style={{ position: 'absolute', bottom: 40, display: 'flex', gap: 20 }}>
        <button onClick={() => simularLeitura('sucesso')} style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.1)', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 8, cursor: 'pointer', fontSize: '1.2rem' }}>
          Simular Sucesso (F1)
        </button>
        <button onClick={() => simularLeitura('erro')} style={{ padding: '15px 30px', background: 'rgba(255,255,255,0.1)', border: '1px solid #334155', color: '#cbd5e1', borderRadius: 8, cursor: 'pointer', fontSize: '1.2rem' }}>
          Simular Erro (F2)
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { transform: scale(1); box-shadow: 0 0 0 40px rgba(16, 185, 129, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>
    </div>
  );
}
