import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockKpisAuditor, mockAlertasAuditor } from '../../data/mockData';

export default function AuditorHome() {
  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-satellite-dish" style={{ color: 'var(--primary)' }}></i> Malha Municipal
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Visão panorâmica consolidada de todas as unidades escolares na jurisdição.
          </p>
        </div>
      </div>

      <div className="kpi-grid animate-slide-up">
        {mockKpisAuditor.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`}></i></div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="glass-panel animate-slide-up delay-100" style={{ padding: 40, marginBottom: 30, textAlign: 'center' }}>
        <div style={{ height: 250, borderRadius: 16, background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <i className="fa-solid fa-map-location-dot" style={{ fontSize: '3rem', color: 'var(--primary)' }}></i>
          <h3 style={{ fontFamily: 'Outfit' }}>Mapa de Calor Municipal</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Integração MapBox/Leaflet (Placeholder para produção)</p>
        </div>
      </div>

      {/* Alerts Table */}
      <div className="glass-panel animate-slide-up delay-200" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>
            <i className="fa-solid fa-bell" style={{ color: 'var(--alert-red)', marginRight: 10 }}></i>
            Alertas Recentes da Rede
          </h3>
        </div>
        <div className="table-wrapper" style={{ border: 'none', borderRadius: 0, boxShadow: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Unidade</th>
                <th>Tipo de Alerta</th>
                <th>Gravidade</th>
                <th>Descrição</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {mockAlertasAuditor.map((a, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 600 }}>{a.escola}</td>
                  <td>{a.tipo}</td>
                  <td><span className={`badge badge-${a.gravidade}`}>{a.gravidade === 'danger' ? 'Crítico' : 'Atenção'}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{a.desc}</td>
                  <td>{a.data}</td>
                  <td>
                    <Link
                      to={`/auditor/investigar?escola=${a.timelineKey}&nome=${encodeURIComponent(a.escola)}&tipo=${encodeURIComponent(a.tipo)}`}
                      className="btn btn-primary"
                      style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i> {a.acao}
                    </Link>
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
