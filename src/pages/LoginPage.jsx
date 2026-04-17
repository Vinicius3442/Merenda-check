import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BgMesh from '../components/ui/BgMesh';

export default function LoginPage() {
  const [selected, setSelected] = useState(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { key: 'operador', icon: 'fa-utensils',      title: 'Operador',  subtitle: 'Cozinheiro', color: 'var(--primary)' },
    { key: 'gestor',   icon: 'fa-chart-bar',     title: 'Gestor',    subtitle: 'Diretor Escolar', color: 'var(--alert-blue)' },
    { key: 'nutricao', icon: 'fa-apple-whole',   title: 'Nutrição',  subtitle: 'Resp. PNAE', color: 'var(--alert-green)' },
    { key: 'licitacao',icon: 'fa-file-signature',title: 'Licitação', subtitle: 'Setor de Contratos', color: 'var(--text-main)' },
    { key: 'auditor',  icon: 'fa-building-columns',title: 'Auditor', subtitle: 'Sec. de Ensino', color: 'var(--alert-yellow)' },
    { key: 'admin',    icon: 'fa-server',        title: 'SysAdmin',  subtitle: 'Depto. de TI', color: 'var(--alert-red)' },
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
    <>
      <BgMesh />
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div
          className="glass-panel animate-slide-up"
          style={{ padding: '44px 48px', maxWidth: 640, width: '100%', textAlign: 'center' }}
        >
          <Link to="/">
            <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 24 }} />
          </Link>

          <h1 style={{ fontSize: '1.7rem', marginBottom: 6, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
            Acesso à Plataforma
          </h1>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
            Selecione seu perfil e informe suas credenciais.
          </p>

          {/* Seleção de Perfil */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 24 }}>
            {roles.map((role) => {
              const isSelected = selected === role.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  className="role-btn"
                  onClick={() => handleRoleSelect(role.key)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '12px 16px', borderRadius: 8, cursor: 'pointer',
                    background: isSelected
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'var(--bg-surface-elevated)',
                    border: isSelected
                      ? '2px solid var(--primary)'
                      : '2px solid var(--border-subtle)',
                    color: 'var(--text-main)',
                    transition: 'all 0.2s',
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: `${role.color}18`, color: role.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem', flexShrink: 0,
                  }}>
                    <i className={`fa-solid ${role.icon}`}></i>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {role.title}
                    </h3>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                      {role.subtitle}
                    </span>
                  </div>
                  {isSelected && (
                    <i
                      className="fa-solid fa-circle-check"
                      style={{ color: 'var(--primary)', fontSize: '1rem', flexShrink: 0 }}
                    ></i>
                  )}
                </button>
              );
            })}
          </div>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label className="form-label">E-mail Institucional</label>
              <input
                type="email"
                className="form-control"
                placeholder="usuario@merendacheck.gov.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 8 }}>
              <label className="form-label">Senha</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: 24 }}>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                style={{ color: 'var(--primary)', fontSize: '0.88rem' }}
              >
                Esqueci minha senha
              </a>
            </div>

            {/* Botão de submit — alto contraste, dinâmico */}
            <button
              type="submit"
              disabled={!selected || !email || !senha}
              style={{
                width: '100%',
                padding: '15px 20px',
                borderRadius: 7,
                border: 'none',
                cursor: selected ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontSize: '1rem',
                fontWeight: 700,
                fontFamily: 'inherit',
                letterSpacing: '0.01em',
                transition: 'all 0.2s',
                // Alto contraste: fundo sólido branco-acinzentado quando sem seleção,
                // verde sólido quando tem perfil escolhido
                background: selected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                color: selected ? '#fff' : 'var(--text-muted)',
                boxShadow: selected ? '0 2px 12px rgba(16,185,129,0.3)' : 'none',
              }}
            >
              {selected ? (
                <>
                  <i className="fa-solid fa-arrow-right-to-bracket"></i>
                  Entrar como {selectedRole?.title}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-hand-pointer"></i>
                  Selecione um perfil acima
                </>
              )}
            </button>
          </form>

          {/* Rodapé do card */}
          <p style={{ marginTop: 20, fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            <i className="fa-solid fa-lock" style={{ marginRight: 5 }}></i>
            Conexão segura · LGPD · Dados criptografados
          </p>
        </div>
      </div>
    </>
  );
}
