import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { supabase } from '../../lib/supabase';

export default function AuditTrailTI() {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('audit_trail')
        .select(`
          criado_em,
          ip_origem,
          acao,
          tabela_afetada,
          usuarios (nome)
        `)
        .order('criado_em', { ascending: false })
        .limit(100);
        
      if (error) throw error;
      
      if (data) {
        const formatted = data.map(d => ({
          data: new Date(d.criado_em).toLocaleString(),
          user: d.usuarios?.nome || 'Sistema / Backend',
          ip: d.ip_origem || 'Desconhecido',
          acao: `${d.acao}_${d.tabela_afetada.toUpperCase()}`,
          detalhes: 'Gatilho do PostgreSQL.'
        }));
        setLogs(formatted);
      }
    } catch (e) {
      console.error('Erro ao buscar auditoria:', e);
    } finally {
      setLoading(false);
    }
  };

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
    if (acao.includes('DELETE')) return { color: 'var(--alert-red)', background: 'rgba(244,63,94,0.12)', border: '1px solid rgba(244,63,94,0.2)' };
    if (acao.includes('UPDATE')) return { color: 'var(--alert-yellow)', background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' };
    if (acao.includes('INSERT')) return { color: 'var(--primary)', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)' };
    return { color: 'var(--alert-blue)', background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)' };
  };

  return (
    <DashboardLayout>
      <div className="wizard-container">
        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fa-solid fa-shield-halved" style={{ color: 'var(--alert-red)' }}></i>
              Log de Auditoria Global
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: 4 }}>
              Registro imutável automático de ações no banco de dados via PostgreSQL Triggers.
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
                Eventos do Supabase
              </span>
              <span style={{
                background: 'rgba(244,63,94,0.12)', color: 'var(--alert-red)',
                border: '1px solid rgba(244,63,94,0.2)', borderRadius: 20,
                padding: '2px 10px', fontSize: '0.75rem', fontWeight: 700
              }}>{filteredLogs.length} registros</span>
              
              <button className="btn btn-secondary" onClick={fetchLogs} style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                <i className="fa-solid fa-rotate-right"></i> Recarregar
              </button>
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
            </div>
          </div>

          <div className="table-wrapper">
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center' }}><i className="fa-solid fa-spinner fa-spin"></i> Carregando logs de auditoria...</div>
            ) : (
              <table className="data-table" style={{ minWidth: 640, fontFamily: 'monospace' }}>
                <thead>
                  <tr>
                    <th>Data / Hora</th>
                    <th>Agente (Usuário)</th>
                    <th>IP de Origem</th>
                    <th>Ação Executada</th>
                    <th>Detalhes Técnicos</th>
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
                        Nenhum evento registrado pelo banco ainda (execute o arquivo audit_e_avatar.sql).
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
