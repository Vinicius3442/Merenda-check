import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockTimelines } from '../data/mockData';

export function useRastreabilidade(escolaId) {
  const [timeline, setTimeline] = useState(mockTimelines['cei-pequeninos'] || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTimeline() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        if (!escolaId) {
          setLoading(false);
          return;
        }

        // Fetch lotes
        const { data: lotes } = await supabase
          .from('lotes_transporte')
          .select('*')
          .eq('destino_escola', escolaId)
          .order('criado_em', { ascending: false });

        // Fetch movimentacoes
        const { data: movs } = await supabase
          .from('movimentacoes')
          .select('*, usuarios(nome, role)')
          .eq('escola_id', escolaId)
          .order('criado_em', { ascending: false });

        // Fetch alertas
        const { data: alertas } = await supabase
          .from('alertas')
          .select('*')
          .eq('escola_id', escolaId)
          .order('criado_em', { ascending: false });

        let dynamicEvents = [];
        let eventIdCounter = 1;

        // 1. Mapear Alertas (Vermelhos / Amarelos)
        (alertas || []).forEach(a => {
          dynamicEvents.push({
            id: eventIdCounter++,
            dot: a.gravidade === 'danger' ? 'dot-danger' : 'dot-warning',
            icon: a.gravidade === 'danger' ? 'fa-triangle-exclamation' : 'fa-hourglass-half',
            borderColor: a.gravidade === 'danger' ? 'var(--alert-red)' : 'var(--alert-yellow)',
            titleClass: '', 
            titleColor: a.gravidade === 'danger' ? 'var(--alert-red)' : 'var(--alert-yellow)',
            title: `Alerta Preditivo: ${a.tipo}`,
            subtitle: a.descricao,
            date: new Date(a.criado_em).toLocaleString('pt-BR'),
            description: a.resolvido ? 'Este alerta já foi resolvido pela equipe.' : 'Este alerta requer ação imediata.',
            extraGlow: a.gravidade === 'danger',
            meta: [
              { icon: 'fa-shield-halved', text: a.gravidade === 'danger' ? 'Auditoria Exigida' : 'Atenção Necessária', color: a.gravidade === 'danger' ? 'var(--alert-red)' : 'var(--alert-yellow)', bold: true },
            ],
            rawDate: new Date(a.criado_em)
          });
        });

        // 2. Mapear Lotes Entregues (Verdes)
        (lotes || []).forEach(l => {
          dynamicEvents.push({
            id: eventIdCounter++,
            dot: 'dot-success',
            icon: 'fa-truck-ramp-box',
            borderColor: 'var(--alert-green)',
            titleClass: 'text-gradient',
            title: `Romaneio de Entrega — Lote ${l.id.substring(0,5).toUpperCase()}`,
            subtitle: `Motorista: ${l.motorista} | Placa: ${l.placa}`,
            badgeClass: l.status === 'entregue' ? 'badge-success' : 'badge-warning', 
            badgeText: l.status.toUpperCase(),
            date: new Date(l.criado_em).toLocaleString('pt-BR'),
            meta: [
              { icon: 'fa-lock', text: `Hash Tx: ${l.tx_hash || 'N/A'}`, color: 'var(--text-muted)' },
            ],
            rawDate: new Date(l.criado_em)
          });
        });

        // 3. Mapear Movimentações (Azuis / Neutras)
        (movs || []).forEach(m => {
          dynamicEvents.push({
            id: eventIdCounter++,
            dot: 'dot-neutral',
            icon: m.tipo === 'baixa' ? 'fa-fire-burner' : m.tipo === 'sobra' ? 'fa-trash' : 'fa-boxes-stacked',
            borderColor: 'var(--alert-blue)',
            titleClass: '',
            title: `Movimentação de Estoque: ${m.tipo.toUpperCase()}`,
            subtitle: `Operação de ${m.quantidade_kg} kg registrada por ${m.usuarios?.nome || 'Sistema'}.`,
            date: new Date(m.criado_em).toLocaleString('pt-BR'),
            description: m.observacao || '',
            meta: [
              { icon: 'fa-weight-scale', text: `Volume: ${m.quantidade_kg} kg` },
              { icon: 'fa-user', text: `Role: ${m.usuarios?.role || 'N/A'}` },
            ],
            rawDate: new Date(m.criado_em)
          });
        });

        // Ordenar por data decrescente
        dynamicEvents.sort((a, b) => b.rawDate - a.rawDate);

        if (dynamicEvents.length > 0) {
          setTimeline(dynamicEvents);
        } else {
          setTimeline(mockTimelines['cei-pequeninos'] || []);
        }

      } catch (err) {
        console.error('Erro ao buscar rastreabilidade:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchTimeline();
  }, [escolaId]);

  return { timeline, loading };
}
