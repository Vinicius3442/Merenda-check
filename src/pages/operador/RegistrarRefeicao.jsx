import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useMockSubmit } from '../../hooks/useMockSubmit';

export default function RegistrarRefeicao() {
  const { loading, mockSubmit } = useMockSubmit();

  return (
    <>
      <BgMesh />
      <div className="app-container">
        <main className="app-main" style={{ paddingTop: 60 }}>
          <div className="wizard-container" style={{ maxWidth: 700 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <Link to="/operador" className="btn btn-secondary"><i className="fa-solid fa-arrow-left"></i> Voltar</Link>
              <img src="/logo.png" alt="Merenda Check" className="logo-img" />
            </div>

            <div className="header-dash animate-fade-in">
              <div>
                <h1>Apontamento Manual</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Utilize este recurso em caso de falha da roleta biométrica do refeitório.</p>
              </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ width: 80, height: 80, background: 'rgba(5, 150, 105, 0.1)', color: 'var(--primary)', fontSize: '2.5rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', marginBottom: 16 }}>
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="brand-font" style={{ fontSize: '1.4rem' }}>Quantidade Estimada Servida</h3>
              </div>

              <div className="form-group" style={{ marginBottom: 40 }}>
                <input type="number" className="form-control large-input" placeholder="000" />
              </div>

              <div className="form-group">
                <label className="form-label">Nome do Supervisor / Responsável Legal</label>
                <input type="text" className="form-control" value="João Maria (123.456.789-00)" readOnly />
              </div>

              <div style={{ marginTop: 40 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: 18, fontSize: '1.1rem' }}
                  onClick={() => mockSubmit({ successTitle: 'Sistema Sincronizado', successMsg: 'Base de dados do refeitório atualizada com sucesso.' })}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-cloud-arrow-up"></i> Confirmar Quantidade</>}
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
