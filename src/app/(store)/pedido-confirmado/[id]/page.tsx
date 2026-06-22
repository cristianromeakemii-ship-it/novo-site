"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Copy } from "lucide-react"
import { supabase, type Order } from "@/lib/supabase"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function OrderConfirmationPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    supabase
      .from("orders")
      .select("*, order_items(*)")
      .eq("id", id)
      .single()
      .then(({ data }) => { if (data) setOrder(data) })
  }, [id])

  const handleCopy = () => {
    navigator.clipboard.writeText(id.slice(0, 8).toUpperCase())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Carregando pedido...</p>
      </div>
    )
  }

  const paymentLabels: Record<string, string> = {
    pix: "PIX",
    boleto: "Boleto Bancário",
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-lg text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-[#3A2E1A] mb-2">
        Pedido Confirmado!
      </h1>
      <p className="text-gray-600 mb-6">Obrigado pela sua compra.</p>

      <div className="border rounded-lg p-6 text-left space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Pedido</span>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold">#{id.slice(0, 8).toUpperCase()}</span>
            <button onClick={handleCopy} className="text-gray-400 hover:text-gray-600">
              <Copy className="w-4 h-4" />
            </button>
            {copied && <span className="text-xs text-green-500">Copiado!</span>}
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Total</span>
          <span className="font-bold text-primary">{formatPrice(order.total)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Pagamento</span>
          <span className="text-sm">{paymentLabels[order.payment_method] || order.payment_method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Status</span>
          <span className="text-sm text-orange-500 font-medium">Aguardando pagamento</span>
        </div>
      </div>

      {order.payment_method === "pix" && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-green-800 mb-2">Instruções de Pagamento via PIX</h3>
          <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
            <li>Abra o aplicativo do seu banco</li>
            <li>Selecione a opção PIX</li>
            <li>Você receberá os dados de pagamento por e-mail</li>
            <li>Realize o pagamento dentro do prazo</li>
          </ol>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto">Voltar à Loja</Button>
        </Link>
        <Link href="/minha-conta/pedidos">
          <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white">Meus Pedidos</Button>
        </Link>
      </div>
    </div>
  )
}
