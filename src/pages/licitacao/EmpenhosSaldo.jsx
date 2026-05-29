import DashboardLayout from '../../components/layout/DashboardLayout';
import { useContratos } from '../../hooks/useContratos';

export default function EmpenhosSaldo() {
  const { contratos, loading } = useContratos();

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  const totalGeral = contratos.reduce((s, c) => s + Number(c.valor_total || 0), 0);
  const totalExec  = contratos.reduce((s, c) => s + Number(c.valor_executado || 0), 0);
  const totalSaldo = totalGeral - totalExec;

  const getStatusColor = (c) => {
    const pct = c.valor_total > 0 ? (c.valor_executado / c.valor_total) : 0;
    if (pct >= 0.95) return 'var(--alert-red)';
    if (pct >= 0.70) return 'var(--alert-yellow)';
    return 'var(--alert-green)';
  };

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fa-solid fa-file-signature" style={{ color: 'var(--primary)' }}></i>
              Contratos e Empenhos (Pregão)
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
              Controle de saldo licitado para evitar pagamentos superfaturados ou entregas sem cobertura legal.
            </p>
          </div>
        </div>

        <div className="kpi-grid animate-slide-up" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: 30 }}>
          <div className="kpi-card">
            <div className="kpi-icon"><i className="fa-solid fa-sack-dollar"></i></div>
            <div className="kpi-value" style={{ color: 'var(--text-main)', fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}>{loading ? '...' : formatCurrency(totalGeral)}</div>
            <div className="kpi-label">Orçamento Total (Contratos)</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon"><i className="fa-solid fa-file-invoice"></i></div>
            <div className="kpi-value" style={{ color: 'var(--alert-green)', fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}>{loading ? '...' : formatCurrency(totalExec)}</div>
            <div className="kpi-label">Saldo Executado (Liquidado)</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon"><i className="fa-solid fa-wallet"></i></div>
            <div className="kpi-value" style={{ color: 'var(--primary)', fontSize: 'clamp(1rem, 2vw, 1.8rem)' }}>{loading ? '...' : formatCurrency(totalSaldo)}</div>
            <div className="kpi-label">Saldo Remanescente (Aberto)</div>
          </div>
        </div>

        <div className="table-card animate-slide-up delay-100">
          {/* Card Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fa-solid fa-gavel" style={{ color: 'var(--primary)' }}></i>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                Contratos Ativos
              </span>
            </div>
            <span style={{
              background: 'rgba(16,185,129,0.08)', color: 'var(--primary)',
              border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20,
              padding: '3px 12px', fontSize: '0.78rem', fontWeight: 700
            }}>
              {contratos.length} contratos registrados
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem' }}></i>
              </div>
            ) : (
              <table className="data-table" style={{ minWidth: 700 }}>
                <thead>
                  <tr>
                    <th>Número do Contrato</th>
                    <th>Objeto / Categoria</th>
                    <th>Fornecedor</th>
                    <th>Teto do Contrato</th>
                    <th>Valor Executado</th>
                    <th>Execução</th>
                  </tr>
                </thead>
                <tbody>
                  {contratos.map((c) => {
                    const pct = c.valor_total > 0 ? Math.min((c.valor_executado / c.valor_total) * 100, 100) : 0;
                    const cor = getStatusColor(c);
                    return (
                      <tr key={c.id}>
                        <td>
                          <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f1f5f9', fontSize: '0.88rem' }}>
                            {c.numero}
                          </span>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 2 }}>{c.modalidade}</div>
                        </td>
                        <td style={{ fontWeight: 600 }}>{c.objeto?.slice(0, 40)}{c.objeto?.length > 40 ? '...' : ''}</td>
                        <td style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{c.fornecedor?.nome || '—'}</td>
                        <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{formatCurrency(c.valor_total)}</td>
                        <td style={{ fontWeight: 700, color: cor }}>{formatCurrency(c.valor_executado)}</td>
                        <td style={{ minWidth: 160 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${pct}%`, background: cor, borderRadius: 3, transition: 'width 0.6s ease' }}></div>
                            </div>
                            <span style={{ fontSize: '0.82rem', color: cor, fontWeight: 700, width: 38, textAlign: 'right' }}>
                              {pct.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {contratos.length === 0 && (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhum contrato encontrado.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Alert Footer */}
          <div style={{
            margin: '0 24px 24px', marginTop: 16,
            padding: '12px 16px',
            background: 'rgba(244, 63, 94, 0.07)',
            borderRadius: 10,
            border: '1px solid rgba(244, 63, 94, 0.18)',
          }}>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--alert-red)', display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: 2, flexShrink: 0 }}></i>
              <span>
                <strong>Atenção Setor de Compras:</strong> O Pregão PE 049/25 (CerealBrasil) atingiu 98% de execução.
                Novas guias de recebimento dessa empresa serão automaticamente bloqueadas até que haja Aditivo de Contrato.
              </span>
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
