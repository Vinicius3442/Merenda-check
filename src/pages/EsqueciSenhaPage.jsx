import { useState } from 'react';
import { Link } from 'react-router-dom';
import BgMesh from '../components/ui/BgMesh';
import Footer from '../components/ui/Footer';
import { supabase } from '../lib/supabase';

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    setErro(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login',
      });
      if (error) throw error;
      setEnviado(true);
    } catch (err) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BgMesh />
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div
            className="glass-panel animate-slide-up"
            style={{ padding: '44px 48px', maxWidth: 480, width: '100%', textAlign: 'center' }}
          >
            <Link to="/">
              <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 24 }} />
            </Link>

            <h1 style={{ fontSize: '1.7rem', marginBottom: 6, fontFamily: 'Outfit', letterSpacing: '-0.02em' }}>
              Recuperar Senha
            </h1>
            
            {!enviado ? (
              <>
                <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: '0.95rem' }}>
                  Informe seu e-mail institucional para receber as instruções de recuperação de acesso.
                </p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                  <div className="form-group" style={{ marginBottom: 24 }}>
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

                  {erro && (
                    <div style={{ color: 'var(--alert-red)', marginBottom: 16, fontSize: '0.9rem', padding: '10px', background: 'rgba(244,63,94,0.1)', borderRadius: 6 }}>
                      {erro}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={!email || loading}
                    style={{
                      width: '100%',
                      padding: '15px 20px',
                      borderRadius: 7,
                      border: 'none',
                      cursor: email && !loading ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      fontSize: '1rem',
                      fontWeight: 700,
                      fontFamily: 'inherit',
                      background: email && !loading ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                      color: email && !loading ? '#fff' : 'var(--text-muted)',
                      boxShadow: email && !loading ? '0 2px 12px rgba(16,185,129,0.3)' : 'none',
                      transition: 'all 0.2s',
                    }}
                  >
                    {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                    {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                  </button>
                </form>
              </>
            ) : (
              <div className="animate-fade-in" style={{ padding: '20px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 20px' }}>
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 style={{ marginBottom: 10 }}>Link Enviado!</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: 24, fontSize: '0.95rem', lineHeight: 1.5 }}>
                  Enviamos as instruções de recuperação para <strong>{email}</strong>. Verifique sua caixa de entrada.
                </p>
              </div>
            )}

            <div style={{ marginTop: 24 }}>
              <Link to="/login" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <i className="fa-solid fa-arrow-left"></i> Voltar para o Login
              </Link>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div style={{ padding: '0 24px 24px' }}>
          <Footer />
        </div>
      </div>
    </>
  );
}
