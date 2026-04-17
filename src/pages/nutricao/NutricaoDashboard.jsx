import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function NutricaoDashboard() {
  const metaKpis = [
    { label: 'Cardápios Planejados', value: '12 / 12', icon: 'fa-calendar-check', color: 'var(--alert-green)' },
    { label: 'Custo FNDE Mensal', value: 'R$ 1.2M', icon: 'fa-sack-dollar', color: 'var(--alert-yellow)' },
    { label: 'Fichas Técnicas', value: '45', icon: 'fa-clipboard-list', color: 'var(--alert-blue)' },
    { label: 'Conformidade Nutricional', value: '98%', icon: 'fa-apple-whole', color: 'var(--primary)' },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-chart-pie" style={{ color: 'var(--primary)' }}></i>
            Metas PNAE (Programa Nacional de Alimentação Escolar)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Acompanhe o cumprimento das diretrizes nutricionais, custo per capita e adequação do cardápio letivo.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary">
            <i className="fa-solid fa-file-pdf"></i> Exportar Relatório FNDE
          </button>
        </div>
      </div>

      <div className="kpi-grid animate-slide-up">
        {metaKpis.map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-icon"><i className={`fa-solid ${kpi.icon}`}></i></div>
            <div className="kpi-value" style={{ color: kpi.color }}>{kpi.value}</div>
            <div className="kpi-label">{kpi.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, marginTop: 30 }}>
        <h3 style={{ fontFamily: 'Outfit', marginBottom: 20 }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: 'var(--alert-red)', marginRight: 8 }}></i>
          Avisos do Sistema de IA
        </h3>
        <p style={{ color: 'var(--text-muted)' }}>O cruzamento preditivo encontrou uma inconsistência entre o Estoque Geral e o Cardápio Planejado da semana que vem:</p>
        <div style={{ marginTop: 16, padding: 16, background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--alert-yellow)', borderRadius: '0 8px 8px 0' }}>
          <strong>Atenção:</strong> Há déficit projetado de <strong>120kg de Carne Bovina</strong> para atender a rede inteira no dia 22/04 (Cardápio: Estrogonofe). Recomenda-se acionar Licitação ou alterar cardápio.
        </div>
        <div style={{ marginTop: 20 }}>
          <Link to="/nutricao/cardapios" className="btn btn-primary" style={{ marginRight: 10 }}>
            <i className="fa-solid fa-pen-to-square"></i> Editar Cardápio
          </Link>
          <button className="btn btn-secondary">
            <i className="fa-solid fa-paper-plane"></i> Solicitar Compra
          </button>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
