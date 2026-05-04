import DashboardLayout from '../../components/layout/DashboardLayout';
import PredictiveChart from '../../components/charts/PredictiveChart';
import LogisticsMap from '../../components/ui/LogisticsMap';
import { mockKpisGestor, mockChartData } from '../../data/mockData';

export default function GestorHome() {
  return (
    <DashboardLayout>
      {/* "Frufruzagens" - Orbs flutuantes para deixar o design artístico */}
      <div style={{ position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, background: 'var(--primary)', filter: 'blur(100px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', top: '40%', left: '0%', width: 400, height: 400, background: 'var(--alert-blue)', filter: 'blur(120px)', opacity: 0.1, zIndex: 0, pointerEvents: 'none', animation: 'float 10s ease-in-out infinite' }}></div>

      <div className="header-dash animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-chart-line" style={{ color: 'var(--primary)', fontSize: '1.6rem' }}></i>
            Painel Preditivo
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Visão em tempo real da rede com projeções de curtíssimo prazo (IA).
          </p>
        </div>
      </div>

      <div className="kpi-grid animate-slide-up">
        {mockKpisGestor.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`}></i></div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
            {/* Contexto: bom ou ruim? */}
            {kpi.trend && (
              <div style={{
                marginTop: 6, fontSize: '0.75rem', fontWeight: 700,
                color: kpi.trendColor || kpi.color,
                display: 'flex', alignItems: 'center', gap: 4,
              }}>
                <i className="fa-solid fa-arrow-trend-up" style={{ fontSize: '0.7rem' }}></i>
                {kpi.trend}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Grid de Gráficos e Mapa */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, position: 'relative', zIndex: 1 }}>
        <div className="glass-panel animate-slide-up delay-200" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '24px 24px 0' }}>
            <h3 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>
              <i className="fa-solid fa-brain" style={{ color: 'var(--alert-blue)', marginRight: 10 }}></i>
              Predição de Consumo Semanal
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Modelo calibrado com catracas faciais e cardápio planejado.</p>
          </div>
          <PredictiveChart labels={mockChartData.labels} real={mockChartData.real} predito={mockChartData.predito} />
        </div>

        {/* O Novo Mapa de Logística Animado */}
        <div className="animate-slide-up delay-300">
          <LogisticsMap />
        </div>
      </div>
    </DashboardLayout>
  );
}
