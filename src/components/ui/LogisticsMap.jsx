import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas geográficas reais em São Paulo
const COORDS = {
  cdCentral: [-23.5489, -46.6388], // Praça da Sé
  ceiPequeninos: [-23.5615, -46.6562], // Av. Paulista (CEI Pequeninos)
  emeiMargarida: [-23.5910, -46.6740], // Itaim Bibi (EMEI Margarida)
  emefJoaoSilva: [-23.5220, -46.6010]  // Tatuapé (EMEF João Silva)
};

const rotasIniciais = [
  {
    id: 'rota-cei',
    nome: 'Rota Centro-Oeste (R-15 Leste)',
    escolaKey: 'cei-pequeninos',
    escolaNome: 'CEI Pequeninos',
    origemCoords: COORDS.cdCentral,
    destinoCoords: COORDS.ceiPequeninos,
    motorista: 'José Claudino',
    veículo: 'Caminhão Refrigerado Volare',
    placa: 'LOG-4122',
    tempoEstimado: 40, // minutos
    tempoAtual: 35, // minutos (percurso normal)
    status: 'Em Trânsito',
    insumo: 'Frango Congelado e Vegetais',
    alertaAtivo: false
  },
  {
    id: 'rota-margarida',
    nome: 'Rota Zona Sul (R-08 Sul)',
    escolaKey: 'emei-margarida',
    escolaNome: 'EMEI Margarida',
    origemCoords: COORDS.cdCentral,
    destinoCoords: COORDS.emeiMargarida,
    motorista: 'Aline Souza',
    veículo: 'Furgão Térmico Master',
    placa: 'MCD-8891',
    tempoEstimado: 50,
    tempoAtual: 45,
    status: 'Carregando',
    insumo: 'Iogurtes e Queijos Frescos',
    alertaAtivo: false
  },
  {
    id: 'rota-joao',
    nome: 'Rota Zona Leste (R-14 Norte)',
    escolaKey: 'emef-joao-silva',
    escolaNome: 'EMEF João Silva',
    origemCoords: COORDS.cdCentral,
    destinoCoords: COORDS.emefJoaoSilva,
    motorista: 'Carlos Alberto',
    veículo: 'Caminhão Baú Cargo',
    placa: 'CAR-1290',
    tempoEstimado: 30,
    tempoAtual: 28,
    status: 'Entregue',
    insumo: 'Arroz, Feijão e Cereais',
    alertaAtivo: false
  }
];

export default function LogisticsMap() {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const routeLayers = useRef({});
  const markerLayers = useRef({});
  const truckMarker = useRef(null);

  const [rotas, setRotas] = useState(() => {
    // Inicializar a partir do localStorage se já houver anomalia ativa
    const anomalyActive = localStorage.getItem('merenda_route_anomaly_active') === 'true';
    const anomalyEscola = localStorage.getItem('merenda_route_anomaly_escola') || 'cei-pequeninos';
    
    return rotasIniciais.map(r => {
      if (anomalyActive && r.escolaKey === anomalyEscola) {
        return {
          ...r,
          status: 'DESVIO DE ROTA / ATRASO',
          tempoAtual: 200, // 3h e 20min
          alertaAtivo: true
        };
      }
      return r;
    });
  });

  const [selectedRouteId, setSelectedRouteId] = useState('rota-cei');
  const rotaAtiva = rotas.find(r => r.id === selectedRouteId) || rotas[0];

  // Alternador da anomalia de desvio (Simular 3 horas em rota de 40min)
  const toggleAnomalia = (routeId) => {
    setRotas(prev => prev.map(r => {
      if (r.id === routeId) {
        const novoAlerta = !r.alertaAtivo;
        
        if (novoAlerta) {
          localStorage.setItem('merenda_route_anomaly_active', 'true');
          localStorage.setItem('merenda_route_anomaly_escola', r.escolaKey);
          localStorage.setItem('merenda_route_anomaly_detalhes', `Veículo ${r.placa} do motorista ${r.motorista} está há 3 horas em trânsito em uma rota estimada de 40 minutos para ${r.escolaNome}.`);
          
          // Despachar evento para atualizar o resto da tela
          window.dispatchEvent(new Event('merenda_alert_sync'));
        } else {
          localStorage.removeItem('merenda_route_anomaly_active');
          localStorage.removeItem('merenda_route_anomaly_escola');
          localStorage.removeItem('merenda_route_anomaly_detalhes');
          
          window.dispatchEvent(new Event('merenda_alert_sync'));
        }

        return {
          ...r,
          status: novoAlerta ? 'DESVIO DE ROTA / ATRASO' : r.id === 'rota-joao' ? 'Entregue' : r.id === 'rota-margarida' ? 'Carregando' : 'Em Trânsito',
          tempoAtual: novoAlerta ? 200 : r.tempoEstimado, // 200 min = 3h20min
          alertaAtivo: novoAlerta
        };
      }
      return r;
    }));
  };

  // Inicializar o mapa do Leaflet
  useEffect(() => {
    if (!mapContainer.current) return;

    // Se já existe uma instância do mapa, destrói para recriar
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Criar o mapa centralizado em São Paulo
    const map = L.map(mapContainer.current, {
      center: [-23.5600, -46.6400],
      zoom: 12,
      zoomControl: true,
      attributionControl: false
    });

    mapInstance.current = map;

    // TileLayer escuro para estética premium (glassmorphism / neon dashboard)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Ícones personalizados em HTML/CSS para evitar erros de importação de imagens em empacotadores
    const iconCD = L.divIcon({
      className: 'leaflet-custom-marker',
      html: `
        <div style="background: var(--primary); width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid #fff; box-shadow: 0 0 15px var(--primary); color: white; font-weight: bold;">
          <i class="fa-solid fa-warehouse"></i>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Adicionar marcador do Almoxarifado Central (Origem)
    const cdMarker = L.marker(COORDS.cdCentral, { icon: iconCD })
      .addTo(map)
      .bindPopup('<b>Almoxarifado Central (CD Sede)</b><br/>Origem da Carga Municipal');

    markerLayers.current['cd'] = cdMarker;

    // Adicionar Marcadores das Escolas
    const coresEscolas = {
      'cei-pequeninos': 'var(--alert-red)',
      'emei-margarida': 'var(--alert-yellow)',
      'emef-joao-silva': 'var(--alert-green)'
    };

    const iconesEscolas = {
      'cei-pequeninos': 'fa-school',
      'emei-margarida': 'fa-child-reaching',
      'emef-joao-silva': 'fa-graduation-cap'
    };

    // Desenhar escolas
    Object.entries(coresEscolas).forEach(([key, color]) => {
      let coords = COORDS.cdCentral;
      let label = '';
      if (key === 'cei-pequeninos') { coords = COORDS.ceiPequeninos; label = 'CEI Pequeninos'; }
      if (key === 'emei-margarida') { coords = COORDS.emeiMargarida; label = 'EMEI Margarida'; }
      if (key === 'emef-joao-silva') { coords = COORDS.emefJoaoSilva; label = 'EMEF João Silva'; }

      const iconEscola = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div style="background: ${color}; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 12px ${color}; color: white; font-size: 13px;">
            <i class="fa-solid ${iconesEscolas[key]}"></i>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const schoolMarker = L.marker(coords, { icon: iconEscola })
        .addTo(map)
        .bindPopup(`<b>${label}</b><br/>Unidade de Recebimento`);
      
      markerLayers.current[key] = schoolMarker;
    });

    // Função de limpeza
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Atualizar polilinhas de rotas e caminhões ativos baseados nas mudanças
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;

    // Remover polilinhas anteriores se houver
    Object.values(routeLayers.current).forEach(layer => map.removeLayer(layer));
    routeLayers.current = {};

    if (truckMarker.current) {
      map.removeLayer(truckMarker.current);
      truckMarker.current = null;
    }

    // Desenhar a polilinha para a rota selecionada
    const r = rotaAtiva;
    const isAnomaly = r.alertaAtivo;
    const routeColor = isAnomaly ? 'var(--alert-red)' : 'var(--primary)';
    
    // Simular rota com pontos intermediários reais em SP
    let middleCoords = [];
    if (r.escolaKey === 'cei-pequeninos') {
      middleCoords = [
        r.origemCoords,
        [-23.5530, -46.6480], // Bela Vista
        [-23.5590, -46.6540], // Consolação
        r.destinoCoords
      ];
    } else if (r.escolaKey === 'emei-margarida') {
      middleCoords = [
        r.origemCoords,
        [-23.5680, -46.6480], // Paraíso
        [-23.5850, -46.6620], // Vila Mariana
        r.destinoCoords
      ];
    } else {
      middleCoords = [
        r.origemCoords,
        [-23.5350, -46.6200], // Brás
        [-23.5280, -46.6100], // Belenzinho
        r.destinoCoords
      ];
    }

    // Criar a polilinha de trajeto
    const polyline = L.polyline(middleCoords, {
      color: routeColor,
      weight: 6,
      opacity: 0.8,
      dashArray: isAnomaly ? '8, 8' : 'none',
      className: isAnomaly ? 'leaflet-route-deviated-pulse' : ''
    }).addTo(map);

    routeLayers.current[r.id] = polyline;

    // Ajustar zoom para enquadrar a rota
    map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

    // Desenhar caminhão em movimento (ou parado na anomalia)
    // Se anomalia, o caminhão fica fora da rota intermediária (simulando desvio físico no mapa)
    let truckPosition = middleCoords[1]; // Ponto médio padrão
    if (isAnomaly) {
      // Posição de desvio intencional: jogado para uma área totalmente fora da rota (Ex: Zona Norte - Santana)
      truckPosition = [-23.5044, -46.6201];
    }

    const truckColor = isAnomaly ? 'var(--alert-red)' : 'var(--alert-blue)';
    const truckIcon = L.divIcon({
      className: 'leaflet-custom-marker-truck',
      html: `
        <div style="background: ${truckColor}; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; box-shadow: 0 0 15px ${truckColor}; color: white; font-size: 13px; animation: ${isAnomaly ? 'pulseTruckAlert 1.5s infinite' : 'none'};">
          <i class="fa-solid fa-truck-fast"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 17]
    });

    const truck = L.marker(truckPosition, { icon: truckIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: Outfit, sans-serif; min-width: 140px;">
          <h4 style="margin: 0 0 4px 0; color: ${truckColor};">${isAnomaly ? '⚠️ DESVIO CRÍTICO' : '🚛 Caminhão em Rota'}</h4>
          <b>Motorista:</b> ${r.motorista}<br/>
          <b>Placa:</b> ${r.placa}<br/>
          <b>Posição GPS:</b> ${isAnomaly ? 'Desviado para Santana (Fora da Rota)' : 'Em Rota Autorizada'}
        </div>
      `);

    truckMarker.current = truck;
    if (isAnomaly) {
      truck.openPopup();
    }

  }, [rotaAtiva, rotas]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: 20, minHeight: 480 }}>
      {/* Contêiner do Mapa do Leaflet */}
      <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
        <div ref={mapContainer} style={{ width: '100%', height: '100%', minHeight: 460, zIndex: 1 }} />
        
        {/* Overlay de Anomalia Crítica Piscando no Mapa */}
        {rotaAtiva.alertaAtivo && (
          <div style={{
            position: 'absolute', top: 12, left: 12, right: 12,
            background: 'rgba(239, 68, 68, 0.95)', color: 'white',
            padding: '12px 18px', borderRadius: 10, zIndex: 10,
            display: 'flex', alignItems: 'center', gap: 12,
            border: '2px solid rgba(255, 255, 255, 0.4)',
            boxShadow: '0 4px 20px rgba(239, 68, 68, 0.5)',
            fontFamily: 'Outfit', animation: 'alertFlashHeader 1.5s infinite'
          }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', color: 'var(--alert-red)', display: 'flex', alignItems: 'center', justifyCenter: 'center', display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>!</div>
            <div style={{ flex: 1, fontSize: '0.88rem' }}>
              <strong>ALERTA DE DESVIO DE CARGA MUNICIPAL:</strong> Caminhão placa <b>{rotaAtiva.placa}</b> está inativo/desviado há <b>3 horas e 20 minutos</b> em trajeto de 40 minutos.
            </div>
          </div>
        )}
      </div>

      {/* Painel de Rastreamento de Rota & Simulação */}
      <div className="glass-panel" style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px solid var(--border-subtle)' }}>
        <div>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: 18, display: 'flex', alignItems: 'center', gap: 10, fontSize: '1.2rem', color: 'var(--text-main)' }}>
            <i className="fa-solid fa-route" style={{ color: 'var(--primary)' }}></i>
            Monitoramento de Rotas
          </h3>

          {/* Selecionar Rota */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {rotas.map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRouteId(r.id)}
                style={{
                  padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                  background: selectedRouteId === r.id ? 'rgba(5, 150, 105, 0.08)' : 'var(--bg-surface-elevated)',
                  border: selectedRouteId === r.id ? '2px solid var(--primary)' : '2px solid var(--border-subtle)',
                  color: 'var(--text-main)', transition: 'all 0.2s', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.escolaNome}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.nome}</div>
                </div>
                <span style={{
                  padding: '4px 8px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
                  background: r.alertaAtivo ? 'rgba(239,68,68,0.15)' : r.status === 'Entregue' ? 'rgba(16,185,129,0.15)' : 'rgba(96,165,250,0.15)',
                  color: r.alertaAtivo ? 'var(--alert-red)' : r.status === 'Entregue' ? 'var(--alert-green)' : 'var(--alert-blue)',
                  border: `1px solid ${r.alertaAtivo ? 'var(--alert-red)' : r.status === 'Entregue' ? 'var(--alert-green)' : 'var(--alert-blue)'}30`
                }}>
                  {r.alertaAtivo ? 'Desvio Crítico' : r.status}
                </span>
              </button>
            ))}
          </div>

          {/* Detalhes da Rota Ativa */}
          <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 12, padding: 18, border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ margin: '0 0 12px 0', fontFamily: 'Outfit', fontSize: '0.95rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 8 }}>
              Detalhes do Transporte ({rotaAtiva.placa})
            </h4>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              <div>
                <strong>Motorista:</strong><br/>
                <span style={{ color: 'var(--text-main)' }}>{rotaAtiva.motorista}</span>
              </div>
              <div>
                <strong>Veículo:</strong><br/>
                <span style={{ color: 'var(--text-main)' }}>{rotaAtiva.veículo}</span>
              </div>
              <div>
                <strong>Tempo Previsto:</strong><br/>
                <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{rotaAtiva.tempoEstimado} minutos</span>
              </div>
              <div>
                <strong>Tempo Transcorrido:</strong><br/>
                <span style={{
                  color: rotaAtiva.alertaAtivo ? 'var(--alert-red)' : 'var(--alert-green)',
                  fontWeight: 800, animation: rotaAtiva.alertaAtivo ? 'pulseRedText 1s infinite' : 'none'
                }}>
                  {rotaAtiva.tempoAtual >= 60 ? `${Math.floor(rotaAtiva.tempoAtual/60)}h ${rotaAtiva.tempoAtual%60}min` : `${rotaAtiva.tempoAtual} minutos`}
                </span>
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: 4 }}>
                <strong>Carga Transportada:</strong><br/>
                <span style={{ color: 'var(--primary)', fontWeight: 700 }}><i className="fa-solid fa-box-open" style={{ marginRight: 6 }}></i> {rotaAtiva.insumo}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Controle da Anomalia */}
        <div style={{ marginTop: 20 }}>
          <button
            onClick={() => toggleAnomalia(rotaAtiva.id)}
            className={`btn ${rotaAtiva.alertaAtivo ? 'btn-danger' : 'btn-primary'}`}
            style={{
              width: '100%', padding: '14px', fontSize: '0.92rem', fontWeight: 'bold',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: rotaAtiva.alertaAtivo ? '0 4px 15px rgba(239, 68, 68, 0.4)' : 'none',
              animation: rotaAtiva.alertaAtivo ? 'none' : 'none'
            }}
          >
            <i className={`fa-solid ${rotaAtiva.alertaAtivo ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
            {rotaAtiva.alertaAtivo ? 'Resolver e Liberar Rota' : 'Simular Desvio de Rota (3 horas)'}
          </button>
          <p style={{ margin: '8px 0 0 0', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.4 }}>
            {rotaAtiva.alertaAtivo 
              ? '⚠️ O veículo está enviando alertas vermelhos para o auditor.' 
              : 'Clique acima para forçar um atraso grave artificial de 3h e disparar o alerta de desvio.'
            }
          </p>
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
        @keyframes pulseTruckAlert {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
          70% { transform: scale(1.15); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes alertFlashHeader {
          0% { background: rgba(239, 68, 68, 0.95); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
          50% { background: rgba(185, 28, 28, 0.98); box-shadow: 0 4px 25px rgba(185, 28, 28, 0.7); }
          100% { background: rgba(239, 68, 68, 0.95); box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4); }
        }
        @keyframes pulseRedText {
          0%, 100% { color: #ef4444; }
          50% { color: #b91c1c; text-shadow: 0 0 4px rgba(239,68,68,0.2); }
        }
      `}</style>
    </div>
  );
}
