import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function SolicitarCompra() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    quantidade: '',
    unidade: 'kg',
    motivo: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!isSupabaseConfigured) {
      setTimeout(() => {
        showToast('Sucesso', 'Solicitação salva localmente (Modo Demo).', 'success');
        setFormData({ item: '', quantidade: '', unidade: 'kg', motivo: '' });
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const escolaId = user?.escola_id === 'geral' ? null : user?.escola_id;
      const { error } = await supabase.from('solicitacoes_compra').insert([{
        escola_id: escolaId,
        item: formData.item,
        quantidade: parseFloat(formData.quantidade),
        unidade: formData.unidade,
        motivo: formData.motivo,
        solicitante_id: user?.id
      }]);

      if (error) throw error;

      showToast('Sucesso', 'Solicitação de compra enviada para licitação.', 'success');
      setFormData({ item: '', quantidade: '', unidade: 'kg', motivo: '' });
    } catch (err) {
      console.error(err);
      showToast('Erro', 'Não foi possível enviar a solicitação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="header-dash animate-fade-in" style={{ marginBottom: 40 }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '2rem', background: 'linear-gradient(90deg, var(--primary), #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              <i className="fa-solid fa-cart-plus" style={{ color: 'var(--primary)', WebkitTextFillColor: 'initial' }}></i>
              Solicitar Compra
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: 8 }}>
              Envie rapidamente solicitações de compra de insumos diretamente para o setor de Licitação e Almoxarifado.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel animate-slide-up" style={{ 
          padding: 40, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 24,
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
          background: 'linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))'
        }}>
          
          <div style={{ 
            padding: '16px 20px', 
            background: 'rgba(16,185,129,0.05)', 
            borderRadius: 12, 
            borderLeft: '4px solid var(--primary)',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            lineHeight: 1.5,
            marginBottom: 10
          }}>
            <strong style={{ color: 'var(--text-main)' }}>Nota:</strong> Solicitações urgentes devem ser detalhadas no campo "Motivo". Todas as solicitações são auditadas e registradas no histórico.
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Item / Insumo Solicitado</label>
            <input 
              type="text" 
              className="form-control" 
              required 
              value={formData.item}
              onChange={e => setFormData({...formData, item: e.target.value})}
              placeholder="Ex: Arroz Agulhinha Tipo 1"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', fontSize: '1.05rem', borderRadius: 12 }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 2, margin: 0, minWidth: 200 }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Quantidade</label>
              <input 
                type="number" 
                step="0.01"
                min="0.1"
                className="form-control" 
                required 
                value={formData.quantidade}
                onChange={e => setFormData({...formData, quantidade: e.target.value})}
                placeholder="0.00"
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', fontSize: '1.05rem', borderRadius: 12 }}
              />
            </div>
            <div className="form-group" style={{ flex: 1, margin: 0, minWidth: 150 }}>
              <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Unidade de Medida</label>
              <select 
                className="form-control"
                value={formData.unidade}
                onChange={e => setFormData({...formData, unidade: e.target.value})}
                style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', fontSize: '1.05rem', borderRadius: 12, cursor: 'pointer' }}
              >
                <option value="kg">Quilogramas (kg)</option>
                <option value="l">Litros (L)</option>
                <option value="un">Unidades (un)</option>
                <option value="cx">Caixas (cx)</option>
                <option value="pct">Pacotes (pct)</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>Justificativa / Motivo</label>
            <textarea 
              className="form-control" 
              required 
              rows="4"
              value={formData.motivo}
              onChange={e => setFormData({...formData, motivo: e.target.value})}
              placeholder="Explique a necessidade (ex: Cardápio especial, reposição por perda de validade, etc.)"
              style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 16px', fontSize: '1.05rem', borderRadius: 12, resize: 'vertical' }}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ 
            alignSelf: 'flex-end', 
            padding: '14px 32px', 
            fontSize: '1.1rem', 
            fontWeight: 700,
            borderRadius: 12,
            marginTop: 10,
            boxShadow: '0 10px 20px -10px var(--primary)'
          }}>
            {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
            {loading ? ' Enviando...' : ' Confirmar Solicitação'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
