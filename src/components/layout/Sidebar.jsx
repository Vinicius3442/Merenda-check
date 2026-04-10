import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MENUS = {
  operador: [
    { to: '/operador', icon: 'fa-house', label: 'Painel Operador' },
    { to: '/operador/entrada', icon: 'fa-qrcode', label: 'Receber Insumo' },
    { to: '/operador/baixa', icon: 'fa-fire-burner', label: 'Retirar para Cozinha' },
    { to: '/operador/refeicao', icon: 'fa-users', label: 'Registrar Refeição' },
    { to: '/operador/sobra', icon: 'fa-scale-unbalanced', label: 'Sobra Limpa' },
    { to: '/operador/saida', icon: 'fa-truck-fast', label: 'Saída / Remanejamento' },
  ],
  gestor: [
    { to: '/gestor', icon: 'fa-house', label: 'Visão Geral' },
    { to: '/gestor/estoque', icon: 'fa-boxes-stacked', label: 'Estoque Local' },
    { to: '/gestor/relatorios', icon: 'fa-file-invoice', label: 'Relatórios' },
  ],
  auditor: [
    { to: '/auditor', icon: 'fa-satellite-dish', label: 'Malha Municipal' },
    { to: '/auditor/escolas', icon: 'fa-school', label: 'Unidades (Escolas)' },
    { to: '/auditor/rastrear', icon: 'fa-code-branch', label: 'Investigação de Lote' },
  ],
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const items = MENUS[role] || [];
  const isAuditor = role === 'auditor';

  return (
    <aside className="app-sidebar">
      <Link to="/" className="logo" style={{ marginBottom: 40, display: 'block' }}>
        <img src="/logo.png" alt="Merenda Check" className="logo-img" />
      </Link>

      <nav className="menu">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item ${location.pathname === item.to ? 'active' : ''}`}
          >
            <i className={`fa-solid ${item.icon}`}></i> {item.label}
          </Link>
        ))}

        <Link to="/login" className="menu-item danger" onClick={logout}>
          <i className="fa-solid fa-power-off"></i> Encerrar Sessão
        </Link>
      </nav>

      <Link to="/perfil" className="user-profile">
        <div className={`avatar ${isAuditor ? 'auditor-avatar' : ''}`}>
          {user?.initials || '??'}
        </div>
        <div>
          <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-main)', fontWeight: 700 }}>
            {user?.name || 'Usuário'}
          </h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {user?.role || 'Sem cargo'}
          </span>
        </div>
      </Link>
    </aside>
  );
}
