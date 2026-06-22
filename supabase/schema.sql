-- Arte Fios de Luz — Full E-commerce Schema

-- Enums
DO $$ BEGIN
  CREATE TYPE app_role AS ENUM ('admin', 'customer');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('ATIVO', 'INATIVO', 'RASCUNHO', 'INDISPONIVEL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE product_type AS ENUM ('DIGITAL', 'FISICO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'CANCELLED', 'EXPIRED', 'REFUNDED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE fulfillment_status AS ENUM ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE movement_type AS ENUM ('ENTRADA', 'SAIDA', 'AJUSTE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Subcategories
CREATE TABLE IF NOT EXISTS subcategories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  type product_type NOT NULL DEFAULT 'FISICO',
  price numeric(10,2) NOT NULL DEFAULT 0,
  cost_price numeric(10,2) NOT NULL DEFAULT 0,
  status product_status NOT NULL DEFAULT 'RASCUNHO',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  subcategory_id uuid REFERENCES subcategories(id) ON DELETE SET NULL,
  is_featured boolean NOT NULL DEFAULT false,
  guide_size text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Stock
CREATE TABLE IF NOT EXISTS stock_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL UNIQUE REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL DEFAULT 0,
  min_quantity integer NOT NULL DEFAULT 1,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stock_movements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity integer NOT NULL,
  type movement_type NOT NULL,
  reason text NOT NULL DEFAULT '',
  user_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid,
  customer_email text NOT NULL DEFAULT '',
  customer_name text NOT NULL DEFAULT '',
  customer_phone text NOT NULL DEFAULT '',
  payment_method text NOT NULL DEFAULT 'PIX',
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  fulfillment_status fulfillment_status NOT NULL DEFAULT 'PENDING',
  shipping_cost numeric(10,2) NOT NULL DEFAULT 0,
  shipping_method text NOT NULL DEFAULT '',
  shipping_address jsonb,
  delivery_estimate text NOT NULL DEFAULT '',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  tracking_code text NOT NULL DEFAULT '',
  tracking_url text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_sale numeric(10,2) NOT NULL DEFAULT 0,
  cost_at_sale numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Digital assets
CREATE TABLE IF NOT EXISTS digital_assets (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS digital_access (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  asset_id uuid NOT NULL REFERENCES digital_assets(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid,
  granted_at timestamptz NOT NULL DEFAULT now()
);

-- Shipping zones
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  cep_start text NOT NULL,
  cep_end text NOT NULL,
  price numeric(10,2) NOT NULL DEFAULT 0,
  estimate text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Home sections
CREATE TABLE IF NOT EXISTS home_sections (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text NOT NULL,
  title text NOT NULL DEFAULT '',
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  data jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Store settings (single row)
CREATE TABLE IF NOT EXISTS store_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  store_name text NOT NULL DEFAULT 'Arte Fios de Luz',
  store_description text NOT NULL DEFAULT 'Peças artesanais carregadas de significado, fé, proteção e conexão espiritual.',
  logo_url text NOT NULL DEFAULT '',
  home_title text NOT NULL DEFAULT 'Arte Fios de Luz',
  home_subtitle text NOT NULL DEFAULT 'Arte, fé e proteção em cada criação',
  hero_image_url text NOT NULL DEFAULT '',
  hero_cta_text text NOT NULL DEFAULT 'Ver Coleção',
  hero_cta_link text NOT NULL DEFAULT '/categoria/guias-de-orixas',
  image_fit text NOT NULL DEFAULT 'cover',
  theme_primary text NOT NULL DEFAULT '28 80% 52%',
  theme_secondary text NOT NULL DEFAULT '0 0% 97%',
  theme_background text NOT NULL DEFAULT '0 0% 100%',
  theme_text text NOT NULL DEFAULT '0 0% 20%',
  theme_accent text NOT NULL DEFAULT '38 35% 58%',
  font_family text NOT NULL DEFAULT 'Playfair Display',
  base_font_size text NOT NULL DEFAULT '16px',
  border_radius text NOT NULL DEFAULT '0.5rem',
  button_style text NOT NULL DEFAULT 'rounded',
  card_shadow text NOT NULL DEFAULT 'sm',
  announcement_enabled boolean NOT NULL DEFAULT false,
  announcement_text text NOT NULL DEFAULT '',
  whatsapp text NOT NULL DEFAULT '5535989899904',
  phone text NOT NULL DEFAULT '+55 35 98989-9904',
  email text NOT NULL DEFAULT 'artefiodeluz@gmail.com',
  horario_atendimento text NOT NULL DEFAULT 'Seg–Sex, 9h às 18h',
  instagram_url text NOT NULL DEFAULT 'https://www.instagram.com/artefiosdeluz',
  facebook_url text NOT NULL DEFAULT '',
  tiktok_url text NOT NULL DEFAULT '',
  whatsapp_button_enabled boolean NOT NULL DEFAULT true,
  whatsapp_number text NOT NULL DEFAULT '5535989899904',
  whatsapp_message text NOT NULL DEFAULT 'Olá! Vi o site da Arte Fios de Luz e gostaria de saber mais.',
  whatsapp_button_position text NOT NULL DEFAULT 'bottom-right',
  whatsapp_show_on text NOT NULL DEFAULT 'ALL',
  delivery_enabled boolean NOT NULL DEFAULT true,
  delivery_modalities jsonb NOT NULL DEFAULT '[{"name":"PAC","price":15.90,"estimate":"8 a 12 dias úteis","enabled":true},{"name":"SEDEX","price":25.90,"estimate":"3 a 5 dias úteis","enabled":true}]'::jsonb,
  free_shipping_above numeric(10,2) NOT NULL DEFAULT 199,
  delivery_provider text NOT NULL DEFAULT 'NONE',
  delivery_integration_active boolean NOT NULL DEFAULT false,
  pix_enabled boolean NOT NULL DEFAULT true,
  boleto_enabled boolean NOT NULL DEFAULT false,
  pix_expiration_minutes integer NOT NULL DEFAULT 30,
  payment_provider text NOT NULL DEFAULT 'NONE',
  payment_webhook_active boolean NOT NULL DEFAULT false,
  storage_bucket_name text NOT NULL DEFAULT 'products',
  search_enabled boolean NOT NULL DEFAULT true,
  footer_links jsonb,
  about_text text NOT NULL DEFAULT 'A Arte Fios de Luz nasce da fé e do cuidado. Criamos guias, terços, pulseiras e artigos de espiritualidade à mão, peça por peça, com respeito às tradições da Umbanda e do Candomblé. Cada criação é única e pode ser personalizada para o seu orixá, sua entidade ou sua intenção — unindo beleza, significado e proteção.',
  about_image_url text NOT NULL DEFAULT ''
);

-- User roles
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role app_role NOT NULL DEFAULT 'customer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Contact messages
CREATE TABLE IF NOT EXISTS contacts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Function to check role
CREATE OR REPLACE FUNCTION has_role(_role app_role, _user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles WHERE user_id = _user_id AND role = _role
  );
END;
$$;

-- RLS Policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE digital_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read subcategories" ON subcategories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "Public read stock_items" ON stock_items FOR SELECT USING (true);
CREATE POLICY "Public read shipping_zones" ON shipping_zones FOR SELECT USING (true);
CREATE POLICY "Public read home_sections" ON home_sections FOR SELECT USING (true);
CREATE POLICY "Public read store_settings" ON store_settings FOR SELECT USING (true);
CREATE POLICY "Public insert contacts" ON contacts FOR INSERT WITH CHECK (true);

-- Authenticated read own orders
CREATE POLICY "Users read own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users read own order_items" ON order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Public insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Digital access
CREATE POLICY "Users read own digital_access" ON digital_access FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public read digital_assets" ON digital_assets FOR SELECT USING (true);

-- Admin full access
CREATE POLICY "Admin all categories" ON categories FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all subcategories" ON subcategories FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all products" ON products FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all product_images" ON product_images FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all stock_items" ON stock_items FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all stock_movements" ON stock_movements FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all orders" ON orders FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all order_items" ON order_items FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all digital_assets" ON digital_assets FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all digital_access" ON digital_access FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all shipping_zones" ON shipping_zones FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all home_sections" ON home_sections FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all store_settings" ON store_settings FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all user_roles" ON user_roles FOR ALL USING (has_role('admin'));
CREATE POLICY "Admin all contacts" ON contacts FOR ALL USING (has_role('admin'));
CREATE POLICY "Users read own roles" ON user_roles FOR SELECT USING (auth.uid() = user_id);

-- Seed: default settings row
INSERT INTO store_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Seed: categories
INSERT INTO categories (name, slug, description) VALUES
  ('Guias de Orixás', 'guias-de-orixas', 'Guias artesanais dedicadas aos Orixás'),
  ('Guias de Entidades', 'guias-de-entidades', 'Guias artesanais dedicadas às Entidades'),
  ('Pulseiras', 'pulseiras', 'Pulseiras artesanais com significado espiritual'),
  ('Copos e Taças', 'copos-e-tacas', 'Copos e taças decorados para rituais'),
  ('Chapéus', 'chapeus', 'Chapéus artesanais para entidades'),
  ('Terços', 'tercos', 'Terços artesanais sagrados'),
  ('Personalizados', 'personalizados', 'Peças feitas sob encomenda')
ON CONFLICT (slug) DO NOTHING;

-- Seed: products (prices TBD)
INSERT INTO products (name, slug, description, price, status, category_id, is_featured) VALUES
  ('Guia para Oxalá', 'guia-para-oxala', 'Guia artesanal em cristais brancos e prata, consagrada para proteção e paz espiritual.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-orixas'), true),
  ('Guia para Maria Padilha', 'guia-para-maria-padilha', 'Guia artesanal dedicada a Maria Padilha, com cristais vermelhos e dourados.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-entidades'), true),
  ('Guia para Nanã com cascalho de ametista', 'guia-para-nana-ametista', 'Guia dedicada a Nanã com cascalho de ametista e cristais roxos.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-orixas'), true),
  ('Braja Pombo Gira Rosa Caveira', 'braja-pombo-gira-rosa-caveira', 'Braja artesanal dedicada à Pombagira Rosa Caveira.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-entidades'), true),
  ('Guia Preto Velho', 'guia-preto-velho', 'Guia artesanal dedicada aos Pretos Velhos, com sementes e cristais.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-entidades'), true),
  ('Guia Ibeji rosa com ursinho', 'guia-ibeji-rosa-ursinho', 'Guia dedicada aos Ibejis, em tons de rosa com pingente de ursinho.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-orixas'), true),
  ('Guia de proteção Oxum e Oxóssi', 'guia-protecao-oxum-oxossi', 'Guia de proteção combinando as energias de Oxum e Oxóssi.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-orixas'), true),
  ('Guia Maria Mulambo com cascalho de ametista', 'guia-maria-mulambo-ametista', 'Guia dedicada a Maria Mulambo com cascalho de ametista.', 0, 'ATIVO', (SELECT id FROM categories WHERE slug = 'guias-de-entidades'), true)
ON CONFLICT (slug) DO NOTHING;

-- Seed: stock for all products
INSERT INTO stock_items (product_id, quantity, min_quantity)
SELECT id, 5, 1 FROM products
ON CONFLICT (product_id) DO NOTHING;

-- Seed: home sections
INSERT INTO home_sections (type, title, enabled, sort_order) VALUES
  ('HERO', 'Hero', true, 1),
  ('BENEFICIOS', 'Benefícios', true, 2),
  ('CATEGORIAS_DESTAQUE', 'Categorias em Destaque', true, 3),
  ('VITRINE_NOVIDADES', 'Novidades', true, 4),
  ('VITRINE_DESTAQUES', 'Destaques', true, 5),
  ('BANNER', 'Encomenda Personalizada', true, 6),
  ('DEPOIMENTOS', 'Depoimentos', true, 7);
