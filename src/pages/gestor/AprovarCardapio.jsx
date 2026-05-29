import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AprovarCardapio() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [cardapios, setCardapios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchCardapios();
  }, []);

  const fetchCardapios = async () => {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    try {
      // O Gestor vê os cardápios da escola dele ou os gerais
      let query = supabase
        .from('cardapios')
        .select(`
          id, semana, plano, status, criado_em,
          escolas (nome),
          usuarios (nome)
        `)
        .order('criado_em', { ascending: false });

      if (user?.escola_id) {
        query = query.or(`escola_id.eq.${user.escola_id},escola_id.is.null`);
      }

      const { data, error } = await query;
      if (error) throw error;
      if (data) setCardapios(data);
    } catch (err) {
      console.error(err);
      showToast('Erro', 'Não foi possível carregar os cardápios.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, newStatus) => {
    if (!isSupabaseConfigured) return;
    setActionLoading(id);
    try {
      const { error } = await supabase
        .from('cardapios')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      // Log in audit_trail
      await supabase.from('audit_trail').insert({
        usuario_id: user.id,
        usuario_email: user.email,
        acao: 'UPDATE_CARDAPIO_STATUS',
        tabela_afetada: 'cardapios',
        registro_id: id,
        dados_novos: { status: newStatus }
      });

      showToast('Sucesso', `Cardápio ${newStatus} com sucesso. Ação registrada no Rastreabilidade TI.`, 'success');
      fetchCardapios();
    } catch (err) {
      console.error(err);
      showToast('Erro', 'Não foi possível atualizar o cardápio.', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="header-dash animate-fade-in" style={{ marginBottom: 30 }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-calendar-check" style={{ color: 'var(--primary)' }}></i>
            Aprovação de Cardápios
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Como Gestor Escolar, você precisa validar e aprovar os cardápios criados pelo setor de Nutrição.
          </p>
        </div>

        <div className="glass-panel animate-slide-up" style={{ padding: 24 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40 }}><i className="fa-solid fa-spinner fa-spin"></i> Carregando...</div>
          ) : cardapios.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>Nenhum cardápio pendente de aprovação.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {cardapios.map(card => (
                <div key={card.id} style={{ 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: 16, padding: 20,
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                      <h3 style={{ margin: 0, fontFamily: 'Outfit', color: 'var(--text-main)' }}>Semana: {card.semana}</h3>
                      <span style={{ 
                        background: card.status === 'aprovado' ? 'rgba(16,185,129,0.1)' : card.status === 'rejeitado' ? 'rgba(244,63,94,0.1)' : 'rgba(251,191,36,0.1)',
                        color: card.status === 'aprovado' ? 'var(--primary)' : card.status === 'rejeitado' ? 'var(--alert-red)' : 'var(--alert-yellow)',
                        padding: '4px 10px', borderRadius: 8, fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase'
                      }}>
                        {card.status || 'pendente'}
                      </span>
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 4 }}>
                      <strong>Unidade:</strong> {card.escolas?.nome || 'Rede Geral (Todas as Escolas)'}
                    </div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 10 }}>
                      <i className="fa-solid fa-user-md" style={{ marginRight: 6 }}></i> Nutricionista: {card.usuarios?.nome || 'Desconhecido'} &nbsp;|&nbsp;
                      <i className="fa-solid fa-clock" style={{ marginRight: 6, marginLeft: 10 }}></i> {new Date(card.criado_em).toLocaleDateString()}
                    </div>
                  </div>

                  {(card.status === 'pendente' || !card.status) && (
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleAction(card.id, 'rejeitado')}
                        disabled={actionLoading === card.id}
                        style={{ color: 'var(--alert-red)', borderColor: 'rgba(244,63,94,0.3)' }}
                      >
                        <i className="fa-solid fa-xmark"></i> Rejeitar
                      </button>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleAction(card.id, 'aprovado')}
                        disabled={actionLoading === card.id}
                      >
                        <i className="fa-solid fa-check"></i> Aprovar Cardápio
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
