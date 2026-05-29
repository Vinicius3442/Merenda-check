import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useAlertas } from '../../hooks/useAlertas';

// Coordenadas geográficas reais em São Paulo
const COORDS = {
  cdCentral: [-23.5489, -46.6388], // Praça da Sé
  ceiPequeninos: [-23.5615, -46.6562], // Av. Paulista
  emeiMargarida: [-23.5910, -46.6740], // Itaim Bibi
  emefJoaoSilva: [-23.5220, -46.6010]  // Tatuapé
};

export default function AuditorHome() {
  const { kpis } = useDashboardStats('auditor');
  const { alertas } = useAlertas();
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [anomalyActive, setAnomalyActive] = useState(false);
  const [anomalyDetails, setAnomalyDetails] = useState('');

  // Sincronizar o estado de anomalia de rota do localStorage
  useEffect(() => {
    const checkAnomaly = () => {
      const active = localStorage.getItem('merenda_route_anomaly_active') === 'true';
      setAnomalyActive(active);
      if (active) {
        setAnomalyDetails(localStorage.getItem('merenda_route_anomaly_detalhes') || 'Desvio logístico grave detectado.');
      } else {
        setAnomalyDetails('');
      }
    };
    checkAnomaly();
    window.addEventListener('merenda_alert_sync', checkAnomaly);
    return () => window.removeEventListener('merenda_alert_sync', checkAnomaly);
  }, []);

  // Inicializar o mapa do Leaflet
  useEffect(() => {
    if (!mapContainer.current) return;

    // Destruir mapa anterior se existir
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    const map = L.map(mapContainer.current, {
      center: [-23.5550, -46.6350],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });
    mapInstance.current = map;

    // Tema Dark
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Ícone do Almoxarifado Central (CD)
    const iconCD = L.divIcon({
      className: 'leaflet-custom-marker',
      html: `
        <div style="background: var(--primary); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 0 15px var(--primary); color: white;">
          <i class="fa-solid fa-warehouse"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });
    L.marker(COORDS.cdCentral, { icon: iconCD })
      .addTo(map)
      .bindPopup('<b>CD Central de Distribuição</b><br/>Origem do Abastecimento Municipal');

    // Desenhar escolas e rotas
    const escolas = [
      { key: 'cei-pequeninos', label: 'CEI Pequeninos', coords: COORDS.ceiPequeninos, color: anomalyActive ? 'var(--alert-red)' : 'var(--alert-blue)', icon: 'fa-school' },
      { key: 'emei-margarida', label: 'EMEI Margarida', coords: COORDS.emeiMargarida, color: 'var(--alert-yellow)', icon: 'fa-child-reaching' },
      { key: 'emef-joao-silva', label: 'EMEF João Silva', coords: COORDS.emefJoaoSilva, color: 'var(--alert-green)', icon: 'fa-graduation-cap' }
    ];

    escolas.forEach(esc => {
      const iconEscola = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div style="background: ${esc.color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 10px ${esc.color}; color: white; font-size: 12px;">
            <i class="fa-solid ${esc.icon}"></i>
          </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      L.marker(esc.coords, { icon: iconEscola })
        .addTo(map)
        .bindPopup(`<b>${esc.label}</b><br/>Ponto de Consumo`);
    });

    // Rota EMEF João Silva (Segura - Verde)
    L.polyline([COORDS.cdCentral, [-23.5350, -46.6200], [-23.5280, -46.6100], COORDS.emefJoaoSilva], {
      color: 'var(--alert-green)',
      weight: 4,
      opacity: 0.6
    }).addTo(map);

    // Rota EMEI Margarida (Normal - Amarela/Laranja)
    L.polyline([COORDS.cdCentral, [-23.5680, -46.6480], [-23.5850, -46.6620], COORDS.emeiMargarida], {
      color: 'var(--alert-yellow)',
      weight: 4,
      opacity: 0.6
    }).addTo(map);

    // Rota CEI Pequeninos (Critica se anomalia ativa, senão normal)
    const routeColor = anomalyActive ? 'var(--alert-red)' : 'var(--primary)';
    const routePoly = L.polyline([COORDS.cdCentral, [-23.5530, -46.6480], [-23.5590, -46.6540], COORDS.ceiPequeninos], {
      color: routeColor,
      weight: anomalyActive ? 6 : 4,
      opacity: 0.8,
      dashArray: anomalyActive ? '6, 6' : 'none',
      className: anomalyActive ? 'leaflet-route-deviated-pulse' : ''
    }).addTo(map);

    // Adicionar caminhão na rota
    let truckPos = [-23.5530, -46.6480]; // Posição padrão intermediária
    if (anomalyActive) {
      truckPos = [-23.5044, -46.6201]; // Desvio para Santana (totalmente fora)
      
      // Desenhar linha de desvio tracejada
      L.polyline([[-23.5530, -46.6480], truckPos], {
        color: 'var(--alert-red)',
        weight: 3,
        dashArray: '4, 4',
        opacity: 0.7
      }).addTo(map);
    }

    const truckColor = anomalyActive ? 'var(--alert-red)' : 'var(--alert-blue)';
    const truckIcon = L.divIcon({
      className: 'leaflet-custom-marker-truck',
      html: `
        <div style="background: ${truckColor}; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 12px ${truckColor}; color: white; font-size: 12px; animation: ${anomalyActive ? 'pulseTruckAlert 1.5s infinite' : 'none'};">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    L.marker(truckPos, { icon: truckIcon })
      .addTo(map)
      .bindPopup(anomalyActive 
        ? `<b>⚠️ DESVIO CRÍTICO DE ROTA</b><br/>Carga desviada para Santana.<br/><b>Motorista:</b> José Claudino<br/><b>Placa:</b> LOG-4122`
        : `<b>Caminhão em Rota</b><br/>Carga a caminho do CEI Pequeninos.<br/>Sinal GPS normal.`
      );

    // Ajustar mapa
    if (anomalyActive) {
      map.setView(truckPos, 13);
    } else {
      map.fitBounds(routePoly.getBounds(), { padding: [40, 40] });
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [anomalyActive]);

  // KPIs dinâmicos para alertar o auditor
  const kpisDinamicos = (kpis || []).map(kpi => {
    if (kpi.label === 'Alertas FIFO' && anomalyActive) {
      return { ...kpi, value: '4', color: 'var(--alert-red)' };
    }
    return kpi;
  });

  // Inserir anomalia na tabela de alertas de AuditorHome
  const alertasExibidos = [...alertas];
  if (anomalyActive) {
    // Insere o alerta crítico de desvio na primeira posição da lista
    alertasExibidos.unshift({
      escola: 'CEI Pequeninos',
      tipo: 'Desvio Crítico de Rota',
      gravidade: 'danger',
      desc: 'Veículo inativo/desviado há mais de 3 horas em rota de 40min.',
      data: 'Agora',
      acao: 'Investigar',
      escolaId: 'cei-pequeninos'
    });
  }

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

      {/* Alerta de Desvio Crítico em Vermelho Pulsante */}
      {anomalyActive && (
        <div className="animate-slide-up" style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '2px solid var(--alert-red)',
          boxShadow: '0 0 20px rgba(239, 68, 68, 0.2)',
          borderRadius: 16,
          padding: '20px 24px',
          marginBottom: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 16,
          animation: 'alertFlashPulse 2s infinite'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--alert-red)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', boxShadow: '0 0 15px var(--alert-red)'
            }}>
              <i className="fa-solid fa-triangle-exclamation"></i>
            </div>
            <div>
              <h3 style={{ fontFamily: 'Outfit', color: 'var(--alert-red)', fontSize: '1.15rem', margin: '0 0 4px 0', fontWeight: 'bold' }}>
                🚨 EMERGÊNCIA LOGÍSTICA DETECTADA
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-main)' }}>
                {anomalyDetails}
              </p>
            </div>
          </div>
          <Link
            to="/auditor/investigar?escola=cei-pequeninos&nome=CEI%20Pequeninos&tipo=Desvio%20Cr%C3%ADtico%20de%20Rota"
            className="btn btn-danger animate-pulse"
            style={{ padding: '10px 18px', fontSize: '0.9rem', fontWeight: 'bold', background: 'var(--alert-red)', borderColor: 'var(--alert-red)' }}
          >
            <i className="fa-solid fa-magnifying-glass"></i> Investigar Trajeto
          </Link>
        </div>
      )}

      <div className="kpi-grid animate-slide-up">
        {kpisDinamicos.map((kpi, i) => (
          <div key={i} className="kpi-card" style={kpi.label === 'Alertas FIFO' && anomalyActive ? { borderLeft: '4px solid var(--alert-red)', animation: 'alertFlashPulse 2s infinite' } : {}}>
            <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`} style={kpi.label === 'Alertas FIFO' && anomalyActive ? { color: 'var(--alert-red)' } : {}}></i></div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Rastreamento com Mapa Leaflet Ativo da Rede */}
      <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, marginBottom: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', fontSize: '1.15rem', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)' }}></i>
          Rede Municipal de Abastecimento (Monitoramento por Satélite)
        </h3>
        <div ref={mapContainer} style={{ height: 350, borderRadius: 12, border: '1px solid var(--border-subtle)', background: 'var(--bg-surface-elevated)', zIndex: 1 }} />
        <div style={{ display: 'flex', gap: 16, marginTop: 12, justifyContent: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--alert-green)', marginRight: 6 }}></span> Rota Segura (EMEF)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: 'var(--alert-yellow)', marginRight: 6 }}></span> Rota Regular (EMEI)</span>
          <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: anomalyActive ? 'var(--alert-red)' : 'var(--primary)', marginRight: 6 }}></span> Rota R-15 Leste (CEI)</span>
          {anomalyActive && <span style={{ color: 'var(--alert-red)', fontWeight: 'bold', animation: 'pulseRedText 1s infinite' }}>⚠️ ALERTA DE DESVIO ATIVO (Carga em Santana!)</span>}
        </div>
      </div>

      {/* Alerts Table */}
      <div className="table-card animate-slide-up delay-200">
        {/* Card Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-bell" style={{ color: 'var(--alert-red)' }}></i>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Alertas Recentes da Rede</span>
            {anomalyActive && (
              <span style={{
                background: 'rgba(244,63,94,0.12)', color: 'var(--alert-red)',
                border: '1px solid rgba(244,63,94,0.25)', borderRadius: 20,
                padding: '2px 10px', fontSize: '0.73rem', fontWeight: 700, animation: 'pulseGlow 2s infinite'
              }}>ALERTA ATIVO</span>
            )}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {alertasExibidos.length} alertas
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 640 }}>
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
              {alertasExibidos.map((a, i) => (
                <tr key={i} style={a.gravidade === 'danger' && a.tipo === 'Desvio Crítico de Rota' ? { background: 'rgba(239, 68, 68, 0.05)', animation: 'alertFlashPulseRow 3s infinite' } : {}}>
                  <td style={{ fontWeight: 700, color: '#f1f5f9' }}>{a.escola}</td>
                  <td style={{ fontSize: '0.88rem' }}>{a.tipo}</td>
                  <td>
                    <span className={`badge badge-${a.gravidade}`} style={{ fontSize: '0.73rem' }}>
                      {a.gravidade === 'danger' ? 'Crítico' : 'Atenção'}
                    </span>
                  </td>
                  <td style={{ color: '#94a3b8', fontSize: '0.85rem', maxWidth: 240 }}>{a.desc}</td>
                  <td style={{ color: '#64748b', fontSize: '0.82rem', whiteSpace: 'nowrap' }}>{a.data}</td>
                  <td>
                    <Link
                      to={`/auditor/investigar?escola=${a.escolaId}&nome=${encodeURIComponent(a.escola)}&tipo=${encodeURIComponent(a.tipo)}`}
                      className={`btn ${a.gravidade === 'danger' ? 'btn-danger' : 'btn-primary'}`}
                      style={{ padding: '7px 12px', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                    >
                      <i className="fa-solid fa-magnifying-glass"></i> {a.acao}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{
          padding: '11px 24px', borderTop: '1px solid rgba(255,255,255,0.06)',
          fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between'
        }}>
          <span><i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>Anomalias detectadas por IA em tempo real</span>
          <span style={{ color: 'var(--primary)' }}><i className="fa-solid fa-microchip" style={{ marginRight: 6 }}></i>Engine FIFO v2.1</span>
        </div>
      </div>

      <style>{`
        .leaflet-route-deviated-pulse {
          animation: routePulseColor 1.5s infinite;
        }
        @keyframes routePulseColor {
          0% { stroke: #ef4444; stroke-width: 6; opacity: 0.8; }
          50% { stroke: #b91c1c; stroke-width: 8; opacity: 1; }
          100% { stroke: #ef4444; stroke-width: 6; opacity: 0.8; }
        }
        @keyframes alertFlashPulse {
          0%, 100% { border-color: var(--alert-red); box-shadow: 0 0 10px rgba(239, 68, 68, 0.2); }
          50% { border-color: #b91c1c; box-shadow: 0 0 25px rgba(239, 68, 68, 0.5); }
        }
        @keyframes alertFlashPulseRow {
          0%, 100% { background: rgba(239, 68, 68, 0.02); }
          50% { background: rgba(239, 68, 68, 0.08); }
        }
        @keyframes pulseTruckAlert {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes pulseRedText {
          0%, 100% { color: #ef4444; }
          50% { color: #b91c1c; }
        }
      `}</style>
    </DashboardLayout>
  );
}

