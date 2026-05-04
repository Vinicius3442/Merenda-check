import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { key: 'operador', icon: 'fa-utensils',      title: 'Operador',  color: 'var(--primary)' },
    { key: 'gestor',   icon: 'fa-chart-bar',     title: 'Gestor',    color: 'var(--alert-blue)' },
    { key: 'nutricao', icon: 'fa-apple-whole',   title: 'Nutrição',  color: 'var(--alert-green)' },
    { key: 'licitacao',icon: 'fa-file-signature',title: 'Licitação', color: '#f59e0b' },
    { key: 'auditor',  icon: 'fa-building-columns',title: 'Auditor', color: 'var(--alert-yellow)' },
    { key: 'transportadora', icon: 'fa-truck-fast', title: 'Logística', color: '#8b5cf6' },
    { key: 'admin',    icon: 'fa-server',        title: 'SysAdmin',  color: 'var(--alert-red)' },
  ];

  const selectedRole = roles.find((r) => r.key === selected);

  const handleRoleSelect = (key) => {
    setSelected(key);
    setEmail(`${key}@merendacheck.gov.br`);
    setSenha('demo1234');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!selected) return;
    login(selected);
    navigate(`/${selected}`);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Lado Esquerdo - Imagem / Arte */}
      <div 
        style={{ 
          flex: '1.2', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden',
          background: 'radial-gradient(circle at 30% 50%, rgba(16,185,129,0.15) 0%, rgba(15,23,42,1) 80%)'
        }}
        className="login-art-panel"
      >
        <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 10 }}>
          <Link to="/">
            <img src="/logo.png" alt="Merenda Check" style={{ height: 40 }} />
          </Link>
        </div>

        <div style={{ position: 'relative', width: '80%', maxWidth: '600px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src="/hero_illustration.png" 
            alt="Merenda Check Arte" 
            style={{ width: '100%', maxHeight: '55vh', objectFit: 'contain', filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.6))', zIndex: 2, animation: 'float3D 8s ease-in-out infinite' }} 
          />
          <div style={{ position: 'absolute', top: '50%', left: '50%', width: '120%', height: '120%', transform: 'translate(-50%, -50%)', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', zIndex: 1 }}></div>
        </div>
        
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: 40 }}>
          <h2 style={{ fontSize: '2.8rem', fontFamily: 'Outfit', color: '#fff', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Transparência que alimenta.
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Acesso seguro à plataforma de gestão escolar e rastreabilidade alimentar.
          </p>
        </div>
      </div>

      {/* Lado Direito - Formulário */}
      <div 
        style={{ 
          flex: '1', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          padding: '60px',
          background: 'var(--bg-surface)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.4)',
          zIndex: 5,
          position: 'relative'
        }}
        className="login-form-panel"
      >
        <div style={{ maxWidth: 460, width: '100%', margin: '0 auto' }}>
          
          <div style={{ marginBottom: 40 }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: 12, fontFamily: 'Outfit', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              Acesso ao Sistema
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.5 }}>
              Selecione seu perfil institucional para acessar seu painel de controle personalizado.
            </p>
          </div>

          {/* Seleção de Perfil */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 40 }}>
            {roles.map((role) => {
              const isSelected = selected === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleRoleSelect(role.key)}
                  className={`role-btn ${isSelected ? 'selected' : ''}`}
                >
                  <i className={`fa-solid ${role.icon}`} style={{ fontSize: '1.2rem', color: isSelected ? role.color : 'inherit', width: 24, textAlign: 'center' }}></i>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{role.title}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>E-mail Institucional</label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-envelope login-input-icon"></i>
                <input
                  type="email"
                  className="login-input"
                  placeholder="nome@merendacheck.gov.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600 }}>Senha de Acesso</label>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-lock login-input-icon"></i>
                <input
                  type="password"
                  className="login-input"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ width: 18, height: 18, accentColor: 'var(--primary)' }} /> Manter conectado
              </label>
              <Link to="/esqueci-senha" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={e => e.target.style.opacity = 0.8} onMouseLeave={e => e.target.style.opacity = 1}>
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={!selected || !email || !senha}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: 14,
                fontSize: '1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                opacity: selected ? 1 : 0.5,
                boxShadow: selected ? '0 12px 24px rgba(16,185,129,0.25)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {selected ? (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  Acessar como {selectedRole?.title}
                </>
              ) : (
                'Selecione seu Perfil'
              )}
            </button>
          </form>

          <div style={{ marginTop: 40, textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 30 }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--primary)' }}></i>
              Acesso restrito a servidores autorizados. Ambiente criptografado.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .login-input {
          width: 100%;
          padding: 14px 16px 14px 44px;
          font-size: 1rem;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-family: 'Inter', sans-serif;
        }
        .login-input:focus {
          outline: none;
          background: rgba(16, 185, 129, 0.05);
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1), 0 8px 16px rgba(0, 0, 0, 0.2);
          transform: translateY(-1px);
        }
        .login-input-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: var(--text-muted);
          transition: color 0.3s;
          pointer-events: none;
        }
        .form-group:focus-within .login-input-icon {
          color: var(--primary);
        }
        .role-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: left;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }
        .role-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }
        .role-btn.selected {
          background: rgba(16, 185, 129, 0.1);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 8px 20px rgba(16, 185, 129, 0.15);
        }
        @media (max-width: 1024px) {
          .login-art-panel { display: none !important; }
          .login-form-panel { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  );
}
