import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MENUS = {
  operador: [
    { to: '/operador',        icon: 'fa-house',           label: 'Painel Operador' },
    { to: '/operador/entrada', icon: 'fa-qrcode',          label: 'Receber Insumo' },
    { to: '/operador/baixa',   icon: 'fa-fire-burner',     label: 'Retirar para Cozinha' },
    { to: '/operador/refeicao',icon: 'fa-users',           label: 'Registrar Refeição' },
    { to: '/operador/sobra',   icon: 'fa-scale-unbalanced',label: 'Resto-Ingesta' },
    { to: '/operador/saida',   icon: 'fa-truck-fast',      label: 'Saída / Remanejamento' },
  ],
  gestor: [
    { to: '/gestor',          icon: 'fa-house',           label: 'Visão Geral' },
    { to: '/gestor/estoque',  icon: 'fa-boxes-stacked',   label: 'Estoque Local' },
    { to: '/gestor/relatorios',icon: 'fa-file-invoice',   label: 'Relatórios' },
  ],
  auditor: [
    { to: '/auditor',         icon: 'fa-satellite-dish',  label: 'Malha Municipal' },
    { to: '/auditor/escolas', icon: 'fa-school',          label: 'Unidades (Escolas)' },
    { to: '/auditor/rastrear',icon: 'fa-code-branch',     label: 'Investigação de Lote' },
  ],
  nutricao: [
    { to: '/nutricao',        icon: 'fa-chart-pie',       label: 'Metas PNAE' },
    { to: '/nutricao/cardapios', icon: 'fa-calendar-days', label: 'Gestão de Cardápios' },
    { to: '/nutricao/fichas', icon: 'fa-clipboard-list',  label: 'Fichas Técnicas' },
  ],
  licitacao: [
    { to: '/licitacao',       icon: 'fa-file-signature',  label: 'Contratos e Empenhos' },
    { to: '/licitacao/fornecedores', icon: 'fa-truck',     label: 'Fornecedores (Sanções)' },
  ],
  admin: [
    { to: '/admin',           icon: 'fa-users-gear',      label: 'Gestão de Usuários' },
    { to: '/admin/audit-ti',  icon: 'fa-shield-halved',   label: 'Audit Trail (TI)' },
  ],
};

const ROLE_LABEL = {
  operador: 'Operador',
  gestor:   'Gestor Escolar',
  auditor:  'Auditor Municipal',
  nutricao: 'Setor de Nutrição',
  licitacao:'Compras Públicas',
  admin:    'SysAdmin (TI do Órgão)',
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const items = MENUS[role] || [];

  return (
    <aside className="app-sidebar">
      {/* Logo */}
      <Link to="/" style={{ marginBottom: 8, display: 'block' }}>
        <img src="/logo.png" alt="Merenda Check" className="logo-img" />
      </Link>

      {/* Subtítulo institucional */}
      <div style={{
        fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.08em', color: 'var(--text-muted)',
        marginBottom: 28, paddingBottom: 16,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {ROLE_LABEL[role] || 'Sistema'} · Merenda Check
      </div>

      {/* Menu */}
      <nav className="menu" style={{ flex: 1 }}>
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`menu-item ${location.pathname === item.to ? 'active' : ''}`}
          >
            <i className={`fa-solid ${item.icon}`} style={{ width: 18, textAlign: 'center' }}></i>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Links de suporte */}
      <div style={{
        paddingTop: 16, paddingBottom: 16,
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: 16,
        display: 'flex', flexDirection: 'column', gap: 4,
      }}>
        <a
          href="#"
          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 7,
            color: 'var(--text-muted)', fontSize: '0.85rem', textDecoration: 'none',
            transition: 'background 0.15s, color 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-surface-elevated)'; e.currentTarget.style.color = 'var(--text-main)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <i className="fa-solid fa-circle-question" style={{ width: 18, textAlign: 'center' }}></i> Ajuda
        </a>
        <Link
          to="/login"
          className="menu-item danger"
          onClick={logout}
          style={{ marginTop: 0 }}
        >
          <i className="fa-solid fa-power-off" style={{ width: 18, textAlign: 'center' }}></i> Encerrar Sessão
        </Link>
      </div>

      {/* Usuário logado */}
      <Link to="/perfil" className="user-profile">
        <div className="avatar">
          {user?.initials || '??'}
        </div>
        <div style={{ minWidth: 0 }}>
          <h4 style={{ fontSize: '0.92rem', margin: 0, color: 'var(--text-main)', fontWeight: 700,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Usuário'}
          </h4>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {user?.role || 'Sem cargo'}
          </span>
        </div>
      </Link>
    </aside>
  );
}
