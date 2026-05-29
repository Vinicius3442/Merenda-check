import { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRefeicoes } from '../../hooks/useRefeicoes';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';

export default function RegistrarRefeicao() {
  const { registrarRefeicao } = useRefeicoes();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quantidade, setQuantidade] = useState('');

  const handleSubmit = async () => {
    if (!quantidade || parseInt(quantidade) <= 0) {
      showToast('Campo Obrigatório', 'Informe a quantidade de refeições servidas.', 'error');
      return;
    }
    setLoading(true);
    const result = await registrarRefeicao({ total_servidos: parseInt(quantidade) });
    setLoading(false);

    if (result.ok) {
      showToast('Sistema Sincronizado', 'Base de dados do refeitório atualizada com sucesso.', 'success');
      setQuantidade('');
    } else {
      showToast('Erro ao Registrar', result.error || 'Tente novamente.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="wizard-container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <Link to="/operador" className="btn btn-secondary"><i className="fa-solid fa-arrow-left"></i> Voltar</Link>
          <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ height: 40 }} />
        </div>

        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i className="fa-solid fa-users" style={{ color: 'var(--primary)' }}></i> Apontamento Manual</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Utilize este recurso em caso de falha da roleta biométrica do refeitório.</p>
          </div>
        </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ width: 80, height: 80, background: 'rgba(5, 150, 105, 0.1)', color: 'var(--primary)', fontSize: '2.5rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', marginBottom: 16 }}>
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="brand-font" style={{ fontSize: '1.4rem' }}>Quantidade Estimada Servida</h3>
              </div>

              <div className="form-group" style={{ marginBottom: 40 }}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="000"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  min="0"
                  style={{
                    fontSize: '4.5rem',
                    textAlign: 'center',
                    padding: '30px 20px',
                    borderRadius: '24px',
                    height: 'auto',
                    fontFamily: 'Outfit',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    border: '2px solid rgba(16,185,129,0.3)',
                    background: 'rgba(16,185,129,0.05)',
                    color: 'var(--primary)',
                    boxShadow: 'inset 0 10px 30px rgba(16,185,129,0.1)',
                    outline: 'none',
                    transition: 'all 0.3s'
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16,185,129,0.2), inset 0 10px 30px rgba(16,185,129,0.1)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)';
                    e.currentTarget.style.boxShadow = 'inset 0 10px 30px rgba(16,185,129,0.1)';
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nome do Supervisor / Responsável Legal</label>
                <input type="text" className="form-control" value={`${user?.name || 'Operador Local'}`} readOnly />
              </div>

              <div style={{ marginTop: 40 }}>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', padding: 18, fontSize: '1.1rem' }}
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-cloud-arrow-up"></i> Confirmar Quantidade</>}
                </button>
              </div>
            </div>
      </div>
    </DashboardLayout>
  );
}
