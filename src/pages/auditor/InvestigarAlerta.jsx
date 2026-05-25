import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRastreabilidade } from '../../hooks/useRastreabilidade';
import { useMockSubmit } from '../../hooks/useMockSubmit';

// Coordenadas geográficas reais em São Paulo
const COORDS = {
  cdCentral: [-23.5489, -46.6388], // Praça da Sé
  ceiPequeninos: [-23.5615, -46.6562], // Av. Paulista
};

function TimelineItem({ item }) {
  return (
    <div className="timeline-item" style={item.extraGlow ? { animation: 'pulseTimelineRed 1.5s infinite' } : {}}>
      <div className={`timeline-dot ${item.dot}`}><i className={`fa-solid ${item.icon}`}></i></div>
      <div className="timeline-content" style={{ borderLeftColor: item.borderColor, ...(item.extraGlow ? { boxShadow: '0 0 15px rgba(239, 68, 68, 0.4)', borderColor: 'var(--alert-red)' } : {}) }}>
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

  const [anomalyActive, setAnomalyActive] = useState(false);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Verificar se há anomalia de rota no localStorage
  useEffect(() => {
    const checkAnomaly = () => {
      const active = localStorage.getItem('merenda_route_anomaly_active') === 'true';
      const escola = localStorage.getItem('merenda_route_anomaly_escola');
      if (active && escola === escolaKey) {
        setAnomalyActive(true);
      } else {
        setAnomalyActive(false);
      }
    };
    checkAnomaly();
    window.addEventListener('merenda_alert_sync', checkAnomaly);
    return () => window.removeEventListener('merenda_alert_sync', checkAnomaly);
  }, [escolaKey]);

  // Inicializar o mapa do Leaflet de auditoria
  useEffect(() => {
    // Apenas instanciar o mapa se a escola pesquisada for a do trajeto (CEI Pequeninos)
    if (!mapContainer.current || escolaKey !== 'cei-pequeninos') return;

    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = L.map(mapContainer.current, {
      center: [-23.5550, -46.6450],
      zoom: 13,
      zoomControl: true,
      attributionControl: false
    });
    mapInstance.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    const iconCD = L.divIcon({
      className: 'leaflet-custom-marker',
      html: `
        <div style="background: var(--primary); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 10px var(--primary); color: white;">
          <i class="fa-solid fa-warehouse"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
    L.marker(COORDS.cdCentral, { icon: iconCD }).addTo(map).bindPopup('<b>CD Central</b><br/>Ponto de Partida');

    const iconEscola = L.divIcon({
      className: 'leaflet-custom-marker',
      html: `
        <div style="background: ${anomalyActive ? 'var(--alert-red)' : 'var(--primary)'}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 10px var(--alert-red); color: white;">
          <i class="fa-solid fa-school"></i>
        </div>
      `,
      iconSize: [30, 30],
      iconAnchor: [15, 15]
    });
    L.marker(COORDS.ceiPequeninos, { icon: iconEscola }).addTo(map).bindPopup('<b>CEI Pequeninos</b><br/>Destino da Carga');

    // Desenhar rota planejada
    const polylinePlan = L.polyline([COORDS.cdCentral, [-23.5530, -46.6480], [-23.5590, -46.6540], COORDS.ceiPequeninos], {
      color: 'var(--alert-blue)',
      weight: 5,
      opacity: 0.6
    }).addTo(map);

    let truckPos = [-23.5530, -46.6480]; // Em rota regular
    if (anomalyActive) {
      truckPos = [-23.5044, -46.6201]; // Desviado em Santana
      
      // Rota real realizada desviando do planejado
      L.polyline([[-23.5530, -46.6480], truckPos], {
        color: 'var(--alert-red)',
        weight: 5,
        opacity: 0.8,
        dashArray: '5, 5',
        className: 'leaflet-route-deviated-pulse'
      }).addTo(map);
    }

    const truckColor = anomalyActive ? 'var(--alert-red)' : 'var(--alert-blue)';
    const truckIcon = L.divIcon({
      className: 'leaflet-custom-marker-truck',
      html: `
        <div style="background: ${truckColor}; width: 34px; height: 34px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 15px ${truckColor}; color: white; font-size: 13px; animation: ${anomalyActive ? 'pulseTruckAlert 1.5s infinite' : 'none'};">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const mTruck = L.marker(truckPos, { icon: truckIcon }).addTo(map);
    mTruck.bindPopup(anomalyActive
      ? `<b>⚠️ DESVIO CRÍTICO DE ROTA</b><br/>Caminhão desviou da rota e está parado em Santana por mais de 3 horas!<br/><b>Motorista:</b> José Claudino<br/><b>Placa:</b> LOG-4122`
      : `<b>Transporte Normal</b><br/>Placa LOG-4122 a caminho do CEI Pequeninos.<br/>SLA estimado normal.`
    );

    if (anomalyActive) {
      mTruck.openPopup();
      map.setView(truckPos, 13);
    } else {
      map.fitBounds(polylinePlan.getBounds(), { padding: [30, 30] });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [escolaKey, anomalyActive]);

  const { timeline, loading: timelineLoading } = useRastreabilidade(escolaKey);
  
  // Injetar evento de anomalia logística se ativo
  const displayTimeline = [...timeline];
  if (anomalyActive) {
    displayTimeline.unshift({
      id: 'anomaly-route-event',
      dot: 'dot-danger',
      icon: 'fa-truck-fast',
      borderColor: 'var(--alert-red)',
      titleClass: 'pulse-text-red',
      titleColor: 'var(--alert-red)',
      title: '🚨 ANOMALIA CRÍTICA: Desvio de Rota de Entrega Detectado',
      subtitle: 'Alerta em Tempo Real (Rastreamento por Satélite GPS ativo)',
      date: 'Agora mesmo',
      description: 'O veículo da transportadora LogLife (Placa LOG-4122) ultrapassou o tempo máximo de tolerância física do trajeto de 40 minutos. O sinal aponta desvio da rota oficial de entrega e parada não autorizada por mais de 3 horas. Risco máximo de desvio ou roubo de carga.',
      extraGlow: true,
      meta: [
        { icon: 'fa-hourglass-end', text: 'Tempo em Rota: 3h 20min (200 min)', color: 'var(--alert-red)', bold: true },
        { icon: 'fa-map-pin', text: 'Posição GPS atual: Santana, SP (Fora da Rota)', color: 'var(--alert-red)' }
      ]
    });
  }

  const isRisk = escolaKey === 'cei-pequeninos' || anomalyActive;
  const isWarning = escolaKey === 'emei-margarida' && !anomalyActive;

  const statusColor = isRisk ? 'var(--alert-red)' : isWarning ? 'var(--alert-yellow)' : 'var(--alert-green)';
  const statusIcon = isRisk ? 'fa-triangle-exclamation' : isWarning ? 'fa-circle-exclamation' : 'fa-circle-check';

  return (
    <DashboardLayout>
      {/* Classe CSS extra de Sirene na Página inteira */}
      {anomalyActive && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          border: '6px solid var(--alert-red)',
          boxShadow: 'inset 0 0 60px rgba(239, 68, 68, 0.25)',
          pointerEvents: 'none', zIndex: 9999,
          animation: 'sirenBorderPulse 1.5s infinite'
        }} />
      )}

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
        boxShadow: anomalyActive ? '0 0 25px rgba(239, 68, 68, 0.2)' : 'none',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
        animation: anomalyActive ? 'alertFlashContainer 2s infinite' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14,
            background: `${statusColor}20`, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', color: statusColor, flexShrink: 0,
            animation: anomalyActive ? 'pulseTruckAlert 1.5s infinite' : 'none'
          }}>
            <i className={`fa-solid ${statusIcon}`}></i>
          </div>
          <div>
            <h2 style={{ fontFamily: 'Outfit', fontSize: '1.3rem', marginBottom: 4, color: anomalyActive ? 'var(--alert-red)' : 'var(--text-main)' }}>
              {anomalyActive ? 'Investigação Crítica: Desvio Grave de Rota' : `Investigação: ${tipoAlerta}`}
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
            className={`btn ${anomalyActive ? 'btn-danger' : 'btn-danger'}`}
            style={anomalyActive ? { background: 'var(--alert-red)', borderColor: 'var(--alert-red)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' } : {}}
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
          { label: 'Tipo de Anomalia', value: anomalyActive ? 'Desvio de Rota (GPS)' : tipoAlerta, icon: 'fa-bug', color: statusColor },
          { label: 'Eventos no Log', value: `${displayTimeline.length} entradas`, icon: 'fa-list-check', color: 'var(--alert-blue)' },
          { label: 'Status da Auditoria', value: isRisk ? 'DESVIO DETECTADO' : isWarning ? 'Monitoramento' : 'Conforme', icon: 'fa-shield-halved', color: statusColor },
        ].map((card, i) => (
          <div key={i} className="kpi-card" style={{ padding: 20, ...(card.label === 'Status da Auditoria' && anomalyActive ? { borderLeft: '4px solid var(--alert-red)', animation: 'alertFlashPulseRow 2s infinite' } : {}) }}>
            <div className="kpi-icon"><i className={`fa-solid ${card.icon}`} style={{ color: card.color }}></i></div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'Outfit', color: card.color, marginBottom: 4 }}>{card.value}</div>
            <div className="kpi-label">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Rastreamento Leaflet Ativo Dedicado da Carga */}
      {escolaKey === 'cei-pequeninos' && (
        <div className="glass-panel animate-slide-up" style={{ padding: 24, marginBottom: 30, border: anomalyActive ? '1px solid var(--alert-red)' : '1px solid var(--border-subtle)' }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1.1rem', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10, color: anomalyActive ? 'var(--alert-red)' : 'var(--text-main)' }}>
            <i className="fa-solid fa-satellite" style={{ animation: anomalyActive ? 'pulseTruckAlert 2s infinite' : 'none' }}></i>
            {anomalyActive ? 'Rastreamento de Desvio em Tempo Real (Manifesto Digital)' : 'Rastreamento de Carga Oficial'}
          </h3>
          <div ref={mapContainer} style={{ height: 350, borderRadius: 12, border: '1px solid var(--border-subtle)', overflow: 'hidden', zIndex: 1 }} />
          {anomalyActive && (
            <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '12px 16px', borderRadius: 8, marginTop: 12, border: '1px solid rgba(239, 68, 68, 0.15)', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--alert-red)', fontSize: '1.1rem' }}></i>
              <div>
                <strong>Atenção:</strong> A carga municipal de 100 kg está retida em Santana (Fora do Eixo da Av. Paulista) sem justificativa.
                Desvio de trajeto apurado por telemetria ativa. Risco imediato de roubo de carga ou desvio de merenda escolar.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Timeline */}
      <div className="glass-panel" style={{ padding: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-timeline" style={{ color: 'var(--primary)' }}></i>
          Log de Eventos Completo — {escolaNome}
        </h3>
        <div className="timeline">
          {displayTimeline.map((item) => (
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
          onClick={() => mockSubmit({ successTitle: 'Gestor Notificado', successMsg: `WhatsApp de emergência disparado via Twilio para o Gestor e Nutricionista de ${escolaNome}.` })}
          disabled={loading}
        >
          <i className="fa-solid fa-envelope"></i> Notificar Gestor
        </button>
        <Link to="/auditor" className="btn btn-light">
          <i className="fa-solid fa-arrow-left"></i> Voltar ao Painel
        </Link>
      </div>

      <style>{`
        .leaflet-route-deviated-pulse {
          animation: routePulseColor 1.5s infinite;
        }
        @keyframes routePulseColor {
          0% { stroke: #ef4444; stroke-width: 5; opacity: 0.8; }
          50% { stroke: #b91c1c; stroke-width: 7; opacity: 1; }
          100% { stroke: #ef4444; stroke-width: 5; opacity: 0.8; }
        }
        @keyframes sirenBorderPulse {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); box-shadow: inset 0 0 40px rgba(239, 68, 68, 0.15); }
          50% { border-color: rgba(239, 68, 68, 0.95); box-shadow: inset 0 0 80px rgba(239, 68, 68, 0.45); }
        }
        @keyframes alertFlashContainer {
          0%, 100% { border-color: rgba(239, 68, 68, 0.4); background: rgba(239, 68, 68, 0.05); }
          50% { border-color: rgba(239, 68, 68, 0.8); background: rgba(239, 68, 68, 0.12); }
        }
        @keyframes pulseTruckAlert {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes pulseTimelineRed {
          0%, 100% { box-shadow: 0 0 5px rgba(239, 68, 68, 0.2); }
          50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); }
        }
      `}</style>
    </DashboardLayout>
  );
}

