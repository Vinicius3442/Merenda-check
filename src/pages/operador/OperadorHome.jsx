import { Link } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';

const actions = [
  { to: '/operador/entrada', icon: 'fa-qrcode', title: 'Receber Insumo', desc: 'Conferir entrega do fornecedor via leitura óptica (QR Code).', color: 'var(--primary)' },
  { to: '/operador/baixa', icon: 'fa-fire-burner', title: 'Retirar para Cozinha', desc: 'Selecionar insumo do estoque FIFO para preparo.', color: 'var(--alert-yellow)' },
  { to: '/operador/refeicao', icon: 'fa-users', title: 'Registrar Refeição', desc: 'Apontar manualmente a quantidade servida (fallback da catraca).', color: 'var(--alert-blue)' },
  { to: '/operador/sobra', icon: 'fa-scale-unbalanced', title: 'Sobra Limpa (Panela)', desc: 'Pesar e declarar a sobra das panelas do dia.', color: 'var(--alert-red)' },
  { to: '/operador/saida', icon: 'fa-truck-fast', title: 'Movimentação de Saída', desc: 'Transferir ou remanejar insumos para outro destino.', color: 'var(--alert-blue)' },
];

export default function OperadorHome() {
  return (
    <>
      <BgMesh />
      <div className="app-container">
        <main className="app-main" style={{ paddingTop: 60 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
            <Link to="/login" className="btn btn-secondary"><i className="fa-solid fa-power-off"></i> Sair</Link>
            <img src="/logo.png" alt="Merenda Check" className="logo-img" />
            <Link to="/perfil" className="btn btn-light"><i className="fa-solid fa-user-gear"></i> Perfil</Link>
          </div>

          <div className="header-dash animate-fade-in">
            <div>
              <h1>Painel do Operador</h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Selecione a ação que deseja realizar no almoxarifado.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }} className="animate-slide-up delay-100">
            {actions.map((a) => (
              <Link key={a.to} to={a.to} className="glass-panel" style={{ padding: 30, textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `${a.color}15`, color: a.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                  <i className={`fa-solid ${a.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit' }}>{a.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, flex: 1 }}>{a.desc}</p>
                <span style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.9rem' }}>
                  Iniciar <i className="fa-solid fa-arrow-right" style={{ marginLeft: 6 }}></i>
                </span>
              </Link>
            ))}
          </div>

          <Footer />
        </main>
      </div>
    </>
  );
}
