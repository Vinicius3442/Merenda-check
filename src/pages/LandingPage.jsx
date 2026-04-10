import { Link } from 'react-router-dom';
import BgMesh from '../components/ui/BgMesh';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <>
      <BgMesh />

      {/* Floating Header */}
      <header className="landing-header animate-fade-in">
        <Link to="/" className="landing-logo">
          <img src="/logo.png" alt="Merenda Check" className="logo-img" />
        </Link>
        <nav className="landing-nav">
          <a href="#como-funciona">Como Funciona</a>
          <a href="#modulos">Módulos</a>
          <a href="#cta">Contato</a>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
          <i className="fa-solid fa-right-to-bracket"></i> Acessar Plataforma
        </Link>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content animate-slide-up">
          <span className="badge badge-success" style={{ marginBottom: 20 }}>
            <i className="fa-solid fa-shield-check"></i> Plataforma Governamental Ativa
          </span>
          <h1 className="hero-title">
            Rastreabilidade<br />
            <span className="text-gradient">Inteligente</span> da Merenda Escolar
          </h1>
          <p className="hero-subtitle">
            Do recebimento à colher do aluno. Cada grama registrado, auditado e protegido por contratos inteligentes imutáveis.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-rocket"></i> Iniciar Sessão
            </Link>
            <a href="#como-funciona" className="btn btn-light btn-lg">
              <i className="fa-solid fa-play"></i> Como Funciona
            </a>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="hero-mockup animate-slide-up delay-200">
          <div className="mockup-window glass-panel" style={{ padding: 30 }}>
            <div className="mockup-bar">
              <span className="mockup-dot" style={{ background: '#f43f5e' }}></span>
              <span className="mockup-dot" style={{ background: '#fbbf24' }}></span>
              <span className="mockup-dot" style={{ background: '#34d399' }}></span>
            </div>
            <div className="mockup-kpis">
              <div className="mockup-kpi">
                <div className="mockup-kpi-value text-gradient">97.1%</div>
                <div className="mockup-kpi-label">Conformidade</div>
              </div>
              <div className="mockup-kpi">
                <div className="mockup-kpi-value" style={{ color: 'var(--alert-blue)' }}>142</div>
                <div className="mockup-kpi-label">Escolas Ativas</div>
              </div>
              <div className="mockup-kpi">
                <div className="mockup-kpi-value" style={{ color: 'var(--alert-yellow)' }}>3</div>
                <div className="mockup-kpi-label">Alertas FIFO</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="workflow-section" id="como-funciona">
        <h2 className="section-title animate-fade-in">
          <span className="text-gradient">Como</span> Funciona
        </h2>
        <p className="section-subtitle animate-fade-in">Pipeline completo de rastreabilidade alimentar</p>
        <div className="workflow-grid animate-slide-up delay-100">
          {[
            { icon: 'fa-truck-ramp-box', num: '01', title: 'Recebimento', desc: 'Conferência óptica via QR Code no almoxarifado. Peso aferido e registrado.' },
            { icon: 'fa-boxes-stacked', num: '02', title: 'Armazenamento FIFO', desc: 'Sistema inteligente trava lotes novos enquanto antigos não são consumidos.' },
            { icon: 'fa-fire-burner', num: '03', title: 'Preparo & Consumo', desc: 'Operador registra despacho para cozinha e apontamento de refeições por catraca biométrica.' },
            { icon: 'fa-scale-unbalanced', num: '04', title: 'Sobra & Auditoria', desc: 'IA detecta discrepância entre preparo, catraca e sobra limpa. Alerta em tempo real.' },
          ].map((step) => (
            <div key={step.num} className="workflow-card glass-panel">
              <div className="workflow-num">{step.num}</div>
              <div className="workflow-icon">
                <i className={`fa-solid ${step.icon}`}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Módulos */}
      <section className="modules-section" id="modulos">
        <h2 className="section-title animate-fade-in">
          Painéis <span className="text-gradient">Especializados</span>
        </h2>
        <p className="section-subtitle animate-fade-in">Cada perfil tem sua visão otimizada</p>
        <div className="modules-grid animate-slide-up delay-100">
          {[
            { icon: 'fa-utensils', title: 'Operador (Merendeira)', desc: 'Interface tablet-first para registrar entradas, saídas, refeições e sobras da cozinha.', color: 'var(--primary)' },
            { icon: 'fa-chart-line', title: 'Gestor Escolar', desc: 'Dashboard analítico com gráficos preditivos, estoque transparente e emissão de relatórios fiscais.', color: 'var(--alert-blue)' },
            { icon: 'fa-satellite-dish', title: 'Auditor Municipal', desc: 'Visão de jurisdição completa com mapa de calor, investigação de lotes suspeitos e timeline forense.', color: 'var(--alert-yellow)' },
          ].map((mod) => (
            <div key={mod.title} className="module-card glass-panel">
              <div className="module-icon" style={{ color: mod.color, background: `${mod.color}15` }}>
                <i className={`fa-solid ${mod.icon}`}></i>
              </div>
              <h3>{mod.title}</h3>
              <p>{mod.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="cta-card glass-panel animate-slide-up">
          <h2>Pronto para <span className="text-gradient">Transformar</span> a Gestão?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 30px' }}>
            Solicite uma demonstração e saiba como o Merenda Check pode garantir a transparência e eficiência da merenda escolar no seu município.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-rocket"></i> Acessar Demonstração
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div>
            <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 12 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Rastreabilidade inteligente<br/>da merenda escolar.</p>
          </div>
          <div>
            <h4 style={{ marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>Plataforma</h4>
            <Link to="/login" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 6 }}>Acessar</Link>
            <a href="#como-funciona" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 6 }}>Como Funciona</a>
            <a href="#modulos" style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Módulos</a>
          </div>
          <div>
            <h4 style={{ marginBottom: 12, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: 1 }}>Legal</h4>
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 6 }}>Termos de Uso</span>
            <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Política de Privacidade</span>
          </div>
        </div>
        <div style={{ textAlign: 'center', paddingTop: 30, borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          &copy; 2026 Merenda Check. Todos os direitos reservados.
        </div>
      </footer>
    </>
  );
}
