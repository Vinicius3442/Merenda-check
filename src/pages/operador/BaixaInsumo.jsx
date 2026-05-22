import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import BgMesh from '../../components/ui/BgMesh';
import Footer from '../../components/ui/Footer';
import { useAuth } from '../../contexts/AuthContext';
import { useEstoque } from '../../hooks/useEstoque';
import { useToast } from '../../contexts/ToastContext';
import { useEffect } from 'react';

export default function BaixaInsumo() {
  const { user } = useAuth();
  const { estoque, loading: loadingEstoque, baixarEstoque } = useEstoque(user?.escola_id);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetId = searchParams.get('id');

  const [selectedId, setSelectedId] = useState(presetId || null);
  const [quantidade, setQuantidade] = useState('');
  const [observacao, setObservacao] = useState('Retirada para Cozinha');
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (presetId) {
      setSelectedId(presetId);
    }
  }, [presetId]);

  const selected = estoque.find((i) => String(i.id) === String(selectedId));

  const filteredEstoque = estoque.filter((item) => {
    const matchesSearch = item.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.lote.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && item.status !== 'arquivado';
  });

  const formatValidade = (dateStr, status) => {
    if (!dateStr) return status === 'arquivado' ? 'Consumido na Íntegra' : '—';
    const d = new Date(dateStr);
    const diff = Math.ceil((d - new Date()) / 86400000);
    if (diff < 0) return 'Vencido';
    if (diff === 0) return 'Vence Hoje';
    if (diff <= 7) return `Vence em ${diff} Dia${diff > 1 ? 's' : ''}`;
    return `Vence em ${diff} Dias`;
  };

  const handleAutorizar = async () => {
    if (!selected) return;

    const volumeDisponivel = parseFloat(selected.volume_kg) || 0;
    const qt = parseFloat(quantidade);

    if (isNaN(qt) || qt <= 0) {
      showToast('Erro de Validação', 'Insira uma quantidade maior que zero.', 'error');
      return;
    }

    if (qt > volumeDisponivel) {
      showToast('Erro de Validação', `Quantidade máxima disponível: ${volumeDisponivel} kg.`, 'error');
      return;
    }

    setSubmitting(true);
    const res = await baixarEstoque(selected.id, qt, observacao, user?.id);
    setSubmitting(false);

    if (res.ok) {
      showToast('Despacho Validado', 'Saída registrada. Estoque atualizado com sucesso.', 'success');
      setTimeout(() => {
        navigate('/operador');
      }, 1500);
    } else {
      showToast('Erro ao Baixar Estoque', res.error || 'Não foi possível registrar a baixa.', 'error');
    }
  };

  return (
    <>
      <BgMesh />
      <div className="app-container">
        <main className="app-main" style={{ paddingTop: 60 }}>
          <div className="wizard-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
              <Link to="/operador" className="btn btn-secondary"><i className="fa-solid fa-arrow-left"></i> Voltar</Link>
              <img src="/logo.png" alt="Merenda Check" className="logo-img" />
            </div>

            <div className="header-dash animate-fade-in">
              <div>
                <h1>Retirar para Cozinha</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Lista restrita por data de validade (Sistema FIFO ativo).</p>
              </div>
            </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              <div className="search-mock">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Procurar Insumo (Ex: Carne, Arroz...)" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {loadingEstoque ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-circle-notch fa-spin fa-2x" style={{ marginBottom: 10, color: 'var(--primary)' }}></i>
                  <p>Carregando estoque da escola...</p>
                </div>
              ) : filteredEstoque.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  <i className="fa-solid fa-box-open fa-2x" style={{ marginBottom: 10 }}></i>
                  <p>Nenhum insumo elegível disponível no momento.</p>
                </div>
              ) : (
                <div className="inventory-list">
                  {filteredEstoque.map((item) => (
                    <div
                      key={item.id}
                      className={`inv-item ${String(selectedId) === String(item.id) ? 'selected' : ''} ${!item.eligible ? 'locked' : ''}`}
                      onClick={() => item.eligible && setSelectedId(item.id)}
                    >
                      <div>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: 4 }}>{item.nome} - Lote {item.lote}</h4>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <i className="fa-solid fa-cube" style={{ marginRight: 4 }}></i> Disponível: {parseFloat(item.volume_kg || 0).toFixed(1)} kg
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${item.status === 'urgente' ? 'badge-warning' : 'badge-neutral'}`} style={{ marginBottom: 4 }}>
                          {item.status === 'urgente' && <i className="fa-solid fa-hourglass-end" style={{ marginRight: 4 }}></i>}
                          {formatValidade(item.validade, item.status)}
                        </span>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: item.eligible ? 'var(--primary)' : 'var(--alert-red)' }}>
                          <i className={`fa-solid ${item.eligible ? 'fa-unlock' : 'fa-lock'}`}></i>{' '}
                          {item.eligible ? 'Elegível' : 'Retido pelo FIFO'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selected && (
                <div className="baixa-area active">
                  <h3 className="brand-font" style={{ marginBottom: 20 }}>
                    <i className="fa-solid fa-fire-burner" style={{ color: 'var(--primary)', marginRight: 10 }}></i> Ordem de Envio
                  </h3>
                  <div className="form-group" style={{ marginBottom: 15 }}>
                    <label className="form-label">Insumo Selecionado</label>
                    <input type="text" className="form-control" value={`${selected.nome} (Lote: ${selected.lote})`} readOnly />
                  </div>
                  <div className="form-group" style={{ marginBottom: 15 }}>
                    <label className="form-label">Quantidade para Despacho (kg)</label>
                    <input 
                      type="number" 
                      step="any"
                      className="form-control" 
                      placeholder={`Inserir valor em kg (máx. ${parseFloat(selected.volume_kg || 0).toFixed(1)} kg)...`} 
                      max={selected.volume_kg}
                      value={quantidade}
                      onChange={(e) => setQuantidade(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Finalidade / Observações</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Ex: Almoço de hoje - Galinhada"
                      value={observacao}
                      onChange={(e) => setObservacao(e.target.value)}
                    />
                  </div>
                  <div style={{ marginTop: 30, textAlign: 'right' }}>
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleAutorizar}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <i className="fa-solid fa-circle-notch fa-spin"></i> Processando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-check"></i> Autorizar Remoção
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <Footer />
        </main>
      </div>
    </>
  );
}
