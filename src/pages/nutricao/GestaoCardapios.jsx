import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

// Base de receitas simuladas integradas do TACO com valores macro per capita
const RECIPES_DB = {
  desjejum: [
    { id: 'dj-1', nome: 'Pão Francês com manteiga e Leite Integral com Cacau', calorias: 350, carboidratos: 55, proteinas: 12, lipideos: 9, custo: 0.85 },
    { id: 'dj-2', nome: 'Iogurte Natural Integral com Aveia e Mel', calorias: 280, carboidratos: 42, proteinas: 10, lipideos: 8, custo: 1.10 },
    { id: 'dj-3', nome: 'Banana Prata Assada com Queijo Mozarela e Canela', calorias: 220, carboidratos: 32, proteinas: 7, lipideos: 6, custo: 0.95 },
    { id: 'dj-4', nome: 'Pão de Queijo Assado e Suco de Laranja Natural', calorias: 310, carboidratos: 48, proteinas: 6, lipideos: 10, custo: 1.25 }
  ],
  almoco: [
    { id: 'al-1', nome: 'Picadinho de Carne Moída Especial (Arroz, Feijão, Carne Moída e Cebola)', calorias: 680, carboidratos: 85, proteinas: 32, lipideos: 18, custo: 1.95 },
    { id: 'al-2', nome: 'Frango com Legumes (Peito de Frango, Arroz, Batata Inglesa e Abóbora)', calorias: 580, carboidratos: 75, proteinas: 35, lipideos: 12, custo: 1.65 },
    { id: 'al-3', nome: 'Feijoada Escolar Light (Arroz, Feijão Preto, Carne Bovina e Couve)', calorias: 720, carboidratos: 90, proteinas: 38, lipideos: 20, custo: 2.10 },
    { id: 'al-4', nome: 'Sopa de Macarrão e Legumes Consistente (Macarrão, Carne, Batata e Alho)', calorias: 450, carboidratos: 65, proteinas: 18, lipideos: 10, custo: 1.15 }
  ],
  lanche: [
    { id: 'la-1', nome: 'Fruta Fresca da Estação (Banana Prata)', calorias: 120, carboidratos: 26, proteinas: 1.3, lipideos: 0.3, custo: 0.30 },
    { id: 'la-2', nome: 'Maçã Fuji Fresca e Biscoito de Polvilho Integral', calorias: 150, carboidratos: 30, proteinas: 2, lipideos: 3, custo: 0.45 },
    { id: 'la-3', nome: 'Vitamina de Morango Cremosa (Leite Integral e Polpa de Morango)', calorias: 180, carboidratos: 25, proteinas: 6, lipideos: 5, custo: 0.80 },
    { id: 'la-4', nome: 'Salada de Frutas Especial (Banana, Maçã e Laranja)', calorias: 110, carboidratos: 24, proteinas: 1, lipideos: 0.2, custo: 0.60 }
  ]
};

// PNAE Full-day Targets (Referência para Alunos do Integral de 6-10 anos)
const PNAE_TARGETS = {
  calorias: { min: 1035, max: 1265, target: 1150, label: 'Energia (kcal)' },
  carboidratos: { min: 150, max: 200, target: 172, label: 'Carboidratos (g)' },
  proteinas: { min: 28, max: 45, target: 35, label: 'Proteínas (g)' },
  lipideos: { min: 25, max: 38, target: 32, label: 'Lipídeos (g)' }
};

export default function GestaoCardapios() {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [selectedDay, setSelectedDay] = useState('seg');
  const [saving, setSaving] = useState(false);
  const [loadingDb, setLoadingDb] = useState(false);
  
  // Planejamento inicial para os 5 dias da semana
  const [semanaPlan, setSemanaPlan] = useState({
    seg: { desjejum: 'dj-1', almoco: 'al-1', lanche: 'la-1' },
    ter: { desjejum: 'dj-2', almoco: 'al-2', lanche: 'la-2' },
    qua: { desjejum: 'dj-3', almoco: 'al-3', lanche: 'la-3' },
    qui: { desjejum: 'dj-4', almoco: 'al-1', lanche: 'la-1' },
    sex: { desjejum: 'dj-1', almoco: 'al-2', lanche: 'la-4' }
  });

  const escolaId = user?.escola_id || 'geral';
  const semanaId = '2026-W17'; // Semana 17 Letiva

  // Carregar cardápio do Supabase ou localStorage
  useEffect(() => {
    async function loadPlan() {
      setLoadingDb(true);
      
      const localPlan = localStorage.getItem(`cardapio_${escolaId}_${semanaId}`);
      if (localPlan) {
        try {
          setSemanaPlan(JSON.parse(localPlan));
        } catch (e) {
          console.error('Erro ao parsear localPlan:', e);
        }
      }

      if (!isSupabaseConfigured) {
        setLoadingDb(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('cardapios')
          .select('plano')
          .eq('escola_id', escolaId === 'geral' ? null : escolaId)
          .eq('semana', semanaId)
          .maybeSingle();

        if (error) {
          if (error.code !== '42P01') {
            console.error('Erro Supabase carregando cardápio:', error);
          }
        } else if (data?.plano) {
          setSemanaPlan(data.plano);
          localStorage.setItem(`cardapio_${escolaId}_${semanaId}`, JSON.stringify(data.plano));
        }
      } catch (err) {
        console.error('Erro carregando cardápio do banco:', err);
      } finally {
        setLoadingDb(false);
      }
    }

    loadPlan();
  }, [escolaId, semanaId]);

  const diasSemana = [
    { id: 'seg', label: 'Segunda-feira' },
    { id: 'ter', label: 'Terça-feira' },
    { id: 'qua', label: 'Quarta-feira' },
    { id: 'qui', label: 'Quinta-feira' },
    { id: 'sex', label: 'Sexta-feira' }
  ];

  // Obter receitas selecionadas para o dia ativo
  const planoDiaAtivo = semanaPlan[selectedDay];
  const recDesjejum = RECIPES_DB.desjejum.find(r => r.id === planoDiaAtivo.desjejum) || RECIPES_DB.desjejum[0];
  const recAlmoco = RECIPES_DB.almoco.find(r => r.id === planoDiaAtivo.almoco) || RECIPES_DB.almoco[0];
  const recLanche = RECIPES_DB.lanche.find(r => r.id === planoDiaAtivo.lanche) || RECIPES_DB.lanche[0];

  // Cálculo consolidado do dia ativo
  const totalCalorias = recDesjejum.calorias + recAlmoco.calorias + recLanche.calorias;
  const totalCarboidratos = recDesjejum.carboidratos + recAlmoco.carboidratos + recLanche.carboidratos;
  const totalProteinas = recDesjejum.proteinas + recAlmoco.proteinas + recLanche.proteinas;
  const totalLipideos = recDesjejum.lipideos + recAlmoco.lipideos + recLanche.lipideos;
  const totalCusto = recDesjejum.custo + recAlmoco.custo + recLanche.custo;

  // Atualizar receita do dia ativo
  const handleRecipeChange = (mealType, recipeId) => {
    setSemanaPlan(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [mealType]: recipeId
      }
    }));
  };

  // Validar se um nutriente está em conformidade com o PNAE (+/- 10%)
  const checkConformity = (value, targetObj) => {
    if (value >= targetObj.min && value <= targetObj.max) return 'compliant';
    if (value < targetObj.min) return 'low';
    return 'high';
  };

  const cCal = checkConformity(totalCalorias, PNAE_TARGETS.calorias);
  const cCarb = checkConformity(totalCarboidratos, PNAE_TARGETS.carboidratos);
  const cProt = checkConformity(totalProteinas, PNAE_TARGETS.proteinas);
  const cLip = checkConformity(totalLipideos, PNAE_TARGETS.lipideos);

  const isDiaTotalmenteConforme = cCal === 'compliant' && cCarb === 'compliant' && cProt === 'compliant' && cLip === 'compliant';

  const dispararSalvar = async () => {
    setSaving(true);
    localStorage.setItem(`cardapio_${escolaId}_${semanaId}`, JSON.stringify(semanaPlan));

    if (!isSupabaseConfigured) {
      showToast('Salvo no Navegador', 'Planejamento semanal salvo localmente no navegador (Modo Demo).', 'success');
      setSaving(false);
      return;
    }

    try {
      const dbEscolaId = escolaId === 'geral' ? null : escolaId;

      const { data: existing, error: errCheck } = await supabase
        .from('cardapios')
        .select('id')
        .eq('escola_id', dbEscolaId)
        .eq('semana', semanaId)
        .maybeSingle();

      let error = null;

      if (existing?.id) {
        const { error: errUpdate, data } = await supabase
          .from('cardapios')
          .update({ plano: semanaPlan })
          .eq('id', existing.id)
          .select();
        error = errUpdate;
        if (!error && (!data || data.length === 0)) {
          error = { code: '42501', message: 'Violação de política RLS: Você não tem permissão.' };
        }
      } else {
        const { error: errInsert, data } = await supabase
          .from('cardapios')
          .insert([{ escola_id: dbEscolaId, semana: semanaId, plano: semanaPlan }])
          .select();
        error = errInsert;
        if (!error && (!data || data.length === 0)) {
          error = { code: '42501', message: 'Violação de política RLS: Você não tem permissão para inserir.' };
        }
      }

      if (error) {
        if (error.code === '42P01') {
          showToast('Salvo Resiliente', 'Cardápio salvo localmente! (Tabela do banco ausente, ativando fallback).', 'warning');
        } else if (error.code === '42501' || error.message?.includes('policy')) {
          showToast('Salvo Localmente (Sem Permissão)', 'O sistema detectou que você não possui privilégios de gravação para o banco central, mas salvou o planejamento temporariamente em seu navegador.', 'warning');
        } else {
          showToast('Erro ao Salvar', `Erro de gravação: ${error.message}`, 'error');
        }
      } else {
        showToast('Sucesso PNAE', 'Configuração semanal salva no Servidor de Cardápios (Supabase)!', 'success');
      }
    } catch (err) {
      console.error('Erro de gravação:', err);
      showToast('Salvo Resiliente', 'Cardápio salvo localmente no navegador.', 'warning');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', paddingBottom: 40 }}>
        
        {loadingDb && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(15,23,42,0.9), rgba(30,41,59,0.95))',
            color: '#fff', padding: '16px 24px',
            borderRadius: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: 'Outfit', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)'
          }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
            Sincronizando Servidor...
          </div>
        )}

        <div className="header-dash animate-fade-in" style={{ 
          marginBottom: 30, 
          padding: '24px 32px', 
          background: 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(15,23,42,0) 100%)',
          borderRadius: 24,
          border: '1px solid rgba(16,185,129,0.1)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 20
        }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: '2.2rem', margin: 0 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14,
                background: 'linear-gradient(135deg, var(--primary), #059669)',
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 10px 20px rgba(16,185,129,0.3)'
              }}>
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <span style={{ background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Gestão de Cardápios
              </span>
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', margin: '12px 0 0 0', maxWidth: 600, lineHeight: 1.5 }}>
              Planejamento nutricional inteligente com validação PNAE em tempo real. Valores per capita sincronizados com a base TACO.
            </p>
          </div>
          <div>
            <button 
              className="btn btn-primary" 
              onClick={dispararSalvar} 
              disabled={saving}
              style={{
                padding: '14px 28px', fontSize: '1.05rem', fontWeight: 700, borderRadius: 14,
                boxShadow: '0 10px 25px rgba(16,185,129,0.4)',
                transform: saving ? 'scale(0.98)' : 'none',
                transition: 'all 0.2s'
              }}
            >
              {saving ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Processando...</>
              ) : (
                <><i className="fa-solid fa-cloud-arrow-up"></i> Publicar Semana</>
              )}
            </button>
          </div>
        </div>

        {/* Informações da Semana */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* Planejador Semanal */}
          <div className="glass-panel animate-slide-up" style={{ padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ fontFamily: 'Outfit', margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Semana 17 Letiva</h3>
              <div style={{ 
                background: 'rgba(59,130,246,0.1)', color: '#60a5fa', padding: '8px 16px', borderRadius: 20,
                fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(59,130,246,0.2)'
              }}>
                <i className="fa-solid fa-wallet" style={{ marginRight: 8 }}></i>
                Custo: R$ {totalCusto.toFixed(2)} / aluno
              </div>
            </div>

            {/* Abas dos Dias */}
            <div style={{ display: 'flex', gap: 10, paddingBottom: 20, marginBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.05)', overflowX: 'auto' }}>
              {diasSemana.map(dia => {
                const isActive = selectedDay === dia.id;
                const plan = semanaPlan[dia.id];
                const calDia = 
                  (RECIPES_DB.desjejum.find(r => r.id === plan.desjejum)?.calorias || 0) +
                  (RECIPES_DB.almoco.find(r => r.id === plan.almoco)?.calorias || 0) +
                  (RECIPES_DB.lanche.find(r => r.id === plan.lanche)?.calorias || 0);
                const confDia = calDia >= PNAE_TARGETS.calorias.min && calDia <= PNAE_TARGETS.calorias.max;

                return (
                  <button
                    key={dia.id}
                    onClick={() => setSelectedDay(dia.id)}
                    style={{
                      flex: 1, minWidth: 80, padding: '14px 8px', borderRadius: 16,
                      background: isActive ? 'linear-gradient(135deg, var(--primary), #059669)' : 'rgba(255,255,255,0.03)',
                      color: isActive ? '#fff' : 'var(--text-muted)',
                      border: isActive ? 'none' : '1px solid rgba(255,255,255,0.05)',
                      boxShadow: isActive ? '0 10px 20px rgba(16,185,129,0.3)' : 'none',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                    }}
                    onMouseEnter={e => { if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                    onMouseLeave={e => { if(!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                  >
                    <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: 1, opacity: isActive ? 1 : 0.7 }}>
                      {dia.label.split('-')[0].substring(0,3)}
                    </span>
                    <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, color: isActive ? '#fff' : 'inherit' }}>
                      🔥 {calDia}
                      <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: confDia ? '#10b981' : '#ef4444',
                        boxShadow: confDia ? '0 0 8px #10b981' : '0 0 8px #ef4444'
                      }} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Meal Slots */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Função Auxiliar para Renderizar Refeição */}
              {[
                { type: 'desjejum', icon: 'fa-mug-hot', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', title: 'Desjejum', rec: recDesjejum, db: RECIPES_DB.desjejum },
                { type: 'almoco', icon: 'fa-bowl-food', color: '#10b981', bg: 'rgba(16,185,129,0.1)', title: 'Almoço', rec: recAlmoco, db: RECIPES_DB.almoco },
                { type: 'lanche', icon: 'fa-apple-whole', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', title: 'Lanche da Tarde', rec: recLanche, db: RECIPES_DB.lanche }
              ].map(meal => (
                <div key={meal.type} style={{
                  background: 'rgba(15,23,42,0.4)', padding: 24, borderRadius: 20,
                  border: '1px solid rgba(255,255,255,0.04)',
                  position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: meal.color }} />
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <div style={{ 
                        width: 48, height: 48, borderRadius: 14, 
                        background: meal.bg, color: meal.color, 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 
                      }}>
                        <i className={`fa-solid ${meal.icon}`}></i>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{meal.title}</h4>
                        <h3 style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: 'var(--text-main)', fontFamily: 'Outfit', lineHeight: 1.3 }}>{meal.rec.nome}</h3>
                      </div>
                    </div>
                    <div style={{ background: meal.bg, color: meal.color, padding: '6px 12px', borderRadius: 12, fontSize: '0.85rem', fontWeight: 800 }}>
                      🔥 {meal.rec.calorias}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center' }}>
                    <select
                      className="form-control"
                      value={planoDiaAtivo[meal.type]}
                      onChange={(e) => handleRecipeChange(meal.type, e.target.value)}
                      style={{ 
                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', 
                        color: 'var(--text-main)', fontSize: '0.9rem', borderRadius: 12, padding: '12px 16px',
                        cursor: 'pointer', appearance: 'none', width: '100%'
                      }}
                    >
                      {meal.db.map(r => (
                        <option key={r.id} value={r.id}>{r.nome} ({r.calorias} kcal)</option>
                      ))}
                    </select>
                    <div style={{ 
                      display: 'flex', gap: 12, fontSize: '0.75rem', color: 'var(--text-muted)', 
                      background: 'rgba(255,255,255,0.03)', padding: '10px 16px', borderRadius: 12 
                    }}>
                      <span title="Carboidratos"><strong>C:</strong> {meal.rec.carboidratos}g</span>
                      <span title="Proteínas"><strong>P:</strong> {meal.rec.proteinas}g</span>
                      <span title="Lipídeos"><strong>L:</strong> {meal.rec.lipideos}g</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Painel PNAE de Conformidade Nutricional */}
          <div className="glass-panel animate-slide-up delay-100" style={{ 
            padding: 32, borderRadius: 24, 
            border: isDiaTotalmenteConforme ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)',
            boxShadow: isDiaTotalmenteConforme ? 'inset 0 0 40px rgba(16,185,129,0.05)' : 'inset 0 0 40px rgba(245,158,11,0.05)'
          }}>
            
            {/* Header Conformidade */}
            <div style={{ textAlign: 'center', marginBottom: 32, paddingBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{
                width: 70, height: 70, borderRadius: '50%',
                background: isDiaTotalmenteConforme ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: isDiaTotalmenteConforme ? 'var(--primary)' : 'var(--alert-yellow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px auto', fontSize: '2rem',
                border: isDiaTotalmenteConforme ? '2px solid var(--primary)' : '2px solid var(--alert-yellow)',
                boxShadow: isDiaTotalmenteConforme ? '0 0 20px rgba(16,185,129,0.4)' : '0 0 20px rgba(245,158,11,0.4)'
              }}>
                <i className={`fa-solid ${isDiaTotalmenteConforme ? 'fa-shield-check' : 'fa-triangle-exclamation'}`}></i>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.4rem', color: 'var(--text-main)', margin: '0 0 8px 0' }}>
                {isDiaTotalmenteConforme ? 'Conformidade FNDE Atingida' : 'Desvio Nutricional Detectado'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {isDiaTotalmenteConforme 
                  ? 'Os níveis nutricionais do dia estão perfeitamente ajustados dentro das margens exigidas pelo PNAE.' 
                  : 'Atenção: Revise o cardápio. Um ou mais nutrientes estão fora do intervalo estipulado de tolerância.'}
              </p>
            </div>

            {/* Nutrientes Comparação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {[
                { label: 'Energia', val: totalCalorias, target: PNAE_TARGETS.calorias, status: cCal, unit: 'kcal' },
                { label: 'Carboidratos', val: totalCarboidratos, target: PNAE_TARGETS.carboidratos, status: cCarb, unit: 'g' },
                { label: 'Proteínas', val: totalProteinas.toFixed(1), target: PNAE_TARGETS.proteinas, status: cProt, unit: 'g' },
                { label: 'Lipídeos', val: totalLipideos.toFixed(1), target: PNAE_TARGETS.lipideos, status: cLip, unit: 'g' }
              ].map(nutri => {
                const isCompliant = nutri.status === 'compliant';
                const percent = Math.min((nutri.val / nutri.target.max) * 100, 100);
                const color = isCompliant ? '#10b981' : '#f59e0b';
                
                return (
                  <div key={nutri.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8, alignItems: 'flex-end' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{nutri.label} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({nutri.val} {nutri.unit})</span></span>
                      <span style={{ 
                        color: color, fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5,
                        background: `${color}15`, padding: '4px 8px', borderRadius: 8
                      }}>
                        {isCompliant ? 'Conforme' : 'Desvio'}
                      </span>
                    </div>
                    <div style={{ height: 12, background: 'rgba(0,0,0,0.3)', borderRadius: 6, overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5)' }}>
                      {/* Tolerance Band */}
                      <div style={{ 
                        position: 'absolute', 
                        left: `${(nutri.target.min / nutri.target.max) * 100}%`, 
                        width: `${((nutri.target.max - nutri.target.min) / nutri.target.max) * 100}%`, 
                        height: '100%', background: 'rgba(255,255,255,0.08)' 
                      }} />
                      
                      <div style={{
                        width: `${percent}%`, height: '100%',
                        background: `linear-gradient(90deg, ${color}80, ${color})`,
                        borderRadius: 6, transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: `0 0 10px ${color}80`
                      }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 6, fontFamily: 'monospace' }}>
                      <span>MIN: {nutri.target.min}</span>
                      <span style={{ color: color }}>ATUAL: {nutri.val}</span>
                      <span>MAX: {nutri.target.max}</span>
                    </div>
                  </div>
                );
              })}

            </div>

            {/* Informações Regulatórias FNDE */}
            <div style={{
              marginTop: 32, padding: 20, background: 'linear-gradient(135deg, rgba(16,185,129,0.05), rgba(16,185,129,0.01))',
              borderRadius: 16, border: '1px solid rgba(16,185,129,0.1)', fontSize: '0.85rem',
              color: 'var(--text-main)', lineHeight: '1.5', display: 'flex', gap: 16, alignItems: 'flex-start'
            }}>
              <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--primary)', fontSize: '1.5rem', marginTop: 2 }}></i>
              <div>
                <strong style={{ display: 'block', marginBottom: 4 }}>Diretrizes PNAE 2026</strong>
                O Fundo Nacional de Desenvolvimento da Educação (FNDE) preconiza que a alimentação em período integral supra pelo menos 70% das necessidades diárias, promovendo saúde preventiva nas escolas.
              </div>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
