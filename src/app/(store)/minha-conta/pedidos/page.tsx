"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Package, ChevronDown, ChevronUp } from "lucide-react"
import { supabase, type Order } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"
import { formatPrice, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  EXPIRED: "Expirado",
  REFUNDED: "Reembolsado",
  PROCESSING: "Em Processamento",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  REFUNDED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
}

export default function MyOrdersPage() {
  const { user, loading: authLoading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (authLoading) return
    if (!user) { setLoading(false); return }
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setOrders(data)
        setLoading(false)
      })
  }, [user, authLoading])

  if (!authLoading && !user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Faça login para ver seus pedidos.</p>
        <Link href="/entrar" className="text-primary hover:underline font-medium">Entrar</Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-8">
        Meus Pedidos
      </h1>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse border rounded-lg p-6">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">Você ainda não tem pedidos.</p>
          <Link href="/" className="text-primary hover:underline font-medium">Explorar produtos</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg overflow-hidden">
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50"
              >
                <div className="flex items-center gap-4 text-left">
                  <div>
                    <p className="font-mono text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Badge className={cn("text-[10px] border-0", statusColors[order.payment_status])}>
                    {statusLabels[order.payment_status] || order.payment_status}
                  </Badge>
                  <Badge className={cn("text-[10px] border-0", statusColors[order.fulfillment_status])}>
                    {statusLabels[order.fulfillment_status] || order.fulfillment_status}
                  </Badge>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-primary">{formatPrice(order.total)}</span>
                  {expanded === order.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {expanded === order.id && (
                <div className="border-t px-4 py-3 bg-gray-50">
                  <div className="space-y-2">
                    {order.order_items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                        <span>{formatPrice(item.price_at_sale * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t mt-3 pt-3 flex justify-between text-sm">
                    <span className="text-gray-500">Frete: {formatPrice(order.shipping_cost)}</span>
                    <span className="text-gray-500">Pagamento: {order.payment_method.toUpperCase()}</span>
                  </div>
                  {order.tracking_code && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500">Rastreio: </span>
                      {order.tracking_url ? (
                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                          {order.tracking_code}
                        </a>
                      ) : (
                        <span className="text-sm font-mono">{order.tracking_code}</span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
