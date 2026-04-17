import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AuditTrailTI() {
  const logs = [
    { data: 'Hoje - 09:15', user: 'Maria Silva', ip: '189.44.12.99', acao: 'LOGIN_SUCESSO', detalhes: 'Autenticação multifator OK' },
    { data: 'Hoje - 09:12', user: 'Maria Silva', ip: '189.44.12.99', acao: 'LOGIN_FALHA', detalhes: 'Senha incorreta' },
    { data: 'Ontem - 17:40', user: 'SysAdmin', ip: 'SecEdu_Intranet', acao: 'ACL_UPDATE', detalhes: 'Revogou acesso de Paulo Exonerado' },
    { data: 'Ontem - 16:20', user: 'Carlos Roberto', ip: 'EMEF_Wifi', acao: 'REPORT_EXPORT', detalhes: 'Gerou PDF de Fechamento Mensal' },
  ];

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--alert-red)' }}></i>
            Log de Auditoria de TI
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Registro imutável de acessos sistêmicos, essenciais para conformidade em investigações da LGPD.
          </p>
        </div>
      </div>

      <div className="glass-panel animate-slide-up" style={{ padding: 24 }}>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div className="search-bar" style={{ flex: 1 }}>
            <i className="fa-solid fa-search"></i>
            <input type="text" placeholder="Filtrar por Usuário, IP ou Ação..." />
          </div>
          <button className="btn btn-secondary">
            <i className="fa-solid fa-filter"></i> Período
          </button>
          <button className="btn btn-secondary">
            <i className="fa-solid fa-download"></i> Exportar CSV
          </button>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid var(--border-subtle)' }}>
              <th style={{ padding: '12px 8px' }}>Data/Hora</th>
              <th style={{ padding: '12px 8px' }}>Agente</th>
              <th style={{ padding: '12px 8px' }}>IP de Origem</th>
              <th style={{ padding: '12px 8px' }}>Ação de Sistema</th>
              <th style={{ padding: '12px 8px' }}>Detalhes Técnicos</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{log.data}</td>
                <td style={{ padding: '12px 8px', color: 'var(--text-main)', fontWeight: 700 }}>{log.user}</td>
                <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{log.ip}</td>
                <td style={{ padding: '12px 8px' }}>
                  <span style={{ 
                    color: log.acao.includes('FALHA') ? 'var(--alert-red)' : 'var(--primary)',
                    background: log.acao.includes('FALHA') ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                    padding: '2px 6px', borderRadius: 4
                  }}>
                    {log.acao}
                  </span>
                </td>
                <td style={{ padding: '12px 8px', color: 'var(--text-muted)' }}>{log.detalhes}</td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
