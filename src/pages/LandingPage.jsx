import { Link } from 'react-router-dom';
import BgMesh from '../components/ui/BgMesh';
import '../styles/landing.css';

export default function LandingPage() {
  return (
    <>
      <BgMesh />

      {/* Header — Barra estruturada full-width */}
      <header className="landing-header animate-fade-in">
        <Link to="/" className="landing-logo">
          <img src="/logo.png" alt="Merenda Check" className="logo-img" />
          <span className="landing-logo-tagline">Solução de Transparência e Gestão</span>
        </Link>
        <nav className="landing-nav">
          <a href="#como-funciona">Como Funciona</a>
          <a href="#modulos">Módulos</a>
          <a href="#cta">Contato</a>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ flexShrink: 0 }}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar Plataforma
        </Link>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content animate-slide-up">

          {/* Tag de certificação institucional */}
          <div className="compliance-tag">
            <i className="fa-solid fa-lock"></i>
            Em conformidade com a LGPD e Lei de Transparência
          </div>

          <h1 className="hero-title">
            Sistema de Auditoria e<br />
            Rastreabilidade de{' '}
            <span className="text-gradient">Insumos Escolares</span>
          </h1>
          <p className="hero-subtitle">
            Do recebimento ao prato do aluno: cada grama registrado, auditado
            em tempo real. Dados criptografados e auditáveis via tecnologia
            Blockchain para garantir a integridade da merenda pública.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-user-shield"></i> Acessar a Plataforma
            </Link>
            <a href="#como-funciona" className="btn btn-light btn-lg">
              <i className="fa-solid fa-circle-info"></i> Como Funciona
            </a>
          </div>
        </div>

        {/* Painel de indicadores governamentais */}
        <div className="hero-mockup animate-slide-up delay-200">
          <div className="mockup-window glass-panel">
            {/* Barra institucional — sem dots do macOS */}
            <div className="mockup-header">
              <span className="mockup-header-title">
                <i className="fa-solid fa-chart-line" style={{ marginRight: 6 }}></i>
                Painel Municipal — Exemplo-SP · 2026
              </span>
              <span className="mockup-status">
                <span className="mockup-status-dot"></span> Sistema Ativo
              </span>
            </div>
            <div className="mockup-kpis">
              <div className="mockup-kpi">
                <div className="mockup-kpi-value" style={{ color: 'var(--primary)' }}>
                  R$ 87K
                </div>
                <div className="mockup-kpi-label">Economia Gerada</div>
              </div>
              <div className="mockup-kpi">
                <div className="mockup-kpi-value" style={{ color: 'var(--alert-blue)' }}>
                  142
                </div>
                <div className="mockup-kpi-label">Escolas Atendidas</div>
              </div>
              <div className="mockup-kpi">
                <div className="mockup-kpi-value" style={{ color: 'var(--alert-green)' }}>
                  100%
                </div>
                <div className="mockup-kpi-label">Status Auditado</div>
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
        <p className="section-subtitle animate-fade-in">
          Pipeline completo de rastreabilidade e auditoria alimentar
        </p>
        <div className="workflow-grid animate-slide-up delay-100">
          {[
            {
              icon: 'fa-truck-ramp-box', num: '01', title: 'Recebimento',
              desc: 'Conferência via QR Code no almoxarifado. Lote registrado com peso, data e fornecedor.',
            },
            {
              icon: 'fa-boxes-stacked', num: '02', title: 'Armazenamento FIFO',
              desc: 'Sistema garante consumo ordenado por validade, prevenindo desperdício e desvios.',
            },
            {
              icon: 'fa-fire-burner', num: '03', title: 'Preparo e Consumo',
              desc: 'Operador registra despacho para a cozinha e o sistema aponta refeições por escola.',
            },
            {
              icon: 'fa-magnifying-glass-chart', num: '04', title: 'Sobra e Auditoria',
              desc: 'Discrepâncias entre preparo e sobra são detectadas e reportadas ao auditor em tempo real.',
            },
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
        <p className="section-subtitle animate-fade-in">
          Cada perfil tem sua visão otimizada para suas responsabilidades
        </p>
        <div className="modules-grid animate-slide-up delay-100">
          {[
            {
              icon: 'fa-utensils',
              title: 'Operador — Merendeira / Nutricionista',
              desc: 'Interface simplificada para registrar entradas, saídas, refeições servidas e sobras da cozinha.',
              color: 'var(--primary)',
            },
            {
              icon: 'fa-chart-bar',
              title: 'Gestor Escolar — Diretor',
              desc: 'Dashboard com visão de estoque local, relatórios fiscais e alertas de consumo irregular.',
              color: 'var(--alert-blue)',
            },
            {
              icon: 'fa-building-columns',
              title: 'Auditor Municipal — Tribunal / Secretaria',
              desc: 'Visão completa da jurisdição com investigação de lotes, linha do tempo forense e alertas automáticos.',
              color: 'var(--alert-yellow)',
            },
          ].map((mod) => (
            <div key={mod.title} className="module-card glass-panel">
              <div className="module-icon" style={{ color: mod.color, background: `${mod.color}18` }}>
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
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: 560, margin: '0 auto 28px', lineHeight: 1.7 }}>
            Solicite acesso à demonstração e saiba como o Merenda Check garante a
            transparência, a economicidade e a conformidade da alimentação escolar no seu município.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar a Plataforma
          </Link>
        </div>
      </section>

      {/* Rodapé Institucional */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">

          {/* Coluna 1: Marca */}
          <div>
            <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 14 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: 10 }}>
              Sistema de Auditoria e Rastreabilidade<br />de Insumos Escolares Públicos.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
              <i className="fa-solid fa-location-dot" style={{ marginRight: 6 }}></i>
              Secretaria Municipal de Educação
            </p>
          </div>

          {/* Coluna 2: Plataforma */}
          <div className="footer-col">
            <h5>Plataforma</h5>
            <Link to="/login">Acessar o Sistema</Link>
            <a href="#como-funciona">Como Funciona</a>
            <a href="#modulos">Módulos</a>
          </div>

          {/* Coluna 3: Legislação */}
          <div className="footer-col">
            <h5>Legislação</h5>
            <a href="https://www.gov.br/lgpd" target="_blank" rel="noreferrer">
              LGPD — Lei nº 13.709/2018
            </a>
            <a href="https://www.gov.br/acessoainformacao" target="_blank" rel="noreferrer">
              Lei de Acesso à Informação
            </a>
            <a href="https://www.fnde.gov.br/pnae" target="_blank" rel="noreferrer">
              PNAE — Programa Nacional
            </a>
          </div>

          {/* Coluna 4: Suporte */}
          <div className="footer-col">
            <h5>Suporte</h5>
            <span>Seg – Sex: 08h às 18h</span>
            <a href="#cta">Solicitar Acesso</a>
            <a href="#cta">Manual do Usuário</a>
            <a href="https://www.transparencia.gov.br" target="_blank" rel="noreferrer">
              Portal da Transparência
            </a>
          </div>
        </div>

        <div className="footer-legal">
          <span>© 2026 Merenda Check. Todos os direitos reservados.</span>
          <div style={{ display: 'flex', gap: 20 }}>
            <a href="#cta">Termos de Uso</a>
            <a href="#cta">Política de Privacidade</a>
          </div>
        </div>
      </footer>
    </>
  );
}
