-- ============================================================
-- Avaliações de clientes por produto (item 3)
-- Rode no SQL Editor do Supabase.
-- ============================================================

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  is_approved boolean not null default true, -- mude o default para false se quiser moderar antes
  created_at timestamptz not null default now()
);

create index if not exists reviews_product_id_idx on reviews(product_id);

alter table reviews enable row level security;

-- Leitura pública das avaliações aprovadas
drop policy if exists "reviews_public_read" on reviews;
create policy "reviews_public_read" on reviews
  for select using (is_approved = true);

-- Qualquer visitante pode enviar uma avaliação
drop policy if exists "reviews_public_insert" on reviews;
create policy "reviews_public_insert" on reviews
  for insert with check (true);
