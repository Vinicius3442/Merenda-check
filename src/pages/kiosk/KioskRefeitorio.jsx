import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function KioskRefeitorio() {
  const [estado, setEstado] = useState('aguardando'); // 'aguardando', 'processando', 'sucesso', 'erro'
  const [time, setTime] = useState(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const simularLeitura = (tipo) => {
    setEstado('processando');
    setTimeout(() => {
      setEstado(tipo);
      setTimeout(() => setEstado('aguardando'), 3000);
    }, 800);
  };

  const renderContent = () => {
    if (estado === 'processando') {
      return (
        <div className="tablet-content processing">
          <div className="spinner"></div>
          <h2 style={{ marginTop: 20 }}>Verificando Biometria...</h2>
        </div>
      );
    }
    
    if (estado === 'sucesso') {
      return (
        <div className="tablet-content success">
          <i className="fa-solid fa-circle-check animate-bounce" style={{ fontSize: '8rem', color: '#10B981', marginBottom: 20 }}></i>
          <h1 style={{ fontSize: '3rem', color: '#10B981', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>Liberado</h1>
          <p style={{ fontSize: '1.5rem', color: '#64748b' }}>Bom Apetite, João!</p>
          <div className="mascot-happy"></div>
        </div>
      );
    }

    if (estado === 'erro') {
      return (
        <div className="tablet-content error">
          <i className="fa-solid fa-circle-xmark animate-bounce" style={{ fontSize: '8rem', color: '#EF4444', marginBottom: 20 }}></i>
          <h1 style={{ fontSize: '3rem', color: '#EF4444', margin: 0, fontWeight: 900, textTransform: 'uppercase' }}>Bloqueado</h1>
          <p style={{ fontSize: '1.5rem', color: '#64748b' }}>Refeição já registrada hoje.</p>
        </div>
      );
    }

    return (
      <div className="tablet-content waiting">
        <div className="fingerprint-container">
          <div className="fingerprint-ring"></div>
          <i className="fa-solid fa-fingerprint fingerprint-icon"></i>
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#1E293B', margin: '0 0 10px 0', fontWeight: 800 }}>Aguardando Leitura</h1>
        <p style={{ fontSize: '1.2rem', color: '#64748b', margin: 0 }}>Posicione sua digital ou aproxime o cartão</p>

        {/* Botões de Simulação */}
        <div className="simulation-buttons">
          <button onClick={() => simularLeitura('sucesso')} className="sim-btn success-btn">Simular Sucesso</button>
          <button onClick={() => simularLeitura('erro')} className="sim-btn error-btn">Simular Erro</button>
        </div>
      </div>
    );
  };

  return (
    <div className="kiosk-environment">
      {/* Botão de sair do modo Kiosk (Apenas para dev) */}
      <button onClick={() => navigate('/login')} className="exit-kiosk">
        <i className="fa-solid fa-power-off"></i> Sair do Kiosk
      </button>

      {/* Mockup do Tablet (Landscape) */}
      <div className="tablet-mockup">
        {/* Câmera / Sensor superior */}
        <div className="tablet-camera"></div>

        {/* Tela do Tablet */}
        <div className="tablet-screen">
          {/* Status Bar */}
          <div className="status-bar">
            <div className="status-left">
              <span style={{ fontWeight: 700 }}>{time}</span>
            </div>
            <div className="status-center">
              <img src="/logo.png" alt="Merenda Check" style={{ height: 20, filter: 'brightness(0)' }} />
            </div>
            <div className="status-right">
              <i className="fa-solid fa-wifi"></i>
              <i className="fa-solid fa-battery-full"></i>
              <span>100%</span>
            </div>
          </div>

          {/* Conteúdo dinâmico da tela */}
          <div className="screen-body">
            {renderContent()}
          </div>
        </div>
      </div>

      <style>{`
        .kiosk-environment {
          height: 100vh;
          width: 100vw;
          background: radial-gradient(circle at 50% 50%, #334155 0%, #0f172a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .exit-kiosk {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          color: #fff;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
          z-index: 10;
        }
        .exit-kiosk:hover { background: rgba(255,255,255,0.2); }

        .tablet-mockup {
          width: 1024px;
          height: 700px;
          background: #111;
          border-radius: 40px;
          padding: 24px;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8), inset 0 0 5px rgba(255,255,255,0.2);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          transform: scale(0.95);
          animation: float 6s ease-in-out infinite;
        }

        .tablet-camera {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: #333;
          border-radius: 50%;
          box-shadow: inset 0 0 4px #000;
        }

        .tablet-screen {
          width: 100%;
          height: 100%;
          background: #F8FAFC; /* Fundo claro para contrastar com ambiente escuro */
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .status-bar {
          height: 32px;
          background: rgba(255,255,255,0.8);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          font-size: 0.85rem;
          color: #334155;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          z-index: 5;
        }

        .status-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .screen-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }

        .tablet-content {
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          height: 100%;
          justify-content: center;
          background: radial-gradient(circle, #fff, #F1F5F9);
        }

        .fingerprint-container {
          position: relative;
          width: 200px;
          height: 200px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
        }

        .fingerprint-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 4px solid rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .fingerprint-icon {
          font-size: 7rem;
          color: var(--primary);
          z-index: 2;
          background: #fff;
          padding: 20px;
          border-radius: 50%;
          box-shadow: 0 10px 30px rgba(16,185,129,0.2);
        }

        @keyframes ping {
          75%, 100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }

        .spinner {
          width: 60px;
          height: 60px;
          border: 6px solid #E2E8F0;
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .simulation-buttons {
          position: absolute;
          bottom: 40px;
          display: flex;
          gap: 20px;
        }

        .sim-btn {
          padding: 12px 24px;
          border-radius: 50px;
          font-weight: 700;
          cursor: pointer;
          border: none;
          transition: all 0.2s;
        }

        .success-btn {
          background: rgba(16, 185, 129, 0.1);
          color: #059669;
        }
        .success-btn:hover { background: rgba(16, 185, 129, 0.2); }

        .error-btn {
          background: rgba(239, 68, 68, 0.1);
          color: #DC2626;
        }
        .error-btn:hover { background: rgba(239, 68, 68, 0.2); }

        /* Media queries for smaller screens (dev test) */
        @media (max-width: 1100px) {
          .tablet-mockup {
            width: 90vw;
            height: 60vw;
            border-radius: 20px;
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
}
