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
          <span className="landing-logo-tagline" style={{ display: 'none' /* Oculto mobile/desktop clean */ }}>Solução de Transparência</span>
        </Link>
        <nav className="landing-nav">
          <a href="#como-funciona">Como Funciona</a>
          <a href="#modulos">Módulos</a>
          <a href="#cta">Contato</a>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ flexShrink: 0, borderRadius: 50, padding: '10px 24px' }}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar
        </Link>
      </header>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content animate-slide-up">

          {/* Tag de certificação institucional */}
          <div className="compliance-tag">
            <i className="fa-solid fa-shield-halved"></i>
            Tecnologia de Transparência Pública
          </div>

          <h1 className="hero-title">
            Do Almoxarifado<br />
            ao <span className="text-gradient">Prato do Aluno.</span>
          </h1>
          <p className="hero-subtitle">
            Gestão inteligente, rastreabilidade completa e auditoria em tempo real.
            Garanta que cada recurso da merenda escolar seja utilizado com perfeição, sem desperdícios.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-bolt"></i> Começar Agora
            </Link>
            <a href="#como-funciona" className="btn btn-light btn-lg">
              <i className="fa-solid fa-play"></i> Ver Demonstração
            </a>
          </div>
        </div>

        {/* Nova Imagem Artística Premium */}
        <div className="hero-mockup-group animate-slide-up delay-200" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '550px', transform: 'rotateY(-15deg) rotateX(10deg)', transformStyle: 'preserve-3d', animation: 'float3D 8s ease-in-out infinite' }}>
            {/* Brilho atrás da imagem */}
            <div style={{ position: 'absolute', top: '10%', left: '10%', right: '10%', bottom: '10%', background: 'var(--primary)', filter: 'blur(80px)', opacity: 0.4, zIndex: -1 }}></div>
            
            <img 
              src="/merenda.jpeg" 
              alt="Merenda Check 3D Concept" 
              style={{ width: '100%', borderRadius: '32px', boxShadow: '0 40px 80px rgba(0,0,0,0.7)', border: '2px solid rgba(255,255,255,0.1)' }} 
            />
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="workflow-section" id="como-funciona">
        <h2 className="section-title animate-fade-in">
          <span className="text-gradient">Inteligência</span> em cada Etapa
        </h2>
        <p className="section-subtitle animate-fade-in">
          Nossa plataforma acompanha a merenda escolar através de um ecossistema conectado, eliminando perdas e garantindo qualidade.
        </p>
        <div className="workflow-grid animate-slide-up delay-100">
          {[
            {
              icon: 'fa-truck-ramp-box', num: '01', title: 'Recepção Inteligente',
              desc: 'Leitura via QR Code com auditoria imediata. Pesagem, validade e origem registradas no ato.',
            },
            {
              icon: 'fa-cubes-stacked', num: '02', title: 'Estoque Dinâmico',
              desc: 'Algoritmo FIFO garante o consumo dos itens corretos, evitando validade expirada e desperdícios.',
            },
            {
              icon: 'fa-fire-burner', num: '03', title: 'Preparo Rastreado',
              desc: 'Transformação dos insumos em refeições documentada, com ficha técnica e custo por prato.',
            },
            {
              icon: 'fa-chart-pie', num: '04', title: 'Análise de Consumo',
              desc: 'Controle de sobras limpas e biometria/cartão de alunos para estatísticas precisas de adesão.',
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
          Feito para <span className="text-gradient">Todos</span>
        </h2>
        <p className="section-subtitle animate-fade-in">
          Interfaces especializadas garantem a melhor experiência para cada usuário do sistema.
        </p>
        <div className="modules-grid animate-slide-up delay-100">
          {[
            {
              icon: 'fa-hand-holding-hand',
              title: 'Operadores e Merendeiras',
              desc: 'Aplicativo de uso fácil, botões grandes e fluxos rápidos para o dia a dia na cozinha.',
              color: 'var(--primary)',
            },
            {
              icon: 'fa-school',
              title: 'Gestão Escolar',
              desc: 'Visão completa da unidade: estoque, cardápios e relatórios financeiros automatizados.',
              color: 'var(--alert-blue)',
            },
            {
              icon: 'fa-building-columns',
              title: 'Auditoria Municipal',
              desc: 'Dashboard macro de toda a rede. Alertas de desvios, análises comparativas e total compliance.',
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
          <h2>Transforme a <span className="text-gradient">Merenda Escolar</span></h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 600, margin: '0 auto 32px', lineHeight: 1.7 }}>
            Junte-se às escolas que já estão economizando milhões enquanto garantem refeições de maior qualidade para os alunos.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            <i className="fa-solid fa-rocket"></i> Agendar Demonstração
          </Link>
        </div>
      </section>

      {/* Rodapé Institucional */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          {/* Coluna 1: Marca */}
          <div>
            <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ marginBottom: 16 }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: 16 }}>
              Plataforma inteligente de auditoria e rastreabilidade alimentar.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <a href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-brands fa-linkedin-in"></i></a>
              <a href="#" style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><i className="fa-brands fa-twitter"></i></a>
            </div>
          </div>

          {/* Coluna 2: Produto */}
          <div className="footer-col">
            <h5>Produto</h5>
            <Link to="/login">Login</Link>
            <a href="#como-funciona">Recursos</a>
            <a href="#modulos">Perfis de Usuário</a>
            <a href="#">Casos de Sucesso</a>
          </div>

          {/* Coluna 3: Empresa */}
          <div className="footer-col">
            <h5>Empresa</h5>
            <a href="#">Sobre Nós</a>
            <a href="#">Contato</a>
            <a href="#">Trabalhe Conosco</a>
            <a href="#">Imprensa</a>
          </div>

          {/* Coluna 4: Legal */}
          <div className="footer-col">
            <h5>Legal</h5>
            <a href="https://www.gov.br/lgpd" target="_blank" rel="noreferrer">LGPD</a>
            <a href="#">Termos de Uso</a>
            <a href="#">Política de Privacidade</a>
            <a href="#">Compliance</a>
          </div>
        </div>

        <div className="footer-legal">
          <span>© 2026 Merenda Check. Inovando a Gestão Pública.</span>
          <span>Feito com <i className="fa-solid fa-heart" style={{ color: 'var(--alert-red)' }}></i> para a educação.</span>
        </div>
      </footer>
    </>
  );
}
