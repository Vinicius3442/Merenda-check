import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import PublicFooter from '../../components/ui/PublicFooter';
import '../../styles/landing.css';

export default function Ouvidoria() {
  return (
    <>
      <BgMesh />
      <header className="landing-header animate-fade-in" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link to="/" className="landing-logo">
          <img src="/logo.png" alt="Merenda Check" className="logo-img" />
          <span className="landing-logo-tagline" style={{ display: 'none' }}>Ouvidoria Pública</span>
        </Link>
        <nav className="landing-nav">
          <Link to="/">Voltar para Home</Link>
          <Link to="/transparencia">Transparência</Link>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ borderRadius: 50, padding: '10px 24px' }}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar
        </Link>
      </header>

      <main className="animate-slide-up" style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 800, margin: '0 auto', minHeight: '80vh', paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="compliance-tag" style={{ margin: '0 auto 20px auto' }}>
            <i className="fa-solid fa-bullhorn"></i> Controle Social
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
            Ouvidoria da <span className="text-gradient">Merenda</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>
            Sua identidade será mantida em sigilo absoluto. Os relatos são auditados diretamente.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '40px', borderRadius: '24px' }}>
          <h2 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-file-signature" style={{ color: 'var(--primary)' }}></i> Relatar um Problema
          </h2>
          
          <form onSubmit={(e) => { e.preventDefault(); alert("Obrigado pelo seu relato. A Ouvidoria já foi notificada e irá investigar."); }}>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, color: 'var(--text-main)' }}>Selecione a Escola</label>
              <select className="form-control" style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)' }} required>
                <option value="">Selecione...</option>
                <option value="1">CEI Pequeninos</option>
                <option value="2">EMEF João Silva</option>
                <option value="3">Outra não listada</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, color: 'var(--text-main)' }}>Qual o problema?</label>
              <select className="form-control" style={{ width: '100%', background: 'rgba(15, 23, 42, 0.6)' }} required>
                <option value="">Selecione a categoria</option>
                <option value="falta">Falta de Merenda (Cardápio não servido)</option>
                <option value="qualidade">Comida estragada ou com aspecto ruim</option>
                <option value="quantidade">Porções muito pequenas (Pouca comida)</option>
              </select>
            </div>

            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: 8, color: 'var(--text-main)' }}>Detalhes Adicionais</label>
              <textarea className="form-control" rows="4" placeholder="Descreva o que aconteceu em detalhes..." style={{ width: '100%', resize: 'vertical', background: 'rgba(15, 23, 42, 0.6)' }} required></textarea>
            </div>

            <div style={{ marginBottom: 30, padding: 24, background: 'rgba(255,255,255,0.02)', border: '1px dashed var(--border-subtle)', borderRadius: 12, textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}>
              <i className="fa-solid fa-camera" style={{ fontSize: '2.5rem', color: 'var(--text-muted)', marginBottom: 12 }}></i>
              <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>Anexar Imagem (Opcional)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>Tire uma foto do prato ou da situação como evidência</div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              <i className="fa-solid fa-paper-plane"></i> Enviar Relato Seguro
            </button>
          </form>
        </div>
      </main>

      <PublicFooter />
    </>
  );
}
