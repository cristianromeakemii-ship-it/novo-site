"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

export type CartItem = {
  id: string // id do produto (vai para order_items.product_id)
  key: string // chave da linha do carrinho (id + personalizacao)
  name: string
  slug: string
  price: number
  quantity: number
  image_url: string
  type: 'DIGITAL' | 'FISICO'
  customization?: string
}

type CartInput = Omit<CartItem, 'quantity' | 'key'>

type CartContextType = {
  items: CartItem[]
  addItem: (item: CartInput, quantity?: number) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Linhas com a MESMA personalizacao se agrupam; personalizacoes diferentes do
// mesmo produto viram linhas separadas.
function lineKey(id: string, customization?: string) {
  const c = customization?.trim()
  return c ? `${id}::${c}` : id
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("cart")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[]
        // garante a chave de linha em carrinhos salvos antes da personalizacao
        setItems(parsed.map((i) => ({ ...i, key: i.key || lineKey(i.id, i.customization) })))
      } catch {}
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, loaded])

  const addItem = useCallback((item: CartInput, quantity = 1) => {
    const key = lineKey(item.id, item.customization)
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { ...item, key, quantity }]
    })
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cart:open"))
    }
  }, [])

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }, [])

  const updateQuantity = useCallback((key: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.key !== key))
    } else {
      setItems((prev) => prev.map((i) => (i.key === key ? { ...i, quantity } : i)))
    }
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
