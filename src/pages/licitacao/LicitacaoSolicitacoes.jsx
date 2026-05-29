import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function LicitacaoSolicitacoes() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [solicitacoes, setSolicitacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchSolicitacoes();
  }, []);

  const fetchSolicitacoes = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('solicitacoes_compra')
        .select(`
          id, item, quantidade, unidade, motivo, status, criado_em,
          escolas (nome),
          usuarios (nome)
        `)
        .order('criado_em', { ascending: false });

      if (error) throw error;
      if (data) setSolicitacoes(data);
    } catch (err) {
      console.error(err);
      showToast('Erro', 'Não foi possível carregar as solicitações.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, newStatus) => {
    if (!isSupabaseConfigured) return;
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('solicitacoes_compra')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Log in audit_trail
      await supabase.from('audit_trail').insert({
        usuario_id: user.id,
        usuario_email: user.email,
        acao: 'UPDATE_SOLICITACAO',
        tabela_afetada: 'solicitacoes_compra',
        registro_id: id,
        dados_novos: { status: newStatus }
      });

      showToast('Sucesso', `Solicitação ${newStatus} com sucesso. Log de auditoria registrado.`, 'success');
      fetchSolicitacoes();
    } catch (err) {
      console.error(err);
      showToast('Erro', 'Não foi possível atualizar a solicitação.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="header-dash animate-fade-in" style={{ marginBottom: 30 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-file-invoice" style={{ color: 'var(--alert-yellow)' }}></i>
            Aprovação de Solicitações de Compra
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Gerencie os pedidos de insumos enviados pelo setor de Nutrição.
          </p>
        </div>

        <div className="glass-panel animate-slide-up" style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><i className="fa-solid fa-spinner fa-spin"></i> Carregando...</div>
          ) : solicitacoes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhuma solicitação encontrada no banco de dados.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {solicitacoes.map(sol => (
                <div key={sol.id} style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: 16, padding: 20,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--text-main)' }}>{sol.item}</h3>
                      <span style={{ 
                        background: sol.status === 'aprovado' ? 'rgba(16,185,129,0.1)' : sol.status === 'rejeitado' ? 'rgba(244,63,94,0.1)' : 'rgba(251,191,36,0.1)',
                        color: sol.status === 'aprovado' ? 'var(--primary)' : sol.status === 'rejeitado' ? 'var(--alert-red)' : 'var(--alert-yellow)',
                        padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {sol.status}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                      <strong>Quantidade:</strong> {sol.quantidade} {sol.unidade}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                      <strong>Motivo:</strong> {sol.motivo}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 10 }}>
                      <i className="fa-solid fa-user" style={{ marginRight: 6 }}></i> {sol.usuarios?.nome || 'Nutricionista'} &nbsp;|&nbsp;
                      <i className="fa-solid fa-school" style={{ marginRight: 6, marginLeft: 10 }}></i> {sol.escolas?.nome || 'Geral'}
                    </div>
                  </div>

                  {sol.status === 'pendente' && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleAction(sol.id, 'rejeitado')}
                        disabled={actionLoading === sol.id}
                        style={{ color: 'var(--alert-red)', borderColor: 'rgba(244,63,94,0.3)' }}
                      >
                        <i className="fa-solid fa-xmark"></i> Rejeitar
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleAction(sol.id, 'aprovado')}
                        disabled={actionLoading === sol.id}
                      >
                        <i className="fa-solid fa-check"></i> Aprovar Pedido
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
