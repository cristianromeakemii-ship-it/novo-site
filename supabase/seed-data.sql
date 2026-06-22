-- =============================================================
-- SEED COMPLETO — Arte Fios de Luz
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- =============================================================

-- Limpar dados antigos (se existirem)
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM stock_items;
DELETE FROM stock_movements;
DELETE FROM product_images;
DELETE FROM products;
DELETE FROM subcategories;
DELETE FROM categories;
DELETE FROM home_sections;
DELETE FROM contacts;
DELETE FROM shipping_zones;
DELETE FROM store_settings;

-- =============================================================
-- CATEGORIAS
-- =============================================================
INSERT INTO categories (id, name, slug, description, image_url, is_active) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Guias de Orixás', 'guias-de-orixas', 'Guias artesanais consagradas e dedicadas aos Orixás da Umbanda e Candomblé. Cada peça é feita com cristais, miçangas e firmas selecionadas.', '', true),
  ('c1000000-0000-0000-0000-000000000002', 'Guias de Entidades', 'guias-de-entidades', 'Guias dedicadas às entidades espirituais — Pretos Velhos, Caboclos, Pombagiras, Exus e muito mais.', '', true),
  ('c1000000-0000-0000-0000-000000000003', 'Pulseiras', 'pulseiras', 'Pulseiras artesanais com cristais e pedras naturais, carregadas de proteção e fé.', '', true),
  ('c1000000-0000-0000-0000-000000000004', 'Copos e Taças', 'copos-e-tacas', 'Copos e taças artesanais decorados para uso ritual e decoração sagrada.', '', true),
  ('c1000000-0000-0000-0000-000000000005', 'Chapéus', 'chapeus', 'Chapéus artesanais para entidades como Malandros, Malandras e Exus.', '', true),
  ('c1000000-0000-0000-0000-000000000006', 'Terços', 'tercos', 'Terços artesanais em cristais e medalhas sagradas para devoção diária.', '', true),
  ('c1000000-0000-0000-0000-000000000007', 'Personalizados', 'personalizados', 'Peças exclusivas feitas sob encomenda, de acordo com seu orixá, entidade ou intenção espiritual.', '', true);

-- =============================================================
-- SUBCATEGORIAS
-- =============================================================
INSERT INTO subcategories (id, category_id, name, slug, description, is_active) VALUES
  -- Guias de Orixás
  ('s1000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Oxalá', 'oxala', 'Guias dedicadas ao Pai Oxalá', true),
  ('s1000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000001', 'Oxum', 'oxum', 'Guias dedicadas à Mãe Oxum', true),
  ('s1000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000001', 'Iemanjá', 'iemanja', 'Guias dedicadas à Rainha do Mar', true),
  ('s1000000-0000-0000-0000-000000000004', 'c1000000-0000-0000-0000-000000000001', 'Oxóssi', 'oxossi', 'Guias dedicadas a Oxóssi', true),
  ('s1000000-0000-0000-0000-000000000005', 'c1000000-0000-0000-0000-000000000001', 'Ogum', 'ogum', 'Guias dedicadas a Ogum', true),
  ('s1000000-0000-0000-0000-000000000006', 'c1000000-0000-0000-0000-000000000001', 'Iansã', 'iansa', 'Guias dedicadas a Iansã (Oyá)', true),
  ('s1000000-0000-0000-0000-000000000007', 'c1000000-0000-0000-0000-000000000001', 'Xangô', 'xango', 'Guias dedicadas a Xangô', true),
  ('s1000000-0000-0000-0000-000000000008', 'c1000000-0000-0000-0000-000000000001', 'Nanã', 'nana', 'Guias dedicadas a Nanã', true),
  ('s1000000-0000-0000-0000-000000000009', 'c1000000-0000-0000-0000-000000000001', 'Obaluaê', 'obaluae', 'Guias dedicadas a Obaluaê (Omulu)', true),
  ('s1000000-0000-0000-0000-000000000010', 'c1000000-0000-0000-0000-000000000001', 'Ibeji', 'ibeji', 'Guias dedicadas aos Ibejis', true),
  -- Guias de Entidades
  ('s1000000-0000-0000-0000-000000000011', 'c1000000-0000-0000-0000-000000000002', 'Preto Velho', 'preto-velho', 'Guias de Pretos Velhos', true),
  ('s1000000-0000-0000-0000-000000000012', 'c1000000-0000-0000-0000-000000000002', 'Pombagira', 'pombagira', 'Guias de Pombagiras', true),
  ('s1000000-0000-0000-0000-000000000013', 'c1000000-0000-0000-0000-000000000002', 'Exu', 'exu', 'Guias de Exus', true),
  ('s1000000-0000-0000-0000-000000000014', 'c1000000-0000-0000-0000-000000000002', 'Caboclo', 'caboclo', 'Guias de Caboclos', true),
  ('s1000000-0000-0000-0000-000000000015', 'c1000000-0000-0000-0000-000000000002', 'Malandro', 'malandro', 'Guias de Malandros', true),
  ('s1000000-0000-0000-0000-000000000016', 'c1000000-0000-0000-0000-000000000002', 'Cigano', 'cigano', 'Guias de Ciganos e Ciganas', true),
  ('s1000000-0000-0000-0000-000000000017', 'c1000000-0000-0000-0000-000000000002', 'Erê', 'ere', 'Guias de Erês (Crianças)', true),
  ('s1000000-0000-0000-0000-000000000018', 'c1000000-0000-0000-0000-000000000002', 'Boiadeiro', 'boiadeiro', 'Guias de Boiadeiros', true),
  ('s1000000-0000-0000-0000-000000000019', 'c1000000-0000-0000-0000-000000000002', 'Marinheiro', 'marinheiro', 'Guias de Marinheiros', true),
  ('s1000000-0000-0000-0000-000000000020', 'c1000000-0000-0000-0000-000000000002', 'Baiano', 'baiano', 'Guias de Baianos', true),
  -- Copos e Taças
  ('s1000000-0000-0000-0000-000000000021', 'c1000000-0000-0000-0000-000000000004', 'Taças de Pombagira', 'tacas-pombagira', 'Taças decoradas para Pombagiras', true),
  ('s1000000-0000-0000-0000-000000000022', 'c1000000-0000-0000-0000-000000000004', 'Copos de Exu', 'copos-exu', 'Copos decorados para Exus', true),
  ('s1000000-0000-0000-0000-000000000023', 'c1000000-0000-0000-0000-000000000004', 'Taças de Malandro', 'tacas-malandro', 'Taças para Malandros e Malandras', true),
  -- Chapéus
  ('s1000000-0000-0000-0000-000000000024', 'c1000000-0000-0000-0000-000000000005', 'Chapéu de Malandro', 'chapeu-malandro', 'Chapéus artesanais para Malandros', true),
  ('s1000000-0000-0000-0000-000000000025', 'c1000000-0000-0000-0000-000000000005', 'Chapéu de Exu', 'chapeu-exu', 'Chapéus artesanais para Exus', true);

-- =============================================================
-- PRODUTOS — GUIAS DE ORIXÁS (12 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000001', 'Guia de Oxalá em Cristal Branco', 'guia-oxala-cristal-branco',
   'Guia artesanal dedicada ao Pai Oxalá, confeccionada em cristais brancos translúcidos e miçangas prateadas. Representa paz, serenidade e proteção divina. Cada conta é selecionada à mão para garantir harmonia e beleza na peça final.',
   'FISICO', 89.90, 32.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', true, '65'),

  ('p1000000-0000-0000-0000-000000000002', 'Guia de Oxalá com Firma Branca', 'guia-oxala-firma-branca',
   'Guia de Oxalá com firma branca rajada, cristais opacos e acabamento em metal prateado. Peça robusta e elegante, ideal para uso ritual e diário.',
   'FISICO', 109.90, 38.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000001', false, '70'),

  ('p1000000-0000-0000-0000-000000000003', 'Guia de Oxum Dourada', 'guia-oxum-dourada',
   'Guia dedicada à Mãe Oxum, em cristais dourados e âmbar com detalhes em metal dourado. Simboliza amor, fertilidade, riqueza e beleza. Uma peça sofisticada que honra a Rainha das Águas Doces.',
   'FISICO', 119.90, 42.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000002', true, '65'),

  ('p1000000-0000-0000-0000-000000000004', 'Guia de Oxum com Cascalho de Citrino', 'guia-oxum-citrino',
   'Guia de Oxum com cascalho de citrino natural e miçangas amarelas. O citrino potencializa a energia de prosperidade e abundância. Peça delicada e cheia de luz.',
   'FISICO', 139.90, 52.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000002', true, '65'),

  ('p1000000-0000-0000-0000-000000000005', 'Guia de Iemanjá em Cristais Azuis', 'guia-iemanja-cristais-azuis',
   'Guia dedicada à Rainha do Mar, Iemanjá. Confeccionada em cristais azuis celestes, pérolas e conchas naturais. Traz a energia de maternidade, proteção e cura emocional.',
   'FISICO', 129.90, 45.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000003', true, '70'),

  ('p1000000-0000-0000-0000-000000000006', 'Guia de Iemanjá com Conchas e Pérolas', 'guia-iemanja-conchas-perolas',
   'Versão especial da guia de Iemanjá, com conchas naturais do litoral e pérolas de água doce. Peça exclusiva e delicada, feita com materiais nobres.',
   'FISICO', 169.90, 65.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000003', false, '65'),

  ('p1000000-0000-0000-0000-000000000007', 'Guia de Oxóssi Verde Esmeralda', 'guia-oxossi-verde-esmeralda',
   'Guia dedicada a Oxóssi, o Caçador. Em cristais verdes esmeralda e sementes naturais da mata. Representa prosperidade, fartura e conexão com a natureza.',
   'FISICO', 99.90, 35.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000004', true, '65'),

  ('p1000000-0000-0000-0000-000000000008', 'Guia de Ogum em Cristais Vermelhos', 'guia-ogum-cristais-vermelhos',
   'Guia dedicada ao guerreiro Ogum, em cristais vermelhos intensos e detalhes em metal. Simboliza força, coragem, proteção nos caminhos e vitória nas batalhas espirituais.',
   'FISICO', 99.90, 35.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000005', true, '70'),

  ('p1000000-0000-0000-0000-000000000009', 'Guia de Iansã Coral e Marrom', 'guia-iansa-coral-marrom',
   'Guia dedicada a Iansã (Oyá), senhora dos ventos e tempestades. Em cristais coral e marrom com firmas tradicionais. Energia de transformação, liderança e justiça.',
   'FISICO', 109.90, 38.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000006', false, '65'),

  ('p1000000-0000-0000-0000-000000000010', 'Guia de Xangô em Cristais Marrons e Brancos', 'guia-xango-marrom-branco',
   'Guia dedicada a Xangô, o Rei da Justiça. Cristais marrons e brancos intercalados com firmas. Traz energia de justiça, sabedoria e poder.',
   'FISICO', 109.90, 38.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000007', false, '65'),

  ('p1000000-0000-0000-0000-000000000011', 'Guia de Nanã com Cascalho de Ametista', 'guia-nana-cascalho-ametista',
   'Guia dedicada à Avó Nanã, a mais velha das Orixás. Com cascalho de ametista natural e cristais roxos. A ametista potencializa a sabedoria, transmutação e conexão ancestral.',
   'FISICO', 149.90, 55.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000008', true, '65'),

  ('p1000000-0000-0000-0000-000000000012', 'Guia de Ibeji Rosa com Ursinho', 'guia-ibeji-rosa-ursinho',
   'Guia dedicada aos Ibejis (Erês), em tons de rosa com pingente de ursinho. Uma peça delicada e encantadora que representa a pureza, alegria e proteção das crianças espirituais.',
   'FISICO', 79.90, 28.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000001', 's1000000-0000-0000-0000-000000000010', true, '60');

-- =============================================================
-- PRODUTOS — GUIAS DE ENTIDADES (12 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000013', 'Guia de Maria Padilha Vermelha e Dourada', 'guia-maria-padilha-vermelha-dourada',
   'Guia artesanal dedicada à poderosa Maria Padilha. Em cristais vermelhos, pretos e dourados com firmas de Pombagira. Energia de poder feminino, sedução e proteção.',
   'FISICO', 119.90, 42.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000012', true, '65'),

  ('p1000000-0000-0000-0000-000000000014', 'Braja de Pombagira Rosa Caveira', 'braja-pombagira-rosa-caveira',
   'Braja artesanal dedicado à Pombagira Rosa Caveira. Múltiplas voltas em cristais rosa, pretos e vermelhos com firmas tradicionais. Peça imponente e carregada de axé.',
   'FISICO', 189.90, 72.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000012', true, '70'),

  ('p1000000-0000-0000-0000-000000000015', 'Guia de Maria Mulambo com Ametista', 'guia-maria-mulambo-ametista',
   'Guia dedicada à Maria Mulambo, com cascalho de ametista e cristais roxos e pretos. Traz energia de transformação, cura e libertação.',
   'FISICO', 129.90, 48.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000012', true, '65'),

  ('p1000000-0000-0000-0000-000000000016', 'Guia de Dama da Noite', 'guia-dama-da-noite',
   'Guia dedicada à Pombagira Dama da Noite. Cristais pretos e roxos com detalhes prateados. Elegância noturna e mistério em cada conta.',
   'FISICO', 119.90, 42.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000012', false, '65'),

  ('p1000000-0000-0000-0000-000000000017', 'Guia de Preto Velho com Sementes', 'guia-preto-velho-sementes',
   'Guia dedicada aos Pretos Velhos, com sementes naturais, cristais pretos e brancos. Representa sabedoria, humildade, cura e aconselhamento espiritual.',
   'FISICO', 89.90, 30.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000011', true, '70'),

  ('p1000000-0000-0000-0000-000000000018', 'Guia de Preto Velho com Quartzo Fumê', 'guia-preto-velho-quartzo-fume',
   'Versão especial com cascalho de quartzo fumê e sementes. O quartzo fumê potencializa a energia de aterramento e proteção dos Pretos Velhos.',
   'FISICO', 139.90, 50.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000011', false, '65'),

  ('p1000000-0000-0000-0000-000000000019', 'Guia de Exu Tranca Ruas', 'guia-exu-tranca-ruas',
   'Guia dedicada ao Exu Tranca Ruas. Cristais pretos e vermelhos com firmas e ferramentas em metal. Proteção nos caminhos, abertura de portas e oportunidades.',
   'FISICO', 109.90, 38.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000013', true, '70'),

  ('p1000000-0000-0000-0000-000000000020', 'Guia de Exu Caveira', 'guia-exu-caveira',
   'Guia artesanal para Exu Caveira. Cristais pretos, brancos e vermelhos com pingente de caveira em metal. Energia de transformação e proteção nas encruzilhadas.',
   'FISICO', 119.90, 42.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000013', false, '65'),

  ('p1000000-0000-0000-0000-000000000021', 'Guia de Caboclo Pena Branca', 'guia-caboclo-pena-branca',
   'Guia dedicada ao Caboclo Pena Branca. Cristais verdes e brancos com sementes e penas naturais. Proteção da mata, cura e firmeza espiritual.',
   'FISICO', 99.90, 35.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000014', false, '65'),

  ('p1000000-0000-0000-0000-000000000022', 'Guia de Zé Pelintra', 'guia-ze-pelintra',
   'Guia dedicada ao Malandro Zé Pelintra. Cristais vermelhos e brancos com detalhes que remetem à malandragem carioca. Proteção, alegria e esperteza espiritual.',
   'FISICO', 99.90, 35.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000015', true, '65'),

  ('p1000000-0000-0000-0000-000000000023', 'Guia de Cigana Rosa', 'guia-cigana-rosa',
   'Guia dedicada à Cigana Rosa. Cristais rosa, dourados e vermelhos com moedas e espelhos em miniatura. Amor, prosperidade e vidência.',
   'FISICO', 129.90, 48.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000016', true, '65'),

  ('p1000000-0000-0000-0000-000000000024', 'Guia de Erê Colorida', 'guia-ere-colorida',
   'Guia dedicada aos Erês (Crianças espirituais). Multicolorida em cristais alegres com pingentes lúdicos. Pureza, alegria e proteção infantil.',
   'FISICO', 69.90, 22.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000002', 's1000000-0000-0000-0000-000000000017', false, '60');

-- =============================================================
-- PRODUTOS — PULSEIRAS (6 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000025', 'Pulseira de Proteção Oxalá', 'pulseira-protecao-oxala',
   'Pulseira artesanal em cristais brancos e prata dedicada a Oxalá. Proteção e paz para o dia a dia. Ajustável com fecho em metal.',
   'FISICO', 49.90, 15.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000026', 'Pulseira de Ogum Vermelha', 'pulseira-ogum-vermelha',
   'Pulseira artesanal em pedras vermelhas e ferramentas em metal dedicada a Ogum. Força e proteção nos caminhos.',
   'FISICO', 49.90, 15.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, false, NULL),

  ('p1000000-0000-0000-0000-000000000027', 'Pulseira de Oxum com Citrino', 'pulseira-oxum-citrino',
   'Pulseira delicada em cristais dourados e cascalho de citrino. Prosperidade e beleza com a energia de Oxum.',
   'FISICO', 59.90, 20.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000028', 'Pulseira de Iemanjá com Pérolas', 'pulseira-iemanja-perolas',
   'Pulseira em pérolas de água doce e cristais azuis. A energia maternal e protetora de Iemanjá no seu pulso.',
   'FISICO', 69.90, 25.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, false, NULL),

  ('p1000000-0000-0000-0000-000000000029', 'Pulseira 7 Linhas', 'pulseira-7-linhas',
   'Pulseira das 7 Linhas da Umbanda com cristais nas 7 cores. Proteção completa e conexão com todas as linhas espirituais.',
   'FISICO', 59.90, 18.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000030', 'Pulseira de Proteção Quartzo Negro', 'pulseira-protecao-quartzo-negro',
   'Pulseira em quartzo negro (turmalina) e ônix. Máxima proteção contra energias negativas. Unissex.',
   'FISICO', 54.90, 18.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000003', NULL, false, NULL);

-- =============================================================
-- PRODUTOS — COPOS E TAÇAS (5 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000031', 'Taça de Maria Padilha Vermelha', 'taca-maria-padilha-vermelha',
   'Taça artesanal decorada em vermelho e dourado, dedicada a Maria Padilha. Ideal para oferendas e decoração do congá. Peça única feita à mão.',
   'FISICO', 89.90, 30.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000021', true, NULL),

  ('p1000000-0000-0000-0000-000000000032', 'Taça de Pombagira Rosa Caveira', 'taca-pombagira-rosa-caveira',
   'Taça artesanal decorada em rosa e preto com detalhes de caveira. Dedicada à Pombagira Rosa Caveira.',
   'FISICO', 89.90, 30.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000021', false, NULL),

  ('p1000000-0000-0000-0000-000000000033', 'Copo de Exu Tranca Ruas', 'copo-exu-tranca-ruas',
   'Copo artesanal decorado em preto e vermelho, dedicado ao Exu Tranca Ruas. Ideal para padê e oferendas.',
   'FISICO', 79.90, 25.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000022', true, NULL),

  ('p1000000-0000-0000-0000-000000000034', 'Copo de Exu Caveira', 'copo-exu-caveira',
   'Copo artesanal com motivo de caveira em preto e branco. Dedicado ao Exu Caveira. Acabamento impecável.',
   'FISICO', 79.90, 25.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000022', false, NULL),

  ('p1000000-0000-0000-0000-000000000035', 'Taça de Malandro Zé Pelintra', 'taca-malandro-ze-pelintra',
   'Taça artesanal decorada em vermelho e branco com detalhes de chapéu e navalha. Dedicada ao Malandro Zé Pelintra.',
   'FISICO', 89.90, 30.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000004', 's1000000-0000-0000-0000-000000000023', true, NULL);

-- =============================================================
-- PRODUTOS — CHAPÉUS (4 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000036', 'Chapéu de Malandro Branco e Vermelho', 'chapeu-malandro-branco-vermelho',
   'Chapéu artesanal de Malandro nas cores tradicionais branco e vermelho. Fita de cetim, pluma e acabamento premium. Ideal para trabalhos e festas.',
   'FISICO', 129.90, 45.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000024', true, NULL),

  ('p1000000-0000-0000-0000-000000000037', 'Chapéu de Malandro Preto e Vermelho', 'chapeu-malandro-preto-vermelho',
   'Versão clássica do chapéu de Malandro em preto e vermelho. Elegante e sofisticado com pluma e fita.',
   'FISICO', 129.90, 45.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000024', false, NULL),

  ('p1000000-0000-0000-0000-000000000038', 'Chapéu de Exu Cartola Preta', 'chapeu-exu-cartola-preta',
   'Cartola preta artesanal para Exu, com fita vermelha e detalhes em metal. Imponente e carregada de axé.',
   'FISICO', 149.90, 55.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000025', true, NULL),

  ('p1000000-0000-0000-0000-000000000039', 'Chapéu de Malandra Rosa', 'chapeu-malandra-rosa',
   'Chapéu artesanal de Malandra em rosa e vermelho, com flores, pluma e fita de cetim. Feminino e poderoso.',
   'FISICO', 139.90, 50.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000005', 's1000000-0000-0000-0000-000000000024', false, NULL);

-- =============================================================
-- PRODUTOS — TERÇOS (4 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000040', 'Terço de Oxalá em Cristal', 'terco-oxala-cristal',
   'Terço artesanal dedicado a Oxalá, em cristais brancos com crucifixo prateado e medalha de proteção. Para devoção e uso diário.',
   'FISICO', 69.90, 22.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000006', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000041', 'Terço de Iemanjá Azul', 'terco-iemanja-azul',
   'Terço artesanal em cristais azuis dedicado a Iemanjá, com medalha da sereia e acabamento dourado.',
   'FISICO', 74.90, 25.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000006', NULL, false, NULL),

  ('p1000000-0000-0000-0000-000000000042', 'Terço de Proteção 7 Linhas', 'terco-protecao-7-linhas',
   'Terço nas cores das 7 Linhas da Umbanda. Proteção espiritual completa com medalha sagrada e cristais variados.',
   'FISICO', 79.90, 28.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000006', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000043', 'Terço de Pombagira Vermelho', 'terco-pombagira-vermelho',
   'Terço artesanal em cristais vermelhos e pretos dedicado às Pombagiras. Com medalha de rosa e crucifixo dourado.',
   'FISICO', 74.90, 25.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000006', NULL, false, NULL);

-- =============================================================
-- PRODUTOS — PERSONALIZADOS (3 produtos)
-- =============================================================
INSERT INTO products (id, name, slug, description, type, price, cost_price, status, category_id, subcategory_id, is_featured, guide_size) VALUES
  ('p1000000-0000-0000-0000-000000000044', 'Guia Personalizada — Seu Orixá', 'guia-personalizada-seu-orixa',
   'Guia feita sob encomenda, personalizada para o seu orixá de cabeça. Escolha as cores, cristais, firmas e tamanho. Consulte-nos pelo WhatsApp para montar a sua peça única.',
   'FISICO', 159.90, 55.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000007', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000045', 'Guia Personalizada — Sua Entidade', 'guia-personalizada-sua-entidade',
   'Guia sob encomenda dedicada à sua entidade espiritual. Preto Velho, Caboclo, Pombagira, Exu — conte-nos sobre sua entidade e criaremos a peça perfeita.',
   'FISICO', 159.90, 55.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000007', NULL, true, NULL),

  ('p1000000-0000-0000-0000-000000000046', 'Kit Guia + Pulseira Personalizado', 'kit-guia-pulseira-personalizado',
   'Conjunto de guia e pulseira personalizado, feito sob medida com as cores e cristais do seu orixá ou entidade. O kit perfeito para completar sua proteção espiritual.',
   'FISICO', 219.90, 75.00, 'ATIVO', 'c1000000-0000-0000-0000-000000000007', NULL, true, NULL);

-- =============================================================
-- ESTOQUE — todas as peças com quantidades variadas
-- =============================================================
INSERT INTO stock_items (product_id, quantity, min_quantity) VALUES
  ('p1000000-0000-0000-0000-000000000001', 8, 2),
  ('p1000000-0000-0000-0000-000000000002', 5, 2),
  ('p1000000-0000-0000-0000-000000000003', 6, 2),
  ('p1000000-0000-0000-0000-000000000004', 4, 2),
  ('p1000000-0000-0000-0000-000000000005', 7, 2),
  ('p1000000-0000-0000-0000-000000000006', 3, 1),
  ('p1000000-0000-0000-0000-000000000007', 10, 3),
  ('p1000000-0000-0000-0000-000000000008', 6, 2),
  ('p1000000-0000-0000-0000-000000000009', 4, 2),
  ('p1000000-0000-0000-0000-000000000010', 5, 2),
  ('p1000000-0000-0000-0000-000000000011', 3, 1),
  ('p1000000-0000-0000-0000-000000000012', 12, 3),
  ('p1000000-0000-0000-0000-000000000013', 5, 2),
  ('p1000000-0000-0000-0000-000000000014', 2, 1),
  ('p1000000-0000-0000-0000-000000000015', 4, 2),
  ('p1000000-0000-0000-0000-000000000016', 6, 2),
  ('p1000000-0000-0000-0000-000000000017', 8, 2),
  ('p1000000-0000-0000-0000-000000000018', 3, 1),
  ('p1000000-0000-0000-0000-000000000019', 5, 2),
  ('p1000000-0000-0000-0000-000000000020', 4, 2),
  ('p1000000-0000-0000-0000-000000000021', 6, 2),
  ('p1000000-0000-0000-0000-000000000022', 7, 2),
  ('p1000000-0000-0000-0000-000000000023', 4, 2),
  ('p1000000-0000-0000-0000-000000000024', 9, 3),
  ('p1000000-0000-0000-0000-000000000025', 15, 5),
  ('p1000000-0000-0000-0000-000000000026', 12, 5),
  ('p1000000-0000-0000-0000-000000000027', 10, 3),
  ('p1000000-0000-0000-0000-000000000028', 8, 3),
  ('p1000000-0000-0000-0000-000000000029', 14, 5),
  ('p1000000-0000-0000-0000-000000000030', 10, 3),
  ('p1000000-0000-0000-0000-000000000031', 4, 2),
  ('p1000000-0000-0000-0000-000000000032', 3, 1),
  ('p1000000-0000-0000-0000-000000000033', 5, 2),
  ('p1000000-0000-0000-0000-000000000034', 4, 2),
  ('p1000000-0000-0000-0000-000000000035', 3, 1),
  ('p1000000-0000-0000-0000-000000000036', 4, 2),
  ('p1000000-0000-0000-0000-000000000037', 3, 1),
  ('p1000000-0000-0000-0000-000000000038', 2, 1),
  ('p1000000-0000-0000-0000-000000000039', 3, 1),
  ('p1000000-0000-0000-0000-000000000040', 6, 2),
  ('p1000000-0000-0000-0000-000000000041', 5, 2),
  ('p1000000-0000-0000-0000-000000000042', 7, 2),
  ('p1000000-0000-0000-0000-000000000043', 4, 2),
  ('p1000000-0000-0000-0000-000000000044', 99, 1),
  ('p1000000-0000-0000-0000-000000000045', 99, 1),
  ('p1000000-0000-0000-0000-000000000046', 99, 1);

-- =============================================================
-- ZONAS DE FRETE
-- =============================================================
INSERT INTO shipping_zones (name, cep_start, cep_end, price, estimate, is_active) VALUES
  ('Minas Gerais — Sul de Minas', '37000000', '37999999', 12.90, '3 a 5 dias úteis', true),
  ('Minas Gerais — Capital e região', '30000000', '36999999', 15.90, '4 a 7 dias úteis', true),
  ('São Paulo — Capital', '01000000', '09999999', 18.90, '4 a 7 dias úteis', true),
  ('São Paulo — Interior', '10000000', '19999999', 18.90, '5 a 8 dias úteis', true),
  ('Rio de Janeiro', '20000000', '28999999', 18.90, '5 a 8 dias úteis', true),
  ('Região Sudeste — outros', '29000000', '29999999', 22.90, '6 a 10 dias úteis', true),
  ('Região Sul', '80000000', '89999999', 25.90, '7 a 12 dias úteis', true),
  ('Região Nordeste', '40000000', '65999999', 28.90, '8 a 14 dias úteis', true),
  ('Região Centro-Oeste', '70000000', '77999999', 25.90, '7 a 12 dias úteis', true),
  ('Região Norte', '66000000', '69999999', 32.90, '10 a 18 dias úteis', true);

-- =============================================================
-- HOME SECTIONS
-- =============================================================
INSERT INTO home_sections (type, title, enabled, sort_order) VALUES
  ('HERO', 'Hero', true, 1),
  ('BENEFICIOS', 'Benefícios', true, 2),
  ('CATEGORIAS_DESTAQUE', 'Categorias em Destaque', true, 3),
  ('VITRINE_NOVIDADES', 'Novidades', true, 4),
  ('VITRINE_DESTAQUES', 'Destaques', true, 5),
  ('BANNER', 'Encomenda Personalizada', true, 6),
  ('DEPOIMENTOS', 'Depoimentos', true, 7);

-- =============================================================
-- STORE SETTINGS (1 row)
-- =============================================================
INSERT INTO store_settings (
  store_name, store_description, home_title, home_subtitle,
  hero_cta_text, hero_cta_link,
  whatsapp, phone, email, horario_atendimento,
  instagram_url, whatsapp_number, whatsapp_message,
  free_shipping_above, pix_enabled, boleto_enabled,
  about_text, announcement_enabled, announcement_text
) VALUES (
  'Arte Fios de Luz',
  'Peças artesanais carregadas de significado, fé, proteção e conexão espiritual.',
  'Arte Fios de Luz',
  'Arte, fé e proteção em cada criação',
  'Ver Coleção',
  '/categoria/guias-de-orixas',
  '5535989899904',
  '+55 35 98989-9904',
  'artefiodeluz@gmail.com',
  'Seg–Sex, 9h às 18h',
  'https://www.instagram.com/artefiosdeluz',
  '5535989899904',
  'Olá! Vi o site da Arte Fios de Luz e gostaria de saber mais sobre as peças.',
  199.00,
  true,
  false,
  'A Arte Fios de Luz nasce da fé e do cuidado. Criamos guias, terços, pulseiras e artigos de espiritualidade à mão, peça por peça, com respeito às tradições da Umbanda e do Candomblé.

Cada criação é única e pode ser personalizada para o seu orixá, sua entidade ou sua intenção — unindo beleza, significado e proteção.

Nosso trabalho é feito com amor, devoção e materiais selecionados: cristais naturais, cascalhos de pedras preciosas, sementes da mata, firmas tradicionais e metais de qualidade.

Acreditamos que cada peça carrega a energia de quem a faz e de quem a usa. Por isso, trabalhamos com intenção em cada conta, cada nó, cada detalhe.

Seja bem-vindo(a) à nossa casa espiritual.',
  true,
  'FRETE GRÁTIS para compras acima de R$ 199 ✨'
);

-- =============================================================
-- PEDIDOS DE TESTE (para o admin ver dados)
-- =============================================================
INSERT INTO orders (id, customer_name, customer_email, customer_phone, payment_method, payment_status, fulfillment_status, shipping_cost, shipping_method, subtotal, total, shipping_address, delivery_estimate, created_at) VALUES
  ('o1000000-0000-0000-0000-000000000001', 'Maria Clara Santos', 'maria.clara@email.com', '11999887766', 'PIX', 'PAID', 'DELIVERED', 12.90, 'PAC', 209.80, 222.70, '{"address": "Rua das Flores, 123", "city": "Pouso Alegre", "state": "MG", "zip": "37550000"}', '3 a 5 dias úteis', now() - interval '15 days'),
  ('o1000000-0000-0000-0000-000000000002', 'João Pedro Lima', 'joao.pedro@email.com', '21988776655', 'PIX', 'PAID', 'SHIPPED', 18.90, 'SEDEX', 119.90, 138.80, '{"address": "Av. Brasil, 456", "city": "Rio de Janeiro", "state": "RJ", "zip": "20040020"}', '5 a 8 dias úteis', now() - interval '5 days'),
  ('o1000000-0000-0000-0000-000000000003', 'Ana Beatriz Oliveira', 'ana.bea@email.com', '35988665544', 'PIX', 'PENDING', 'PENDING', 0, 'PAC', 249.80, 249.80, '{"address": "Rua Minas Gerais, 789", "city": "Itajubá", "state": "MG", "zip": "37500000"}', '3 a 5 dias úteis', now() - interval '1 day'),
  ('o1000000-0000-0000-0000-000000000004', 'Carlos Eduardo Souza', 'carlos.edu@email.com', '11977554433', 'PIX', 'PAID', 'PROCESSING', 18.90, 'PAC', 189.90, 208.80, '{"address": "Rua Augusta, 1000", "city": "São Paulo", "state": "SP", "zip": "01305100"}', '4 a 7 dias úteis', now() - interval '3 days'),
  ('o1000000-0000-0000-0000-000000000005', 'Fernanda Rodrigues', 'fernanda.r@email.com', '31966443322', 'PIX', 'PAID', 'DELIVERED', 15.90, 'PAC', 329.70, 345.60, '{"address": "Rua da Bahia, 500", "city": "Belo Horizonte", "state": "MG", "zip": "30160011"}', '4 a 7 dias úteis', now() - interval '20 days');

-- Itens dos pedidos
INSERT INTO order_items (order_id, product_id, product_name, quantity, price_at_sale, cost_at_sale) VALUES
  ('o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000003', 'Guia de Oxum Dourada', 1, 119.90, 42.00),
  ('o1000000-0000-0000-0000-000000000001', 'p1000000-0000-0000-0000-000000000001', 'Guia de Oxalá em Cristal Branco', 1, 89.90, 32.00),
  ('o1000000-0000-0000-0000-000000000002', 'p1000000-0000-0000-0000-000000000013', 'Guia de Maria Padilha Vermelha e Dourada', 1, 119.90, 42.00),
  ('o1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000014', 'Braja de Pombagira Rosa Caveira', 1, 189.90, 72.00),
  ('o1000000-0000-0000-0000-000000000003', 'p1000000-0000-0000-0000-000000000027', 'Pulseira de Oxum com Citrino', 1, 59.90, 20.00),
  ('o1000000-0000-0000-0000-000000000004', 'p1000000-0000-0000-0000-000000000014', 'Braja de Pombagira Rosa Caveira', 1, 189.90, 72.00),
  ('o1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000044', 'Guia Personalizada — Seu Orixá', 1, 159.90, 55.00),
  ('o1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000011', 'Guia de Nanã com Cascalho de Ametista', 1, 149.90, 55.00),
  ('o1000000-0000-0000-0000-000000000005', 'p1000000-0000-0000-0000-000000000025', 'Pulseira de Proteção Oxalá', 1, 49.90, 15.00);

-- =============================================================
-- CONTATOS DE TESTE
-- =============================================================
INSERT INTO contacts (name, email, phone, message, created_at) VALUES
  ('Luciana Ferreira', 'luciana.f@email.com', '11988776655', 'Olá! Gostaria de saber se vocês fazem guias personalizadas para Oxóssi com cascalho de esmeralda. Qual o prazo?', now() - interval '3 days'),
  ('Roberto Alves', 'roberto.a@email.com', '21977665544', 'Boa tarde! Vi o perfil de vocês no Instagram e amei as peças. Quero encomendar um braja para Pombagira Maria Padilha. Como faço?', now() - interval '7 days'),
  ('Patrícia Mendes', 'patricia.m@email.com', '35966554433', 'Vocês enviam para Poços de Caldas? Quero comprar a pulseira 7 linhas e a guia de Oxalá.', now() - interval '1 day');
