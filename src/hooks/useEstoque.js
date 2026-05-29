import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockEstoque } from '../data/mockData';

function parseMock(mock) {
  return mock.map((m) => ({
    id: String(m.id),
    lote: m.lote,
    hash: m.hash,
    nome: m.nome,
    volume_kg: m.maxValue,
    status: m.status,
    eligible: m.eligible,
    validade: null,
    escola_id: null,
  }));
}

export function useEstoque(escolaId = null) {
  const [estoque, setEstoque] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchEstoque() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setEstoque(parseMock(mockEstoque));
      setLoading(false);
      return;
    }

    let query = supabase.from('estoque').select('*').order('criado_em', { ascending: false });
    if (escolaId) query = query.eq('escola_id', escolaId);

    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
      setEstoque(parseMock(mockEstoque));
    } else {
      setEstoque(data || []);
    }
    setLoading(false);
  }

  async function inserirLote({ nome, lote, volume_kg, validade, escola_id, observacao = 'Entrada via QR Code', usuario_id = null }) {
    if (!isSupabaseConfigured) {
      const novo = { id: Date.now(), lote, hash: '0xMOCK', nome, volume_kg, status: 'normal', eligible: true, validade };
      setEstoque((prev) => [novo, ...prev]);
      return { ok: true };
    }
    const { data: novoItem, error: err } = await supabase.from('estoque').insert([
      { nome, lote, volume_kg, validade, escola_id, status: 'normal', eligible: true },
    ]).select().single();
    
    if (err) return { ok: false, error: err.message };

    const { error: errMov } = await supabase.from('movimentacoes').insert([
      {
        estoque_id: novoItem.id,
        escola_id,
        tipo: 'entrada',
        quantidade_kg: volume_kg,
        observacao,
        usuario_id,
      },
    ]);
    
    if (errMov) console.error('Erro ao gravar movimentação de entrada:', errMov);
    await fetchEstoque();
    return { ok: true };
  }

  async function atualizarStatus(id, status) {
    if (!isSupabaseConfigured) {
      setEstoque((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)));
      return { ok: true };
    }
    const { error: err } = await supabase.from('estoque').update({ status }).eq('id', id);
    if (err) return { ok: false, error: err.message };
    await fetchEstoque();
    return { ok: true };
  }

  async function baixarEstoque(id, quantidade, observacao = 'Retirada para Cozinha', usuarioId = null) {
    const qt = parseFloat(quantidade);
    if (!isSupabaseConfigured) {
      setEstoque((prev) =>
        prev.map((e) => {
          if (String(e.id) === String(id)) {
            const vol = e.volume_kg || parseFloat(e.volume) || 0;
            const novoVolume = Math.max(0, vol - qt);
            return {
              ...e,
              volume_kg: novoVolume,
              volume: `${novoVolume} kg`,
              status: novoVolume === 0 ? 'arquivado' : e.status,
              eligible: novoVolume > 0,
            };
          }
          return e;
        })
      );
      return { ok: true };
    }

    // Buscar item atual
    const { data: item, error: errFetch } = await supabase
      .from('estoque')
      .select('volume_kg, escola_id')
      .eq('id', id)
      .single();

    if (errFetch || !item) {
      return { ok: false, error: errFetch?.message || 'Item não encontrado no estoque' };
    }

    const novoVolume = Math.max(0, Number(item.volume_kg) - qt);
    const novoStatus = novoVolume === 0 ? 'arquivado' : 'normal';

    // Atualizar estoque
    const { error: errUpdate } = await supabase
      .from('estoque')
      .update({ volume_kg: novoVolume, status: novoStatus, eligible: novoVolume > 0 })
      .eq('id', id);

    if (errUpdate) return { ok: false, error: errUpdate.message };

    // Inserir movimentação
    const { error: errMov } = await supabase.from('movimentacoes').insert([
      {
        estoque_id: id,
        escola_id: item.escola_id,
        tipo: 'baixa',
        quantidade_kg: qt,
        observacao,
        usuario_id: usuarioId,
      },
    ]);

    if (errMov) console.error('Erro ao gravar movimentação:', errMov);

    await fetchEstoque();
    return { ok: true };
  }

  useEffect(() => {
    fetchEstoque();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('estoque-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'estoque' }, fetchEstoque)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, [escolaId]);

  return { estoque, loading, error, inserirLote, atualizarStatus, baixarEstoque, refetch: fetchEstoque };
}
