import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import LogisticsMap from '../../components/ui/LogisticsMap';

const entregas = [
  { rota: 'R-14 Norte', escola: 'EMEF João Silva', horario: '09:30', status: 'Em Trânsito', cor: 'var(--primary)', bg: 'rgba(16,185,129,0.12)' },
  { rota: 'R-15 Leste', escola: 'CEI Pequeninos', horario: '11:00', status: 'Carregando', cor: 'var(--alert-yellow)', bg: 'rgba(251,191,36,0.12)' },
  { rota: 'R-08 Sul', escola: 'EMEI Girassol', horario: '13:30', status: 'Pendente', cor: 'var(--alert-blue)', bg: 'rgba(96,165,250,0.12)' },
  { rota: 'R-22 Centro', escola: 'EMEF Oswaldo Cruz', horario: '15:00', status: 'Entregue', cor: 'var(--alert-green)', bg: 'rgba(52,211,153,0.12)' },
];

export default function TransportadoraHome() {
  return (
    <DashboardLayout>
      {/* Header */}
      <header className="page-header">
        <div>
          <h1 className="page-title">Visão Geral da Logística</h1>
          <p className="page-subtitle">Acompanhamento de frotas e entregas de insumos com GPS ativo e anomalias de trajeto.</p>
        </div>
        <Link to="/transportadora/emitir-lote" className="btn btn-primary">
          <i className="fa-solid fa-qrcode"></i> Emitir Lote Criptografado
        </Link>
      </header>

      {/* Rastreamento com Mapa Leaflet Interativo */}
      <div className="glass-panel" style={{ padding: 20, marginBottom: 36 }}>
        <h2 style={{ fontSize: '1.15rem', fontFamily: 'Outfit, sans-serif', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="fa-solid fa-satellite" style={{ color: 'var(--primary)' }}></i>
          Painel de Rastreamento de Rotas (GPS Ativo)
        </h2>
        <LogisticsMap />
      </div>

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
            <i className="fa-solid fa-link"></i> 100% integridade criptográfica
          </p>
        </div>
      </div>

      {/* Próximas Entregas */}
      <div className="table-card">
        {/* Card Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexWrap: 'wrap', gap: 12,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fa-solid fa-route" style={{ color: 'var(--primary)' }}></i>
            <span style={{ fontFamily: 'Outfit', fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>Próximas Entregas</span>
          </div>
          <span style={{
            fontSize: '0.78rem', color: 'var(--alert-green)', background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.2)', padding: '3px 12px', borderRadius: 20, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alert-green)', display: 'inline-block' }}></span>
            GPS Ativo — Atualizado agora
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ minWidth: 520 }}>
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
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', fontSize: '0.85rem' }}>{e.rota}</span>
                  </td>
                  <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{e.escola}</td>
                  <td style={{ color: '#94a3b8' }}>
                    <i className="fa-regular fa-clock" style={{ marginRight: 6 }}></i>{e.horario}
                  </td>
                  <td>
                    <span style={{
                      padding: '4px 14px', background: e.bg, color: e.cor,
                      borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                      border: `1px solid ${e.cor}30`, display: 'inline-block',
                    }}>
                      {e.status}
                    </span>
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
          <span><i className="fa-solid fa-circle-info" style={{ marginRight: 6 }}></i>{entregas.length} rotas programadas hoje</span>
          <span style={{ color: 'var(--alert-green)' }}><i className="fa-solid fa-satellite" style={{ marginRight: 6 }}></i>Rastreio Satelital Ativo</span>
        </div>
      </div>
    </DashboardLayout>
  );
}
