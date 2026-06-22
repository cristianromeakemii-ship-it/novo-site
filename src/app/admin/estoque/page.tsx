"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { formatPrice, cn } from "@/lib/utils"
import { Package, Boxes, DollarSign, AlertTriangle } from "lucide-react"

type StockRow = {
  id: string
  product_id: string
  quantity: number
  min_quantity: number
  product_name: string
  category_name: string
  price: number
  cost_price: number
}

export default function EstoquePage() {
  const [rows, setRows] = useState<StockRow[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase
      .from("stock_items")
      .select("*, products(name, price, cost_price, categories(name))")
      .order("updated_at", { ascending: false })

    const mapped: StockRow[] = (data || []).map((s: any) => ({
      id: s.id,
      product_id: s.product_id,
      quantity: s.quantity,
      min_quantity: s.min_quantity,
      product_name: s.products?.name || "",
      category_name: s.products?.categories?.name || "-",
      price: s.products?.price || 0,
      cost_price: s.products?.cost_price || 0,
    }))
    setRows(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateField = async (id: string, field: string, value: number) => {
    await supabase.from("stock_items").update({ [field]: value }).eq("id", id)
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
  }

  const updateCostPrice = async (productId: string, value: number) => {
    await supabase.from("products").update({ cost_price: value }).eq("id", productId)
    setRows((prev) => prev.map((r) => (r.product_id === productId ? { ...r, cost_price: value } : r)))
  }

  const activeCount = rows.length
  const totalUnits = rows.reduce((s, r) => s + r.quantity, 0)
  const totalValue = rows.reduce((s, r) => s + r.quantity * r.cost_price, 0)
  const lowStockCount = rows.filter((r) => r.quantity <= r.min_quantity).length

  const kpis = [
    { label: "Produtos Ativos", value: String(activeCount), icon: Package, color: "text-blue-600" },
    { label: "Unidades em Estoque", value: String(totalUnits), icon: Boxes, color: "text-purple-600" },
    { label: "Valor Total", value: formatPrice(totalValue), icon: DollarSign, color: "text-green-600" },
    { label: "Estoque Baixo", value: String(lowStockCount), icon: AlertTriangle, color: "text-red-600" },
  ]

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Estoque</h2>

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

      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Produto</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Quantidade</th>
              <th className="p-3">Mín.</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Custo</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isLow = r.quantity <= r.min_quantity
              return (
                <tr key={r.id} className={cn("border-b last:border-0 hover:bg-muted/50", isLow && "bg-red-50")}>
                  <td className="p-3 font-medium">{r.product_name}</td>
                  <td className="p-3 text-muted-foreground">{r.category_name}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={r.quantity}
                      onBlur={(e) => updateField(r.id, "quantity", Number(e.target.value))}
                      className={cn("w-20 px-2 py-1 border rounded text-sm bg-background", isLow && "border-red-400")}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      min="0"
                      defaultValue={r.min_quantity}
                      onBlur={(e) => updateField(r.id, "min_quantity", Number(e.target.value))}
                      className="w-20 px-2 py-1 border rounded text-sm bg-background"
                    />
                  </td>
                  <td className="p-3">{formatPrice(r.price)}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={r.cost_price}
                      onBlur={(e) => updateCostPrice(r.product_id, Number(e.target.value))}
                      className="w-24 px-2 py-1 border rounded text-sm bg-background"
                    />
                  </td>
                </tr>
              )
            })}
            {rows.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">Nenhum item em estoque.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
