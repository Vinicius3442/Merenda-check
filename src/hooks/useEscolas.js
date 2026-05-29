import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockEscolas } from '../data/mockData';

export function useEscolas() {
  const [escolas, setEscolas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchEscolas() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setEscolas(mockEscolas);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('escolas')
      .select('*, alertas(tipo, gravidade, descricao, criado_em, resolvido)')
      .order('nome');

    if (err) {
      setError(err.message);
      setEscolas(mockEscolas);
    } else {
      // Mapear para o formato esperado pelos componentes
      const mapped = (data || []).map((e) => ({
        ...e,
        id: e.id,
        nome: e.nome,
        diretora: e.diretora,
        endereco: e.endereco,
        status: e.status,
        lat: e.lat,
        lng: e.lng,
        health: e.health,
        healthClass: e.health >= 90 ? 'health-100' : e.health >= 70 ? 'health-80' : 'health-60',
        badgeClass: e.health >= 90 ? 'badge-success' : e.health >= 70 ? 'badge-warning' : 'badge-danger',
        badgeText: e.health >= 90 ? 'Selo Verde' : e.health >= 70 ? 'Atenção' : 'Sob Risco',
        alertIcon: e.health >= 90 ? 'fa-check' : e.health >= 70 ? 'fa-info-circle' : 'fa-triangle-exclamation',
        alertColor: e.health >= 90 ? 'var(--alert-green)' : e.health >= 70 ? 'var(--alert-yellow)' : 'var(--alert-red)',
        alertas: e.alertas || [],
      }));
      setEscolas(mapped);
    }
    setLoading(false);
  }

  async function inserirEscola(escolaData) {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase não configurado' };
    const { data, error } = await supabase.from('escolas').insert([escolaData]).select();
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: data[0] };
  }

  async function atualizarStatus(id, newStatus) {
    if (!isSupabaseConfigured) return { ok: false, error: 'Supabase não configurado' };
    const { error } = await supabase.from('escolas').update({ status: newStatus }).eq('id', id);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
  }

  useEffect(() => {
    fetchEscolas();

    if (isSupabaseConfigured) {
      const channel = supabase
        .channel('escolas-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'escolas' }, fetchEscolas)
        .subscribe();
      return () => supabase.removeChannel(channel);
    }
  }, []);

  return { escolas, loading, error, refetch: fetchEscolas, inserirEscola, atualizarStatus };
}
