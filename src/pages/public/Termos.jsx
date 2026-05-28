import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import PublicFooter from '../../components/ui/PublicFooter';
import '../../styles/landing.css';

export default function Termos() {
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
            <i className="fa-solid fa-scale-balanced"></i> Termos
          </div>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', margin: 0 }}>
            Termos de <span className="text-gradient">Uso</span>
          </h1>
        </div>

        <div className="glass-panel" style={{ padding: '50px 40px', borderRadius: '24px' }}>
            
            <div style={{ fontSize: '1rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              <p style={{ marginBottom: 20 }}>
                Ao acessar e utilizar o sistema <strong>Merenda Check</strong>, você, servidor ou prestador de serviço, concorda com as seguintes condições legais.
              </p>
              
              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>1. Responsabilidade Funcional</h3>
              <p style={{ marginBottom: 20 }}>
                As credenciais de acesso são pessoais e intransferíveis. Qualquer registro no sistema (como baixa de estoque, entrada de insumos ou confirmação de QR Code) feito sob seu login possui presunção de veracidade e valor legal para fins de auditoria pública.
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>2. Imutabilidade dos Registros</h3>
              <p style={{ marginBottom: 20 }}>
                Ciente de que o Merenda Check utiliza algoritmos de rastreabilidade (Hashing), registros inseridos e validados no sistema não poderão ser excluídos, apenas retificados através de movimentações compensatórias devidamente justificadas.
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>3. Uso da Aplicação Mobile</h3>
              <p style={{ marginBottom: 20 }}>
                A utilização do aplicativo móvel para leitura de remessas e gestão de estoque exige permissão de acesso à câmera e à internet do dispositivo. A responsabilidade por manter o software atualizado é da Unidade Escolar.
              </p>

              <h3 style={{ marginTop: 30, marginBottom: 15, fontFamily: 'Outfit' }}>4. Penalidades</h3>
              <p style={{ marginBottom: 20 }}>
                A inserção deliberada de dados falsos, bem como a fraude no registro de catraca e recebimento de mercadorias, sujeitará o infrator às sanções administrativas, civis e penais cabíveis de acordo com a legislação aplicável aos servidores públicos e fornecedores licitados.
              </p>
            </div>
        </div>
      </main>
      <PublicFooter />
    </>
  );
}
