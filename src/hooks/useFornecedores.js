import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const mockFornecedores = [
  { id: 'aaaa0001', nome: 'AgroSul Alimentos SA',        cnpj: '10.432.567/0001-10', contato: 'comercial@agrosul.com.br',    status_ceis: 'Limpo',    categoria: 'Proteínas/Carnes', uf: 'RS' },
  { id: 'aaaa0002', nome: 'CerealBrasil Distribuidora',  cnpj: '22.543.678/0001-22', contato: 'vendas@cerealbrasil.com.br',  status_ceis: 'Limpo',    categoria: 'Grãos/Cereais',   uf: 'GO' },
  { id: 'aaaa0003', nome: 'Laticínios Bom Sabor Ltda.',  cnpj: '33.654.789/0001-33', contato: 'comercial@bomsabor.com.br',   status_ceis: 'Limpo',    categoria: 'Laticínios',      uf: 'MG' },
  { id: 'aaaa0004', nome: 'Hortifruti Verde Vale',        cnpj: '44.765.890/0001-44', contato: 'pedidos@verdevale.com.br',    status_ceis: 'Suspenso', categoria: 'Hortifruti',      uf: 'SP' },
];

export function useFornecedores() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function fetchFornecedores() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      setFornecedores(mockFornecedores);
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from('fornecedores')
      .select('*')
      .order('nome');

    if (err) {
      setError(err.message);
      setFornecedores(mockFornecedores);
    } else {
      setFornecedores(data || []);
    }
    setLoading(false);
  }

  async function inserirFornecedor(payload) {
    if (!isSupabaseConfigured) {
      const novo = { id: String(Date.now()), ...payload };
      setFornecedores((prev) => [novo, ...prev]);
      return { ok: true };
    }
    const { error: err } = await supabase.from('fornecedores').insert([payload]);
    if (err) return { ok: false, error: err.message };
    await fetchFornecedores();
    return { ok: true };
  }

  async function atualizarStatusCEIS(id, status_ceis) {
    if (!isSupabaseConfigured) {
      setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, status_ceis } : f)));
      return { ok: true };
    }
    const { error: err } = await supabase.from('fornecedores').update({ status_ceis }).eq('id', id);
    if (err) {
      if (err.code === '42501' || err.message?.includes('RLS') || err.message?.includes('policy') || err.message?.includes('permit')) {
        // Fallback local caso o RLS barre
        setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, status_ceis } : f)));
        return { ok: true, fallback: true };
      }
      return { ok: false, error: err.message };
    }
    await fetchFornecedores();
    return { ok: true };
  }

  useEffect(() => {
    fetchFornecedores();
  }, []);

  return { fornecedores, loading, error, inserirFornecedor, atualizarStatusCEIS, refetch: fetchFornecedores };
}
