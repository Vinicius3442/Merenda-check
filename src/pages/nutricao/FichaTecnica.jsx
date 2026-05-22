import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { tacoDatabase, calcularNutrientes } from '../../data/tacoDatabase';

// Receitas iniciais com referência a IDs da Tabela TACO e gramaturas por porção
const RECEITAS_INICIAIS = [
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
  },
  {
    id: 'rec-sopa',
    nome: 'Sopa de Macarrão',
    tipo: 'Creches',
    rendimento: '1 Porção (200ml)',
    custoBase: 0.90,
    ingredientes: [
      { idInsumo: 'taco-010', gramas: 30 }, // Macarrão
      { idInsumo: 'taco-004', gramas: 15 }, // Carne moída
      { idInsumo: 'taco-014', gramas: 20 }, // Batata
      { idInsumo: 'taco-012', gramas: 5 }   // Cebola
    ]
  }
];

export default function FichaTecnica() {
  const [receitas, setReceitas] = useState(RECEITAS_INICIAIS);
  const [selectedRecId, setSelectedRecId] = useState('rec-picadinho');
  const [editMode, setEditMode] = useState(false);
  const [buscarInsumo, setBuscarInsumo] = useState('');
  const [insumoSelecionado, setInsumoSelecionado] = useState(null);
  const [gramasInput, setGramasInput] = useState('');
  const [mostrarAutocomplete, setMostrarAutocomplete] = useState(false);

  // Receita Ativa
  const receitaAtiva = receitas.find(r => r.id === selectedRecId) || receitas[0];

  // Obter detalhes nutricionais para cada ingrediente da receita ativa
  const ingredientesCalculados = receitaAtiva.ingredientes.map(ing => {
    const macros = calcularNutrientes(ing.idInsumo, ing.gramas);
    return {
      ...ing,
      nome: macros?.alimento?.nome || 'Insumo não encontrado',
      calorias: macros?.calorias || 0,
      carboidratos: macros?.carboidratos || 0,
      proteinas: macros?.proteinas || 0,
      lipideos: macros?.lipideos || 0,
      categoria: macros?.alimento?.categoria || ''
    };
  });

  // Calcular macros consolidados da receita ativa
  const macrosTotais = ingredientesCalculados.reduce((acc, curr) => ({
    calorias: acc.calorias + curr.calorias,
    carboidratos: acc.carboidratos + curr.carboidratos,
    proteinas: acc.proteinas + curr.proteinas,
    lipideos: acc.lipideos + curr.lipideos,
    pesoTotal: acc.pesoTotal + curr.gramas
  }), { calorias: 0, carboidratos: 0, proteinas: 0, lipideos: 0, pesoTotal: 0 });

  // Calcular percentuais calóricos (Calorias por grama: Carb=4, Prot=4, Lip=9)
  const kcalCarb = macrosTotais.carboidratos * 4;
  const kcalProt = macrosTotais.proteinas * 4;
  const kcalLip = macrosTotais.lipideos * 9;
  const kcalTotalMacros = kcalCarb + kcalProt + kcalLip || 1;

  const pctCarb = Math.round((kcalCarb / kcalTotalMacros) * 100);
  const pctProt = Math.round((kcalProt / kcalTotalMacros) * 100);
  const pctLip = Math.round((kcalLip / kcalTotalMacros) * 100);

  // Filtrar banco TACO para o autocomplete
  const insumosFiltrados = buscarInsumo
    ? tacoDatabase.filter(item =>
        item.nome.toLowerCase().includes(buscarInsumo.toLowerCase())
      )
    : tacoDatabase.slice(0, 5);

  // Adicionar ingrediente à receita ativa
  const handleAdicionarIngrediente = (e) => {
    e.preventDefault();
    if (!insumoSelecionado || !gramasInput || isNaN(gramasInput)) return;

    const gramas = parseFloat(gramasInput);
    
    // Atualiza a receita ativa no estado
    setReceitas(prev => prev.map(rec => {
      if (rec.id === selectedRecId) {
        // Se o ingrediente já existe, soma a gramatura
        const existenteIdx = rec.ingredientes.findIndex(ing => ing.idInsumo === insumoSelecionado.id);
        let novosIngredientes = [...rec.ingredientes];
        if (existenteIdx > -1) {
          novosIngredientes[existenteIdx] = {
            ...novosIngredientes[existenteIdx],
            gramas: novosIngredientes[existenteIdx].gramas + gramas
          };
        } else {
          novosIngredientes.push({ idInsumo: insumoSelecionado.id, gramas });
        }
        return { ...rec, ingredientes: novosIngredientes };
      }
      return rec;
    }));

    // Reset formulário
    setBuscarInsumo('');
    setInsumoSelecionado(null);
    setGramasInput('');
    setMostrarAutocomplete(false);
  };

  // Remover ingrediente
  const handleRemoverIngrediente = (idInsumo) => {
    setReceitas(prev => prev.map(rec => {
      if (rec.id === selectedRecId) {
        return {
          ...rec,
          ingredientes: rec.ingredientes.filter(ing => ing.idInsumo !== idInsumo)
        };
      }
      return rec;
    }));
  };

  // Criar nova receita
  const handleNovaReceita = () => {
    const nome = prompt('Nome da Nova Receita:', 'Receita Nova');
    if (!nome) return;
    const tipo = prompt('Tipo de Refeição (ex: Almoço Escolar, Desjejum, Creches):', 'Almoço Escolar');
    const rendimento = prompt('Rendimento per Capita (ex: 1 Porção (130g)):', '1 Porção (100g)');
    
    const novaRec = {
      id: `rec-${Date.now()}`,
      nome,
      tipo: tipo || 'Almoço Escolar',
      rendimento: rendimento || '1 Porção (100g)',
      custoBase: 1.20,
      ingredientes: []
    };

    setReceitas(prev => [...prev, novaRec]);
    setSelectedRecId(novaRec.id);
    setEditMode(true);
  };

  return (
    <DashboardLayout>
      <div className="header-dash animate-fade-in">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <i className="fa-solid fa-apple-whole" style={{ color: 'var(--primary)' }}></i>
            Formulação Nutricional (Tabela TACO)
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Autocomplete de macronutrientes baseado na base UNICAMP (TACO) e controle PNAE.
          </p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={handleNovaReceita}>
            <i className="fa-solid fa-plus"></i> Nova Receita
          </button>
        </div>
      </div>

      <div className="responsive-two-cols">
        
        {/* Lista de Receitas */}
        <div className="glass-panel animate-slide-up" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'Outfit', fontSize: '1rem', color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            Fichas Ativas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {receitas.map(rec => {
              const isSelected = rec.id === selectedRecId;
              return (
                <div
                  key={rec.id}
                  onClick={() => { setSelectedRecId(rec.id); setEditMode(false); }}
                  style={{
                    padding: 16,
                    background: isSelected ? 'var(--primary)' : 'var(--bg-surface-elevated)',
                    color: isSelected ? '#fff' : 'var(--text-main)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                    transition: 'all 0.2s',
                    boxShadow: isSelected ? 'inset 20px 0 30px -10px rgba(0,0,0,0.2)' : 'none'
                  }}
                >
                  <strong style={isSelected ? { color: '#fff' } : {}}>{rec.nome}</strong>
                  <div style={{ fontSize: '0.8rem', opacity: isSelected ? 0.8 : 0.6, marginTop: 4 }}>
                    {rec.tipo} · {rec.rendimento}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detalhes da Ficha & Formulation Workspace */}
        <div className="glass-panel animate-slide-up delay-100" style={{ padding: 30 }}>
          
          {/* Header Receita */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-subtle)' }}>
            <div>
              <h2 style={{ fontFamily: 'Outfit', margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>{receitaAtiva.nome}</h2>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                <span><i className="fa-solid fa-scale-balanced" style={{ marginRight: 6 }}></i> Rende {receitaAtiva.rendimento}</span>
                <span><i className="fa-solid fa-weight-scale" style={{ marginRight: 6 }}></i> {macrosTotais.pesoTotal.toFixed(1)}g per capita</span>
                <span><i className="fa-solid fa-sack-dollar" style={{ marginRight: 6 }}></i> R$ {receitaAtiva.custoBase.toFixed(2)} / Prato</span>
              </div>
            </div>
            <button
              className={`btn ${editMode ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              onClick={() => setEditMode(!editMode)}
            >
              <i className={`fa-solid ${editMode ? 'fa-check' : 'fa-pen'}`}></i> {editMode ? 'Concluir Edição' : 'Editar Ficha'}
            </button>
          </div>

          {/* Autocompleter TACO Form (Apenas se editMode for verdadeiro) */}
          {editMode && (
            <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 12, padding: 20, border: '1px solid var(--border-subtle)', marginBottom: 24 }}>
              <h4 style={{ margin: '0 0 16px 0', fontFamily: 'Outfit', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                <i className="fa-solid fa-search" style={{ marginRight: 8, color: 'var(--primary)' }}></i>
                Adicionar Insumo da Tabela TACO
              </h4>
              <form onSubmit={handleAdicionarIngrediente} className="responsive-form-grid">
                <div style={{ position: 'relative' }} className="form-group">
                  <label className="form-label">Nome do Alimento</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Busque ex: Arroz, Feijão..."
                    value={buscarInsumo}
                    onChange={(e) => {
                      setBuscarInsumo(e.target.value);
                      setMostrarAutocomplete(true);
                    }}
                    onFocus={() => setMostrarAutocomplete(true)}
                  />
                  {mostrarAutocomplete && (
                    <div style={{
                      position: 'absolute', top: '100%', left: 0, right: 0,
                      background: 'var(--bg-base)', border: '1px solid var(--border-subtle)',
                      borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                      zIndex: 10, maxHeights: 200, overflowY: 'auto', marginTop: 4
                    }}>
                      {insumosFiltrados.map(ins => (
                        <div
                          key={ins.id}
                          onClick={() => {
                            setInsumoSelecionado(ins);
                            setBuscarInsumo(ins.nome);
                            setMostrarAutocomplete(false);
                          }}
                          style={{
                            padding: '10px 14px', cursor: 'pointer',
                            borderBottom: '1px solid var(--border-subtle)',
                            color: 'var(--text-main)', fontSize: '0.85rem'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >
                          <strong>{ins.nome}</strong> <span style={{ float: 'right', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{ins.categoria}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">Gramas (g)</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="ex: 50"
                    value={gramasInput}
                    onChange={(e) => setGramasInput(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ padding: 12, width: '100%' }}>
                  <i className="fa-solid fa-plus"></i> Inserir
                </button>
              </form>

              {/* Informações nutricionais prévias do insumo selecionado */}
              {insumoSelecionado && gramasInput && !isNaN(gramasInput) && (
                <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(5, 150, 105, 0.05)', border: '1px solid rgba(5,150,105,0.2)', borderRadius: 8, fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                  <span>Cálculo Prévio para ({gramasInput}g):</span>
                  <span style={{ color: 'var(--primary)' }}>🔥 {Math.round(insumoSelecionado.calorias * (parseFloat(gramasInput)/100))} kcal</span>
                  <span>🍞 Carb: {((insumoSelecionado.carboidratos * parseFloat(gramasInput))/100).toFixed(1)}g</span>
                  <span>🥩 Prot: {((insumoSelecionado.proteinas * parseFloat(gramasInput))/100).toFixed(1)}g</span>
                  <span>🧈 Lip: {((insumoSelecionado.lipideos * parseFloat(gramasInput))/100).toFixed(1)}g</span>
                </div>
              )}
            </div>
          )}

          {/* Tabela de Formulação */}
          <h4 style={{ marginBottom: 16, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <i className="fa-solid fa-list-check" style={{ color: 'var(--primary)' }}></i>
            Ingredientes da Capitação per Capita (Calculados via TACO)
          </h4>
          <div className="table-wrapper" style={{ marginBottom: 30 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Insumo Base</th>
                  <th>Gramatura (g)</th>
                  <th>Energia (kcal)</th>
                  <th>Macros (C/P/L)</th>
                  {editMode && <th style={{ textAlign: 'center' }}>Remover</th>}
                </tr>
              </thead>
              <tbody>
                {ingredientesCalculados.map((ing, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 600, color: '#f1f5f9' }}>{ing.nome}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{ing.gramas}g</td>
                    <td>{ing.calorias} kcal</td>
                    <td style={{ color: '#94a3b8', fontSize: '0.82rem' }}>
                      {ing.carboidratos}g / {ing.proteinas}g / {ing.lipideos}g
                    </td>
                    {editMode && (
                      <td style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => handleRemoverIngrediente(ing.idInsumo)}
                          style={{ background: 'transparent', border: 'none', color: 'var(--alert-red)', cursor: 'pointer', fontSize: '1rem' }}
                        >
                          <i className="fa-solid fa-trash-can"></i>
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {ingredientesCalculados.length === 0 && (
                  <tr>
                    <td colSpan={editMode ? 5 : 4} style={{ textAlign: 'center', padding: 24, color: 'var(--text-muted)' }}>
                      Nenhum insumo adicionado ainda. Ative o modo edição para compor a receita.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* display visual premium de macronutrientes da receita */}
          <div style={{ background: 'var(--bg-surface-elevated)', borderRadius: 16, padding: '24px 30px', border: '1px solid var(--border-subtle)' }}>
            <h4 style={{ margin: '0 0 16px 0', fontFamily: 'Outfit', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fa-solid fa-chart-pie" style={{ color: 'var(--primary)' }}></i>
              Composição Nutricional da Porção
            </h4>

            <div className="responsive-macro-grid">
              
              {/* Caloria Card */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.02))',
                border: '1px solid rgba(16,185,129,0.2)',
                borderRadius: 12, padding: '20px 16px', textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>
                  Valor Calórico Total
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', fontFamily: 'Outfit' }}>
                  {macrosTotais.calorias}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  kcal per capita
                </div>
              </div>

              {/* Progress bars macros */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                
                {/* Carboidratos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}><i className="fa-solid fa-bread-slice" style={{ color: '#60a5fa', marginRight: 6 }}></i> Carboidratos</span>
                    <strong style={{ color: 'var(--text-main)' }}>{macrosTotais.carboidratos.toFixed(1)}g <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.75rem' }}>({pctCarb}%)</span></strong>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pctCarb}%`, height: '100%', background: '#60a5fa', borderRadius: 4 }} />
                  </div>
                </div>

                {/* Proteínas */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}><i className="fa-solid fa-egg" style={{ color: '#34d399', marginRight: 6 }}></i> Proteínas</span>
                    <strong style={{ color: 'var(--text-main)' }}>{macrosTotais.proteinas.toFixed(1)}g <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.75rem' }}>({pctProt}%)</span></strong>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pctProt}%`, height: '100%', background: '#34d399', borderRadius: 4 }} />
                  </div>
                </div>

                {/* Lipídeos */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600 }}><i className="fa-solid fa-cheese" style={{ color: '#fbbf24', marginRight: 6 }}></i> Lipídeos</span>
                    <strong style={{ color: 'var(--text-main)' }}>{macrosTotais.lipideos.toFixed(1)}g <span style={{ color: 'var(--text-muted)', fontWeight: 'normal', fontSize: '0.75rem' }}>({pctLip}%)</span></strong>
                  </div>
                  <div style={{ height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ width: `${pctLip}%`, height: '100%', background: '#fbbf24', borderRadius: 4 }} />
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

