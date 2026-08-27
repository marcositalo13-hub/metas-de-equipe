-- Bucket de fotos de perfil das pessoas (Supabase Storage).
-- Execute este script no SQL Editor do seu projeto Supabase, depois de
-- aplicar supabase/schema.sql.

-- Cria o bucket "fotos" como público (leitura direta por URL, sem auth).
-- Se preferir, crie pelo painel: Storage → New bucket → nome "fotos" →
-- marque "Public bucket" — o insert abaixo faz o mesmo.
insert into storage.buckets (id, name, public)
values ('fotos', 'fotos', true)
on conflict (id) do update set public = true;

-- ATENÇÃO: assim como em supabase/schema.sql, este é um app INTERNO sem
-- autenticação de usuários — o upload é feito direto do browser com a chave
-- anônima (anon key). As policies abaixo liberam select/insert/update no
-- bucket "fotos" para o papel "anon" de propósito. Não use como está para
-- um bucket com dados sensíveis ou exposto publicamente sem autenticação.

-- Leitura pública das fotos (necessária para exibi-las no app).
drop policy if exists "fotos: leitura publica" on storage.objects;
create policy "fotos: leitura publica"
  on storage.objects for select
  to public
  using (bucket_id = 'fotos');

-- Upload de foto nova para anon.
drop policy if exists "fotos: upload anon" on storage.objects;
create policy "fotos: upload anon"
  on storage.objects for insert
  to anon
  with check (bucket_id = 'fotos');

-- Sobrescrever foto existente (upsert: true) para anon.
drop policy if exists "fotos: update anon" on storage.objects;
create policy "fotos: update anon"
  on storage.objects for update
  to anon
  using (bucket_id = 'fotos')
  with check (bucket_id = 'fotos');
