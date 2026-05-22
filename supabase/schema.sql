-- ============================================================
-- MERENDA CHECK — Schema SQL para Supabase
-- Execute este script no Supabase SQL Editor
-- ============================================================

-- Habilitar extensão UUID
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABELA: usuarios (perfis vinculados ao Supabase Auth)
-- ============================================================
create table if not exists public.usuarios (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique references auth.users(id) on delete cascade,
  nome        text not null,
  email       text not null unique,
  role        text not null check (role in ('operador','gestor','auditor','nutricao','licitacao','transportadora','admin')),
  iniciais    text not null,
  escola_id   uuid,
  status      text not null default 'ativo' check (status in ('ativo','inativo')),
  criado_em   timestamptz default now()
);

alter table public.usuarios enable row level security;

-- Política: usuário autenticado pode ler todos os perfis
create policy "Leitura pública de usuários" on public.usuarios
  for select using (auth.role() = 'authenticated');

-- Função helper com SECURITY DEFINER para evitar recursão infinita na política de RLS
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.usuarios
    where auth_id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Política: admin pode gerenciar todos os usuários
create policy "Admin gerencia usuários" on public.usuarios
  for all using (public.is_admin());

-- ============================================================
-- TABELA: escolas
-- ============================================================
create table if not exists public.escolas (
  id              uuid primary key default uuid_generate_v4(),
  nome            text not null,
  diretora        text,
  health          int default 100 check (health between 0 and 100),
  status          text default 'normal' check (status in ('normal','atencao','urgente')),
  criado_em       timestamptz default now()
);

alter table public.escolas enable row level security;
create policy "Leitura de escolas" on public.escolas for select using (auth.role() = 'authenticated');
create policy "Gestão de escolas" on public.escolas for all using (
  exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','gestor','auditor'))
);

-- ============================================================
-- TABELA: estoque (lotes de insumos)
-- ============================================================
create table if not exists public.estoque (
  id          uuid primary key default uuid_generate_v4(),
  escola_id   uuid references public.escolas(id),
  lote        text not null,
  hash        text,
  nome        text not null,
  volume_kg   numeric(10,3) not null default 0,
  validade    date,
  status      text not null default 'normal' check (status in ('normal','urgente','bloqueado','arquivado')),
  eligible    boolean default true,
  criado_em   timestamptz default now(),
  atualizado_em timestamptz default now()
);

alter table public.estoque enable row level security;
create policy "Leitura de estoque" on public.estoque for select using (auth.role() = 'authenticated');
create policy "Gestão de estoque" on public.estoque for all using (
  exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','gestor','operador','auditor'))
);

-- ============================================================
-- TABELA: movimentacoes (entradas e saídas)
-- ============================================================
create table if not exists public.movimentacoes (
  id            uuid primary key default uuid_generate_v4(),
  estoque_id    uuid references public.estoque(id),
  escola_id     uuid references public.escolas(id),
  tipo          text not null check (tipo in ('entrada','saida','baixa','sobra')),
  quantidade_kg numeric(10,3) not null,
  observacao    text,
  usuario_id    uuid references public.usuarios(id),
  criado_em     timestamptz default now()
);

alter table public.movimentacoes enable row level security;
create policy "Leitura de movimentações" on public.movimentacoes for select using (auth.role() = 'authenticated');
create policy "Registro de movimentações" on public.movimentacoes for insert using (auth.role() = 'authenticated');

-- ============================================================
-- TABELA: refeicoes
-- ============================================================
create table if not exists public.refeicoes (
  id              uuid primary key default uuid_generate_v4(),
  escola_id       uuid references public.escolas(id),
  total_servidos  int not null default 0,
  resto_kg        numeric(8,3) default 0,
  data_ref        date not null default current_date,
  turno           text default 'almoco' check (turno in ('cafe','almoco','lanche','janta')),
  usuario_id      uuid references public.usuarios(id),
  criado_em       timestamptz default now()
);

alter table public.refeicoes enable row level security;
create policy "Leitura de refeições" on public.refeicoes for select using (auth.role() = 'authenticated');
create policy "Registro de refeições" on public.refeicoes for insert using (auth.role() = 'authenticated');

-- ============================================================
-- TABELA: alertas
-- ============================================================
create table if not exists public.alertas (
  id          uuid primary key default uuid_generate_v4(),
  escola_id   uuid references public.escolas(id),
  tipo        text not null,
  gravidade   text not null check (gravidade in ('danger','warning','info')),
  descricao   text not null,
  resolvido   boolean default false,
  criado_em   timestamptz default now()
);

alter table public.alertas enable row level security;
create policy "Leitura de alertas" on public.alertas for select using (auth.role() = 'authenticated');
create policy "Gestão de alertas" on public.alertas for all using (
  exists (select 1 from public.usuarios u where u.auth_id = auth.uid() and u.role in ('admin','auditor'))
);

-- ============================================================
-- SEED: Dados de demonstração
-- ============================================================

-- Escolas demo
insert into public.escolas (id, nome, diretora, health, status) values
  ('11111111-1111-1111-1111-111111111111', 'CEI Pequeninos', 'Diretora: Márcia F.', 64, 'urgente'),
  ('22222222-2222-2222-2222-222222222222', 'EMEI Margarida', 'Gestora: Sônia T.', 88, 'atencao'),
  ('33333333-3333-3333-3333-333333333333', 'EMEF João Silva', 'Gestor: Carlos Roberto', 99, 'normal')
on conflict do nothing;

-- Estoque demo
insert into public.estoque (lote, hash, nome, volume_kg, validade, status, eligible, escola_id) values
  ('#4920-A', '0x3F...8C2', 'Carne Moída Bovina', 15, current_date + 3, 'urgente', true, '11111111-1111-1111-1111-111111111111'),
  ('#5103-B', '0x9A...2F1', 'Carne Moída Bovina', 50, current_date + 45, 'bloqueado', false, '11111111-1111-1111-1111-111111111111'),
  ('#4801-X', '0x1B...7C9', 'Arroz Agulhinha Premium', 120, current_date + 120, 'normal', true, '33333333-3333-3333-3333-333333333333'),
  ('#4755-Z', '0x5E...0D3', 'Polpa de Morango', 0, current_date - 10, 'arquivado', false, '22222222-2222-2222-2222-222222222222')
on conflict do nothing;

-- Alertas demo
insert into public.alertas (escola_id, tipo, gravidade, descricao) values
  ('11111111-1111-1111-1111-111111111111', 'Sobra Excessiva', 'danger', '-32kg não justificados'),
  ('22222222-2222-2222-2222-222222222222', 'Validade Iminente', 'warning', 'Laticínios vencendo em 48h'),
  ('33333333-3333-3333-3333-333333333333', 'Atraso de Romaneio', 'warning', 'Entrega D-2 sem conferência')
on conflict do nothing;

-- ============================================================
-- USUÁRIOS DEMO: Crie manualmente no Supabase Auth Dashboard
-- ou execute após criar os usuários via Auth:
-- ============================================================
-- Exemplo (substitua auth_id pelo UUID real gerado pelo Supabase Auth):
--
-- insert into public.usuarios (auth_id, nome, email, role, iniciais) values
--   ('<uuid-operador>',  'Maria Silva',     'operador@merendacheck.gov.br',       'operador',       'MS'),
--   ('<uuid-gestor>',    'Carlos Roberto',  'gestor@merendacheck.gov.br',         'gestor',         'CR'),
--   ('<uuid-auditor>',   'Dra. Ana Gomes',  'auditor@merendacheck.gov.br',        'auditor',        'AG'),
--   ('<uuid-nutricao>',  'Dra. Fernanda L.','nutricao@merendacheck.gov.br',       'nutricao',       'FL'),
--   ('<uuid-licitacao>', 'Roberto Braga',   'licitacao@merendacheck.gov.br',      'licitacao',      'RB'),
--   ('<uuid-transport>', 'João Logística',  'transportadora@merendacheck.gov.br', 'transportadora', 'JL'),
--   ('<uuid-admin>',     'SysAdmin',        'admin@merendacheck.gov.br',          'admin',          'TI');

-- ============================================================
-- TABELA: cardapios (planejamento semanal PNAE)
-- ============================================================
create table if not exists public.cardapios (
  id            uuid primary key default uuid_generate_v4(),
  escola_id     uuid references public.escolas(id) on delete cascade,
  semana        text not null,
  plano         jsonb not null,
  criado_em     timestamptz default now(),
  atualizado_em timestamptz default now(),
  unique (escola_id, semana)
);

alter table public.cardapios enable row level security;
create policy "Leitura de cardápios" on public.cardapios for select using (auth.role() = 'authenticated');
create policy "Gestão de cardápios" on public.cardapios for all using (auth.role() = 'authenticated');

-- Adicionar chave estrangeira que faltava entre usuarios e escolas para habilitar junções PostgREST
alter table public.usuarios
  add constraint fk_usuarios_escolas
  foreign key (escola_id)
  references public.escolas(id)
  on delete set null;
