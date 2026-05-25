import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';

export default function Transparencia() {
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
        
        <main className="app-main" style={{ paddingTop: 60, paddingBottom: 60, maxWidth: 900, margin: '0 auto' }}>
          <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: 10, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <i className="fa-solid fa-magnifying-glass-chart" style={{ color: 'var(--primary)' }}></i>
              Portal de <span className="text-gradient">Transparência</span>
            </h1>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: 40, fontSize: '1.1rem' }}>
              Dados abertos da alimentação escolar municipal para controle social.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 40 }}>
              <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
                <i className="fa-solid fa-file-contract" style={{ fontSize: '2.5rem', color: 'var(--alert-blue)', marginBottom: 16 }}></i>
                <h3 style={{ marginBottom: 10 }}>Contratos e Licitações</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Visualize todas as atas de registro de preço e contratos com fornecedores do PNAE.</p>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Ver Documentos</button>
              </div>
              <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
                <i className="fa-solid fa-truck-ramp-box" style={{ fontSize: '2.5rem', color: 'var(--alert-green)', marginBottom: 16 }}></i>
                <h3 style={{ marginBottom: 10 }}>Lotes Entregues</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Acompanhe a origem, data e hash criptográfico de cada remessa de alimento.</p>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Ver Entregas</button>
              </div>
              <div className="card glass-panel" style={{ padding: 24, textAlign: 'center' }}>
                <i className="fa-solid fa-chart-pie" style={{ fontSize: '2.5rem', color: 'var(--alert-yellow)', marginBottom: 16 }}></i>
                <h3 style={{ marginBottom: 10 }}>Dados de Consumo</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 16 }}>Estatísticas reais de refeições servidas por escola, índices de sobra e conformidade.</p>
                <button className="btn btn-secondary" style={{ width: '100%' }}>Ver Relatórios</button>
              </div>
            </div>
            
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: 24, textAlign: 'center' }}>
              <i className="fa-solid fa-lock" style={{ fontSize: '2rem', color: 'var(--text-muted)', marginBottom: 12 }}></i>
              <h3>Imutabilidade Criptográfica</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: 600, margin: '0 auto' }}>
                Todos os dados apresentados neste portal são chancelados por hashes SHA-256 no momento da geração, impossibilitando adulteração retroativa dos valores nutricionais e financeiros através de criptografia matemática forte.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
