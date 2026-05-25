import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';

export default function SobreNos() {
  return (
    <>
      <BgMesh />
      <div className="app-container">
        <header className="landing-header animate-fade-in" style={{ background: 'var(--bg-surface)', padding: '15px 40px', borderBottom: '1px solid var(--border-subtle)' }}>
          <Link to="/" className="landing-logo">
            <img src="/logo.png" alt="Merenda Check" className="logo-img" />
          </Link>
          <nav className="landing-nav">
            <Link to="/">Voltar para Home</Link>
          </nav>
          <Link to="/login" className="btn btn-primary" style={{ borderRadius: 50, padding: '10px 24px' }}>
            Acessar
          </Link>
        </header>
        
        <main className="app-main" style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 800, margin: '0 auto' }}>
          <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: 20, textAlign: 'center' }}>
              Nossa <span className="text-gradient">Missão</span>
            </h1>
            
            <div style={{ fontSize: '1.1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              <p style={{ marginBottom: 20 }}>
                O <strong>Merenda Check</strong> nasceu da necessidade de trazer transparência absoluta e eficiência para um dos programas mais importantes do nosso país: o Programa Nacional de Alimentação Escolar (PNAE).
              </p>
              <p style={{ marginBottom: 20 }}>
                Acreditamos que cada centavo investido em alimentação escolar deve chegar ao prato do aluno com qualidade, segurança e no tempo certo. O desperdício e a má gestão não apenas custam caro aos cofres públicos, mas também afetam o desenvolvimento de milhares de crianças.
              </p>
              <p style={{ marginBottom: 20 }}>
                Nossa plataforma utiliza tecnologias de ponta, como Rastreabilidade Criptográfica (Imutabilidade via Hashes SHA-256) e Inteligência Artificial, para cruzar dados desde a saída do almoxarifado até a catraca da escola, garantindo que o alimento seja rastreado em tempo real.
              </p>
              
              <div style={{ marginTop: 40, padding: 24, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, borderLeft: '4px solid var(--primary)' }}>
                <h3 style={{ marginBottom: 10, color: 'var(--primary)', fontFamily: 'Outfit' }}>Por que criamos o Merenda Check?</h3>
                <ul style={{ listStylePosition: 'inside', paddingLeft: 0 }}>
                  <li style={{ marginBottom: 10 }}>Para acabar com o desperdício invisível nas cozinhas.</li>
                  <li style={{ marginBottom: 10 }}>Para facilitar a vida das merendeiras e diretoras com fluxos digitais simples.</li>
                  <li style={{ marginBottom: 10 }}>Para garantir que o dinheiro público seja auditável por qualquer cidadão.</li>
                </ul>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
