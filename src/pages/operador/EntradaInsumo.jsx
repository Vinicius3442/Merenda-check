import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useMockSubmit } from '../../hooks/useMockSubmit';

export default function EntradaInsumo() {
  const { loading, mockSubmit } = useMockSubmit();

  return (
    <>
      <BgMesh />
      <div className="app-container">
        <main className="app-main" style={{ paddingTop: 60 }}>
          <div className="wizard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <Link to="/operador" className="btn btn-secondary"><i className="fa-solid fa-arrow-left"></i> Voltar</Link>
              <img src="/logo.png" alt="Merenda Check" className="logo-img" />
            </div>

            <div className="header-dash animate-fade-in">
              <div>
                <h1>Recepção de Insumo</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Escaneie a QR Code do Romaneio de transporte para importar os dados do lote automaticamente.</p>
              </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              {/* Scanner mockup */}
              <div style={{
                width: '100%', height: 200, borderRadius: 20, border: '2px dashed var(--primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5, 150, 105, 0.05)', color: 'var(--primary)', marginBottom: 30, cursor: 'pointer',
                transition: '0.3s', fontSize: '1.1rem', gap: 10,
              }}>
                <i className="fa-solid fa-qrcode" style={{ fontSize: '3rem' }}></i>
                <span style={{ fontWeight: 700, fontFamily: 'Outfit' }}>Toque para Escanear QR Code</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>(simulação)</span>
              </div>

              <div className="form-group">
                <label className="form-label">Fornecedor</label>
                <input type="text" className="form-control" defaultValue="AgroSul Alimentos SA" readOnly />
              </div>
              <div className="form-group">
                <label className="form-label">Produto / Insumo</label>
                <input type="text" className="form-control" defaultValue="Carne Moída Bovina - Int. Nacional" readOnly />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Peso Conferido (kg)</label>
                  <input type="number" className="form-control" defaultValue="100" />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Validade</label>
                  <input type="date" className="form-control" defaultValue="2026-06-15" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observação (Opcional)</label>
                <textarea className="form-control" rows="3" placeholder="Anomalias na embalagem, temperatura, etc."></textarea>
              </div>

              <div style={{ marginTop: 30, textAlign: 'right' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => mockSubmit({ successTitle: 'Entrada Processada', successMsg: 'Estoque do almoxarifado sincronizado com a Ledger.' })}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-check"></i> Confirmar Entrada</>}
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
