import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hplvaxihexvbogqwkotf.supabase.co';
const supabaseAnonKey = 'sb_publishable_iafduRT1U2qmXvx9zKO-gg_zhvMgjtm';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  await supabase.auth.signInWithPassword({
    email: 'admin@merendacheck.gov.br',
    password: 'Merenda@2026'
  });

  const txHash = '0x112233445566778899aabbccddeeff';
  
  const { data, error } = await supabase.from('lotes_transporte').insert([{
    fornecedor_id: 'aaaa0001-0000-0000-0000-000000000001',
    nota_fiscal: 'NF-DEMO-999',
    placa: 'KZT-8899',
    motorista: 'Claudio Roberto',
    origem: 'Almoxarifado Central',
    destino_escola: '33333333-3333-3333-3333-333333333333',
    tx_hash: txHash,
    status: 'em_transito',
    itens: [
      { descricao: 'Arroz Agulhinha', qtd: 150, unidade: 'kg', validade: '2026-12-01' },
      { descricao: 'Feijão Preto', qtd: 80, unidade: 'kg', validade: '2026-11-15' }
    ]
  }]).select();

  if (error) {
    console.error('Erro ao inserir lote:', error);
  } else {
    console.log('Lote inserido com sucesso:', data[0].id);
  }
}

run();
