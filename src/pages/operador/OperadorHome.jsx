import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';

// Resumo de estoque crítico para visão rápida do operador
const estoqueResumo = [
  { nome: 'Carne Moída Bovina', restante: '15 kg', alerta: 'Vence em 3 dias', status: 'danger', icon: 'fa-drumstick-bite' },
  { nome: 'Arroz Agulhinha',    restante: '120 kg', alerta: 'Estoque normal', status: 'ok',     icon: 'fa-bowl-rice' },
  { nome: 'Polpa de Morango',   restante: '0 kg',   alerta: 'Esgotado',       status: 'warning', icon: 'fa-jar' },
];

const actions = [
  {
    to: '/operador/entrada',
    icon: 'fa-qrcode',
    title: 'Receber Insumo',
    desc: 'Conferir entrega via leitura óptica (QR Code) e registrar lote no sistema.',
    color: 'var(--primary)',
  },
  {
    to: '/operador/baixa',
    icon: 'fa-fire-burner',
    title: 'Retirar para Cozinha',
    desc: 'Selecionar insumo do estoque FIFO e despachar para o preparo.',
    color: 'var(--alert-yellow)',
  },
  {
    to: '/operador/refeicao',
    icon: 'fa-users',
    title: 'Registrar Refeição',
    desc: 'Apontar manualmente a quantidade de refeições servidas.',
    color: 'var(--alert-blue)',
  },
  {
    to: '/operador/sobra',
    icon: 'fa-scale-unbalanced',
    // Terminologia profissional: Resto-Ingesta / Excedente de Produção
    title: 'Resto-Ingesta (Excedente)',
    desc: 'Pesar e declarar o excedente de produção ao final do turno.',
    color: 'var(--alert-red)',
  },
  {
    to: '/operador/saida',
    icon: 'fa-truck-fast',
    title: 'Movimentação de Saída',
    desc: 'Transferir ou remanejar insumos para outra unidade escolar.',
    color: 'var(--alert-blue)',
  },
];

const statusColor = { danger: 'var(--alert-red)', warning: 'var(--alert-yellow)', ok: 'var(--primary)' };

export default function OperadorHome() {
  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1>Painel do Operador</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Bom dia! Selecione abaixo a operação que deseja registrar.
          </p>
        </div>
      </div>

      {/* Widget de resumo do estoque — visão rápida sem clicar em nada */}
      <div
        className="glass-panel animate-fade-in"
        style={{ padding: '18px 24px', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 28, paddingRight: 28, borderRight: '1px solid var(--border-subtle)' }}>
          <i className="fa-solid fa-boxes-stacked" style={{ color: 'var(--primary)', fontSize: '1.1rem' }}></i>
          <span style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
            Estoque Hoje
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, flex: 1, flexWrap: 'wrap' }}>
          {estoqueResumo.map((item) => (
            <div key={item.nome} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <i
                className={`fa-solid ${item.icon}`}
                style={{ color: statusColor[item.status], fontSize: '0.95rem', width: 16 }}
              ></i>
              <div>
                <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{item.restante}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: 5 }}>{item.nome}</span>
              </div>
              <span
                style={{
                  fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                  background: `${statusColor[item.status]}18`,
                  color: statusColor[item.status],
                  border: `1px solid ${statusColor[item.status]}40`,
                }}
              >
                {item.alerta}
              </span>
            </div>
          ))}
        </div>
        <Link
          to="/operador/entrada"
          style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto', paddingLeft: 20, whiteSpace: 'nowrap' }}
        >
          Ver estoque completo →
        </Link>
      </div>

      {/* Grid de ações */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}
        className="animate-slide-up delay-100"
      >
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="glass-panel"
            style={{ padding: 28, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 14 }}
          >
            {/* Ícone */}
            <div style={{
              width: 52, height: 52, borderRadius: 10,
              background: `${a.color}18`, color: a.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
            }}>
              <i className={`fa-solid ${a.icon}`}></i>
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 6 }}>{a.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.55 }}>{a.desc}</p>
            </div>

            {/* Botão de ação — grande e óbvio */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '11px 0', borderRadius: 6, marginTop: 4,
                background: `${a.color}18`, border: `1px solid ${a.color}40`,
                color: a.color, fontWeight: 700, fontSize: '0.9rem',
                transition: 'background 0.2s',
              }}
            >
              <i className="fa-solid fa-play" style={{ fontSize: '0.75rem' }}></i>
              Iniciar Operação
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
