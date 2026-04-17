import DashboardLayout from '../../components/layout/DashboardLayout';
import { useMockSubmit } from '../../hooks/useMockSubmit';

export default function Relatorios() {
  const { loading, mockSubmit } = useMockSubmit();

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Repositório Documental</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Emissão de prestação de contas selada via Smart Contracts para prefeituras.</p>
        </div>
      </div>

      <div className="report-grid animate-slide-up delay-100">
        <div className="report-card glass-panel">
          <div className="report-icon"><i className="fa-solid fa-clipboard-check"></i></div>
          <h3 className="brand-font" style={{ fontSize: '1.5rem', marginBottom: 12 }}>Auditoria de Sobra Limpa</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30, flex: 1 }}>
            Exporta um documento fiscal detalhando a diferença grama por grama entre baixas de estoque e a sobra das panelas do dia de hoje.
          </p>
          <button className="btn btn-primary" onClick={() => mockSubmit({ successTitle: 'Download Iniciado', successMsg: 'Relatório extraído da Ledger (PDF Assinado).' })} disabled={loading}>
            <i className="fa-solid fa-download"></i> Gerar Extrato (D-0)
          </button>
        </div>

        <div className="report-card glass-panel">
          <div className="report-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--alert-blue)' }}><i className="fa-solid fa-chart-line"></i></div>
          <h3 className="brand-font" style={{ fontSize: '1.5rem', marginBottom: 12 }}>Evolução de Consumo</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30, flex: 1 }}>
            Comparativo mensal gerado pela IA indicando melhorias na calibração de compra x catracas do mês passado.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="month" className="form-control" style={{ width: '100%' }} />
            <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => mockSubmit({ successMsg: 'Gerando PDF...' })} disabled={loading}>
              <i className="fa-solid fa-magnifying-glass-chart"></i> Consultar
            </button>
          </div>
        </div>

        <div className="report-card glass-panel">
          <div className="report-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--alert-yellow)' }}><i className="fa-solid fa-file-shield"></i></div>
          <h3 className="brand-font" style={{ fontSize: '1.5rem', marginBottom: 12 }}>Certificado de Conformidade</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: 30, flex: 1 }}>
            Atestado governamental de que a escola não violou nenhum protocolo FIFO ou rejeitou inspeções ópticas nesta semana.
          </p>
          <button className="btn btn-secondary" style={{ color: 'var(--alert-yellow)', borderColor: 'var(--alert-yellow)' }} onClick={() => mockSubmit({ successTitle: 'Selo Aprovado', successMsg: 'Documento chancelado pela auditoria estadual.' })} disabled={loading}>
            <i className="fa-solid fa-certificate"></i> Emitir Selo (PDF)
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
