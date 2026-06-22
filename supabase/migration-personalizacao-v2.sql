-- ============================================================
-- Migração OPCIONAL: personalização estruturada (v2)
-- Rode no SQL Editor do Supabase quando quiser habilitar opções
-- estruturadas de personalização (tamanho, cor, nº de contas...).
-- É aditivo e seguro: só cria colunas nullable, não altera dados.
-- A personalização v1 (campo livre) já funciona sem esta migração.
-- ============================================================

-- Opções que cada produto oferece para personalizar.
-- Ex.: {"Tamanho": ["60cm","65cm","70cm"], "Tipo": ["Guia aberta","Guia fechada"]}
alter table products
  add column if not exists customization_options jsonb default null;

-- Personalização escolhida pelo cliente, salva por item do pedido.
-- Ex.: {"Tamanho": "65cm", "Tipo": "Guia fechada", "Observação": "cores de Oxum"}
alter table order_items
  add column if not exists customization jsonb default null;

comment on column products.customization_options is
  'Opções de personalização oferecidas pelo produto (chave -> lista de valores).';
comment on column order_items.customization is
  'Personalização escolhida pelo cliente para este item do pedido.';
