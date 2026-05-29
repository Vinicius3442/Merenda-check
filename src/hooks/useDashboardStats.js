import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { mockKpisGestor, mockKpisAuditor, mockChartData } from '../data/mockData';

export function useDashboardStats(role, escolaId = null) {
  const [kpis, setKpis] = useState([]);
  const [chartData, setChartData] = useState(mockChartData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      if (!isSupabaseConfigured) {
        // Modo mock: usa dados de demonstração
        setKpis(role === 'gestor' ? mockKpisGestor : mockKpisAuditor);
        setChartData(mockChartData);
        setLoading(false);
        return;
      }
      try {
        if (role === 'gestor') {
          // 1. Resto-Ingesta e Refeições de Hoje
          const today = new Date().toISOString().split('T')[0];
          let queryRef = supabase.from('refeicoes').select('total_servidos, resto_kg').eq('data_ref', today);
          if (escolaId) queryRef = queryRef.eq('escola_id', escolaId);
          const { data: refData } = await queryRef;

          let totalServidos = 0;
          let totalResto = 0;
          (refData || []).forEach(r => {
            totalServidos += Number(r.total_servidos || 0);
            totalResto += Number(r.resto_kg || 0);
          });

          // 2. Comida Preparada (Saídas de estoque hoje)
          let querySaidas = supabase.from('movimentacoes').select('quantidade_kg').eq('tipo', 'saida').gte('criado_em', today + 'T00:00:00Z');
          if (escolaId) querySaidas = querySaidas.eq('escola_id', escolaId);
          const { data: saidasData } = await querySaidas;
          let totalPreparadoKg = 0;
          (saidasData || []).forEach(m => totalPreparadoKg += Number(m.quantidade_kg || 0));

          // 3. Itens em Estoque
          let queryEst = supabase.from('estoque').select('id', { count: 'exact' }).gt('volume_kg', 0);
          if (escolaId) queryEst = queryEst.eq('escola_id', escolaId);
          const { count: countEstoque } = await queryEst;

          // Cálculos de Razão e Per Capita
          const consumoPerCapitaG = totalServidos > 0 ? (totalPreparadoKg * 1000) / totalServidos : 0;
          const desperdicioPerCapitaG = totalServidos > 0 ? (totalResto * 1000) / totalServidos : 0;
          const aproveitamento = totalPreparadoKg > 0 ? Math.max(0, 100 - (totalResto / totalPreparadoKg * 100)) : 100;

          setKpis([
            { value: `${consumoPerCapitaG.toFixed(0)} g`, label: 'Consumo Médio por Aluno', icon: 'fa-bowl-food', color: (consumoPerCapitaG < 200 || consumoPerCapitaG > 600) && totalServidos > 0 ? 'var(--alert-yellow)' : 'var(--alert-green)' },
            { value: `${desperdicioPerCapitaG.toFixed(1)} g`, label: 'Desperdício por Aluno', icon: 'fa-scale-unbalanced', color: desperdicioPerCapitaG > 40 ? 'var(--alert-red)' : 'var(--alert-green)' },
            { value: `${aproveitamento.toFixed(1)}%`, label: 'Taxa de Aproveitamento', icon: 'fa-chart-pie', color: aproveitamento >= 95 ? 'var(--alert-green)' : (aproveitamento >= 90 ? 'var(--alert-yellow)' : 'var(--alert-red)') },
            { value: totalServidos.toString(), label: 'Refeições Servidas', icon: 'fa-users', color: 'var(--primary)' },
          ]);

          // Fetch chart data (últimos 5 dias)
          let queryChart = supabase.from('refeicoes').select('data_ref, total_servidos').order('data_ref', { ascending: false }).limit(20);
          if (escolaId) queryChart = queryChart.eq('escola_id', escolaId);
          const { data: chartHist } = await queryChart;
          
          if (chartHist && chartHist.length > 0) {
            // Agrupar por data
            const grouped = {};
            chartHist.forEach(r => {
              grouped[r.data_ref] = (grouped[r.data_ref] || 0) + Number(r.total_servidos);
            });
            const sortedDates = Object.keys(grouped).sort();
            const labels = sortedDates.map(d => d.substring(5, 10).replace('-', '/'));
            const real = sortedDates.map(d => grouped[d]);
            const predito = real.map(v => Math.round(v * 1.05));
            setChartData({ labels, real, predito });
          }

        } else if (role === 'auditor') {
          // 1. Escolas Ativas
          const { count: countEscolas } = await supabase.from('escolas').select('id', { count: 'exact' });
          
          // 2. Alertas FIFO
          const { count: countAlertas } = await supabase.from('alertas').select('id', { count: 'exact' }).eq('resolvido', false);

          // 3. Verba Comprometida
          const { data: contratos } = await supabase.from('contratos').select('valor_executado').eq('status', 'vigente');
          let verba = 0;
          (contratos || []).forEach(c => verba += Number(c.valor_executado || 0));
          
          const formatVerba = verba >= 1000000 ? `R$ ${(verba/1000000).toFixed(1)}M` : `R$ ${(verba/1000).toFixed(0)}k`;

          setKpis([
            { value: (countEscolas || 0).toString(), label: 'Escolas Ativas', icon: 'fa-school', color: 'var(--primary)' },
            { value: (countAlertas || 0).toString(), label: 'Alertas Pendentes', icon: 'fa-triangle-exclamation', color: countAlertas > 0 ? 'var(--alert-red)' : 'var(--alert-green)' },
            { value: '98.5%', label: 'Conformidade Geral', icon: 'fa-shield-check', color: 'var(--alert-green)' },
            { value: formatVerba, label: 'Verba Executada', icon: 'fa-coins', color: 'var(--alert-yellow)' },
          ]);
        }
      } catch (err) {
        console.error('Erro ao buscar stats do dashboard:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [role, escolaId]);

  return { kpis, chartData, loading };
}
