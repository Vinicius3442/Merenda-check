import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import PublicFooter from '../../components/ui/PublicFooter';
import '../../styles/landing.css';

export default function Privacidade() {
  return (
    <>
      <BgMesh />
      <header className="landing-header animate-fade-in" style={{ background: 'var(--bg-base)', borderBottom: '1px solid var(--border-subtle)' }}>
        <Link to="/" className="landing-logo">
          <img src="/logo.png" alt="Merenda Check" className="logo-img" />
          <span className="landing-logo-tagline" style={{ display: 'none' }}>Solução de Transparência</span>
        </Link>
        <nav className="landing-nav">
          <Link to="/">Voltar para Home</Link>
        </nav>
        <Link to="/login" className="btn btn-primary" style={{ borderRadius: 50, padding: '10px 24px' }}>
          <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar
        </Link>
      </header>
      
      <main className="animate-slide-up" style={{ paddingTop: 140, paddingBottom: 80, maxWidth: 900, margin: '0 auto', minHeight: '80vh', paddingLeft: 20, paddingRight: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="compliance-tag" style={{ margin: '0 auto 20px auto' }}>
            <i className="fa-solid fa-shield-halved"></i> Jurídico
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
            Política de <span className="text-gradient">Privacidade</span>
          </h1>
        </div>

        <div className="glass-panel" style={{ padding: '50px 40px', borderRadius: '24px' }}>
            
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              <p style={{ marginBottom: 20 }}>
                A plataforma <strong>Merenda Check</strong>, operada sob gestão governamental, respeita rigorosamente a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
              
              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>1. Coleta de Dados</h3>
              <p style={{ marginBottom: 20 }}>
                Coletamos apenas dados essenciais para o funcionamento do sistema de rastreabilidade: nome, e-mail e função dos operadores, bem como registros de atividades (logs) para fins de auditoria e segurança. Não armazenamos dados biométricos de alunos diretamente nesta plataforma (a validação ocorre via token anonimizado na catraca).
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>2. Uso dos Dados</h3>
              <p style={{ marginBottom: 20 }}>
                As informações coletadas são usadas exclusivamente para a gestão e prestação de contas do Programa Nacional de Alimentação Escolar (PNAE). Os dados agregados e anonimizados podem ser exibidos no Portal de Transparência.
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>3. Compartilhamento</h3>
              <p style={{ marginBottom: 20 }}>
                Não vendemos ou repassamos informações pessoais a terceiros. Os dados poderão ser compartilhados apenas com órgãos de controle (TCU, FNDE, Ministério Público) quando requisitado por força da lei.
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>4. Segurança e Criptografia</h3>
              <p style={{ marginBottom: 20 }}>
                Nossos bancos de dados utilizam RLS (Row Level Security) e criptografia forte (SHA-256) para garantir a imutabilidade e a proteção contra acessos não autorizados.
              </p>
            </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
