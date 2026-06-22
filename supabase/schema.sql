-- Products table
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text not null default '',
  price numeric(10,2) not null default 0,
  image_url text not null default '',
  category text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- Testimonials table
create table if not exists testimonials (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  text text not null,
  rating integer not null default 5,
  created_at timestamptz not null default now()
);

-- Contact messages table
create table if not exists contacts (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text not null default '',
  message text not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table products enable row level security;
alter table testimonials enable row level security;
alter table contacts enable row level security;

-- Public read access for products and testimonials
create policy "Public read products" on products for select using (true);
create policy "Public read testimonials" on testimonials for select using (true);

-- Public insert for contacts
create policy "Public insert contacts" on contacts for insert with check (true);

-- Seed data: products
insert into products (name, description, price, image_url, category, featured) values
  ('Guia de Proteção Oxalá', 'Guia artesanal em cristais brancos e prata, consagrada para proteção e paz espiritual.', 89.90, '', 'Guias', true),
  ('Fio de Contas Iemanjá', 'Fio de contas em cristais azuis e conchas naturais, dedicado à Rainha do Mar.', 129.90, '', 'Fios de Contas', true),
  ('Pulseira Ogum', 'Pulseira artesanal em pedras vermelhas e ferramentas em metal, para força e proteção.', 59.90, '', 'Pulseiras', true),
  ('Guia Personalizada', 'Guia feita sob encomenda de acordo com o orixá e a necessidade espiritual do cliente.', 149.90, '', 'Personalizados', true),
  ('Fio de Contas Oxóssi', 'Fio em cristais verdes e sementes naturais, para prosperidade e conexão com a mata.', 119.90, '', 'Fios de Contas', true),
  ('Terço Sagrado', 'Terço artesanal em cristais e medalhas sagradas, para devoção e proteção diária.', 79.90, '', 'Terços', true);

-- Seed data: testimonials
insert into testimonials (name, text, rating) values
  ('Maria Silva', 'Peça linda e cheia de energia! Senti a proteção desde o primeiro momento. Recomendo de coração.', 5),
  ('João Santos', 'Trabalho impecável e com muito respeito às tradições. A guia ficou exatamente como eu imaginava.', 5),
  ('Ana Oliveira', 'Encomendei um fio de contas personalizado e superou todas as expectativas. Arte pura!', 5);
