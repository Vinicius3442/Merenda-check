import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useEstoque } from '../../hooks/useEstoque';

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
  const { user } = useAuth();
  const { estoque } = useEstoque(user?.escola_id);

  const ativos = estoque.filter(e => e.status !== 'arquivado');

  const calcularStatus = (item) => {
    if (!item.volume_kg || parseFloat(item.volume_kg) <= 0) return { alerta: 'Esgotado', status: 'warning', icon: 'fa-box-open' };
    
    if (item.validade) {
      const dias = Math.ceil((new Date(item.validade) - new Date()) / 86400000);
      if (dias < 0) return { alerta: 'Vencido', status: 'danger', icon: 'fa-triangle-exclamation' };
      if (dias <= 7) return { alerta: `Vence em ${dias} dias`, status: 'danger', icon: 'fa-hourglass-half' };
    }
    
    return { alerta: 'Estoque normal', status: 'ok', icon: 'fa-check-circle' };
  };

  const estoqueResumoDinamico = ativos.slice(0, 3).map(item => ({
    nome: item.nome,
    restante: `${parseFloat(item.volume_kg).toFixed(1)} kg`,
    ...calcularStatus(item)
  }));

  if (estoqueResumoDinamico.length === 0) {
    estoqueResumoDinamico.push({ nome: 'Nenhum item', restante: '0 kg', alerta: 'Estoque Vazio', status: 'warning', icon: 'fa-box-open' });
  }

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in" style={{ 
        display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 20, marginBottom: 30,
        background: 'linear-gradient(90deg, rgba(16,185,129,0.1), transparent)',
        padding: '24px 32px', borderRadius: '24px', border: '1px solid rgba(16,185,129,0.15)'
      }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(16,185,129,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--primary)', flexShrink: 0 }}>
          <i className="fa-solid fa-user-gear"></i>
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.8rem', fontFamily: 'Outfit' }}>Painel Operacional</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: 0 }}>
            Bom dia! Controle o fluxo de insumos e refeições de hoje.
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
          {estoqueResumoDinamico.map((item) => (
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
          to="/operador/baixa"
          style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginLeft: 'auto', paddingLeft: 20, whiteSpace: 'nowrap' }}
        >
          Ver estoque completo →
        </Link>
      </div>

      {/* Grid de ações */}
      <div
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}
        className="animate-slide-up delay-100"
      >
        {actions.map((a) => (
          <Link
            key={a.to}
            to={a.to}
            className="glass-panel"
            style={{ 
              padding: '24px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 12,
              background: `linear-gradient(135deg, rgba(30,41,59,0.9), rgba(15,23,42,0.95))`
            }}
          >
            {/* Ícone */}
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: `linear-gradient(135deg, ${a.color}20, ${a.color}10)`, 
              color: a.color, border: `1px solid ${a.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0,
              boxShadow: `0 10px 20px ${a.color}15`
            }}>
              <i className={`fa-solid ${a.icon}`}></i>
            </div>

            <div style={{ flex: 1, marginTop: 10 }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: 8, fontFamily: 'Outfit' }}>{a.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{a.desc}</p>
            </div>

            {/* Botão de ação — design flat e vivo */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                padding: '14px 0', borderRadius: 12, marginTop: 16,
                background: a.color, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                boxShadow: `0 8px 16px ${a.color}40`,
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'brightness(1)'; }}
            >
              Iniciar Operação
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.85rem' }}></i>
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
