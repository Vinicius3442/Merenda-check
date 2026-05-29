import { useState, useRef } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Footer from '../../components/ui/Footer';
import { useEstoque } from '../../hooks/useEstoque';
import { useToast } from '../../contexts/ToastContext';

export default function EntradaInsumo() {
  const { inserirLote } = useEstoque();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fornecedor: '',
    nome: '',
    volume_kg: '',
    validade: '',
    observacao: '',
    lote: '',
  });

  const handleSimularScan = () => {
    setForm({
      fornecedor: 'AgroSul Alimentos SA',
      nome: 'Carne Moída Bovina - Int. Nacional',
      volume_kg: '100',
      validade: '2026-06-15',
      observacao: 'Lote íntegro, aferição de temperatura OK.',
      lote: `#${Math.floor(Math.random() * 9000 + 1000)}-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    });
    showToast('Lote Identificado', 'Dados do fornecedor importados via QR Code.', 'success');
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.nome || !form.lote || !form.volume_kg) {
      showToast('Campos Obrigatórios', 'Preencha ou escaneie o insumo.', 'error');
      return;
    }
    setLoading(true);
    const result = await inserirLote({
      nome: form.nome,
      lote: form.lote,
      volume_kg: parseFloat(form.volume_kg),
      validade: form.validade,
    });
    setLoading(false);

    if (result.ok) {
      showToast('Entrada Processada', 'Estoque sincronizado com sucesso.', 'success');
      setTimeout(() => navigate('/operador'), 1500);
    } else {
      showToast('Erro ao Registrar', result.error || 'Tente novamente.', 'error');
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
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}><i className="fa-solid fa-qrcode" style={{ color: 'var(--primary)' }}></i> Recepção de Insumo</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Escaneie a QR Code do Romaneio de transporte para importar os dados do lote automaticamente.</p>
          </div>
        </div>

            <div className="glass-panel animate-slide-up" style={{ padding: 40 }}>
              {/* Scanner mockup */}
              <div 
                onClick={handleSimularScan}
                style={{
                width: '100%', height: 200, borderRadius: 20, border: '2px dashed var(--primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5, 150, 105, 0.05)', color: 'var(--primary)', marginBottom: 30, cursor: 'pointer',
                transition: '0.3s', fontSize: '1.1rem', gap: 10,
              }}>
                <i className="fa-solid fa-qrcode" style={{ fontSize: '3rem' }}></i>
                <span style={{ fontWeight: 700, fontFamily: 'Outfit' }}>Toque para Escanear QR Code</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Lote pré-preenchido: {form.lote}</span>
              </div>

              <div className="form-group">
                <label className="form-label">Fornecedor</label>
                <input name="fornecedor" type="text" className="form-control" value={form.fornecedor} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Produto / Insumo</label>
                <input name="nome" type="text" className="form-control" value={form.nome} onChange={handleChange} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Peso Conferido (kg)</label>
                  <input name="volume_kg" type="number" className="form-control" value={form.volume_kg} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Data de Validade</label>
                  <input name="validade" type="date" className="form-control" value={form.validade} onChange={handleChange} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Observação (Opcional)</label>
                <textarea name="observacao" className="form-control" rows="3" placeholder="Anomalias na embalagem, temperatura, etc." value={form.observacao} onChange={handleChange}></textarea>
              </div>

              <div style={{ marginTop: 30, textAlign: 'right' }}>
                <button
                  className="btn btn-primary btn-lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</> : <><i className="fa-solid fa-check"></i> Confirmar Entrada</>}
                </button>
              </div>
      </div>
    </DashboardLayout>
  );
}
