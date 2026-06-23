-- ============================================================
-- Upload de fotos de produtos pelo admin (Supabase Storage)
--
-- PASSO 1 (painel): Storage > New bucket > nome "products" > marque "Public bucket".
-- PASSO 2: rode este SQL para as permissoes (RLS) do Storage.
-- ============================================================

-- Leitura publica das imagens do bucket "products"
drop policy if exists "public read products" on storage.objects;
create policy "public read products" on storage.objects
  for select using (bucket_id = 'products');

-- Apenas admin pode enviar imagens
drop policy if exists "admin insert products" on storage.objects;
create policy "admin insert products" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and public.has_role('admin'));

-- Apenas admin pode atualizar imagens
drop policy if exists "admin update products" on storage.objects;
create policy "admin update products" on storage.objects
  for update to authenticated
  using (bucket_id = 'products' and public.has_role('admin'));

-- Apenas admin pode remover imagens
drop policy if exists "admin delete products" on storage.objects;
create policy "admin delete products" on storage.objects
  for delete to authenticated
  using (bucket_id = 'products' and public.has_role('admin'));
