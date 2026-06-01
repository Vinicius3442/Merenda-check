import { useState, useRef } from 'react';
import jsQR from 'jsqr';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Footer from '../../components/ui/Footer';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '../../contexts/AuthContext';
import { useEstoque } from '../../hooks/useEstoque';
import { useLotesTransporte } from '../../hooks/useLotesTransporte';
import { supabase } from '../../lib/supabase';

export default function EntradaInsumo() {
  const { inserirLote } = useEstoque();
  const { confirmarEntrega } = useLotesTransporte();
  const { showToast } = useToast();
  const { user } = useAuth();
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

  const fileInputRef = useRef(null);

  const handleSimularScan = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          showToast('QR Code Lido!', 'Buscando dados no servidor...', 'info');
          const hashLimpo = code.data.replace('merendacheck://lote/', '');
          
          supabase.from('lotes_transporte')
            .select('*, fornecedores(nome, status_ceis)')
            .eq('tx_hash', hashLimpo)
            .single()
            .then(({ data, error }) => {
              if (error || !data) {
                showToast('Erro', 'Lote não encontrado no sistema.', 'error');
                const loteCurto = hashLimpo.length > 10 ? hashLimpo.substring(0, 10).toUpperCase() : hashLimpo.toUpperCase();
                setForm(prev => ({ ...prev, lote: loteCurto }));
              } else if (data.fornecedores?.status_ceis && data.fornecedores.status_ceis !== 'Limpo') {
                showToast(
                  'Assinatura Digital Revogada', 
                  `Lote Bloqueado. O fornecedor "${data.fornecedores.nome}" está suspenso ou inidôneo no CEIS (Status: ${data.fornecedores.status_ceis}). A recepção desta carga foi impedida.`, 
                  'error'
                );
                setForm({
                  fornecedor: data.fornecedores.nome,
                  nome: '',
                  volume_kg: '',
                  validade: '',
                  observacao: `[BLOQUEADO - COMPLIANCE CEIS: ${data.fornecedores.status_ceis}]`,
                  lote: '',
                });
                if (fileInputRef.current) {
                  delete fileInputRef.current.dataset.loteId;
                }
              } else {
                const loteValor = data.nota_fiscal || (hashLimpo.length > 10 ? hashLimpo.substring(0, 10).toUpperCase() : hashLimpo.toUpperCase());
                setForm({
                  fornecedor: data.fornecedores?.nome || 'Fornecedor Desconhecido',
                  nome: data.itens?.[0]?.descricao || 'Vários itens',
                  volume_kg: data.itens?.[0]?.qtd?.toString() || '',
                  validade: data.itens?.[0]?.validade || '',
                  observacao: `Motorista: ${data.motorista} | Placa: ${data.placa}`,
                  lote: loteValor,
                });
                // Guarda o ID do lote para confirmar a entrega no submit
                if (fileInputRef.current) {
                  fileInputRef.current.dataset.loteId = data.id;
                }
                showToast('Sucesso!', 'Dados do Romaneio importados e preenchidos.', 'success');
              }
            });
        } else {
          showToast('Erro', 'Nenhum QR Code encontrado na imagem.', 'error');
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = ''; // reseta o input
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
      escola_id: user?.escola_id,
      observacao: `Fornecedor: ${form.fornecedor} | ${form.observacao}`,
      usuario_id: user?.id,
    });
    
    if (result.ok) {
      const loteId = fileInputRef.current?.dataset?.loteId;
      if (loteId) {
        await confirmarEntrega(loteId);
      }
      setLoading(false);
      showToast('Entrada Processada', 'Estoque sincronizado com sucesso.', 'success');
      setTimeout(() => navigate('/operador'), 1500);
    } else {
      setLoading(false);
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
              {/* File Input Oculto */}
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleFileUpload} 
              />
              
              {/* Scanner mockup/upload */}
              <div 
                onClick={handleSimularScan}
                style={{
                width: '100%', height: 200, borderRadius: 20, border: '2px dashed var(--primary)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(5, 150, 105, 0.05)', color: 'var(--primary)', marginBottom: 30, cursor: 'pointer',
                transition: '0.3s', fontSize: '1.1rem', gap: 10,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(5, 150, 105, 0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(5, 150, 105, 0.05)'; }}
              >
                <i className="fa-solid fa-qrcode" style={{ fontSize: '3rem' }}></i>
                <span style={{ fontWeight: 700, fontFamily: 'Outfit' }}>Toque para Enviar QR Code do Romaneio</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {form.lote ? `Lote importado: ${form.lote.substring(0, 12)}...` : 'Suporta JPG, PNG.'}
                </span>
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
      </div>
    </DashboardLayout>
  );
}
