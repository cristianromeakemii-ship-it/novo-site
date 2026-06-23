-- ============================================================
-- Baixa automática de estoque ao registrar item de pedido (item 4)
-- Rode no SQL Editor do Supabase.
-- Decrementa stock_items.quantity sempre que um order_item é inserido
-- (compra na loja OU venda manual no admin), de forma atômica no banco.
-- ============================================================

create or replace function decrement_stock_on_order_item()
returns trigger
language plpgsql
as $$
begin
  update stock_items
  set quantity = quantity - new.quantity
  where product_id = new.product_id;
  return new;
end;
$$;

drop trigger if exists trg_decrement_stock on order_items;
create trigger trg_decrement_stock
  after insert on order_items
  for each row execute function decrement_stock_on_order_item();
