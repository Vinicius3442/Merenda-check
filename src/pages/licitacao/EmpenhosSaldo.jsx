import DashboardLayout from '../../components/layout/DashboardLayout';

export default function EmpenhosSaldo() {
  const lotesLicitados = [
    { preg: 'PE 045/25', tipo: 'Proteína Animal', fornecedor: 'AgroSul Alimentos', total: 5000000, executado: 4120000, status: 'yellow' },
    { preg: 'PE 048/25', tipo: 'Hortifruti', fornecedor: 'Coop. Fazenda Verde', total: 1200000, executado: 300000, status: 'green' },
    { preg: 'PE 049/25', tipo: 'Estocáveis Secos', fornecedor: 'CerealBrasil', total: 3400000, executado: 3350000, status: 'red' },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const statusColor = {
    red: 'var(--alert-red)',
    yellow: 'var(--alert-yellow)',
    green: 'var(--alert-green)',
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
            <div className="kpi-value" style={{ color: 'var(--text-main)' }}>R$ 18.5M</div>
            <div className="kpi-label">Orçamento Total (Ano)</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon"><i className="fa-solid fa-file-invoice"></i></div>
            <div className="kpi-value" style={{ color: 'var(--alert-green)' }}>R$ 7.7M</div>
            <div className="kpi-label">Saldo Executado (Liquidado)</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-icon"><i className="fa-solid fa-wallet"></i></div>
            <div className="kpi-value" style={{ color: 'var(--primary)' }}>R$ 10.8M</div>
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
              {lotesLicitados.length} contratos registrados
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table" style={{ minWidth: 700 }}>
              <thead>
                <tr>
                  <th>Pregão Eletrônico</th>
                  <th>Categoria</th>
                  <th>Empresa Licitante</th>
                  <th>Teto do Contrato</th>
                  <th>Valor Executado</th>
                  <th>Execução</th>
                </tr>
              </thead>
              <tbody>
                {lotesLicitados.map((lote, i) => {
                  const percent = (lote.executado / lote.total) * 100;
                  const color = statusColor[lote.status];
                  return (
                    <tr key={i}>
                      <td>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f1f5f9', fontSize: '0.88rem' }}>
                          {lote.preg}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600 }}>{lote.tipo}</td>
                      <td style={{ color: '#94a3b8', fontSize: '0.88rem' }}>{lote.fornecedor}</td>
                      <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{formatCurrency(lote.total)}</td>
                      <td style={{ fontWeight: 700, color }}>{formatCurrency(lote.executado)}</td>
                      <td style={{ minWidth: 160 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${percent}%`, background: color, borderRadius: 3, transition: 'width 0.6s ease' }}></div>
                          </div>
                          <span style={{ fontSize: '0.82rem', color, fontWeight: 700, width: 38, textAlign: 'right' }}>
                            {percent.toFixed(0)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
