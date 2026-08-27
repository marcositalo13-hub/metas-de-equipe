-- Schema para o webapp "Metas de Equipe".
-- Execute este script no SQL Editor do seu projeto Supabase.

create extension if not exists pgcrypto;

create table if not exists metas (
  id uuid primary key default gen_random_uuid(),
  pessoa text not null,
  tipo text not null check (tipo in ('M', 'S')),
  data date not null,
  created_at timestamptz default now(),
  constraint metas_pessoa_tipo_data_key unique (pessoa, tipo, data)
);

create index if not exists metas_data_idx on metas (data);

alter table metas enable row level security;

-- ATENÇÃO: este app é uma ferramenta INTERNA sem autenticação de usuários.
-- O acesso é feito diretamente pelo browser com a chave anônima (anon key).
-- As policies abaixo liberam select/insert/delete para o papel "anon" de
-- propósito, pois não há login. NÃO use este schema como está em um produto
-- com dados sensíveis ou exposto publicamente sem adicionar autenticação.

drop policy if exists "anon pode ler metas" on metas;
create policy "anon pode ler metas"
  on metas for select
  to anon
  using (true);

drop policy if exists "anon pode inserir metas" on metas;
create policy "anon pode inserir metas"
  on metas for insert
  to anon
  with check (true);

drop policy if exists "anon pode remover metas" on metas;
create policy "anon pode remover metas"
  on metas for delete
  to anon
  using (true);
