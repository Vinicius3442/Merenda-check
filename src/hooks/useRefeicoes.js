import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockRefeicoes = [
  { id: '1', total_servidos: 412, resto_kg: 2.4, data_ref: new Date().toISOString().split('T')[0], turno: 'almoco' },
  { id: '2', total_servidos: 380, resto_kg: 1.8, data_ref: new Date(Date.now() - 86400000).toISOString().split('T')[0], turno: 'almoco' },
];

export function useRefeicoes(escolaId = null) {
  const [refeicoes, setRefeicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchRefeicoes() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setRefeicoes(mockRefeicoes);
      setLoading(false);
      return;
    }

    let query = supabase
      .from('refeicoes')
      .select('*')
      .order('criado_em', { ascending: false })
      .limit(30);
    if (escolaId) query = query.eq('escola_id', escolaId);

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setRefeicoes(mockRefeicoes);
    } else {
      setRefeicoes(data || []);
    }
    setLoading(false);
  }

  async function registrarRefeicao({ total_servidos, resto_kg, escola_id, turno = 'almoco' }) {
    if (!isSupabaseConfigured) {
      const nova = {
        id: Date.now(),
        total_servidos,
        resto_kg: resto_kg || 0,
        data_ref: new Date().toISOString().split('T')[0],
        turno,
      };
      setRefeicoes((prev) => [nova, ...prev]);
      return { ok: true };
    }

    const { error: err } = await supabase.from('refeicoes').insert([
      { total_servidos, resto_kg: resto_kg || 0, escola_id, turno },
    ]);
    if (err) return { ok: false, error: err.message };
    await fetchRefeicoes();
    return { ok: true };
  }

  useEffect(() => {
    fetchRefeicoes();
  }, [escolaId]);

  return { refeicoes, loading, error, registrarRefeicao, refetch: fetchRefeicoes };
}
