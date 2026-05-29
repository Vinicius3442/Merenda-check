import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRastreabilidade } from '../../hooks/useRastreabilidade';
import { useEscolas } from '../../hooks/useEscolas';

function TimelineItem({ item }) {
  return (
    <div className="timeline-item">
      <div className={`timeline-dot ${item.dot}`}><i className={`fa-solid ${item.icon}`}></i></div>
      <div className={`timeline-content ${item.extraGlow ? 'extra-glow-item' : ''}`} style={{ borderLeftColor: item.borderColor }}>
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
  const presetLote = searchParams.get('lote');
  const presetNome = searchParams.get('nome');

  const { escolas, loading: escolasLoading } = useEscolas();
  const escolaOptions = escolas.map(e => ({
    key: e.id,
    label: e.nome,
    badge: e.badgeClass,
    badgeText: e.badgeText
  }));

  const [selectedKey, setSelectedKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (presetEscola) {
      setSelectedKey(presetEscola);
    } else if (escolas.length > 0 && !selectedKey) {
      setSelectedKey(escolas[0].id);
    }
  }, [presetEscola, escolas, selectedKey]);

  useEffect(() => {
    if (presetLote) {
      setSearchQuery(presetLote);
    }
  }, [presetLote]);

  const { timeline: rawTimeline, loading } = useRastreabilidade(selectedKey);
  const selectedOption = escolaOptions.find(e => e.key === selectedKey);

  // Filtrar e marcar trilha com glow extra
  const filteredTimeline = rawTimeline.filter(item => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q)) ||
      item.meta.some(m => m.text.toLowerCase().includes(q))
    );
  }).map(item => {
    const isMatchingLote = presetLote && JSON.stringify(item).toLowerCase().includes(presetLote.toLowerCase());
    return {
      ...item,
      extraGlow: isMatchingLote || item.extraGlow,
    };
  });

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-code-branch" style={{ color: 'var(--primary)' }}></i> Trilha de Auditoria Consolidada
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Todo apontamento possui registro inalterável e encadeado na linha do tempo.
          </p>
        </div>
      </div>

      {/* School selector */}
      <div className="glass-panel animate-slide-up" style={{ padding: 24, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 16, fontSize: '1rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>
          <i className="fa-solid fa-school" style={{ marginRight: 8 }}></i> Selecionar Unidade Escolar
        </h3>
        {escolasLoading ? (
          <div style={{ padding: 10 }}><i className="fa-solid fa-circle-notch fa-spin"></i> Carregando escolas...</div>
        ) : (
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
        )}
      </div>

      {/* Active escola header */}
      <div className="animate-slide-up" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }}></div>
        <span style={{ fontFamily: 'Outfit', fontWeight: 700, color: 'var(--primary)', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
          <i className="fa-solid fa-database" style={{ marginRight: 6 }}></i>
          Fonte de Veracidade: {selectedOption?.label}
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
        {filteredTimeline.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
        {filteredTimeline.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-xmark" style={{ fontSize: '3rem', color: 'var(--alert-red)', marginBottom: 16 }}></i>
            <h3 style={{ fontFamily: 'Outfit' }}>Nenhum evento corresponde aos filtros</h3>
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
