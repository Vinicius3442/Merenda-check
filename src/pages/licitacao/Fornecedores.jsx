import DashboardLayout from '../../components/layout/DashboardLayout';

export default function Fornecedores() {
  const fornecedores = [
    { cnpj: '10.432.***/0001', nome: 'AgroSul Alimentos SA', status: 'Ativo', color: 'var(--alert-green)' },
    { cnpj: '44.591.***/0001', nome: 'LaticíniosBom Sabor Ltda.', status: 'Advertência', color: 'var(--alert-yellow)', score: 82 },
    { cnpj: '11.092.***/0001', nome: 'CerealBrasil Distribuidora', status: 'Ativo', color: 'var(--alert-green)', score: 99 },
    { cnpj: '08.111.***/0001', nome: 'Frigorífico Boi Gordo', status: 'Suspenso', color: 'var(--alert-red)', score: 45 },
  ];

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-truck" style={{ color: 'var(--primary)' }}></i>
            Gestão de Fornecedores
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Painel de compliance e desempenho (SLA). Suspensões cautelares aplicadas aqui revogam assinaturas digitais na ponta.
          </p>
        </div>
        <div>
          <button className="btn btn-secondary"><i className="fa-solid fa-download"></i> Relatório de Compliance</button>
        </div>
      </div>

      <div className="grid animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
        {fornecedores.map((f, i) => (
          <div key={i} className="glass-panel" style={{ padding: 24, borderTop: `4px solid ${f.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit', fontSize: '1.2rem', color: 'var(--text-main)' }}>{f.nome}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>CNPJ: {f.cnpj}</span>
              </div>
              <span className="badge" style={{ background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}` }}>{f.status}</span>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Score Operacional</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: f.score ? 'var(--text-main)' : 'var(--text-muted)' }}>
                  {f.score || 'N/A'} {f.score && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/ 100</span>}
                </div>
              </div>
              <div>
                {f.status === 'Suspenso' ? (
                   <button className="btn btn-secondary" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                     <i className="fa-solid fa-rotate-left"></i> Revogar Sanção
                   </button>
                ) : (
                  <button className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '0.85rem' }}>
                    <i className="fa-solid fa-ban"></i> Suspender
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, marginTop: 30, display: 'flex', alignItems: 'center', gap: 20 }}>
        <i className="fa-solid fa-gavel" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
        <div>
          <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>Como funciona a suspensão?</h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Ao clicar em "Suspender", a assinatura digital do fornecedor é colocada em uma CRL (Certificate Revocation List). A partir desse instante, se um caminhão dessa empresa for até a escola, a Merendeira não conseguirá dar entrada via QR Code no App, pois o lote será considerado inválido pelo Blockchain.
          </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
