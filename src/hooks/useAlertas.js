import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockAlertasAuditor } from '../data/mockData';

export function useAlertas(escolaId = null) {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchAlertas() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setAlertas(mockAlertasAuditor);
      setLoading(false);
      return;
    }

    let query = supabase
      .from('alertas')
      .select('*, escolas(nome)')
      .eq('resolvido', false)
      .order('criado_em', { ascending: false });
    if (escolaId) query = query.eq('escola_id', escolaId);

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setAlertas(mockAlertasAuditor);
    } else {
      const mapped = (data || []).map((a) => ({
        id: a.id,
        escola: a.escolas?.nome || '—',
        tipo: a.tipo,
        gravidade: a.gravidade,
        desc: a.descricao,
        data: new Date(a.criado_em).toLocaleDateString('pt-BR'),
        acao: 'Investigar',
      }));
      setAlertas(mapped);
    }
    setLoading(false);
  }

  async function resolverAlerta(id) {
    if (!isSupabaseConfigured) {
      setAlertas((prev) => prev.filter((a) => a.id !== id));
      return { ok: true };
    }
    const { error: err } = await supabase
      .from('alertas')
      .update({ resolvido: true })
      .eq('id', id);
    if (err) return { ok: false, error: err.message };
    await fetchAlertas();
    return { ok: true };
  }

  useEffect(() => {
    fetchAlertas();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('alertas-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'alertas' }, fetchAlertas)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [escolaId]);

  return { alertas, loading, error, resolverAlerta, refetch: fetchAlertas };
}
