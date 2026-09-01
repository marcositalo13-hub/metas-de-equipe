-- Habilita o Supabase Realtime (postgres_changes) na tabela `metas`.
-- Execute no SQL Editor do seu projeto Supabase, depois de aplicar
-- supabase/schema.sql. Sem isso, o app continua funcionando normalmente,
-- mas as marcações feitas em um aparelho só aparecem nos outros após
-- recarregar a página.

-- Idempotente: não dá erro se a tabela já estiver na publicação.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'metas'
  ) then
    alter publication supabase_realtime add table metas;
  end if;
end $$;

-- Observação: a RLS e as policies de supabase/schema.sql (select liberado
-- para "anon") também controlam o que o Realtime consegue transmitir — como
-- já liberamos select público ali, nenhuma policy adicional é necessária
-- aqui para o app receber os eventos.
