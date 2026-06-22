"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import { Package, ClipboardList, DollarSign, Clock, AlertTriangle } from "lucide-react"

type KPI = { label: string; value: string; icon: React.ElementType; color: string }

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPI[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [products, orders, paidOrders, pendingOrders, lowStock] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }).eq("status", "ATIVO"),
        supabase.from("orders").select("id", { count: "exact", head: true }),
        supabase.from("orders").select("total").eq("payment_status", "PAID"),
        supabase.from("orders").select("id", { count: "exact", head: true }).eq("payment_status", "PENDING"),
        supabase.from("stock_items").select("id", { count: "exact", head: true }).lt("quantity", 3),
      ])

      const revenue = (paidOrders.data || []).reduce((s, o) => s + (o.total || 0), 0)

      setKpis([
        { label: "Produtos Ativos", value: String(products.count || 0), icon: Package, color: "text-blue-600" },
        { label: "Total de Pedidos", value: String(orders.count || 0), icon: ClipboardList, color: "text-purple-600" },
        { label: "Faturamento", value: formatPrice(revenue), icon: DollarSign, color: "text-green-600" },
        { label: "Pedidos Pendentes", value: String(pendingOrders.count || 0), icon: Clock, color: "text-yellow-600" },
        { label: "Estoque Baixo", value: String(lowStock.count || 0), icon: AlertTriangle, color: "text-red-600" },
      ])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
    </div>
  )
}
