import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function Mascot() {
  const [isVisible, setIsVisible] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const location = useLocation();

  // Esconder no Kiosk (tablet) para não poluir a interface touch
  const hideMascot = location.pathname.includes('/kiosk');

  useEffect(() => {
    // Aparece após 1 segundo
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    // Lógica aleatória de piscar os olhinhos
    const blinkInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 200);
      }
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  if (hideMascot) return null;

  return (
    <div
      className={`mascot-container ${isVisible ? 'mascot-visible' : ''}`}
      style={{
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {/* Balão de fala sutil - apenas na home ou em hover simulado */}
      {location.pathname === '/' && (
        <div className="mascot-bubble animate-bounce">
          Oi! Sou o Checky!
        </div>
      )}

      {/* Mascote SVG (Maçãzinha) */}
      <div className="mascot-svg-wrapper animate-float">
        <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Sombra */}
          <ellipse cx="50" cy="90" rx="30" ry="5" fill="rgba(0,0,0,0.2)" className="mascot-shadow" />
          
          {/* Corpo da Maçã */}
          <path d="M50 85 C10 85, 10 30, 50 30 C90 30, 90 85, 50 85 Z" fill="url(#appleGrad)" />
          
          {/* Caule e Folha */}
          <path d="M50 30 C50 20, 55 15, 60 10" stroke="#8B5A2B" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M50 30 C40 20, 30 25, 30 35 C40 35, 50 30, 50 30 Z" fill="#34D399" />
          
          {/* Olhos (Piscando) */}
          {isBlinking ? (
            <g>
              <line x1="35" y1="50" x2="45" y2="50" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
              <line x1="55" y1="50" x2="65" y2="50" stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
            </g>
          ) : (
            <g>
              <circle cx="40" cy="50" r="5" fill="#0F172A" />
              <circle cx="42" cy="48" r="1.5" fill="#FFF" />
              
              <circle cx="60" cy="50" r="5" fill="#0F172A" />
              <circle cx="62" cy="48" r="1.5" fill="#FFF" />
            </g>
          )}

          {/* Bochechas fofas */}
          <ellipse cx="32" cy="56" rx="4" ry="2" fill="#FF8A8A" opacity="0.6" />
          <ellipse cx="68" cy="56" rx="4" ry="2" fill="#FF8A8A" opacity="0.6" />

          {/* Boca sorridente */}
          <path d="M45 58 Q50 65 55 58" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" fill="none" />

          {/* Brilho no corpo (Efeito artístico) */}
          <path d="M25 45 C20 55, 25 70, 40 80" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.3" fill="none" />

          <defs>
            <radialGradient id="appleGrad" cx="30" cy="40" r="60" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#059669" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
