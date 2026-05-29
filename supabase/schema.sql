create extension if not exists "uuid-ossp";

-- ============================================================
-- 1. TABELA: escolas
-- ============================================================
create table if not exists public.escolas (
  id              uuid primary key default uuid_generate_v4(),
  nome            text not null,
  diretora        text,
  endereco        text,
  lat             numeric(10,6),
  lng             numeric(10,6),
  health          int default 100 check (health between 0 and 100),
  status          text default 'normal' check (status in ('normal','atencao','urgente')),
  criado_em       timestamptz default now()
);

alter table public.escolas enable row level security;
-- Políticas de RLS da tabela escolas movidas para depois da tabela usuarios (evita erro 42P01)

-- ============================================================
-- 2. TABELA: usuarios (perfis RBAC vinculados ao Auth)
-- ============================================================
create table if not exists public.usuarios (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  nome        text not null,
  email       text not null unique,
  role        text not null check (role in ('operador','gestor','auditor','nutricao','licitacao','transportadora','admin')),
  iniciais    text not null,
  escola_id   uuid references public.escolas(id) on delete set null,
  status      text not null default 'ativo' check (status in ('ativo','inativo')),
  criado_em   timestamptz default now()
);

alter table public.usuarios enable row level security;

-- Função helper para evitar recursão infinita no RLS
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.usuarios
    where auth_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

create policy "Leitura pública de usuários" on public.usuarios
  for select using (auth.role() = 'authenticated');
create policy "Admin gerencia usuários" on public.usuarios
  for all using (public.is_admin());

-- Políticas da tabela escolas dependem da tabela usuarios
create policy "Leitura de escolas" on public.escolas
  for select using (auth.role() = 'authenticated');
create policy "Gestão de escolas" on public.escolas
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','gestor','auditor'))
  );

-- ============================================================
-- 3. TABELA: fornecedores
-- ============================================================
create table if not exists public.fornecedores (
  id              uuid primary key default uuid_generate_v4(),
  nome            text not null,
  cnpj            text unique,
  contato         text,
  email           text,
  telefone        text,
  status_ceis     text default 'Limpo' check (status_ceis in ('Limpo','Suspenso','Inidôneo')),
  categoria       text default 'Geral',
  uf              text default 'SP',
  criado_em       timestamptz default now()
);

alter table public.fornecedores enable row level security;
create policy "Leitura de fornecedores" on public.fornecedores
  for select using (auth.role() = 'authenticated');
create policy "Gestão de fornecedores" on public.fornecedores
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','licitacao','auditor'))
  );

-- ============================================================
-- 4. TABELA: contratos (empenhos/licitações)
-- ============================================================
create table if not exists public.contratos (
  id              uuid primary key default uuid_generate_v4(),
  fornecedor_id   uuid references public.fornecedores(id),
  numero          text not null unique,
  objeto          text not null,
  valor_total     numeric(14,2) not null default 0,
  valor_executado numeric(14,2) not null default 0,
  data_inicio     date,
  data_fim        date,
  modalidade      text default 'Pregão Eletrônico',
  status          text default 'vigente' check (status in ('vigente','encerrado','suspenso','em_licitacao')),
  criado_em       timestamptz default now()
);

alter table public.contratos enable row level security;
create policy "Leitura de contratos" on public.contratos
  for select using (auth.role() = 'authenticated');
create policy "Gestão de contratos" on public.contratos
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','licitacao'))
  );

-- ============================================================
-- 5. TABELA: lotes_transporte (romaneios blockchain da transportadora)
-- ============================================================
create table if not exists public.lotes_transporte (
  id              uuid primary key default uuid_generate_v4(),
  fornecedor_id   uuid references public.fornecedores(id),
  nota_fiscal     text,
  placa           text not null,
  motorista       text not null,
  origem          text,
  destino_escola  uuid references public.escolas(id),
  tx_hash         text unique,
  qr_data         text,
  status          text default 'em_transito' check (status in ('em_transito','entregue','devolvido','cancelado')),
  itens           jsonb not null default '[]',
  criado_em       timestamptz default now(),
  entregue_em     timestamptz
);

alter table public.lotes_transporte enable row level security;
create policy "Leitura de lotes" on public.lotes_transporte
  for select using (auth.role() = 'authenticated');
create policy "Gestão de lotes" on public.lotes_transporte
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','transportadora','auditor','operador'))
  );

-- ============================================================
-- 6. TABELA: estoque (lotes de insumos nas escolas)
-- ============================================================
create table if not exists public.estoque (
  id              uuid primary key default uuid_generate_v4(),
  escola_id       uuid references public.escolas(id),
  lote_transporte_id uuid references public.lotes_transporte(id),
  lote            text not null,
  hash            text,
  nome            text not null,
  volume_kg       numeric(10,3) not null default 0,
  validade        date,
  status          text not null default 'normal' check (status in ('normal','urgente','bloqueado','arquivado')),
  eligible        boolean default true,
  criado_em       timestamptz default now(),
  atualizado_em   timestamptz default now()
);

alter table public.estoque enable row level security;
create policy "Leitura de estoque" on public.estoque
  for select using (auth.role() = 'authenticated');
create policy "Gestão de estoque" on public.estoque
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','gestor','operador','auditor'))
  );

-- ============================================================
-- 7. TABELA: movimentacoes (entradas, baixas, saídas, sobras)
-- ============================================================
create table if not exists public.movimentacoes (
  id              uuid primary key default uuid_generate_v4(),
  estoque_id      uuid references public.estoque(id),
  escola_id       uuid references public.escolas(id),
  escola_destino_id uuid references public.escolas(id),
  tipo            text not null check (tipo in ('entrada','saida','baixa','sobra','remanejamento')),
  quantidade_kg   numeric(10,3) not null,
  observacao      text,
  usuario_id      uuid references public.usuarios(id),
  criado_em       timestamptz default now()
);

alter table public.movimentacoes enable row level security;
create policy "Leitura de movimentações" on public.movimentacoes
  for select using (auth.role() = 'authenticated');
create policy "Registro de movimentações" on public.movimentacoes
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 8. TABELA: refeicoes (apontamento diário de refeições servidas)
-- ============================================================
create table if not exists public.refeicoes (
  id              uuid primary key default uuid_generate_v4(),
  escola_id       uuid references public.escolas(id),
  total_servidos  int not null default 0,
  resto_kg        numeric(8,3) default 0,
  motivo_resto    text,
  data_ref        date not null default current_date,
  turno           text default 'almoco' check (turno in ('cafe','almoco','lanche','janta')),
  usuario_id      uuid references public.usuarios(id),
  criado_em       timestamptz default now()
);

alter table public.refeicoes enable row level security;
create policy "Leitura de refeições" on public.refeicoes
  for select using (auth.role() = 'authenticated');
create policy "Registro de refeições" on public.refeicoes
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- 9. TABELA: alertas
-- ============================================================
create table if not exists public.alertas (
  id              uuid primary key default uuid_generate_v4(),
  escola_id       uuid references public.escolas(id),
  tipo            text not null,
  gravidade       text not null check (gravidade in ('danger','warning','info')),
  descricao       text not null,
  resolvido       boolean default false,
  resolvido_por   uuid references public.usuarios(id),
  resolvido_em    timestamptz,
  criado_em       timestamptz default now()
);

alter table public.alertas enable row level security;
create policy "Leitura de alertas" on public.alertas
  for select using (auth.role() = 'authenticated');
create policy "Gestão de alertas" on public.alertas
  for all using (
    exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','auditor'))
  );

-- ============================================================
-- 10. TABELA: cardapios (planejamento semanal PNAE)
-- ============================================================
create table if not exists public.cardapios (
  id              uuid primary key default uuid_generate_v4(),
  escola_id       uuid references public.escolas(id) on delete cascade,
  semana          text not null,
  plano           jsonb not null,
  criado_por      uuid references public.usuarios(id),
  criado_em       timestamptz default now(),
  atualizado_em   timestamptz default now(),
  unique (escola_id, semana)
);

alter table public.cardapios enable row level security;
create policy "Leitura de cardápios" on public.cardapios
  for select using (auth.role() = 'authenticated');
create policy "Gestão de cardápios" on public.cardapios
  for all using (auth.role() = 'authenticated');

-- ============================================================
-- 11. TABELA: audit_trail (log imutável de ações do sistema)
-- ============================================================
create table if not exists public.audit_trail (
  id              uuid primary key default uuid_generate_v4(),
  usuario_id      uuid references public.usuarios(id),
  usuario_email   text,
  acao            text not null,
  tabela_afetada  text,
  registro_id     text,
  dados_anteriores jsonb,
  dados_novos     jsonb,
  ip_origem       text,
  criado_em       timestamptz default now()
);

alter table public.audit_trail enable row level security;
create policy "Leitura de audit trail (admins)" on public.audit_trail
  for select using (public.is_admin());
create policy "Inserção de audit trail" on public.audit_trail
  for insert with check (auth.role() = 'authenticated');

-- ============================================================
-- FUNÇÃO: Atualizar timestamp automaticamente no estoque
-- ============================================================
create or replace function public.atualizar_timestamp()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

create trigger estoque_atualizar_timestamp
  before update on public.estoque
  for each row execute function public.atualizar_timestamp();

create trigger cardapios_atualizar_timestamp
  before update on public.cardapios
  for each row execute function public.atualizar_timestamp();

-- ============================================================
-- FUNÇÃO: Gerar alerta automático quando estoque fica crítico
-- ============================================================
create or replace function public.verificar_estoque_critico()
returns trigger as $$
begin
  -- Alerta validade em 7 dias
  if new.validade is not null and new.validade <= current_date + 7 and new.validade >= current_date and new.status != 'arquivado' then
    insert into public.alertas (escola_id, tipo, gravidade, descricao)
    values (
      new.escola_id,
      'Validade Iminente',
      case when new.validade <= current_date + 3 then 'danger' else 'warning' end,
      format('Lote %s (%s): vence em %s dias', new.lote, new.nome, new.validade - current_date)
    )
    on conflict do nothing;
  end if;
  -- Alerta estoque zerado
  if new.volume_kg = 0 and old.volume_kg > 0 then
    insert into public.alertas (escola_id, tipo, gravidade, descricao)
    values (
      new.escola_id,
      'Estoque Esgotado',
      'info',
      format('Lote %s (%s) consumido na íntegra. Solicite reposição.', new.lote, new.nome)
    )
    on conflict do nothing;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger estoque_verificar_critico
  after update on public.estoque
  for each row execute function public.verificar_estoque_critico();

-- ============================================================
-- SEED: Dados de demonstração completos
-- ============================================================

-- Escolas
insert into public.escolas (id, nome, diretora, endereco, lat, lng, health, status) values
  ('11111111-1111-1111-1111-111111111111', 'CEI Pequeninos',   'Diretora: Márcia F.',       'Rua das Flores, 120 - Centro',     -23.5500, -46.6330, 64, 'urgente'),
  ('22222222-2222-2222-2222-222222222222', 'EMEI Margarida',   'Gestora: Sônia T.',         'Av. Brasil, 450 - Jardim América',  -23.5520, -46.6380, 88, 'atencao'),
  ('33333333-3333-3333-3333-333333333333', 'EMEF João Silva',  'Gestor: Carlos Roberto',    'Rua XV de Novembro, 800 - Vila Nova', -23.5490, -46.6300, 99, 'normal')
on conflict (id) do nothing;

-- Fornecedores
insert into public.fornecedores (id, nome, cnpj, contato, status_ceis, categoria, uf) values
  ('aaaa0001-0000-0000-0000-000000000001', 'AgroSul Alimentos SA',        '10.432.567/0001-10', 'comercial@agrosul.com.br',      'Limpo',    'Proteínas/Carnes', 'RS'),
  ('aaaa0002-0000-0000-0000-000000000002', 'CerealBrasil Distribuidora',  '22.543.678/0001-22', 'vendas@cerealbrasil.com.br',    'Limpo',    'Grãos/Cereais',   'GO'),
  ('aaaa0003-0000-0000-0000-000000000003', 'Laticínios Bom Sabor Ltda.',  '33.654.789/0001-33', 'comercial@bomsabor.com.br',     'Limpo',    'Laticínios',      'MG'),
  ('aaaa0004-0000-0000-0000-000000000004', 'Hortifruti Verde Vale',        '44.765.890/0001-44', 'pedidos@verdevale.com.br',      'Suspenso', 'Hortifruti',      'SP')
on conflict do nothing;

-- Contratos
insert into public.contratos (id, fornecedor_id, numero, objeto, valor_total, valor_executado, data_inicio, data_fim, modalidade, status) values
  ('cccc0001-0000-0000-0000-000000000001', 'aaaa0001-0000-0000-0000-000000000001', '2026/PE-001', 'Fornecimento de carnes bovina e suína para PNAE', 480000.00, 312000.00, '2026-01-01', '2026-12-31', 'Pregão Eletrônico', 'vigente'),
  ('cccc0002-0000-0000-0000-000000000002', 'aaaa0002-0000-0000-0000-000000000002', '2026/PE-002', 'Fornecimento de grãos, cereais e massas para PNAE', 210000.00, 140000.00, '2026-01-01', '2026-12-31', 'Pregão Eletrônico', 'vigente'),
  ('cccc0003-0000-0000-0000-000000000003', 'aaaa0003-0000-0000-0000-000000000003', '2026/PE-003', 'Fornecimento de laticínios e derivados para PNAE',  180000.00, 95000.00,  '2026-01-01', '2026-12-31', 'Pregão Eletrônico', 'vigente'),
  ('cccc0004-0000-0000-0000-000000000004', 'aaaa0004-0000-0000-0000-000000000004', '2025/TP-010', 'Fornecimento de hortifrutigranjeiros — ENCERRADO',  95000.00,  95000.00,  '2025-01-01', '2025-12-31', 'Tomada de Preços',  'encerrado')
on conflict do nothing;

-- Lote de transporte demo
insert into public.lotes_transporte (id, fornecedor_id, nota_fiscal, placa, motorista, origem, destino_escola, tx_hash, status, itens) values
  (
    '10010001-0000-0000-0000-000000000001',
    'aaaa0001-0000-0000-0000-000000000001',
    'NF-00234',
    'ABC-1234',
    'José Carlos da Silva',
    'Centro de Distribuição Central',
    '11111111-1111-1111-1111-111111111111',
    '0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b',
    'entregue',
    '[{"descricao":"Carne Moída Bovina","qtd":100,"unidade":"kg","validade":"2026-06-15"},{"descricao":"Arroz Agulhinha","qtd":50,"unidade":"kg","validade":"2026-12-01"}]'
  )
on conflict do nothing;

-- Estoque
insert into public.estoque (lote, hash, nome, volume_kg, validade, status, eligible, escola_id) values
  ('#4920-A', '0x3F...8C2', 'Carne Moída Bovina',     15,  current_date + 3,   'urgente',  true,  '11111111-1111-1111-1111-111111111111'),
  ('#5103-B', '0x9A...2F1', 'Carne Moída Bovina',     50,  current_date + 45,  'bloqueado', false, '11111111-1111-1111-1111-111111111111'),
  ('#4801-X', '0x1B...7C9', 'Arroz Agulhinha Premium',120,  current_date + 120, 'normal',   true,  '33333333-3333-3333-3333-333333333333'),
  ('#4755-Z', '0x5E...0D3', 'Polpa de Morango',       0,   current_date - 10,  'arquivado', false, '22222222-2222-2222-2222-222222222222'),
  ('#6210-L', '0x44C...F82','Leite Integral UHT',     80,  current_date + 2,   'urgente',  true,  '22222222-2222-2222-2222-222222222222'),
  ('#3310-K', '0x77D...A11','Feijão Carioca',          60,  current_date + 90,  'normal',   true,  '33333333-3333-3333-3333-333333333333')
on conflict do nothing;

-- Alertas
insert into public.alertas (escola_id, tipo, gravidade, descricao) values
  ('11111111-1111-1111-1111-111111111111', 'Sobra Excessiva',    'danger',  '-32kg não justificados na despensa — divergência com catracas biométricas'),
  ('22222222-2222-2222-2222-222222222222', 'Validade Iminente',  'warning', 'Laticínios (Lote #6210-L) vencendo em 48h — risco de perda'),
  ('33333333-3333-3333-3333-333333333333', 'Atraso de Romaneio', 'warning', 'Entrega D-2 sem conferência de QR Code pelo operador')
on conflict do nothing;

-- Refeições demo (últimos 5 dias)
insert into public.refeicoes (escola_id, total_servidos, resto_kg, turno, data_ref) values
  ('33333333-3333-3333-3333-333333333333', 412, 2.4, 'almoco', current_date),
  ('33333333-3333-3333-3333-333333333333', 380, 1.8, 'almoco', current_date - 1),
  ('33333333-3333-3333-3333-333333333333', 395, 3.1, 'almoco', current_date - 2),
  ('33333333-3333-3333-3333-333333333333', 420, 0.9, 'almoco', current_date - 3),
  ('33333333-3333-3333-3333-333333333333', 408, 2.0, 'almoco', current_date - 4),
  ('11111111-1111-1111-1111-111111111111', 215, 8.2, 'almoco', current_date),
  ('22222222-2222-2222-2222-222222222222', 310, 4.5, 'almoco', current_date)
on conflict do nothing;

-- ============================================================
-- USUÁRIOS DEMO — Instruções de criação
-- ============================================================
-- PASSO 1: Acesse https://app.supabase.com
-- PASSO 2: Vá em Authentication > Users > Invite User (ou Add User)
-- Crie os seguintes usuários com as senhas indicadas:
--
--   Email                                  | Senha Inicial
--   ----------------------------------------|--------------------
--   operador@merendacheck.gov.br            | Merenda@2026
--   gestor@merendacheck.gov.br              | Merenda@2026
--   auditor@merendacheck.gov.br             | Merenda@2026
--   nutricao@merendacheck.gov.br            | Merenda@2026
--   licitacao@merendacheck.gov.br           | Merenda@2026
--   transportadora@merendacheck.gov.br      | Merenda@2026
--   admin@merendacheck.gov.br               | Merenda@2026
--
-- PASSO 3: Após criar cada usuário no Auth, copie o UUID gerado
--          e execute o INSERT abaixo substituindo o <uuid-xxx>:
--
insert into public.usuarios (auth_id, nome, email, role, iniciais, escola_id, status) values
  ('24bb2470-69ec-41f6-97e2-3677d1f23323',  'Maria Silva',      'operador@merendacheck.gov.br',        'operador',       'MS', '33333333-3333-3333-3333-333333333333', 'ativo'),
  ('b6b54dbb-0e3c-4d59-bf2d-4204e413062b',    'Carlos Roberto',   'gestor@merendacheck.gov.br',          'gestor',         'CR', '33333333-3333-3333-3333-333333333333', 'ativo'),
  ('556fd993-a2d2-4b48-95f6-0f3b9a87798e',   'Dra. Ana Gomes',   'auditor@merendacheck.gov.br',         'auditor',        'AG', null, 'ativo'),
  ('792f423b-aece-4763-bbac-381c3860bb72',  'Dra. Fernanda L.', 'nutricao@merendacheck.gov.br',        'nutricao',       'FL', null, 'ativo'),
  ('36366701-5b7b-43c0-9686-85c65a6b0db0', 'Roberto Braga',    'licitacao@merendacheck.gov.br',       'licitacao',      'RB', null, 'ativo'),
  ('791514be-b0df-452c-94b5-1c58793acd38', 'João Logística',   'transportadora@merendacheck.gov.br',  'transportadora', 'JL', null, 'ativo'),
  ('eca16a61-fe47-414e-af97-a9f77576ec23',     'SysAdmin TI',      'admin@merendacheck.gov.br',           'admin',          'TI', null, 'ativo');

-- ============================================================
-- 12. TABELA: contatos (Formulário de Ouvidoria/Contato)
-- ============================================================
create table if not exists public.contatos (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text not null,
  mensagem text not null,
  lido boolean default false,
  criado_em timestamptz default now()
);

alter table public.contatos enable row level security;
-- Permite que qualquer pessoa insira dados no contato sem estar logada
create policy "Inserção pública de contatos" on public.contatos for insert with check (true);
create policy "Leitura de contatos" on public.contatos for select using (auth.role() = 'authenticated');

-- ============================================================
-- SEED: Dados de demonstração adicionais (Contatos)
-- ============================================================
insert into public.contatos (nome, email, mensagem, lido) values
  ('Ana Paula', 'ana.escola@gov.br', 'Gostaria de agendar uma demonstração do sistema para a nossa rede de creches.', false),
  ('Prefeito João', 'gabinete@prefeitura.gov.br', 'O portal de transparência está excelente. Quero estender o uso para o almoxarifado central.', true)
on conflict do nothing;

-- ============================================================
-- 13. TABELA: solicitacoes_compra
-- ============================================================
create table if not exists public.solicitacoes_compra (
  id uuid primary key default uuid_generate_v4(),
  escola_id uuid references public.escolas(id),
  item text not null,
  quantidade numeric(10,3) not null,
  unidade text default 'kg',
  motivo text,
  status text default 'pendente' check (status in ('pendente', 'aprovado', 'rejeitado', 'concluido')),
  solicitante_id uuid references public.usuarios(id),
  criado_em timestamptz default now()
);

alter table public.solicitacoes_compra enable row level security;
create policy "Leitura de solicitacoes de compra" on public.solicitacoes_compra for select using (auth.role() = 'authenticated');
create policy "Inserção de solicitacoes de compra" on public.solicitacoes_compra for insert with check (auth.role() = 'authenticated');
create policy "Gestão de solicitacoes de compra" on public.solicitacoes_compra for update using (
  exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin', 'licitacao', 'gestor'))
);

