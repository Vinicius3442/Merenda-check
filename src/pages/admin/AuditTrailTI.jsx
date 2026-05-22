import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AuditTrailTI() {
  const [searchQuery, setSearchQuery] = useState('');

  const logs = [
    { data: 'Hoje - 09:15', user: 'Maria Silva', ip: '189.44.12.99', acao: 'LOGIN_SUCESSO', detalhes: 'Autenticação multifator OK' },
    { data: 'Hoje - 09:12', user: 'Maria Silva', ip: '189.44.12.99', acao: 'LOGIN_FALHA', detalhes: 'Senha incorreta' },
    { data: 'Ontem - 17:40', user: 'SysAdmin', ip: 'SecEdu_Intranet', acao: 'ACL_UPDATE', detalhes: 'Revogou acesso de Paulo Exonerado' },
    { data: 'Ontem - 16:20', user: 'Carlos Roberto', ip: 'EMEF_Wifi', acao: 'REPORT_EXPORT', detalhes: 'Gerou PDF de Fechamento Mensal' },
  ];

  const filteredLogs = logs.filter((log) => {
    const term = searchQuery.toLowerCase();
    return (
      log.user.toLowerCase().includes(term) ||
      log.ip.toLowerCase().includes(term) ||
      log.acao.toLowerCase().includes(term) ||
      log.detalhes.toLowerCase().includes(term)
    );
  });

  const acaoStyle = (acao) => {
    if (acao.includes('FALHA')) return { color: 'var(--alert-red)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' };
    if (acao.includes('UPDATE') || acao.includes('ACL')) return { color: 'var(--alert-yellow)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' };
    if (acao.includes('EXPORT')) return { color: 'var(--alert-blue)', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' };
    return { color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' };
  };

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--alert-red)' }}></i>
              Log de Auditoria de TI
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
              Registro imutável de acessos sistêmicos — conformidade LGPD.
            </p>
          </div>
        </div>

        <div className="table-card animate-slide-up">
          {/* Card Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
            flexWrap: 'wrap', gap: 12,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fa-solid fa-terminal" style={{ color: 'var(--alert-red)', fontSize: '0.9rem' }}></i>
              <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                Eventos de Sistema
              </span>
              <span style={{
                background: 'rgba(244,63,94,0.12)', color: 'var(--alert-red)',
                border: '1px solid rgba(244,63,94,0.2)', borderRadius: 20,
                padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700
              }}>{filteredLogs.length} registros</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ position: 'relative' }}>
                <i className="fa-solid fa-search" style={{
                  position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
                  color: 'var(--text-muted)', fontSize: '0.75rem'
                }}></i>
                <input
                  type="text"
                  placeholder="Filtrar por usuário, IP ou ação..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    paddingLeft: 30, paddingRight: 12, paddingTop: 7, paddingBottom: 7,
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 8, color: '#f1f5f9', fontSize: '0.82rem', outline: 'none', width: 210,
                  }}
                />
              </div>
              <button className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.82rem' }}>
                <i className="fa-solid fa-filter"></i> Período
              </button>
              <button className="btn btn-secondary" style={{ padding: '7px 12px', fontSize: '0.82rem' }}>
                <i className="fa-solid fa-download"></i> CSV
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table" style={{ minWidth: 640, fontFamily: 'monospace' }}>
              <thead>
                <tr>
                  <th>Data / Hora</th>
                  <th>Agente</th>
                  <th>IP de Origem</th>
                  <th>Ação de Sistema</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log, i) => (
                  <tr key={i}>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{log.data}</td>
                    <td style={{ fontWeight: 700, color: '#f1f5f9', fontFamily: 'inherit', fontSize: '0.88rem' }}>{log.user}</td>
                    <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{log.ip}</td>
                    <td>
                      <span style={{
                        ...acaoStyle(log.acao),
                        padding: '3px 10px', borderRadius: 6, fontSize: '0.75rem',
                        fontWeight: 700, letterSpacing: '0.04em',
                        fontFamily: 'monospace', display: 'inline-block'
                      }}>
                        {log.acao}
                      </span>
                    </td>
                    <td style={{ color: '#94a3b8', fontSize: '0.85rem', fontFamily: 'inherit' }}>{log.detalhes}</td>
                  </tr>
                ))}
                {filteredLogs.length === 0 && (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>
                      Nenhum evento correspondente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={{
            padding: '11px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
            fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <span><i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>Exibindo {filteredLogs.length} eventos mais recentes</span>
            <span style={{ color: 'var(--alert-red)' }}><i className="fa-solid fa-lock" style={{ marginRight: 6 }}></i>Log Imutável — LGPD Art. 37</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
