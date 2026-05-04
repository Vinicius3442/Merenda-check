import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useMockSubmit } from '../../hooks/useMockSubmit';

export default function Saida() {
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
                <h1>Transferência Externa / Remanejamento</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Comunique a saída física de mercadorias para o Pátio Central ou outra Unidade.</p>
              </div>
            </div>

            <div className="glass-panel invoice-card animate-slide-up">
              <div className="scanner-mock">
                <i className="fa-solid fa-barcode" style={{ fontSize: '3rem', marginBottom: 10 }}></i>
                <h3 className="brand-font" style={{ fontSize: '1.1rem' }}>Escaneie o Recibo da Transportadora</h3>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo de Remanejamento</label>
                <select className="form-control">
                  <option disabled>Selecione um evento contratual...</option>
                  <option defaultValue>Transferência entre Escolas (Equilíbrio Inteligente IA)</option>
                  <option>Devolução Fornecedor (Defeito Organoléptico)</option>
                  <option>Recolhimento Secretaria Sede</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 30 }}>
                <label className="form-label">Destinatário</label>
                <input type="text" className="form-control" placeholder="CNPJ/ID do Órgão de Destino" defaultValue="EMEF Castro Alves (Id: 1049)" />
              </div>

              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Insumo Autuado</th>
                      <th>Hash (Blockchain)</th>
                      <th>Volume Solicitado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Carne Moída Bovina</td>
                      <td style={{ fontFamily: 'monospace' }}>#4920-A</td>
                      <td>5 kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 40, textAlign: 'right' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => mockSubmit({ successTitle: 'Manifesto Gerado', successMsg: 'A guia de remessa eletrônica foi despachada para o motorista.' })}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-truck-fast"></i> Validar Saída (Guia GNRE)</>}
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
