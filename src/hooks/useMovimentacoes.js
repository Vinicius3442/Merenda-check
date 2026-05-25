import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockMovimentacoes = [
  { id: '1', tipo: 'entrada',      quantidade_kg: 100, observacao: 'Recebimento romaneio AgroSul',       criado_em: new Date(Date.now() - 86400000 * 3).toISOString(), escola: { nome: 'CEI Pequeninos' }, usuario: { nome: 'Maria Silva' }, lote: { nome: 'Carne Moída Bovina', lote: '#4920-A' } },
  { id: '2', tipo: 'baixa',        quantidade_kg: 15,  observacao: 'Retirada para Cozinha — Almoço',    criado_em: new Date(Date.now() - 86400000 * 2).toISOString(), escola: { nome: 'CEI Pequeninos' }, usuario: { nome: 'Maria Silva' }, lote: { nome: 'Carne Moída Bovina', lote: '#4920-A' } },
  { id: '3', tipo: 'sobra',        quantidade_kg: 2.4, observacao: 'Sobra limpa — excedente de produção', criado_em: new Date(Date.now() - 86400000 * 1).toISOString(), escola: { nome: 'EMEF João Silva' }, usuario: { nome: 'Carlos Roberto' }, lote: null },
  { id: '4', tipo: 'remanejamento',quantidade_kg: 20,  observacao: 'Remanejamento para CEI Pequeninos',  criado_em: new Date().toISOString(),                          escola: { nome: 'EMEI Margarida' }, usuario: { nome: 'Sônia T.' }, lote: { nome: 'Leite Integral UHT', lote: '#6210-L' } },
];

export function useMovimentacoes(escolaId = null) {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchMovimentacoes() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      const filtered = escolaId
        ? mockMovimentacoes.filter((m) => m.escola?.nome?.includes(escolaId))
        : mockMovimentacoes;
      setMovimentacoes(filtered);
      setLoading(false);
      return;
    }

    let query = supabase
      .from('movimentacoes')
      .select('*, escolas!movimentacoes_escola_id_fkey(nome), usuarios(nome), estoque(nome, lote)')
      .order('criado_em', { ascending: false })
      .limit(100);

    if (escolaId) query = query.eq('escola_id', escolaId);

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setMovimentacoes(mockMovimentacoes);
    } else {
      const mapped = (data || []).map((m) => ({
        ...m,
        escola: m.escolas || {},
        usuario: m.usuarios || {},
        lote: m.estoque || null,
      }));
      setMovimentacoes(mapped);
    }
    setLoading(false);
  }

  async function registrarSobra({ estoque_id, escola_id, quantidade_kg, observacao, usuario_id }) {
    if (!isSupabaseConfigured) {
      const nova = {
        id: String(Date.now()), tipo: 'sobra', quantidade_kg, observacao,
        criado_em: new Date().toISOString(), escola: { nome: 'Escola' }, usuario: { nome: 'Usuário' }, lote: null,
      };
      setMovimentacoes((prev) => [nova, ...prev]);
      return { ok: true };
    }
    const { error: err } = await supabase.from('movimentacoes').insert([{
      estoque_id: estoque_id || null,
      escola_id: escola_id || null,
      tipo: 'sobra',
      quantidade_kg,
      observacao,
      usuario_id: usuario_id || null,
    }]);
    if (err) return { ok: false, error: err.message };
    await fetchMovimentacoes();
    return { ok: true };
  }

  async function registrarSaida({ estoque_id, escola_id, escola_destino_id, quantidade_kg, observacao, usuario_id }) {
    if (!isSupabaseConfigured) {
      const nova = {
        id: String(Date.now()), tipo: 'remanejamento', quantidade_kg, observacao,
        criado_em: new Date().toISOString(), escola: { nome: 'Escola' }, usuario: { nome: 'Usuário' }, lote: null,
      };
      setMovimentacoes((prev) => [nova, ...prev]);
      return { ok: true };
    }
    const { error: err } = await supabase.from('movimentacoes').insert([{
      estoque_id: estoque_id || null,
      escola_id: escola_id || null,
      escola_destino_id: escola_destino_id || null,
      tipo: 'remanejamento',
      quantidade_kg,
      observacao,
      usuario_id: usuario_id || null,
    }]);
    if (err) return { ok: false, error: err.message };
    await fetchMovimentacoes();
    return { ok: true };
  }

  useEffect(() => {
    fetchMovimentacoes();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('movimentacoes-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'movimentacoes' }, fetchMovimentacoes)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [escolaId]);

  return { movimentacoes, loading, error, registrarSobra, registrarSaida, refetch: fetchMovimentacoes };
}
