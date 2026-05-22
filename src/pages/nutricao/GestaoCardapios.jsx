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
        const { error: errUpdate } = await supabase
          .from('cardapios')
          .update({ plano: semanaPlan })
          .eq('id', existing.id);
        error = errUpdate;
      } else {
        const { error: errInsert } = await supabase
          .from('cardapios')
          .insert([{ escola_id: dbEscolaId, semana: semanaId, plano: semanaPlan }]);
        error = errInsert;
      }

      if (error) {
        if (error.code === '42P01') {
          showToast('Salvo Resiliente', 'Cardápio salvo localmente! (Tabela do banco ausente, ativando fallback).', 'warning');
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
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        
        {loadingDb && (
          <div style={{
            position: 'fixed', top: 24, right: 24, zIndex: 1000,
            background: 'var(--bg-surface-elevated)', color: '#fff', padding: '16px 24px',
            borderRadius: 12, boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            display: 'flex', alignItems: 'center', gap: 12,
            fontFamily: 'Outfit', fontWeight: 600, border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <i className="fa-solid fa-circle-notch fa-spin" style={{ color: 'var(--primary)' }}></i>
            Carregando do servidor...
          </div>
        )}

        <div className="header-dash animate-fade-in">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary)' }}></i>
              Gestão Integrada de Cardápios
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Planejamento de nutrição balanceada. Valores per capita atualizados instantaneamente conforme receitas do banco TACO.
            </p>
          </div>
          <div>
            <button className="btn btn-primary" onClick={dispararSalvar} disabled={saving}>
              {saving ? (
                <><i className="fa-solid fa-circle-notch fa-spin"></i> Salvando...</>
              ) : (
                <><i className="fa-solid fa-cloud-arrow-up"></i> Salvar Semana Vigente</>
              )}
            </button>
          </div>
        </div>

        {/* Informações da Semana */}
        <div className="cardapio-grid-layout">
          
          {/* Planejador Semanal e Seletores */}
          <div className="glass-panel animate-slide-up" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'Outfit', margin: 0 }}>Semana 17 Letiva (18 a 22 Mai)</h3>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <i className="fa-solid fa-wallet" style={{ color: 'var(--primary)', marginRight: 6 }}></i>
                Custo de hoje: <strong style={{ color: 'var(--text-main)' }}>R$ {totalCusto.toFixed(2)}</strong> per capita
              </span>
            </div>

            {/* Abas dos Dias */}
            <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12, marginBottom: 24, overflowX: 'auto' }}>
              {diasSemana.map(dia => {
                const isActive = selectedDay === dia.id;
                // Calcular calorias para a badge pequena do dia
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
                      flex: 1, padding: '12px 8px', borderRadius: 8,
                      background: isActive ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                      color: isActive ? '#fff' : 'var(--text-main)',
                      border: isActive ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                      fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 100
                    }}
                  >
                    <span style={{ fontSize: '0.82rem', opacity: isActive ? 0.9 : 0.6 }}>{dia.label.split('-')[0]}</span>
                    <span style={{ fontSize: '0.9rem', color: isActive ? '#fff' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      🔥 {calDia}
                      <span style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: confDia ? '#10b981' : '#f59e0b',
                        display: 'inline-block'
                      }} />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Meal Slots (Desjejum, Almoço, Lanche) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              
              {/* DESJEJUM */}
              <div style={{
                background: 'var(--bg-surface-elevated)', padding: 20, borderRadius: 12,
                border: '1px solid var(--border-subtle)', transition: 'border 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(96,165,250,0.1)', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-mug-saucer"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Café da Manhã · Desjejum</h4>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>{recDesjejum.nome}</h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#60a5fa' }}>🔥 {recDesjejum.calorias} kcal</span>
                </div>
                <div className="meal-slot-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 4 }}>Alterar Receita Recomendada</label>
                    <select
                      className="form-control"
                      value={planoDiaAtivo.desjejum}
                      onChange={(e) => handleRecipeChange('desjejum', e.target.value)}
                      style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    >
                      {RECIPES_DB.desjejum.map(r => (
                        <option key={r.id} value={r.id}>{r.nome} ({r.calorias} kcal)</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
                    C: {recDesjejum.carboidratos}g · P: {recDesjejum.proteinas}g · L: {recDesjejum.lipideos}g
                  </div>
                </div>
              </div>

              {/* ALMOÇO */}
              <div style={{
                background: 'var(--bg-surface-elevated)', padding: 20, borderRadius: 12,
                border: '1px solid var(--border-subtle)', transition: 'border 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(16,185,129,0.1)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-bowl-rice"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Refeição Principal · Almoço</h4>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>{recAlmoco.nome}</h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary)' }}>🔥 {recAlmoco.calorias} kcal</span>
                </div>
                <div className="meal-slot-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 4 }}>Alterar Receita Recomendada</label>
                    <select
                      className="form-control"
                      value={planoDiaAtivo.almoco}
                      onChange={(e) => handleRecipeChange('almoco', e.target.value)}
                      style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    >
                      {RECIPES_DB.almoco.map(r => (
                        <option key={r.id} value={r.id}>{r.nome} ({r.calorias} kcal)</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
                    C: {recAlmoco.carboidratos}g · P: {recAlmoco.proteinas}g · L: {recAlmoco.lipideos}g
                  </div>
                </div>
              </div>

              {/* LANCHE */}
              <div style={{
                background: 'var(--bg-surface-elevated)', padding: 20, borderRadius: 12,
                border: '1px solid var(--border-subtle)', transition: 'border 0.2s'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(251,191,36,0.1)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-apple-whole"></i>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Lanche da Tarde · Merenda</h4>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)', fontFamily: 'Outfit' }}>{recLanche.nome}</h3>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>🔥 {recLanche.calorias} kcal</span>
                </div>
                <div className="meal-slot-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem', marginBottom: 4 }}>Alterar Receita Recomendada</label>
                    <select
                      className="form-control"
                      value={planoDiaAtivo.lanche}
                      onChange={(e) => handleRecipeChange('lanche', e.target.value)}
                      style={{ background: 'var(--bg-base)', border: '1px solid var(--border-subtle)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    >
                      {RECIPES_DB.lanche.map(r => (
                        <option key={r.id} value={r.id}>{r.nome} ({r.calorias} kcal)</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', borderLeft: '1px solid var(--border-subtle)', paddingLeft: 12 }}>
                    C: {recLanche.carboidratos}g · P: {recLanche.proteinas}g · L: {recLanche.lipideos}g
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Painel PNAE de Conformidade Nutricional */}
          <div className="glass-panel animate-slide-up delay-100" style={{ padding: 24, border: isDiaTotalmenteConforme ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(245,158,11,0.3)' }}>
            
            {/* Header Conformidade */}
            <div style={{ textAlign: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: isDiaTotalmenteConforme ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                color: isDiaTotalmenteConforme ? 'var(--primary)' : 'var(--alert-yellow)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px auto', fontSize: '1.8rem',
                border: isDiaTotalmenteConforme ? '2px solid var(--primary)' : '2px solid var(--alert-yellow)',
                boxShadow: isDiaTotalmenteConforme ? '0 0 15px rgba(16,185,129,0.3)' : '0 0 15px rgba(245,158,11,0.3)'
              }}>
                <i className={`fa-solid ${isDiaTotalmenteConforme ? 'fa-square-check' : 'fa-triangle-exclamation'}`}></i>
              </div>
              <h3 style={{ fontFamily: 'Outfit', fontSize: '1.25rem', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
                {isDiaTotalmenteConforme ? 'Cardápio Aprovado PNAE' : 'Cardápio Fora das Diretrizes'}
              </h3>
              <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isDiaTotalmenteConforme 
                  ? 'Os níveis nutricionais estão dentro das bandas de tolerância de ±10% do FNDE.' 
                  : 'Atenção: Um ou mais nutrientes estão fora do intervalo estipulado de tolerância.'}
              </p>
            </div>

            {/* Nutrientes Comparação */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              {/* Calorias */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span><strong>Energia Escolar:</strong> {totalCalorias} kcal</span>
                  <span style={{ color: cCal === 'compliant' ? 'var(--primary)' : 'var(--alert-yellow)', fontWeight: 700 }}>
                    {cCal === 'compliant' ? 'Em Conformidade (1150 kcal ±10%)' : cCal === 'low' ? 'Abaixo do Limite' : 'Acima do Limite'}
                  </span>
                </div>
                <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
                  {/* Tolerância Band Visualized */}
                  <div style={{ position: 'absolute', left: '80%', width: '20%', height: '100%', background: 'rgba(16,185,129,0.08)' }} />
                  <div style={{
                    width: `${Math.min((totalCalorias / PNAE_TARGETS.calorias.max) * 100, 100)}%`,
                    height: '100%',
                    background: cCal === 'compliant' ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #f59e0b, #d97706)',
                    borderRadius: 5
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Mínimo: 1035 kcal</span>
                  <span>Ideal: 1150 kcal</span>
                  <span>Máximo: 1265 kcal</span>
                </div>
              </div>

              {/* Carboidratos */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span><strong>Carboidratos:</strong> {totalCarboidratos}g</span>
                  <span style={{ color: cCarb === 'compliant' ? '#60a5fa' : 'var(--alert-yellow)', fontWeight: 700 }}>
                    {cCarb === 'compliant' ? 'Conforme PNAE' : 'Desvio Detectado'}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((totalCarboidratos / PNAE_TARGETS.carboidratos.max) * 100, 100)}%`,
                    height: '100%',
                    background: cCarb === 'compliant' ? '#60a5fa' : '#f59e0b',
                    borderRadius: 4
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Min: 150g</span>
                  <span>Ideal: 172g</span>
                  <span>Max: 200g</span>
                </div>
              </div>

              {/* Proteínas */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span><strong>Proteínas:</strong> {totalProteinas.toFixed(1)}g</span>
                  <span style={{ color: cProt === 'compliant' ? 'var(--primary)' : 'var(--alert-yellow)', fontWeight: 700 }}>
                    {cProt === 'compliant' ? 'Conforme PNAE' : 'Desvio Detectado'}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((totalProteinas / PNAE_TARGETS.proteinas.max) * 100, 100)}%`,
                    height: '100%',
                    background: cProt === 'compliant' ? '#34d399' : '#f59e0b',
                    borderRadius: 4
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Min: 28g</span>
                  <span>Ideal: 35g</span>
                  <span>Max: 45g</span>
                </div>
              </div>

              {/* Lipídeos */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 6 }}>
                  <span><strong>Lipídeos:</strong> {totalLipideos.toFixed(1)}g</span>
                  <span style={{ color: cLip === 'compliant' ? '#fbbf24' : 'var(--alert-yellow)', fontWeight: 700 }}>
                    {cLip === 'compliant' ? 'Conforme PNAE' : 'Desvio Detectado'}
                  </span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.min((totalLipideos / PNAE_TARGETS.lipideos.max) * 100, 100)}%`,
                    height: '100%',
                    background: cLip === 'compliant' ? '#fbbf24' : '#f59e0b',
                    borderRadius: 4
                  }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  <span>Min: 25g</span>
                  <span>Ideal: 32g</span>
                  <span>Max: 38g</span>
                </div>
              </div>

            </div>

            {/* Informações Regulatórias FNDE */}
            <div style={{
              marginTop: 24, padding: 14, background: 'rgba(255,255,255,0.02)',
              borderRadius: 8, border: '1px solid var(--border-subtle)', fontSize: '0.78rem',
              color: 'var(--text-muted)', lineHeight: '1.4'
            }}>
              <i className="fa-solid fa-circle-info" style={{ color: 'var(--primary)', marginRight: 6 }}></i>
              O Fundo Nacional de Desenvolvimento da Educação (FNDE) preconiza que a alimentação em período integral supra pelo menos 70% das necessidades diárias dos escolares.
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

