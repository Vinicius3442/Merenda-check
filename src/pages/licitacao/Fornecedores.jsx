import DashboardLayout from '../../components/layout/DashboardLayout';
import { useFornecedores } from '../../hooks/useFornecedores';
import { useToast } from '../../contexts/ToastContext';

const statusColor = {
  Limpo:     'var(--alert-green)',
  Suspenso:  'var(--alert-yellow)',
  Inidôneo:  'var(--alert-red)',
};

export default function Fornecedores() {
  const { fornecedores, loading, atualizarStatusCEIS } = useFornecedores();
  const { showToast } = useToast();

  const handleSuspender = async (id, nome) => {
    const res = await atualizarStatusCEIS(id, 'Suspenso');
    if (res.ok) showToast('Sanção Aplicada', `${nome} foi suspenso no sistema CEIS. QR Codes do fornecedor revogados.`, 'warning');
    else showToast('Erro', res.error || 'Não foi possível aplicar a sanção.', 'error');
  };

  const handleRevogar = async (id, nome) => {
    const res = await atualizarStatusCEIS(id, 'Limpo');
    if (res.ok) showToast('Sanção Revogada', `${nome} reativado no sistema.`, 'success');
    else showToast('Erro', res.error || 'Não foi possível revogar a sanção.', 'error');
  };

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

        {loading ? (
          <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', marginBottom: 16 }}></i>
            <p>Carregando fornecedores...</p>
          </div>
        ) : (
          <div className="grid animate-slide-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {fornecedores.map((f) => {
              const cor = statusColor[f.status_ceis] || 'var(--text-muted)';
              return (
                <div key={f.id} className="glass-panel" style={{ padding: 24, borderTop: `4px solid ${cor}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h3 style={{ margin: '0 0 4px 0', fontFamily: 'Outfit', fontSize: '1.1rem', color: 'var(--text-main)' }}>{f.nome}</h3>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>CNPJ: {f.cnpj}</span>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        <i className="fa-solid fa-tag" style={{ marginRight: 4 }}></i>{f.categoria} · {f.uf}
                      </div>
                    </div>
                    <span className="badge" style={{ background: `${cor}20`, color: cor, border: `1px solid ${cor}`, whiteSpace: 'nowrap' }}>
                      {f.status_ceis}
                    </span>
                  </div>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 16, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Contato</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{f.contato || '—'}</div>
                    </div>
                    <div>
                      {f.status_ceis !== 'Limpo' ? (
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          onClick={() => handleRevogar(f.id, f.nome)}
                        >
                          <i className="fa-solid fa-rotate-left"></i> Revogar Sanção
                        </button>
                      ) : (
                        <button
                          className="btn btn-danger"
                          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                          onClick={() => handleSuspender(f.id, f.nome)}
                        >
                          <i className="fa-solid fa-ban"></i> Suspender
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, marginTop: 30, display: 'flex', alignItems: 'center', gap: 20 }}>
          <i className="fa-solid fa-gavel" style={{ fontSize: '2rem', color: 'var(--text-muted)' }}></i>
          <div>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>Como funciona a suspensão?</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              Ao clicar em "Suspender", a assinatura digital do fornecedor é colocada em uma CRL (Certificate Revocation List). A partir desse instante, se um caminhão dessa empresa for até a escola, a Merendeira não conseguirá dar entrada via QR Code no App, pois o lote será considerado inválido pelo sistema criptográfico.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
