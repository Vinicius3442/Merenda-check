// Tabela Brasileira de Composição de Alimentos (TACO - UNICAMP)
// Valores de macronutrientes e calorias referenciados por 100g ou 100ml de alimento

export const tacoDatabase = [
  {
    id: 'taco-001',
    nome: 'Arroz Agulhinha Cozido',
    calorias: 128,
    carboidratos: 28.1,
    proteinas: 2.5,
    lipideos: 0.2,
    categoria: 'Cereais e derivados'
  },
  {
    id: 'taco-002',
    nome: 'Feijão Carioca Cozido',
    calorias: 76,
    carboidratos: 13.6,
    proteinas: 4.8,
    lipideos: 0.5,
    categoria: 'Leguminosas e derivados'
  },
  {
    id: 'taco-003',
    nome: 'Feijão Preto Cozido',
    calorias: 77,
    carboidratos: 14.0,
    proteinas: 4.5,
    lipideos: 0.5,
    categoria: 'Leguminosas e derivados'
  },
  {
    id: 'taco-004',
    nome: 'Carne Bovina Moída (Patinho)',
    calorias: 219,
    carboidratos: 0.0,
    proteinas: 35.9,
    lipideos: 7.3,
    categoria: 'Carnes e derivados'
  },
  {
    id: 'taco-005',
    nome: 'Peito de Frango Sem Pele Grelhado',
    calorias: 159,
    carboidratos: 0.0,
    proteinas: 32.0,
    lipideos: 2.5,
    categoria: 'Carnes e derivados'
  },
  {
    id: 'taco-006',
    nome: 'Leite de Vaca Integral',
    calorias: 60,
    carboidratos: 4.7,
    proteinas: 3.2,
    lipideos: 3.3,
    categoria: 'Leite e derivados'
  },
  {
    id: 'taco-007',
    nome: 'Pão Francês',
    calorias: 300,
    carboidratos: 58.6,
    proteinas: 8.0,
    lipideos: 3.1,
    categoria: 'Cereais e derivados'
  },
  {
    id: 'taco-008',
    nome: 'Banana Prata',
    calorias: 98,
    carboidratos: 26.0,
    proteinas: 1.3,
    lipideos: 0.3,
    categoria: 'Frutas e derivados'
  },
  {
    id: 'taco-009',
    nome: 'Maçã Fuji Com Casca',
    calorias: 56,
    carboidratos: 15.2,
    proteinas: 0.3,
    lipideos: 0.0,
    categoria: 'Frutas e derivados'
  },
  {
    id: 'taco-010',
    nome: 'Macarrão Espaguete Cozido',
    calorias: 140,
    carboidratos: 28.5,
    proteinas: 4.6,
    lipideos: 0.5,
    categoria: 'Cereais e derivados'
  },
  {
    id: 'taco-011',
    nome: 'Polpa de Tomate',
    calorias: 28,
    carboidratos: 6.2,
    proteinas: 1.2,
    lipideos: 0.1,
    categoria: 'Hortaliças e derivados'
  },
  {
    id: 'taco-012',
    nome: 'Cebola Branca',
    calorias: 39,
    carboidratos: 8.9,
    proteinas: 1.1,
    lipideos: 0.1,
    categoria: 'Hortaliças e derivados'
  },
  {
    id: 'taco-013',
    nome: 'Alho Cru',
    calorias: 113,
    carboidratos: 23.9,
    proteinas: 5.3,
    lipideos: 0.2,
    categoria: 'Hortaliças e derivados'
  },
  {
    id: 'taco-014',
    nome: 'Batata Inglesa Cozida',
    calorias: 85,
    carboidratos: 19.1,
    proteinas: 1.8,
    lipideos: 0.0,
    categoria: 'Hortaliças e derivados'
  },
  {
    id: 'taco-015',
    nome: 'Abóbora Cabotiá Cozida',
    calorias: 48,
    carboidratos: 10.8,
    proteinas: 1.4,
    lipideos: 0.7,
    categoria: 'Hortaliças e derivados'
  },
  {
    id: 'taco-016',
    nome: 'Ovo de Galinha Inteiro Cozido',
    calorias: 155,
    carboidratos: 0.6,
    proteinas: 13.0,
    lipideos: 11.0,
    categoria: 'Ovos'
  },
  {
    id: 'taco-017',
    nome: 'Óleo de Soja',
    calorias: 884,
    carboidratos: 0.0,
    proteinas: 0.0,
    lipideos: 100.0,
    categoria: 'Óleos e gorduras'
  },
  {
    id: 'taco-018',
    nome: 'Polpa de Morango Congelada',
    calorias: 31,
    carboidratos: 6.8,
    proteinas: 0.8,
    lipideos: 0.3,
    categoria: 'Frutas e derivados'
  },
  {
    id: 'taco-019',
    nome: 'Queijo Mozarela',
    calorias: 280,
    carboidratos: 3.0,
    proteinas: 22.6,
    lipideos: 20.0,
    categoria: 'Leite e derivados'
  },
  {
    id: 'taco-020',
    nome: 'Iogurte Natural Integral',
    calorias: 61,
    carboidratos: 4.7,
    proteinas: 3.5,
    lipideos: 3.3,
    categoria: 'Leite e derivados'
  }
];

// Função auxiliar para calcular macros com base na gramatura do insumo
export function calcularNutrientes(idInsumo, gramas) {
  const alimento = tacoDatabase.find(item => item.id === idInsumo);
  if (!alimento) return null;

  const fator = gramas / 100;
  return {
    calorias: Math.round(alimento.calorias * fator),
    carboidratos: parseFloat((alimento.carboidratos * fator).toFixed(1)),
    proteinas: parseFloat((alimento.proteinas * fator).toFixed(1)),
    lipideos: parseFloat((alimento.lipideos * fator).toFixed(1)),
    alimento
  };
}
