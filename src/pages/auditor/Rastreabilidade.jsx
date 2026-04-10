import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockTimeline } from '../../data/mockData';

export default function Rastreabilidade() {
  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>Trilha Seca (Blockchain Ledgers)</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Todo grama adquirido pelo órgão público possui um hash inalterável na linha do tempo. Insira o lote suspeito.
          </p>
        </div>
      </div>

      <div className="search-bar-full animate-slide-up">
        <i className="fa-solid fa-fingerprint"></i>
        <input type="text" defaultValue="0x8F9B2C-11Z (CEI Pequeninos - Lote Suspeito #411-A)" />
      </div>

      <div className="timeline animate-slide-up delay-100">
        {mockTimeline.map((item) => (
          <div key={item.id} className="timeline-item">
            <div className={`timeline-dot ${item.dot}`}><i className={`fa-solid ${item.icon}`}></i></div>
            <div className="timeline-content" style={{ borderLeftColor: item.borderColor, ...(item.extraGlow ? { boxShadow: 'var(--alert-red-glow)' } : {}) }}>
              <div className="t-header">
                <div>
                  <div className={`t-title ${item.titleClass}`} style={item.titleColor ? { color: item.titleColor } : {}}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: item.badgeClass ? 'var(--text-main)' : 'var(--text-muted)' }}>
                    {item.subtitle}
                    {item.badgeClass && <span className={`badge ${item.badgeClass}`} style={{ marginLeft: 10 }}>{item.badgeText}</span>}
                  </div>
                </div>
                <div className="t-date">{item.date}</div>
              </div>

              {item.description && (
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: 10, lineHeight: 1.5 }}>
                  {item.description}
                </p>
              )}

              <div className="t-meta">
                {item.meta.map((m, i) => (
                  <span key={i} style={{ color: m.color || 'inherit', fontWeight: m.bold ? 'bold' : 'normal' }}>
                    <i className={`fa-solid ${m.icon}`}></i> {m.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
