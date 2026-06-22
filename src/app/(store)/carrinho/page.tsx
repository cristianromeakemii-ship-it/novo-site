"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingBag, Trash2, Minus, Plus, Sparkles, ArrowLeft } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-[#3A2E1A] mb-2">
          Seu carrinho está vazio
        </h1>
        <p className="text-gray-500 mb-6">Que tal explorar nossos produtos?</p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-white">Ver Produtos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-[#3A2E1A] mb-8">
        Meu Carrinho
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
              <div className="relative w-20 h-20 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                {item.image_url ? (
                  <Image src={item.image_url} alt={item.name} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary/20" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/produto/${item.slug}`} className="text-sm font-medium hover:text-primary line-clamp-2">
                  {item.name}
                </Link>
                <p className="text-primary font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center border rounded-md">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1.5 hover:bg-gray-50">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1.5 hover:bg-gray-50">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-sm">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}

          <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary mt-4">
            <ArrowLeft className="w-4 h-4" /> Continuar comprando
          </Link>
        </div>

        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-semibold text-lg mb-4">Resumo</h2>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
            <div className="border-t my-4" />
            <div className="flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            <Link href="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                Finalizar Compra
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
