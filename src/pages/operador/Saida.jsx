import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useEstoque } from '../../hooks/useEstoque';
import { useMovimentacoes } from '../../hooks/useMovimentacoes';
import { useEscolas } from '../../hooks/useEscolas';
import { useToast } from '../../contexts/ToastContext';

export default function Saida() {
  const { user } = useAuth();
  const { estoque } = useEstoque(user?.escola_id);
  const { escolas } = useEscolas();
  const { registrarSaida } = useMovimentacoes(user?.escola_id);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [motivo, setMotivo] = useState('transferencia');
  const [destinatario, setDestinatario] = useState('');
  const [estoqueId, setEstoqueId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const escolaDestino = escolas.find((e) => e.id === destinatario);
  const lotesSelecionaveis = estoque.filter((e) => e.status !== 'arquivado' && e.volume_kg > 0);
  const loteSelecionado = estoque.find((e) => e.id === estoqueId);

  const motivoLabels = {
    transferencia: 'Transferência entre Escolas (Equilíbrio Inteligente IA)',
    devolucao:     'Devolução Fornecedor (Defeito Organoléptico)',
    recolhimento:  'Recolhimento Secretaria Sede',
  };

  const handleSubmit = async () => {
    if (!estoqueId) {
      showToast('Seleção Obrigatória', 'Selecione um insumo para a saída.', 'error');
      return;
    }
    const qt = parseFloat(quantidade);
    if (isNaN(qt) || qt <= 0) {
      showToast('Quantidade Inválida', 'Informe uma quantidade válida maior que zero.', 'error');
      return;
    }
    if (qt > (loteSelecionado?.volume_kg || 0)) {
      showToast('Quantidade Inválida', `Máximo disponível: ${loteSelecionado?.volume_kg} kg.`, 'error');
      return;
    }

    setSubmitting(true);
    const res = await registrarSaida({
      estoque_id: estoqueId,
      escola_id: user?.escola_id || null,
      escola_destino_id: destinatario || null,
      quantidade_kg: qt,
      observacao: `${motivoLabels[motivo] || motivo}${escolaDestino ? ` — Destino: ${escolaDestino.nome}` : ''}`,
      usuario_id: user?.id || null,
    });
    setSubmitting(false);

    if (res.ok) {
      showToast('Manifesto Gerado', 'A guia de remessa eletrônica foi despachada para o motorista.', 'success');
      setTimeout(() => navigate('/operador'), 1500);
    } else {
      showToast('Erro ao Registrar', res.error || 'Não foi possível registrar a saída.', 'error');
    }
  };

  return (
    <DashboardLayout>
      <div className="wizard-container" style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <button className="btn btn-secondary" onClick={() => navigate('/operador')}><i className="fa-solid fa-arrow-left"></i> Voltar</button>
          <img src="/logo.png" alt="Merenda Check" className="logo-img" style={{ height: 40 }} />
        </div>

        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i className="fa-solid fa-truck-fast" style={{ color: 'var(--alert-blue)' }}></i> Transferência Externa / Remanejamento</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Comunique a saída física de mercadorias para o Pátio Central ou outra Unidade.</p>
          </div>
        </div>

            <div className="glass-panel invoice-card animate-slide-up" style={{ padding: 32 }}>

              <div className="form-group">
                <label className="form-label">Motivo de Remanejamento</label>
                <select className="form-control" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                  <option value="transferencia">Transferência entre Escolas (Equilíbrio Inteligente IA)</option>
                  <option value="devolucao">Devolução Fornecedor (Defeito Organoléptico)</option>
                  <option value="recolhimento">Recolhimento Secretaria Sede</option>
                </select>
              </div>

              {motivo === 'transferencia' && (
                <div className="form-group">
                  <label className="form-label">Escola Destinatária</label>
                  <select className="form-control" value={destinatario} onChange={(e) => setDestinatario(e.target.value)}>
                    <option value="">Selecione a escola de destino...</option>
                    {escolas.map((e) => (
                      <option key={e.id} value={e.id}>{e.nome}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Insumo para Transferência</label>
                <select className="form-control" value={estoqueId} onChange={(e) => setEstoqueId(e.target.value)}>
                  <option value="">Selecione o insumo...</option>
                  {lotesSelecionaveis.map((l) => (
                    <option key={l.id} value={l.id}>{l.nome} — Lote {l.lote} ({parseFloat(l.volume_kg).toFixed(1)} kg disponíveis)</option>
                  ))}
                </select>
              </div>

              {estoqueId && (
                <div className="form-group" style={{ marginBottom: 30 }}>
                  <label className="form-label">Quantidade (kg)</label>
                  <input
                    type="number"
                    step="any"
                    min="0.1"
                    max={loteSelecionado?.volume_kg}
                    className="form-control"
                    placeholder={`Máx. ${parseFloat(loteSelecionado?.volume_kg || 0).toFixed(1)} kg`}
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </div>
              )}

              {/* Preview do lote selecionado */}
              {loteSelecionado && (
                <div className="table-wrapper" style={{ marginBottom: 24 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Insumo Autuado</th>
                        <th>Hash (Assinatura SHA-256)</th>
                        <th>Volume Disponível</th>
                        <th>Quantidade Transferida</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{loteSelecionado.nome}</td>
                        <td style={{ fontFamily: 'monospace' }}>{loteSelecionado.lote}</td>
                        <td>{parseFloat(loteSelecionado.volume_kg).toFixed(1)} kg</td>
                        <td style={{ color: quantidade ? 'var(--primary)' : 'var(--text-muted)', fontWeight: 700 }}>
                          {quantidade ? `${quantidade} kg` : '—'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: 20, textAlign: 'right' }}>
                <button
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting
                    ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</>
                    : <><i className="fa-solid fa-truck-fast"></i> Validar Saída (Guia GNRE)</>
                  }
                </button>
              </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
