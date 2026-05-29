import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return (
    <footer className="landing-footer">
      <div className="landing-footer-inner" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40 }}>
        {/* Coluna 1: Marca */}
        <div>
          <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 16 }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
            Plataforma inteligente de auditoria e rastreabilidade alimentar com tecnologia criptográfica e IA Preditiva.
          </p>
        </div>

        {/* Coluna 2: Institucional */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: 16, fontFamily: 'Outfit' }}>Institucional</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><Link to="/sobre" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Sobre o Projeto</Link></li>
            <li><Link to="/transparencia" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Portal de Transparência</Link></li>
            <li><Link to="/#como-funciona" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Como Funciona</Link></li>
          </ul>
        </div>

        {/* Coluna 3: Legal */}
        <div>
          <h4 style={{ color: 'var(--text-main)', marginBottom: 16, fontFamily: 'Outfit' }}>Avisos Legais</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <li><Link to="/privacidade" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Política de Privacidade (LGPD)</Link></li>
            <li><Link to="/termos" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Termos de Uso</Link></li>
            <li><span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><i className="fa-solid fa-envelope"></i> ouvidoria@merendacheck.gov.br</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-legal">
        <span>© 2026 Merenda Check. GovTech de Rastreabilidade Pública.</span>
      </div>
    </footer>
  );
}
