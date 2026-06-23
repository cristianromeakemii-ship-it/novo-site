"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, type ShippingZone } from "@/lib/supabase"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { settings } = useSettings()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zip, setZip] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("pix")
  const [shippingZones, setShippingZones] = useState<ShippingZone[]>([])
  const [selectedShipping, setSelectedShipping] = useState<ShippingZone | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const hasPhysical = items.some((i) => i.type === "FISICO")

  useEffect(() => {
    if (user) {
      setEmail(user.email || "")
      setName(user.user_metadata?.full_name || "")
    }
  }, [user])

  const handleCepSearch = async () => {
    const cleanCep = zip.replace(/\D/g, "")
    if (cleanCep.length !== 8) return
    // ViaCEP: autopreenche endereco/cidade/estado a partir do CEP
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const cepData = await res.json()
      if (!cepData.erro) {
        if (cepData.logradouro) setAddress(cepData.logradouro)
        if (cepData.localidade) setCity(cepData.localidade)
        if (cepData.uf) setState(cepData.uf)
      }
    } catch {}
    const { data } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("is_active", true)
      .lte("cep_start", cleanCep)
      .gte("cep_end", cleanCep)
    setShippingZones(data || [])
    if (data && data.length > 0) setSelectedShipping(data[0])
  }

  const shippingCost = selectedShipping?.price || 0
  const freeShipping = total >= (settings.free_shipping_above ?? 200)
  const finalShipping = freeShipping ? 0 : shippingCost
  const finalTotal = total + finalShipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !phone) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }
    if (hasPhysical && (!address || !city || !state || !zip)) {
      setError("Preencha o endereço completo para produtos físicos.")
      return
    }
    if (hasPhysical && !selectedShipping) {
      setError("Calcule o frete pelo CEP e selecione um método de envio.")
      return
    }
    setSubmitting(true)
    setError("")

    const customizationNotes = items
      .filter((i) => i.customization)
      .map((i) => `• ${i.name} (x${i.quantity}): ${i.customization}`)
      .join("\n")

    // Revalida estoque dos itens fisicos antes de criar o pedido (evita overselling)
    const neededByProduct = new Map<string, number>()
    for (const it of items) {
      if (it.type !== "FISICO") continue
      neededByProduct.set(it.id, (neededByProduct.get(it.id) || 0) + it.quantity)
    }
    if (neededByProduct.size > 0) {
      const { data: stockRows } = await supabase
        .from("stock_items")
        .select("product_id, quantity")
        .in("product_id", Array.from(neededByProduct.keys()))
      if (stockRows) {
        const stockMap = new Map(stockRows.map((s) => [s.product_id, s.quantity]))
        for (const [pid, needed] of neededByProduct) {
          if ((stockMap.get(pid) ?? 0) < needed) {
            setError("Um item do carrinho ficou sem estoque suficiente. Ajuste as quantidades e tente novamente.")
            setSubmitting(false)
            return
          }
        }
      }
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        payment_method: paymentMethod,
        payment_status: "PENDING",
        fulfillment_status: "PENDING",
        shipping_cost: finalShipping,
        shipping_method: selectedShipping?.name || "Digital",
        shipping_address: hasPhysical ? { address, city, state, zip } : null,
        delivery_estimate: selectedShipping?.estimate || "",
        subtotal: total,
        total: finalTotal,
        tracking_code: "",
        tracking_url: "",
        notes: customizationNotes ? `Personalização:\n${customizationNotes}` : "",
      })
      .select()
      .single()

    if (orderError || !order) {
      setError("Erro ao criar pedido. Tente novamente.")
      setSubmitting(false)
      return
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      product_name: item.customization ? `${item.name} — Personalização: ${item.customization}` : item.name,
      quantity: item.quantity,
      price_at_sale: item.price,
      cost_at_sale: 0,
    }))

    await supabase.from("order_items").insert(orderItems)

    // Resumo para a pagina de confirmacao — funciona para convidados,
    // que nao podem ler o proprio pedido por RLS.
    try {
      sessionStorage.setItem(
        `order:${order.id}`,
        JSON.stringify({ total: finalTotal, payment_method: paymentMethod })
      )
    } catch {}

    clearCart()
    router.push(`/pedido-confirmado/${order.id}`)
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Seu carrinho está vazio.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-8">
        Finalizar Compra
      </h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Dados Pessoais</h2>
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nome completo *</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">E-mail *</label>
                  <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Telefone *</label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {hasPhysical && (
            <div className="border rounded-lg p-6">
              <h2 className="font-semibold mb-4">Endereço de Entrega</h2>
              <div className="grid gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">CEP *</label>
                  <div className="flex gap-2">
                    <Input value={zip} onChange={(e) => setZip(e.target.value)} onBlur={handleCepSearch} placeholder="00000-000" maxLength={9} required />
                    <Button type="button" variant="outline" onClick={handleCepSearch}>Buscar</Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Endereço *</label>
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} required />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Cidade *</label>
                    <Input value={city} onChange={(e) => setCity(e.target.value)} required />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Estado *</label>
                    <Input value={state} onChange={(e) => setState(e.target.value)} required />
                  </div>
                </div>
              </div>

              {/* Shipping methods */}
              {shippingZones.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Método de Envio</h3>
                  <div className="space-y-2">
                    {shippingZones.map((zone) => (
                      <label
                        key={zone.id}
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-md cursor-pointer",
                          selectedShipping?.id === zone.id ? "border-primary bg-primary/5" : ""
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShipping?.id === zone.id}
                            onChange={() => setSelectedShipping(zone)}
                            className="accent-primary"
                          />
                          <div>
                            <p className="text-sm font-medium">{zone.name}</p>
                            <p className="text-xs text-gray-500">{zone.estimate}</p>
                          </div>
                        </div>
                        <span className="text-sm font-medium">
                          {freeShipping ? "Grátis" : zone.price === 0 ? "Grátis" : formatPrice(zone.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment */}
          <div className="border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Pagamento</h2>
            <div className="space-y-2">
              {settings.pix_enabled && (
                <label className={cn(
                  "flex items-center gap-3 p-3 border rounded-md cursor-pointer",
                  paymentMethod === "pix" ? "border-primary bg-primary/5" : ""
                )}>
                  <input type="radio" name="payment" value="pix" checked={paymentMethod === "pix"} onChange={() => setPaymentMethod("pix")} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">PIX</p>
                    <p className="text-xs text-gray-500">Pagamento instantâneo</p>
                  </div>
                </label>
              )}
              {settings.boleto_enabled && (
                <label className={cn(
                  "flex items-center gap-3 p-3 border rounded-md cursor-pointer",
                  paymentMethod === "boleto" ? "border-primary bg-primary/5" : ""
                )}>
                  <input type="radio" name="payment" value="boleto" checked={paymentMethod === "boleto"} onChange={() => setPaymentMethod("boleto")} className="accent-primary" />
                  <div>
                    <p className="text-sm font-medium">Boleto Bancário</p>
                    <p className="text-xs text-gray-500">Prazo de 1-3 dias úteis</p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Resumo do Pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.key} className="text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 truncate mr-2">{item.name} x{item.quantity}</span>
                    <span className="whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                  {item.customization && (
                    <p className="text-xs text-gray-400 truncate">↳ {item.customization}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              {hasPhysical && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Frete</span>
                  <span>{finalShipping === 0 ? "Grátis" : formatPrice(finalShipping)}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
            >
              {submitting ? "Processando..." : "Confirmar Pedido"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
