import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useMockSubmit } from '../../hooks/useMockSubmit';

export default function SobraLimpa() {
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
                <h1>Registro de Sobra Limpa</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Preencha o peso da sobra das panelas (alimento pronto não servido).</p>
              </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40, borderTop: '4px solid var(--alert-red)' }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ width: 80, height: 80, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--alert-red)', fontSize: '2.5rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', marginBottom: 16 }}>
                  <i className="fa-solid fa-scale-unbalanced"></i>
                </div>
                <h3 className="brand-font" style={{ fontSize: '1.4rem' }}>Peso Aferido na Balança</h3>
              </div>

              <div className="form-group" style={{ marginBottom: 40 }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control large-input"
                    placeholder="0.0"
                    style={{ textAlign: 'center', paddingRight: '80px', width: '100%' }}
                  />
                  <span style={{
                    position: 'absolute', right: 24, fontSize: '1.5rem',
                    fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'Outfit', pointerEvents: 'none',
                  }}>kg</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo do Desperdício</label>
                <select className="form-control">
                  <option value="super">Estimativa Incorreta de Alunos Presentes</option>
                  <option value="sabor">Rejeição por Sabor ou Aparência</option>
                  <option value="validade">Alimento Preparado Inadequadamente</option>
                </select>
              </div>

              <div style={{ marginTop: 40 }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', background: 'var(--alert-red)', boxShadow: 'var(--alert-red-glow)' }}
                  onClick={() => mockSubmit({ successTitle: 'Desperdício Registrado', successMsg: 'A secretaria foi notificada para ajustar o planejamento contínuo.' })}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-triangle-exclamation"></i> Concluir Registro</>}
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
