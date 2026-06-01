import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !senha) return;
    setLoginLoading(true);
    setLoginError(null);
    const result = await login(email, senha);
    setLoginLoading(false);
    if (result.ok) {
      navigate(`/${result.role}`);
    } else {
      setLoginError(result.error || 'Erro ao autenticar. Verifique suas credenciais.');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Lado Esquerdo - Imagem em Tela Cheia */}
      <div 
        style={{ 
          flex: '1.2', 
          position: 'relative', 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          overflow: 'hidden'
        }}
        className="login-art-panel"
      >
        {/* Imagem de Fundo (Cover) */}
        <img 
          src="/alimentos.jpg" // Se mudou o nome do arquivo, atualize aqui
          alt="Merenda Check Arte" 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover', 
            zIndex: 1 
          }} 
        />
        
        {/* Camada escura por cima da imagem para dar leitura ao texto */}
        <div style={{ 
          position: 'absolute', 
          top: 0, left: 0, width: '100%', height: '100%', 
          background: 'linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 100%)', 
          zIndex: 2 
        }}></div>

        <div style={{ position: 'absolute', top: 40, left: 40, zIndex: 3 }}>
          <Link to="/">
            <img src="/logo.png" alt="Merenda Check" style={{ height: 40 }} />
          </Link>
        </div>
        
        <div style={{ position: 'relative', zIndex: 3, textAlign: 'center', padding: '0 20px' }}>
          <h2 style={{ fontSize: '2.8rem', fontFamily: 'Outfit', color: '#fff', marginBottom: 16, letterSpacing: '-0.02em', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Transparência que alimenta.
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.6, textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
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
              Insira seu e-mail institucional e senha para acessar seu painel de controle personalizado.
            </p>
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

            {loginError && (
              <div style={{ marginBottom: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', color: 'var(--alert-red)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <i className="fa-solid fa-triangle-exclamation"></i>
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={!email || !senha || loginLoading}
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
                opacity: (email && senha && !loginLoading) ? 1 : 0.5,
                boxShadow: (email && senha) ? '0 12px 24px rgba(16,185,129,0.25)' : 'none',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {loginLoading ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Autenticando...</>
              ) : (
                <><i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar Painel</>
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
          justify-content: center;
          gap: 6px;
          padding: 10px 8px;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-muted);
        }
        .role-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.12);
          transform: translateY(-2px);
        }
        .role-btn.selected {
          background: rgba(16, 185, 129, 0.1);
          border-color: var(--primary);
          color: var(--primary);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.15);
        }
        @media (max-width: 1024px) {
          .login-art-panel { display: none !important; }
          .login-form-panel { padding: 40px 24px !important; }
        }
      `}</style>
    </div>
  );
}