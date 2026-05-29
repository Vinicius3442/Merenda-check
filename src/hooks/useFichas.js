import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Receitas fallback caso o Supabase não esteja disponível
const RECEITAS_MOCK = [
  {
    id: 'rec-picadinho',
    nome: 'Picadinho de Carne',
    tipo: 'Almoço Escolar',
    rendimento: '1 Porção (125g)',
    custoBase: 1.95,
    ingredientes: [
      { idInsumo: 'taco-001', gramas: 40 }, // Arroz
      { idInsumo: 'taco-002', gramas: 20 }, // Feijão
      { idInsumo: 'taco-004', gramas: 50 }, // Carne
      { idInsumo: 'taco-011', gramas: 10 }, // Polpa tomate
      { idInsumo: 'taco-012', gramas: 5 }   // Cebola
    ]
  },
  {
    id: 'rec-frango',
    nome: 'Frango com Legumes',
    tipo: 'Almoço Escolar',
    rendimento: '1 Porção (140g)',
    custoBase: 1.65,
    ingredientes: [
      { idInsumo: 'taco-005', gramas: 60 }, // Peito frango
      { idInsumo: 'taco-014', gramas: 40 }, // Batata
      { idInsumo: 'taco-015', gramas: 30 }, // Abóbora
      { idInsumo: 'taco-012', gramas: 10 }  // Cebola
    ]
  }
];

export function useFichas() {
  const [fichas, setFichas] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchFichas() {
    setLoading(true);
    if (!isSupabaseConfigured) {
      // Se não há banco, tenta ler do localStorage ou usa o mock
      const saved = localStorage.getItem('receitas_taco');
      setFichas(saved ? JSON.parse(saved) : RECEITAS_MOCK);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('fichas_tecnicas')
        .select('*')
        .order('criado_em', { ascending: false });

      if (error) throw error;
      
      // Mapeando a estrutura do banco (snake_case) para a que o frontend usava (camelCase)
      const parseadas = data.map(item => ({
        id: item.id,
        nome: item.nome,
        tipo: item.tipo,
        rendimento: item.rendimento,
        custoBase: item.custo_base,
        ingredientes: item.ingredientes || []
      }));
      setFichas(parseadas.length > 0 ? parseadas : RECEITAS_MOCK);
    } catch (err) {
      console.warn('Erro ao buscar fichas técnicas (Fallback ativado):', err);
      const saved = localStorage.getItem('receitas_taco');
      setFichas(saved ? JSON.parse(saved) : RECEITAS_MOCK);
    } finally {
      setLoading(false);
    }
  }

  // Atualizar (Salvar nova ou editar existente)
  async function salvarFicha(ficha) {
    // Sempre atualizamos o estado local e localStorage
    setFichas(prev => {
      const existe = prev.some(f => f.id === ficha.id);
      let novoEstado = existe ? prev.map(f => f.id === ficha.id ? ficha : f) : [ficha, ...prev];
      localStorage.setItem('receitas_taco', JSON.stringify(novoEstado));
      return novoEstado;
    });

    if (!isSupabaseConfigured) return { ok: true, fallback: true };

    try {
      const dbPayload = {
        nome: ficha.nome,
        tipo: ficha.tipo,
        rendimento: ficha.rendimento,
        custo_base: ficha.custoBase,
        ingredientes: ficha.ingredientes
      };

      // Se o ID tiver formato UUID, tenta fazer update. Se for 'rec-...', insere como novo gerando UUID
      if (ficha.id && !ficha.id.toString().startsWith('rec-')) {
        const { error } = await supabase.from('fichas_tecnicas').update(dbPayload).eq('id', ficha.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('fichas_tecnicas').insert([dbPayload]);
        if (error) throw error;
        // Depois recarrega para pegar o UUID real gerado
        await fetchFichas();
      }
      return { ok: true };
    } catch (err) {
      console.warn('Falha no Supabase ao salvar Ficha (salvo localmente):', err);
      return { ok: true, fallback: true, error: err.message };
    }
  }

  useEffect(() => {
    fetchFichas();
  }, []);

  return { fichas, loading, salvarFicha, refetch: fetchFichas };
}
