"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase"
import { ShoppingCart, DollarSign, Receipt, Package } from "lucide-react"

type ProductReport = { product_name: string; units_sold: number; revenue: number }

export default function VendasPage() {
  const [paidCount, setPaidCount] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [avgTicket, setAvgTicket] = useState(0)
  const [itemsSold, setItemsSold] = useState(0)
  const [report, setReport] = useState<ProductReport[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // Manual sale form
  const [saleForm, setSaleForm] = useState({
    product_id: "",
    quantity: 1,
    customer_name: "",
    customer_email: "",
    payment_method: "pix",
    notes: "",
  })
  const [saving, setSaving] = useState(false)
  const [saleSuccess, setSaleSuccess] = useState(false)

  const load = useCallback(async () => {
    const [ordersRes, itemsRes, productsRes] = await Promise.all([
      supabase.from("orders").select("id, total").eq("payment_status", "PAID"),
      supabase.from("order_items").select("product_name, quantity, price_at_sale, orders!inner(payment_status)").eq("orders.payment_status", "PAID"),
      supabase.from("products").select("*").eq("status", "ATIVO").order("name"),
    ])

    const paidOrders = ordersRes.data || []
    const items = itemsRes.data || []

    const totalRevenue = paidOrders.reduce((s, o) => s + (o.total || 0), 0)
    const totalItems = items.reduce((s: number, i: any) => s + (i.quantity || 0), 0)

    setPaidCount(paidOrders.length)
    setRevenue(totalRevenue)
    setAvgTicket(paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0)
    setItemsSold(totalItems)
    setProducts(productsRes.data || [])

    // Build product report
    const reportMap: Record<string, ProductReport> = {}
    items.forEach((i: any) => {
      const name = i.product_name || "Desconhecido"
      if (!reportMap[name]) reportMap[name] = { product_name: name, units_sold: 0, revenue: 0 }
      reportMap[name].units_sold += i.quantity || 0
      reportMap[name].revenue += (i.price_at_sale || 0) * (i.quantity || 0)
    })
    setReport(Object.values(reportMap).sort((a, b) => b.revenue - a.revenue))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleManualSale = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaleSuccess(false)

    const product = products.find((p) => p.id === saleForm.product_id)
    if (!product) { setSaving(false); return }

    const total = product.price * saleForm.quantity

    const { data: order } = await supabase.from("orders").insert({
      customer_name: saleForm.customer_name,
      customer_email: saleForm.customer_email,
      payment_method: saleForm.payment_method,
      payment_status: "PAID",
      fulfillment_status: "PENDING",
      subtotal: total,
      total,
      shipping_cost: 0,
      notes: saleForm.notes,
    }).select("id").single()

    if (order) {
      await supabase.from("order_items").insert({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: saleForm.quantity,
        price_at_sale: product.price,
        cost_at_sale: product.cost_price,
      })
    }

    setSaleForm({ product_id: "", quantity: 1, customer_name: "", customer_email: "", payment_method: "pix", notes: "" })
    setSaving(false)
    setSaleSuccess(true)
    load()
  }

  const kpis = [
    { label: "Vendas", value: String(paidCount), icon: ShoppingCart, color: "text-blue-600" },
    { label: "Faturamento", value: formatPrice(revenue), icon: DollarSign, color: "text-green-600" },
    { label: "Ticket Médio", value: formatPrice(avgTicket), icon: Receipt, color: "text-purple-600" },
    { label: "Itens Vendidos", value: String(itemsSold), icon: Package, color: "text-orange-600" },
  ]

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Vendas</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-background rounded-xl border p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{kpi.label}</span>
              <kpi.icon size={20} className={kpi.color} />
            </div>
            <span className="text-2xl font-bold">{kpi.value}</span>
          </div>
        ))}
      </div>

      {/* Product Report */}
      <div className="bg-background rounded-xl border overflow-x-auto mb-6">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Relatório por Produto</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Produto</th>
              <th className="p-3">Unidades Vendidas</th>
              <th className="p-3">Receita</th>
            </tr>
          </thead>
          <tbody>
            {report.map((r) => (
              <tr key={r.product_name} className="border-b last:border-0 hover:bg-muted/50">
                <td className="p-3 font-medium">{r.product_name}</td>
                <td className="p-3">{r.units_sold}</td>
                <td className="p-3">{formatPrice(r.revenue)}</td>
              </tr>
            ))}
            {report.length === 0 && (
              <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">Nenhuma venda registrada.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Sale Form */}
      <div className="bg-background rounded-xl border p-6">
        <h3 className="font-semibold mb-4">Registrar Venda Manual</h3>
        {saleSuccess && <p className="text-sm text-green-600 mb-4">Venda registrada com sucesso!</p>}
        <form onSubmit={handleManualSale} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Produto</label>
            <select required value={saleForm.product_id} onChange={(e) => setSaleForm({ ...saleForm, product_id: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
              <option value="">Selecione</option>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name} - {formatPrice(p.price)}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Quantidade</label>
            <input type="number" min="1" required value={saleForm.quantity} onChange={(e) => setSaleForm({ ...saleForm, quantity: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Nome do Cliente</label>
            <input required value={saleForm.customer_name} onChange={(e) => setSaleForm({ ...saleForm, customer_name: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">E-mail do Cliente</label>
            <input type="email" required value={saleForm.customer_email} onChange={(e) => setSaleForm({ ...saleForm, customer_email: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Método de Pagamento</label>
            <select value={saleForm.payment_method} onChange={(e) => setSaleForm({ ...saleForm, payment_method: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
              <option value="pix">PIX</option>
              <option value="boleto">Boleto</option>
              <option value="cartao">Cartão</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium">Observações</label>
            <input value={saleForm.notes} onChange={(e) => setSaleForm({ ...saleForm, notes: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" disabled={saving} className="px-6 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50">
              {saving ? "Registrando..." : "Registrar Venda"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
