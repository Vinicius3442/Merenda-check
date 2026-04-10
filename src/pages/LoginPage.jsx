import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BgMesh from '../components/ui/BgMesh';

export default function LoginPage() {
  const [selected, setSelected] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { key: 'operador', icon: 'fa-utensils', title: 'Operador', subtitle: 'Merendeira / Nutricionista', color: 'var(--primary)' },
    { key: 'gestor', icon: 'fa-chart-line', title: 'Gestor', subtitle: 'Diretor Escolar', color: 'var(--alert-blue)' },
    { key: 'auditor', icon: 'fa-satellite-dish', title: 'Auditor', subtitle: 'Tribunal / Secretaria', color: 'var(--alert-yellow)' },
  ];

  const handleLogin = () => {
    if (!selected) return;
    login(selected);
    navigate(`/${selected}`);
  };

  return (
    <>
      <BgMesh />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <div className="glass-panel animate-slide-up" style={{ padding: 50, maxWidth: 600, width: '100%', textAlign: 'center' }}>
          <Link to="/">
            <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 30 }} />
          </Link>
          <h1 style={{ fontSize: '1.8rem', marginBottom: 8, fontFamily: 'Outfit' }}>Acesso à Plataforma</h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 40 }}>Selecione seu perfil de acesso para entrar no ambiente correto.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
            {roles.map((role) => (
              <button
                key={role.key}
                className={`role-btn`}
                onClick={() => setSelected(role.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '20px 24px', borderRadius: 16, cursor: 'pointer',
                  background: selected === role.key ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-surface-elevated)',
                  border: selected === role.key ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                  color: 'var(--text-main)', transition: 'all 0.3s', textAlign: 'left', width: '100%',
                  boxShadow: selected === role.key ? 'var(--neon-glow)' : 'none',
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: `${role.color}15`, color: role.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0,
                }}>
                  <i className={`fa-solid ${role.icon}`}></i>
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Outfit', marginBottom: 2 }}>{role.title}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{role.subtitle}</span>
                </div>
                {selected === role.key && (
                  <i className="fa-solid fa-circle-check" style={{ marginLeft: 'auto', color: 'var(--primary)', fontSize: '1.3rem' }}></i>
                )}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary btn-lg"
            style={{ width: '100%', opacity: selected ? 1 : 0.5 }}
            onClick={handleLogin}
            disabled={!selected}
          >
            <i className="fa-solid fa-right-to-bracket"></i> Entrar como {selected ? roles.find((r) => r.key === selected)?.title : '...'}
          </button>
        </div>
      </div>
    </>
  );
}
