export const mockEstoque = [
  { id: 1, lote: '#4920-A', hash: '0x3F...8C2', nome: 'Carne Moída Bovina', volume: '15 kg', validade: 'Vence em 3 Dias', status: 'urgente', eligible: true, maxValue: 15 },
  { id: 2, lote: '#5103-B', hash: '0x9A...2F1', nome: 'Carne Moída Bovina', volume: '50 kg', validade: 'Vence em 45 Dias', status: 'bloqueado', eligible: false, maxValue: 50 },
  { id: 3, lote: '#4801-X', hash: '0x1B...7C9', nome: 'Arroz Agulhinha Premium', volume: '120 kg', validade: 'Vence em 120 Dias', status: 'normal', eligible: true, maxValue: 120 },
  { id: 4, lote: '#4755-Z', hash: '0x5E...0D3', nome: 'Polpa de Morango', volume: '0 kg', validade: 'Consumido na Íntegra', status: 'arquivado', eligible: false, maxValue: 0 },
];

export const mockEscolas = [
  {
    id: 1, nome: 'CEI Pequeninos', diretora: 'Diretora: Márcia F.',
    health: 64, healthClass: 'health-60', badgeClass: 'badge-danger', badgeText: 'Sob Risco',
    alerta: 'Inconsistência de Orçamento Calórico detectada hoje. Vazão na cozinha incompatível com alunos da catraca (-32kg).',
    alertIcon: 'fa-triangle-exclamation', alertColor: 'var(--alert-red)',
    timelineKey: 'cei-pequeninos',
  },
  {
    id: 2, nome: 'EMEI Margarida', diretora: 'Gestora: Sônia T.',
    health: 88, healthClass: 'health-80', badgeClass: 'badge-warning', badgeText: 'Atenção',
    alerta: 'Superávit em laticínios perecíveis na despensa. Risco de validade iminente (48h restando). Evite perda imediata.',
    alertIcon: 'fa-info-circle', alertColor: 'var(--alert-yellow)',
    timelineKey: 'emei-margarida',
    remanejamentoDest: 'CEI Pequeninos',
  },
  {
    id: 3, nome: 'EMEF João Silva', diretora: 'Gestor: Carlos Roberto',
    health: 99, healthClass: 'health-100', badgeClass: 'badge-success', badgeText: 'Selo Verde',
    alerta: 'Operação em conformidade contratual. Trava FIFO utilizada rigorosamente. Frequência acompanha o consumo calórico sem discrepâncias.',
    alertIcon: 'fa-check', alertColor: 'var(--alert-green)',
    timelineKey: 'emef-joao-silva',
  },
];

export const mockTimelines = {
  'cei-pequeninos': [
    {
      id: 1, dot: 'dot-success', icon: 'fa-truck-ramp-box',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Recebimento Almoxarifado Central (Sede)',
      subtitle: 'Fornecedor: AgroSul Alimentos SA',
      badgeClass: 'badge-success', badgeText: 'Validado',
      date: '10/03/2026 - 06:15:22',
      meta: [
        { icon: 'fa-weight-scale', text: 'Peso Inicial: 15.000 kg' },
        { icon: 'fa-signature', text: 'Sig: 0x98A.B21' },
      ],
    },
    {
      id: 2, dot: 'dot-neutral', icon: 'fa-route',
      borderColor: 'var(--border-subtle)', titleClass: '',
      title: 'Desmembramento & Rota de Entrega (Transportadora LogLife)',
      subtitle: 'Lote fracionado. Motorista José C. acionou o manifesto digital na Catraca 4.',
      date: '12/03/2026 - 04:30:10',
      meta: [
        { icon: 'fa-boxes-packing', text: 'Peso Fracionado: 100 kg' },
        { icon: 'fa-location-dot', text: 'Destino: CEI Pequeninos' },
      ],
    },
    {
      id: 3, dot: 'dot-success', icon: 'fa-camera-retro',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Aprovação Óptica (QR Code) na CEI Pequeninos',
      subtitle: 'Operador Nutricionista João M. leu a guia via App e confirmou o romaneio completo no recebimento.',
      date: '12/03/2026 - 08:12:05',
      meta: [
        { icon: 'fa-weight-scale', text: 'Recebido Aferido: 100 kg' },
        { icon: 'fa-lock', text: 'Contrato Sincronizado', color: 'var(--primary)' },
      ],
    },
    {
      id: 4, dot: 'dot-danger', icon: 'fa-triangle-exclamation',
      borderColor: 'var(--alert-red)', titleClass: '', titleColor: 'var(--alert-red)',
      title: 'Anomalia Contábil/Física (Furo na Baixa de Refeição)',
      subtitle: 'O módulo preditivo cruzou o preparo vs roleta Biométrica. Há sumiço de massa da despensa.',
      date: 'Hoje - 14:05:00',
      description: 'O operador relatou perda técnica (Defeito Organoléptico) de 32 kg na hora do preparo, no entanto, a traçabilidade acusa que nenhum relato de avaria foi submetido com foto comprobatória durante as 48h de permuta estática.',
      extraGlow: true,
      meta: [
        { icon: 'fa-scale-unbalanced', text: 'Fuga: -32.0 kg' },
        { icon: 'fa-gavel', text: 'Auditoria de Campo Exigida', color: 'var(--alert-red)', bold: true },
      ],
    },
  ],
  'emei-margarida': [
    {
      id: 1, dot: 'dot-success', icon: 'fa-truck-ramp-box',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Entrega de Laticínios — Lote #6210-L',
      subtitle: 'Fornecedor: LaticíniosBom Sabor Ltda.',
      badgeClass: 'badge-success', badgeText: 'Validado',
      date: '05/04/2026 - 07:00:00',
      meta: [
        { icon: 'fa-weight-scale', text: 'Peso Inicial: 80 kg (leite, queijo, iogurte)' },
        { icon: 'fa-signature', text: 'Sig: 0x44C.F82' },
      ],
    },
    {
      id: 2, dot: 'dot-success', icon: 'fa-boxes-stacked',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Armazenamento na Despensa Refrigerada — EMEI Margarida',
      subtitle: 'Operadora Sônia T. registrou o recebimento e alocou na câmara fria (Slot 3).',
      date: '05/04/2026 - 09:15:30',
      meta: [
        { icon: 'fa-snowflake', text: 'Temperatura: 4°C (dentro do SLA)' },
        { icon: 'fa-clock', text: 'Validade: 10/04/2026 (48h restando)' },
      ],
    },
    {
      id: 3, dot: 'dot-warning', icon: 'fa-hourglass-half',
      borderColor: 'var(--alert-yellow)', titleClass: '', titleColor: 'var(--alert-yellow)',
      title: 'Alerta Preditivo: Superávit Iminente de Laticínios',
      subtitle: 'IA detectou que o consumo previsto não absorverá o estoque antes do vencimento. Risco de desperdício.',
      date: 'Hoje - 10:00:00',
      description: 'Com base na frequência dos últimos 3 dias (−15% abaixo do normal) e no cardápio planejado, o sistema projeta que haverá 22 kg de laticínios não consumidos até o vencimento em 48h.',
      meta: [
        { icon: 'fa-chart-line', text: 'Projeção de Sobra: +22 kg' },
        { icon: 'fa-truck-arrow-right', text: 'Sugestão: Remanejar para CEI Pequeninos', color: 'var(--alert-yellow)', bold: true },
      ],
    },
  ],
  'emef-joao-silva': [
    {
      id: 1, dot: 'dot-success', icon: 'fa-truck-ramp-box',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Recebimento de Grãos e Cereais — Lote #4801-X',
      subtitle: 'Fornecedor: CerealBrasil Distribuidora.',
      badgeClass: 'badge-success', badgeText: 'Validado',
      date: '01/04/2026 - 07:30:00',
      meta: [
        { icon: 'fa-weight-scale', text: 'Peso Inicial: 250 kg (arroz, feijão, macarrão)' },
        { icon: 'fa-signature', text: 'Sig: 0x1B7.C93' },
      ],
    },
    {
      id: 2, dot: 'dot-success', icon: 'fa-fire-burner',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Baixa FIFO Diária — Preparo da Cozinha',
      subtitle: 'Operadora Maria S. realizou 5 baixas de 3kg/dia de arroz e feijão sem desvios.',
      date: '01-07/04/2026',
      meta: [
        { icon: 'fa-weight-scale', text: 'Total Despachado: 30 kg (sem sobra)' },
        { icon: 'fa-check-double', text: 'FIFO Cumprido Integralmente', color: 'var(--alert-green)' },
      ],
    },
    {
      id: 3, dot: 'dot-success', icon: 'fa-shield-check',
      borderColor: 'var(--alert-green)', titleClass: 'text-gradient',
      title: 'Conformidade Total — Nenhuma Anomalia Detectada',
      subtitle: 'Todos os registros de preparo, catraca biométrica e sobra limpa batem com o estoque. Contrato em dia.',
      date: 'Hoje - 11:00:00',
      badgeClass: 'badge-success', badgeText: 'Selo Verde',
      meta: [
        { icon: 'fa-certificate', text: 'Certificado de Conformidade Ativo até 30/04/2026', color: 'var(--alert-green)' },
        { icon: 'fa-users', text: 'Refeições Servidas (Semana): 2.060 alunos' },
      ],
    },
  ],
};

// Legacy export for backward compat
export const mockTimeline = mockTimelines['cei-pequeninos'];

export const mockKpisAuditor = [
  { value: '142', label: 'Escolas Ativas', icon: 'fa-school', color: 'var(--primary)' },
  { value: '3', label: 'Alertas FIFO', icon: 'fa-triangle-exclamation', color: 'var(--alert-red)' },
  { value: '97.1%', label: 'Conformidade Geral', icon: 'fa-shield-check', color: 'var(--alert-green)' },
  { value: 'R$ 2,4M', label: 'Verba Comprometida', icon: 'fa-coins', color: 'var(--alert-yellow)' },
];

export const mockKpisGestor = [
  { value: '89%', label: 'Taxa de Aproveitamento', icon: 'fa-chart-simple', color: 'var(--alert-green)' },
  { value: '2.4 kg', label: 'Sobra Limpa (Hoje)', icon: 'fa-scale-unbalanced', color: 'var(--alert-yellow)' },
  { value: '412', label: 'Refeições Servidas', icon: 'fa-utensils', color: 'var(--primary)' },
  { value: '14', label: 'Itens em Estoque', icon: 'fa-boxes-stacked', color: 'var(--alert-blue)' },
];

export const mockAlertasAuditor = [
  { escola: 'CEI Pequeninos', tipo: 'Sobra Excessiva', gravidade: 'danger', desc: '-32kg não justificados', data: 'Hoje', acao: 'Investigar', timelineKey: 'cei-pequeninos' },
  { escola: 'EMEI Margarida', tipo: 'Validade Iminente', gravidade: 'warning', desc: 'Laticínios vencendo em 48h', data: 'Hoje', acao: 'Investigar', timelineKey: 'emei-margarida' },
  { escola: 'EMEF Castro Alves', tipo: 'Atraso de Romaneio', gravidade: 'warning', desc: 'Entrega D-2 sem conferência', data: 'Ontem', acao: 'Investigar', timelineKey: 'emef-joao-silva' },
];

export const mockChartData = {
  labels: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex'],
  real: [380, 412, 395, 420, 408],
  predito: [390, 400, 405, 415, 410],
};
