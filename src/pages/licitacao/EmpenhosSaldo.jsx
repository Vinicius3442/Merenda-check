import DashboardLayout from '../../components/layout/DashboardLayout';

export default function EmpenhosSaldo() {
  const lotesLicitados = [
    { preg: 'PE 045/25', tipo: 'Proteína Animal', fornecedor: 'AgroSul Alimentos', total: 5000000, executado: 4120000, status: 'yellow' },
    { preg: 'PE 048/25', tipo: 'Hortifruti', fornecedor: 'Coop. Fazenda Verde', total: 1200000, executado: 300000, status: 'green' },
    { preg: 'PE 049/25', tipo: 'Estocáveis Secos', fornecedor: 'CerealBrasil', total: 3400000, executado: 3350000, status: 'red' },
  ];

  const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-file-signature" style={{ color: 'var(--primary)' }}></i>
            Contratos e Empenhos (Pregão)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Controle de saldo licitado para evitar pagamentos superfaturados ou entregas sem cobertura legal (Estouro de Empenho).
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

      <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24 }}>
        <h3 style={{ fontFamily: 'Outfit', margin: '0 0 20px 0' }}>
          Listagem de Contratos Ativos
        </h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pregão Eletrônico</th>
                <th>Categoria</th>
                <th>Empresa Licitante</th>
                <th>Teto do Contrato</th>
                <th>Valor Executado</th>
                <th>Status do Empenho</th>
              </tr>
            </thead>
            <tbody>
              {lotesLicitados.map((lote, i) => {
                const percent = (lote.executado / lote.total) * 100;
                return (
                  <tr key={i}>
                    <td style={{ fontWeight: 700 }}>{lote.preg}</td>
                    <td>{lote.tipo}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{lote.fornecedor}</td>
                    <td>{formatCurrency(lote.total)}</td>
                    <td>{formatCurrency(lote.executado)}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: 'var(--bg-surface-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${percent}%`, background: `var(--alert-${lote.status})` }}></div>
                        </div>
                        <span style={{ fontSize: '0.8rem', color: `var(--alert-${lote.status})`, fontWeight: 700, width: 40 }}>
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
        <div style={{ marginTop: 24, padding: 20, background: 'rgba(244, 63, 94, 0.1)', borderRadius: 12, border: '1px solid rgba(244, 63, 94, 0.2)' }}>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--alert-red)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-triangle-exclamation"></i>
            <strong>Atenção Setor de Compras:</strong> O Pregão PE 049/25 (CerealBrasil) atingiu 98% de execução. Novas guias de recebimento dessa empresa serão automaticamente bloqueadas pelo sistema na ponta da escola até que haja Aditivo de Contrato.
          </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
