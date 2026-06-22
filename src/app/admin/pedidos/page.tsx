"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { formatPrice, cn } from "@/lib/utils"
import type { Order } from "@/lib/supabase"
import { Search, X, Eye } from "lucide-react"

const paymentBadge: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-purple-100 text-purple-800",
}

const paymentLabel: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  EXPIRED: "Expirado",
  REFUNDED: "Reembolsado",
}

const fulfillmentBadge: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
}

const fulfillmentLabel: Record<string, string> = {
  PENDING: "Pendente",
  PROCESSING: "Processando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELLED: "Cancelado",
}

const PAYMENT_STATUSES = ["PENDING", "PAID", "CANCELLED", "EXPIRED", "REFUNDED"] as const
const FULFILLMENT_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"] as const

export default function PedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*)")
      .order("created_at", { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.customer_email?.toLowerCase().includes(search.toLowerCase()) || o.customer_name?.toLowerCase().includes(search.toLowerCase())
    const matchStatus = !filterStatus || o.payment_status === filterStatus
    return matchSearch && matchStatus
  })

  const openDetail = (o: Order) => setDetailOrder({ ...o })

  const updateOrder = async () => {
    if (!detailOrder) return
    setSaving(true)
    await supabase.from("orders").update({
      payment_status: detailOrder.payment_status,
      fulfillment_status: detailOrder.fulfillment_status,
      tracking_code: detailOrder.tracking_code,
      tracking_url: detailOrder.tracking_url,
    }).eq("id", detailOrder.id)
    setSaving(false)
    setDetailOrder(null)
    load()
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Pedidos</h2>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por e-mail ou nome..." className="w-full pl-9 pr-3 py-2 border rounded-md bg-background text-sm" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-md bg-background text-sm">
          <option value="">Todos os status</option>
          {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{paymentLabel[s]}</option>)}
        </select>
      </div>

      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">ID</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Total</th>
              <th className="p-3">Pagamento</th>
              <th className="p-3">Entrega</th>
              <th className="p-3">Data</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="p-3 font-mono text-xs">{o.id.substring(0, 8)}</td>
                <td className="p-3">{o.customer_name || "-"}</td>
                <td className="p-3 text-muted-foreground">{o.customer_email}</td>
                <td className="p-3">{formatPrice(o.total)}</td>
                <td className="p-3">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", paymentBadge[o.payment_status])}>
                    {paymentLabel[o.payment_status]}
                  </span>
                </td>
                <td className="p-3">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", fulfillmentBadge[o.fulfillment_status])}>
                    {fulfillmentLabel[o.fulfillment_status]}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString("pt-BR")}</td>
                <td className="p-3">
                  <button onClick={() => openDetail(o)} className="p-1.5 rounded hover:bg-muted"><Eye size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Nenhum pedido encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Dialog */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDetailOrder(null)}>
          <div className="bg-background rounded-xl border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Pedido #{detailOrder.id.substring(0, 8)}</h3>
              <button onClick={() => setDetailOrder(null)} className="p-1 rounded hover:bg-muted"><X size={20} /></button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm"><strong>Cliente:</strong> {detailOrder.customer_name}</p>
                <p className="text-sm"><strong>E-mail:</strong> {detailOrder.customer_email}</p>
                <p className="text-sm"><strong>Total:</strong> {formatPrice(detailOrder.total)}</p>
              </div>

              {detailOrder.order_items && detailOrder.order_items.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Itens:</p>
                  <div className="border rounded-md divide-y">
                    {detailOrder.order_items.map((item) => (
                      <div key={item.id} className="flex justify-between p-2 text-sm">
                        <span>{item.product_name} x{item.quantity}</span>
                        <span>{formatPrice(item.price_at_sale * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Status Pagamento</label>
                  <select value={detailOrder.payment_status} onChange={(e) => setDetailOrder({ ...detailOrder, payment_status: e.target.value as Order["payment_status"] })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    {PAYMENT_STATUSES.map((s) => <option key={s} value={s}>{paymentLabel[s]}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Status Entrega</label>
                  <select value={detailOrder.fulfillment_status} onChange={(e) => setDetailOrder({ ...detailOrder, fulfillment_status: e.target.value as Order["fulfillment_status"] })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                    {FULFILLMENT_STATUSES.map((s) => <option key={s} value={s}>{fulfillmentLabel[s]}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Código de Rastreio</label>
                <input value={detailOrder.tracking_code || ""} onChange={(e) => setDetailOrder({ ...detailOrder, tracking_code: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">URL de Rastreio</label>
                <input value={detailOrder.tracking_url || ""} onChange={(e) => setDetailOrder({ ...detailOrder, tracking_url: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setDetailOrder(null)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Fechar</button>
              <button onClick={updateOrder} disabled={saving} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
