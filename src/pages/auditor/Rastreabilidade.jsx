import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { mockTimelines, mockEscolas } from '../../data/mockData';

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

export default function Rastreabilidade() {
  const [searchParams] = useSearchParams();
  const presetEscola = searchParams.get('escola');
  const presetNome = searchParams.get('nome');

  const escolaOptions = [
    { key: 'cei-pequeninos', label: 'CEI Pequeninos', badge: 'badge-danger', badgeText: 'Alerta Crítico' },
    { key: 'emei-margarida', label: 'EMEI Margarida', badge: 'badge-warning', badgeText: 'Atenção' },
    { key: 'emef-joao-silva', label: 'EMEF João Silva', badge: 'badge-success', badgeText: 'Conforme' },
  ];

  const [selectedKey, setSelectedKey] = useState(presetEscola || 'cei-pequeninos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (presetEscola) setSelectedKey(presetEscola);
  }, [presetEscola]);

  const timeline = mockTimelines[selectedKey] || [];
  const selectedOption = escolaOptions.find(e => e.key === selectedKey);

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-code-branch" style={{ color: 'var(--primary)' }}></i> Trilha Seca (Blockchain Ledgers)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Todo grama adquirido pelo órgão público possui um hash inalterável na linha do tempo.
          </p>
        </div>
      </div>

      {/* School selector */}
      <div className="glass-panel animate-slide-up" style={{ padding: 24, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 16, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          <i className="fa-solid fa-school" style={{ marginRight: 8 }}></i> Selecionar Unidade Escolar
        </h3>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {escolaOptions.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedKey(opt.key)}
              style={{
                padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
                background: selectedKey === opt.key ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-surface-elevated)',
                border: selectedKey === opt.key ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                color: 'var(--text-main)', transition: 'all 0.2s', fontFamily: 'Outfit', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <i className="fa-solid fa-school" style={{ color: selectedKey === opt.key ? 'var(--primary)' : 'var(--text-muted)' }}></i>
              {opt.label}
              <span className={`badge ${opt.badge}`} style={{ fontSize: '0.7rem', padding: '4px 8px' }}>{opt.badgeText}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active escola header */}
      <div className="animate-slide-up" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}></div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-fingerprint" style={{ marginRight: 6 }}></i>
          Oráculo: {selectedOption?.label}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}></div>
      </div>

      {/* Search */}
      <div className="search-bar-full animate-fade-in" style={{ marginBottom: 30 }}>
        <i className="fa-solid fa-magnifying-glass"></i>
        <input
          type="text"
          placeholder={`Buscar lote ou hash em ${selectedOption?.label}...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Timeline */}
      <div className="timeline animate-slide-up delay-100">
        {timeline.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
        {timeline.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-check" style={{ fontSize: '3rem', color: 'var(--alert-green)', marginBottom: 16 }}></i>
            <h3 style={{ fontFamily: 'Outfit' }}>Nenhum evento registrado</h3>
          </div>
        )}
      </div>

      {/* Back link */}
      {presetNome && (
        <div style={{ marginTop: 40, textAlign: 'center' }}>
          <Link to="/auditor/escolas" className="btn btn-secondary">
            <i className="fa-solid fa-arrow-left"></i> Voltar para Lista de Escolas
          </Link>
        </div>
      )}
    </DashboardLayout>
  );
}
