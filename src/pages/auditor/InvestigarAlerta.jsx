import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockTimelines } from '../../data/mockData';
import { useMockSubmit } from '../../hooks/useMockSubmit';

function TimelineItem({ item }) {
  return (
    <div className="timeline-item">
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
  );
}

export default function InvestigarAlerta() {
  const [searchParams] = useSearchParams();
  const escolaKey = searchParams.get('escola') || 'cei-pequeninos';
  const escolaNome = searchParams.get('nome') || 'Unidade Desconhecida';
  const tipoAlerta = searchParams.get('tipo') || 'Anomalia';
  const { loading, mockSubmit } = useMockSubmit();

  const timeline = mockTimelines[escolaKey] || [];
  const isRisk = escolaKey === 'cei-pequeninos';
  const isWarning = escolaKey === 'emei-margarida';

  const statusColor = isRisk ? 'var(--alert-red)' : isWarning ? 'var(--alert-yellow)' : 'var(--alert-green)';
  const statusIcon = isRisk ? 'fa-triangle-exclamation' : isWarning ? 'fa-circle-exclamation' : 'fa-circle-check';

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
        <Link to="/auditor" style={{ color: 'var(--text-muted)' }}>Malha Municipal</Link>
        <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
        <span style={{ color: 'var(--text-main)' }}>Investigar Alerta</span>
      </div>

      {/* Alert Banner */}
      <div className="animate-fade-in" style={{
        padding: '24px 30px', borderRadius: 16, marginBottom: 30,
        background: `${statusColor}10`, border: `2px solid ${statusColor}40`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${statusColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: statusColor, flexShrink: 0 }}>
            <i className={`fa-solid ${statusIcon}`}></i>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: 4 }}>
              Investigação: {tipoAlerta}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
              <i className="fa-solid fa-school" style={{ marginRight: 6 }}></i>{escolaNome}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn btn-secondary"
            onClick={() => mockSubmit({ successTitle: 'Relatório Gerado', successMsg: 'Documento PDF exportado e arquivado para o SEI.' })}
            disabled={loading}
          >
            <i className="fa-solid fa-file-pdf"></i> Exportar Extrato (PDF)
          </button>
          <button
            className="btn btn-danger"
            onClick={() => mockSubmit({ successTitle: 'Processo Iniciado', successMsg: `Processo Administrativo aberto contra ${escolaNome}.` })}
            disabled={loading}
          >
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-folder-open"></i>} Iniciar Processo Administrativo
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 30 }}>
        {[
          { label: 'Unidade', value: escolaNome, icon: 'fa-school', color: 'var(--primary)' },
          { label: 'Tipo de Anomalia', value: tipoAlerta, icon: 'fa-bug', color: statusColor },
          { label: 'Eventos no Log', value: `${timeline.length} entradas`, icon: 'fa-list-check', color: 'var(--alert-blue)' },
          { label: 'Status da Auditoria', value: isRisk ? 'Em investigação' : isWarning ? 'Monitoramento' : 'Conforme', icon: 'fa-shield-halved', color: statusColor },
        ].map((card, i) => (
          <div key={i} className="kpi-card" style={{ padding: 20 }}>
            <div className="kpi-icon"><i className={`fa-solid ${card.icon}`} style={{ color: card.color }}></i></div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit', color: card.color, marginBottom: 4 }}>{card.value}</div>
            <div className="kpi-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Full Timeline */}
      <div className="glass-panel" style={{ padding: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-timeline" style={{ color: 'var(--primary)' }}></i>
          Log de Eventos Completo — {escolaNome}
        </h3>
        <div className="timeline">
          {timeline.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Actions footer */}
      <div className="glass-panel" style={{ padding: 24, marginTop: 24, display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <Link
          to={`/auditor/rastrear?escola=${escolaKey}&nome=${encodeURIComponent(escolaNome)}`}
          className="btn btn-secondary"
        >
          <i className="fa-solid fa-code-branch"></i> Fonte de Veracidade (Log Completo)
        </Link>
        <button
          className="btn btn-secondary"
          onClick={() => mockSubmit({ successTitle: 'Gestor Notificado', successMsg: `E-mail e SMS enviados para o responsável de ${escolaNome}.` })}
          disabled={loading}
        >
          <i className="fa-solid fa-envelope"></i> Notificar Gestor
        </button>
        <Link to="/auditor" className="btn btn-light">
          <i className="fa-solid fa-arrow-left"></i> Voltar ao Painel
        </Link>
      </div>
    </DashboardLayout>
  );
}
