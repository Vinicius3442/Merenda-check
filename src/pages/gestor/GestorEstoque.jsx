import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useMockSubmit } from '../../hooks/useMockSubmit';
import { mockEstoque } from '../../data/mockData';

export default function GestorEstoque() {
  const { loading, mockSubmit } = useMockSubmit();

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Estoque Transparente</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Lista restrita baseada na assinatura da EMEF João Silva.</p>
        </div>
        <div>
          <button className="btn btn-secondary" onClick={() => mockSubmit({ successMsg: 'Relatório em PDF Gerado' })} disabled={loading}>
            <i className="fa-solid fa-file-pdf"></i> Exportar Audit-PDF
          </button>
        </div>
      </div>

      <div className="card glass-panel animate-slide-up delay-100">
        <div className="filter-bar" style={{ padding: '20px 20px 0' }}>
          <input type="text" placeholder="Buscar por Lote, Hash ou ID de Insumo..." />
          <button className="btn btn-secondary"><i className="fa-solid fa-filter"></i> Filtrar Situação</button>
        </div>

        <div className="table-wrapper" style={{ margin: 20, border: 'none', boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Código / Lote</th>
                <th>Insumo</th>
                <th>Volume Atual</th>
                <th>Validade / SLA</th>
                <th>Status do Lote</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {mockEstoque.map((item) => (
                <tr key={item.id} style={item.status === 'bloqueado' ? { opacity: 0.6, backgroundColor: 'var(--bg-base)' } : {}}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                    {item.lote} <br /><span style={{ fontSize: '0.7rem' }}>{item.hash}</span>
                  </td>
                  <td style={{ fontWeight: 600, textDecoration: item.status === 'arquivado' ? 'line-through' : 'none', color: item.status === 'arquivado' ? 'var(--text-muted)' : 'var(--text-main)' }}>
                    {item.nome}
                  </td>
                  <td>{item.volume}</td>
                  <td style={{ color: item.status === 'urgente' ? 'var(--alert-red)' : 'inherit' }}>
                    {item.status === 'urgente' && <i className="fa-solid fa-hourglass-end" style={{ marginRight: 6 }}></i>}
                    {item.status === 'arquivado' && <i className="fa-solid fa-check-double text-gradient" style={{ marginRight: 6 }}></i>}
                    {item.validade}
                  </td>
                  <td>
                    {item.status === 'urgente' && (
                      <span className="badge" style={{ background: 'rgba(239,68,68,0.1)', color: 'var(--alert-red)', border: '1px solid rgba(239,68,68,0.2)', animation: 'pulseGlow 2s infinite' }}>
                        <i className="fa-solid fa-unlock"></i> Prioridade Máxima
                      </span>
                    )}
                    {item.status === 'bloqueado' && <span className="badge badge-neutral"><i className="fa-solid fa-lock"></i> Bloqueado (Data Posterior)</span>}
                    {item.status === 'normal' && <span className="badge badge-success"><i className="fa-solid fa-check"></i> Liberação Padrão</span>}
                    {item.status === 'arquivado' && <span className="badge badge-neutral"><i className="fa-solid fa-archive"></i> Arquivado</span>}
                  </td>
                  <td>
                    {item.eligible && (
                      <Link to="/operador/baixa" className="btn btn-primary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                        <i className="fa-solid fa-download"></i> {item.status === 'urgente' ? 'Baixar Agora' : 'Baixar'}
                      </Link>
                    )}
                    {item.status === 'bloqueado' && (
                      <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} disabled title="Bloqueado pela regra FIFO">
                        <i className="fa-solid fa-ban"></i> Restrito
                      </button>
                    )}
                    {item.status === 'arquivado' && (
                      <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }} onClick={() => mockSubmit({ successMsg: 'Código copiado para área de transferência.' })}>
                        <i className="fa-solid fa-link"></i> Rastrear
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
