import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const MENUS = {
  operador: [
    { to: '/operador',         icon: 'fa-house',            label: 'Painel Operador' },
    { to: '/operador/entrada', icon: 'fa-qrcode',           label: 'Receber Insumo' },
    { to: '/operador/baixa',   icon: 'fa-fire-burner',      label: 'Retirar para Cozinha' },
    { to: '/operador/refeicao',icon: 'fa-users',            label: 'Registrar Refeição' },
    { to: '/operador/sobra',   icon: 'fa-scale-unbalanced', label: 'Resto-Ingesta' },
    { to: '/operador/saida',   icon: 'fa-truck-fast',       label: 'Saída / Remanejamento' },
  ],
  gestor: [
    { to: '/gestor',              icon: 'fa-house',           label: 'Visão Geral' },
    { to: '/gestor/estoque',      icon: 'fa-boxes-stacked',   label: 'Estoque Local' },
    { to: '/gestor/relatorios',   icon: 'fa-file-invoice',    label: 'Relatórios' },
    { to: '/nutricao/cardapios',  icon: 'fa-calendar-check',  label: 'Aprovar Cardápio' },
    { to: '/auditor/escolas',     icon: 'fa-triangle-exclamation', label: 'Ver Alertas' },
    { to: '/auditor/rastrear',    icon: 'fa-code-branch',     label: 'Rastreabilidade' },
  ],
  auditor: [
    { to: '/auditor',          icon: 'fa-satellite-dish',  label: 'Malha Municipal' },
    { to: '/auditor/escolas',  icon: 'fa-school',          label: 'Unidades (Escolas)' },
    { to: '/auditor/rastrear', icon: 'fa-code-branch',     label: 'Investigação de Lote' },
    { to: '/auditor/investigar',icon: 'fa-magnifying-glass', label: 'Investigar Alerta' },
  ],
  nutricao: [
    { to: '/nutricao',            icon: 'fa-chart-pie',       label: 'Metas PNAE' },
    { to: '/nutricao/cardapios',  icon: 'fa-calendar-days',   label: 'Gestão de Cardápios' },
    { to: '/nutricao/fichas',     icon: 'fa-clipboard-list',  label: 'Fichas Técnicas' },
    { to: '/gestor/relatorios',   icon: 'fa-file-arrow-down', label: 'Relatório FNDE' },
    { to: '/licitacao',           icon: 'fa-paper-plane',     label: 'Solicitar Compra' },
  ],
  licitacao: [
    { to: '/licitacao',               icon: 'fa-file-signature', label: 'Contratos e Empenhos' },
    { to: '/licitacao/fornecedores',  icon: 'fa-truck',          label: 'Fornecedores (Sanções)' },
  ],
  admin: [
    { to: '/admin',          icon: 'fa-users-gear',    label: 'Gestão de Usuários' },
    { to: '/admin/audit-ti', icon: 'fa-shield-halved', label: 'Audit Trail (TI)' },
  ],
  transportadora: [
    { to: '/transportadora',              icon: 'fa-house',  label: 'Visão Geral' },
    { to: '/transportadora/emitir-lote',  icon: 'fa-qrcode', label: 'Emitir Lote Blockchain' },
  ],
};

const ROLE_LABEL = {
  operador: 'Operador',
  gestor:   'Gestor Escolar',
  auditor:  'Auditor Municipal',
  nutricao: 'Setor de Nutrição',
  licitacao:'Compras Públicas',
  transportadora: 'Logística de Transporte',
  admin:    'SysAdmin (TI do Órgão)',
};

export default function Sidebar() {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const items = MENUS[role] || [];
  const [open, setOpen] = useState(false);

  // Fechar ao navegar
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Impedir scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuLinkStyle = (isActive) => ({
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '12px 16px', borderRadius: 12,
    color: isActive ? '#fff' : 'var(--text-muted)',
    background: isActive ? 'linear-gradient(90deg, rgba(16,185,129,0.2), rgba(16,185,129,0.05))' : 'transparent',
    borderLeft: isActive ? '4px solid var(--primary)' : '4px solid transparent',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.95rem', textDecoration: 'none',
    transition: 'all 0.2s',
    boxShadow: isActive ? 'inset 20px 0 30px -10px rgba(16,185,129,0.1)' : 'none',
  });

  const sidebarContent = (
    <>
      {/* Logo */}
      <Link to="/" style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <img src="/logo.png" alt="Merenda Check" style={{ height: 38 }} />
      </Link>

      {/* Subtítulo institucional */}
      <div style={{
        fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase',
        letterSpacing: '0.1em', color: 'var(--primary)',
        marginBottom: 32, paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}>
        {ROLE_LABEL[role] || 'Sistema'}
      </div>

      {/* Menu */}
      <nav className="menu" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        {items.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              style={menuLinkStyle(isActive)}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <i className={`fa-solid ${item.icon}`} style={{ width: 20, textAlign: 'center', fontSize: '1.1rem', color: isActive ? 'var(--primary)' : 'inherit' }}></i>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Links de suporte */}
      <div style={{
        paddingTop: 16, paddingBottom: 16,
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        marginBottom: 20, marginTop: 20,
        display: 'flex', flexDirection: 'column', gap: 6,
      }}>
        <Link
          to="/ajuda"
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 10,
            color: 'var(--text-muted)', fontSize: '0.88rem', textDecoration: 'none',
            transition: 'background 0.2s, color 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-main)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <i className="fa-solid fa-circle-question" style={{ width: 20, textAlign: 'center' }}></i> Ajuda
        </Link>
        <button
          onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 16px', borderRadius: 10,
            color: 'var(--alert-red)', fontSize: '0.88rem', background: 'transparent',
            border: 'none', cursor: 'pointer', width: '100%',
            transition: 'background 0.2s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          <i className="fa-solid fa-power-off" style={{ width: 20, textAlign: 'center' }}></i> Encerrar Sessão
        </button>
      </div>

      {/* Usuário logado */}
      <Link to="/perfil" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s', border: '1px solid rgba(255,255,255,0.03)' }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.2)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.03)'; }}
      >
        <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1rem', boxShadow: '0 4px 10px rgba(16,185,129,0.3)', flexShrink: 0 }}>
          {user?.initials || 'MC'}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <h4 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-main)', fontWeight: 700,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.name || 'Usuário Local'}
          </h4>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--alert-green)', display: 'inline-block' }}></span> Online
          </span>
        </div>
      </Link>
    </>
  );

  return (
    <>
      {/* Botão hambúrguer — visível só no mobile */}
      <button
        className="sidebar-hamburger"
        onClick={() => setOpen((v) => !v)}
        aria-label="Abrir menu"
      >
        <i className={`fa-solid ${open ? 'fa-xmark' : 'fa-bars'}`}></i>
      </button>

      {/* Overlay escuro quando menu mobile está aberto */}
      {open && (
        <div
          className="sidebar-overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar principal */}
      <aside
        className={`app-sidebar${open ? ' sidebar-open' : ''}`}
        style={{
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(30px)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', flexDirection: 'column',
          padding: '24px 20px',
          boxShadow: '10px 0 30px rgba(0,0,0,0.3)',
        }}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
