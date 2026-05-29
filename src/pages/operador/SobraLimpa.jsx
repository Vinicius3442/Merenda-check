import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useMovimentacoes } from '../../hooks/useMovimentacoes';
import { useToast } from '../../contexts/ToastContext';

export default function SobraLimpa() {
  const { user } = useAuth();
  const { registrarSobra } = useMovimentacoes(user?.escola_id);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [pesoSobra, setPesoSobra] = useState('');
  const [motivo, setMotivo] = useState('super');
  const [justificativa, setJustificativa] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const kg = parseFloat(pesoSobra);
    if (isNaN(kg) || kg < 0) {
      showToast('Campo Obrigatório', 'Informe o peso aferido na balança.', 'error');
      return;
    }

    if (kg >= 50 && justificativa.trim().length < 10) {
      showToast('Quantidade Absurda', 'Para sobras acima de 50kg, é obrigatório preencher uma justificativa detalhada (mínimo 10 caracteres).', 'error');
      return;
    }

    const motivoTexto = {
      super: 'Estimativa Incorreta de Alunos Presentes',
      sabor: 'Rejeição por Sabor ou Aparência',
      validade: 'Alimento Preparado Inadequadamente',
    }[motivo] || motivo;

    const observacaoFinal = kg >= 50 ? `Sobra Limpa — ${motivoTexto} | Justificativa: ${justificativa}` : `Sobra Limpa — ${motivoTexto}`;

    setSubmitting(true);
    const res = await registrarSobra({
      escola_id: user?.escola_id || null,
      quantidade_kg: kg,
      observacao: observacaoFinal,
      usuario_id: user?.id || null,
    });
    setSubmitting(false);

    if (res.ok) {
      showToast('Desperdício Registrado', 'A secretaria foi notificada para ajustar o planejamento contínuo.', 'success');
      setTimeout(() => navigate('/operador'), 1500);
    } else {
      showToast('Erro ao Registrar', res.error || 'Não foi possível salvar o registro.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="wizard-container" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/operador')}><i className="fa-solid fa-arrow-left"></i> Voltar</button>
          <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ height: 40 }} />
        </div>

        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i className="fa-solid fa-scale-unbalanced" style={{ color: 'var(--alert-red)' }}></i> Registro de Sobra Limpa</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Preencha o peso da sobra das panelas (alimento pronto não servido).</p>
          </div>
        </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40, borderTop: '4px solid var(--alert-red)' }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <div style={{ width: 80, height: 80, background: 'rgba(239, 68, 68, 0.1)', color: 'var(--alert-red)', fontSize: '2.5rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', marginBottom: 16 }}>
                  <i className="fa-solid fa-scale-unbalanced"></i>
                </div>
                <h3 className="brand-font" style={{ fontSize: '1.4rem' }}>Peso Aferido na Balança</h3>
              </div>

              <div className="form-group" style={{ marginBottom: 40 }}>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    className="form-control"
                    placeholder="0.0"
                    value={pesoSobra}
                    onChange={(e) => setPesoSobra(e.target.value)}
                    style={{
                      fontSize: '4.5rem',
                      textAlign: 'center',
                      padding: '30px 80px 30px 20px',
                      borderRadius: '24px',
                      height: 'auto',
                      fontFamily: 'Outfit',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      border: '2px solid rgba(239,68,68,0.3)',
                      background: 'rgba(239,68,68,0.05)',
                      color: 'var(--alert-red)',
                      boxShadow: 'inset 0 10px 30px rgba(239,68,68,0.1)',
                      outline: 'none',
                      transition: 'all 0.3s',
                      width: '100%'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--alert-red)';
                      e.currentTarget.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.2), inset 0 10px 30px rgba(239,68,68,0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
                      e.currentTarget.style.boxShadow = 'inset 0 10px 30px rgba(239,68,68,0.1)';
                    }}
                  />
                  <span style={{
                    position: 'absolute', right: 24, fontSize: '1.5rem',
                    fontWeight: 800, color: 'var(--text-muted)', fontFamily: 'Outfit', pointerEvents: 'none',
                  }}>kg</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Motivo do Desperdício</label>
                <select className="form-control" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                  <option value="super">Estimativa Incorreta de Alunos Presentes</option>
                  <option value="sabor">Rejeição por Sabor ou Aparência</option>
                  <option value="validade">Alimento Preparado Inadequadamente</option>
                </select>
              </div>

              {parseFloat(pesoSobra) >= 50 && (
                <div className="form-group animate-slide-up" style={{ marginTop: 20 }}>
                  <label className="form-label" style={{ color: 'var(--alert-yellow)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <i className="fa-solid fa-triangle-exclamation"></i> Quantidade Atípica — Justificativa Obrigatória
                  </label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    placeholder="Explique detalhadamente o motivo deste desperdício excessivo (mínimo 10 caracteres)." 
                    value={justificativa} 
                    onChange={(e) => setJustificativa(e.target.value)}
                    style={{ borderColor: 'var(--alert-yellow)' }}
                  ></textarea>
                </div>
              )}

              <div style={{ marginTop: 40 }}>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', background: 'var(--alert-red)', boxShadow: 'var(--alert-red-glow)' }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</>
                    : <><i className="fa-solid fa-triangle-exclamation"></i> Concluir Registro</>
                  }
                </button>
              </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
