import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';

export default function Privacidade() {
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
            <h1 style={{ fontSize: '2rem', marginBottom: 30 }}>Política de Privacidade (LGPD)</h1>
            
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
        <Footer />
      </div>
    </>
  );
}
