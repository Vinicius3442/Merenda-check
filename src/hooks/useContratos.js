import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockContratos = [
  {
    id: 'cccc0001', numero: '2026/PE-001', objeto: 'Fornecimento de carnes bovina e suína para PNAE',
    valor_total: 480000, valor_executado: 312000,
    data_inicio: '2026-01-01', data_fim: '2026-12-31',
    modalidade: 'Pregão Eletrônico', status: 'vigente',
    fornecedor: { nome: 'AgroSul Alimentos SA', cnpj: '10.432.567/0001-10', status_ceis: 'Limpo' },
  },
  {
    id: 'cccc0002', numero: '2026/PE-002', objeto: 'Fornecimento de grãos, cereais e massas para PNAE',
    valor_total: 210000, valor_executado: 140000,
    data_inicio: '2026-01-01', data_fim: '2026-12-31',
    modalidade: 'Pregão Eletrônico', status: 'vigente',
    fornecedor: { nome: 'CerealBrasil Distribuidora', cnpj: '22.543.678/0001-22', status_ceis: 'Limpo' },
  },
  {
    id: 'cccc0003', numero: '2026/PE-003', objeto: 'Fornecimento de laticínios e derivados para PNAE',
    valor_total: 180000, valor_executado: 95000,
    data_inicio: '2026-01-01', data_fim: '2026-12-31',
    modalidade: 'Pregão Eletrônico', status: 'vigente',
    fornecedor: { nome: 'Laticínios Bom Sabor Ltda.', cnpj: '33.654.789/0001-33', status_ceis: 'Limpo' },
  },
  {
    id: 'cccc0004', numero: '2025/TP-010', objeto: 'Fornecimento de hortifrutigranjeiros — ENCERRADO',
    valor_total: 95000, valor_executado: 95000,
    data_inicio: '2025-01-01', data_fim: '2025-12-31',
    modalidade: 'Tomada de Preços', status: 'encerrado',
    fornecedor: { nome: 'Hortifruti Verde Vale', cnpj: '44.765.890/0001-44', status_ceis: 'Suspenso' },
  },
];

export function useContratos() {
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchContratos() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setContratos(mockContratos);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('contratos')
      .select('*, fornecedores(nome, cnpj, status_ceis)')
      .order('criado_em', { ascending: false });

    if (err) {
      setError(err.message);
      setContratos(mockContratos);
    } else {
      const mapped = (data || []).map((c) => ({
        ...c,
        fornecedor: c.fornecedores || {},
      }));
      setContratos(mapped);
    }
    setLoading(false);
  }

  async function inserirContrato(payload) {
    if (!isSupabaseConfigured) {
      const novo = { id: String(Date.now()), ...payload, fornecedor: { nome: 'Fornecedor', cnpj: '', status_ceis: 'Limpo' } };
      setContratos((prev) => [novo, ...prev]);
      return { ok: true };
    }
    const { error: err } = await supabase.from('contratos').insert([payload]);
    if (err) return { ok: false, error: err.message };
    await fetchContratos();
    return { ok: true };
  }

  async function atualizarContrato(id, payload) {
    if (!isSupabaseConfigured) {
      setContratos((prev) => prev.map((c) => (c.id === id ? { ...c, ...payload } : c)));
      return { ok: true };
    }
    const { error: err } = await supabase.from('contratos').update(payload).eq('id', id);
    if (err) return { ok: false, error: err.message };
    await fetchContratos();
    return { ok: true };
  }

  useEffect(() => {
    fetchContratos();
  }, []);

  return { contratos, loading, error, inserirContrato, atualizarContrato, refetch: fetchContratos };
}
