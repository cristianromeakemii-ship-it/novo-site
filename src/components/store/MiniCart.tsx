"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { X, ShoppingBag, Trash2, Minus, Plus } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Painel lateral do carrinho. Abre via evento "cart:open" (disparado pelo
// icone do header e ao adicionar um item ao carrinho).
export default function MiniCart() {
  const { items, removeItem, updateQuantity, total, itemCount } = useCart()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const openHandler = () => setOpen(true)
    window.addEventListener("cart:open", openHandler)
    return () => window.removeEventListener("cart:open", openHandler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-[90] bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-[91] h-full w-full max-w-sm bg-white shadow-xl flex flex-col transition-transform duration-300",
          open ? "translate-x-0" : "translate-x-full"
        )}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" /> Meu Carrinho ({itemCount})
          </h2>
          <button onClick={() => setOpen(false)} aria-label="Fechar carrinho" className="text-gray-500 hover:text-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 mb-4">Seu carrinho está vazio.</p>
            <Button onClick={() => setOpen(false)} className="bg-primary hover:bg-primary/90 text-white">
              Continuar comprando
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div key={item.key} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="64px" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/produto/${item.slug}`}
                      onClick={() => setOpen(false)}
                      className="text-sm font-medium line-clamp-2 hover:text-primary"
                    >
                      {item.name}
                    </Link>
                    {item.customization && (
                      <p className="text-xs text-gray-500 line-clamp-1">Personalização: {item.customization}</p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex items-center border rounded-md">
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity - 1)}
                          className="p-1 hover:bg-gray-50"
                          aria-label="Diminuir"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.key, item.quantity + 1)}
                          className="p-1 hover:bg-gray-50"
                          aria-label="Aumentar"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-primary">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.key)}
                    className="text-red-400 hover:text-red-600 self-start"
                    aria-label="Remover item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t p-4 space-y-3">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">Finalizar Compra</Button>
              </Link>
              <Link href="/carrinho" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Ver carrinho completo</Button>
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  )
}
