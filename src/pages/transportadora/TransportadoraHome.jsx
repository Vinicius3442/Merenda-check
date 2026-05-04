import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

const entregas = [
  { rota: 'R-14 Norte',  escola: 'EMEF João Silva',       horario: '09:30', status: 'Em Trânsito',  cor: 'var(--primary)',       bg: 'rgba(16,185,129,0.12)' },
  { rota: 'R-15 Leste',  escola: 'CEI Pequeninos',        horario: '11:00', status: 'Carregando',   cor: 'var(--alert-yellow)',  bg: 'rgba(251,191,36,0.12)' },
  { rota: 'R-08 Sul',    escola: 'EMEI Girassol',         horario: '13:30', status: 'Pendente',     cor: 'var(--alert-blue)',    bg: 'rgba(96,165,250,0.12)' },
  { rota: 'R-22 Centro', escola: 'EMEF Oswaldo Cruz',     horario: '15:00', status: 'Entregue',     cor: 'var(--alert-green)',   bg: 'rgba(52,211,153,0.12)' },
];

export default function TransportadoraHome() {
  return (
    <DashboardLayout>
      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Visão Geral da Logística</h1>
          <p className="page-subtitle">Acompanhamento de frotas e entregas de insumos.</p>
        </div>
        <Link to="/transportadora/emitir-lote" className="btn btn-primary">
          <i className="fa-solid fa-qrcode"></i> Emitir Lote Blockchain
        </Link>
      </header>

      {/* KPI Cards */}
      <div className="kpi-grid" style={{ marginBottom: 36 }}>
        <div className="kpi-card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <i className="fa-solid fa-truck-fast kpi-icon"></i>
          <div className="kpi-value" style={{ color: 'var(--primary)' }}>14</div>
          <div className="kpi-label">Entregas Hoje</div>
          <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--alert-yellow)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-clock"></i> 2 pendentes
          </p>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--alert-blue)' }}>
          <i className="fa-solid fa-satellite-dish kpi-icon"></i>
          <div className="kpi-value" style={{ color: 'var(--alert-blue)' }}>4</div>
          <div className="kpi-label">Veículos em Rota</div>
          <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--alert-green)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-circle" style={{ fontSize: '0.5rem' }}></i> GPS Ativo
          </p>
        </div>

        <div className="kpi-card" style={{ borderLeft: '4px solid var(--alert-green)' }}>
          <i className="fa-solid fa-cubes kpi-icon"></i>
          <div className="kpi-value" style={{ color: 'var(--alert-green)' }}>142</div>
          <div className="kpi-label">Lotes Emitidos (Mês)</div>
          <p style={{ margin: '8px 0 0', fontSize: '0.82rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <i className="fa-solid fa-link"></i> 100% integridade blockchain
          </p>
        </div>
      </div>

      {/* Próximas Entregas */}
      <div className="glass-panel" style={{ padding: '28px 32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: '1.15rem', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
            <i className="fa-solid fa-route" style={{ color: 'var(--primary)', marginRight: 10 }}></i>
            Próximas Entregas
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', background: 'var(--bg-surface-elevated)', padding: '4px 12px', borderRadius: 20 }}>
            Atualizado agora
          </span>
        </div>

        <div className="table-wrapper" style={{ borderRadius: 14, border: '1px solid var(--border-subtle)' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Rota</th>
                <th>Escola</th>
                <th>Horário Previsto</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {entregas.map((e) => (
                <tr key={e.rota}>
                  <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)', fontWeight: 600 }}>{e.rota}</td>
                  <td style={{ fontWeight: 600 }}>{e.escola}</td>
                  <td>
                    <i className="fa-regular fa-clock" style={{ marginRight: 6, color: 'var(--text-muted)' }}></i>
                    {e.horario}
                  </td>
                  <td>
                    <span style={{
                      padding: '5px 14px', background: e.bg, color: e.cor,
                      borderRadius: 20, fontSize: '0.8rem', fontWeight: 700,
                      border: `1px solid ${e.cor}30`,
                    }}>
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
