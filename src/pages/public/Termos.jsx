import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';

export default function Termos() {
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
            <h1 style={{ fontSize: '2rem', marginBottom: 30 }}>Termos de Uso</h1>
            
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
        <Footer />
      </div>
    </>
  );
}
