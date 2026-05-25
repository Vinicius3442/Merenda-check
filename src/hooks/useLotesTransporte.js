import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockLotes = [
  {
    id: 'llll0001',
    nota_fiscal: 'NF-00234',
    placa: 'ABC-1234',
    motorista: 'José Carlos da Silva',
    origem: 'Centro de Distribuição Central',
    tx_hash: '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    status: 'entregue',
    itens: [
      { descricao: 'Carne Moída Bovina', qtd: 100, unidade: 'kg', validade: '2026-06-15' },
      { descricao: 'Arroz Agulhinha', qtd: 50, unidade: 'kg', validade: '2026-12-01' },
    ],
    criado_em: new Date(Date.now() - 86400000 * 3).toISOString(),
    entregue_em: new Date(Date.now() - 86400000 * 2).toISOString(),
    fornecedor: { nome: 'AgroSul Alimentos SA' },
    escola_destino: { nome: 'CEI Pequeninos' },
  },
];

export function useLotesTransporte() {
  const [lotes, setLotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchLotes() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setLotes(mockLotes);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('lotes_transporte')
      .select('*, fornecedores(nome), escolas!lotes_transporte_destino_escola_fkey(nome)')
      .order('criado_em', { ascending: false });

    if (err) {
      setError(err.message);
      setLotes(mockLotes);
    } else {
      const mapped = (data || []).map((l) => ({
        ...l,
        itens: typeof l.itens === 'string' ? JSON.parse(l.itens) : (l.itens || []),
        fornecedor: l.fornecedores || {},
        escola_destino: l.escolas || {},
      }));
      setLotes(mapped);
    }
    setLoading(false);
  }

  async function emitirLote({ fornecedor_id, nota_fiscal, placa, motorista, origem, destino_escola, itens }) {
    // Gerar Hash Criptográfico Real (SHA-256) para Imutabilidade (Blockchain simulation)
    const payloadParaHash = JSON.stringify({ fornecedor_id, nota_fiscal, placa, motorista, origem, destino_escola, itens, timestamp: Date.now() });
    const encoder = new TextEncoder();
    const data = encoder.encode(payloadParaHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const txHash = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    const qrData = `merendacheck://lote/${txHash}`;

    if (!isSupabaseConfigured) {
      const novo = {
        id: String(Date.now()),
        nota_fiscal,
        placa,
        motorista,
        origem,
        tx_hash: txHash,
        qr_data: qrData,
        status: 'em_transito',
        itens: itens || [],
        criado_em: new Date().toISOString(),
        fornecedor: { nome: 'Fornecedor Demo' },
        escola_destino: { nome: 'Escola Demo' },
      };
      setLotes((prev) => [novo, ...prev]);
      return { ok: true, txHash, qrData };
    }

    const { data, error: err } = await supabase
      .from('lotes_transporte')
      .insert([{
        fornecedor_id: fornecedor_id || null,
        nota_fiscal,
        placa,
        motorista,
        origem,
        destino_escola: destino_escola || null,
        tx_hash: txHash,
        qr_data: qrData,
        status: 'em_transito',
        itens,
      }])
      .select()
      .single();

    if (err) return { ok: false, error: err.message };
    await fetchLotes();
    return { ok: true, txHash, qrData, lote: data };
  }

  async function confirmarEntrega(id) {
    if (!isSupabaseConfigured) {
      setLotes((prev) => prev.map((l) => l.id === id ? { ...l, status: 'entregue', entregue_em: new Date().toISOString() } : l));
      return { ok: true };
    }
    const { error: err } = await supabase
      .from('lotes_transporte')
      .update({ status: 'entregue', entregue_em: new Date().toISOString() })
      .eq('id', id);
    if (err) return { ok: false, error: err.message };
    await fetchLotes();
    return { ok: true };
  }

  useEffect(() => {
    fetchLotes();
  }, []);

  return { lotes, loading, error, emitirLote, confirmarEntrega, refetch: fetchLotes };
}
