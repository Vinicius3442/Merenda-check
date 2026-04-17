import DashboardLayout from '../../components/layout/DashboardLayout';
import PredictiveChart from '../../components/charts/PredictiveChart';
import { mockKpisGestor, mockChartData } from '../../data/mockData';

export default function GestorHome() {
  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Painel Preditivo</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Visão em tempo real da EMEF João Silva com projeções de curtíssimo prazo (IA).
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

      <div className="glass-panel animate-slide-up delay-200" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '24px 24px 0' }}>
          <h3 style={{ fontFamily: 'Outfit', marginBottom: 4 }}>
            <i className="fa-solid fa-brain" style={{ color: 'var(--alert-blue)', marginRight: 10 }}></i>
            Predição Semanal de Consumo vs Real
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Modelo calibrado com base em frequência (catracas) e cardápio planejado.</p>
        </div>
        <PredictiveChart labels={mockChartData.labels} real={mockChartData.real} predito={mockChartData.predito} />
      </div>
    </DashboardLayout>
  );
}
