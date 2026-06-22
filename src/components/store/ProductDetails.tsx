"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingBag, MessageCircle, Minus, Plus, Truck } from "lucide-react"
import { supabase, type Product, type ShippingZone } from "@/lib/supabase"
import { useCart } from "@/contexts/CartContext"
import { useSettings } from "@/contexts/SettingsContext"
import { formatPrice, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Parte interativa da pagina de produto (galeria, quantidade, carrinho, frete).
// A pagina em si e Server Component (SEO/metadata); aqui fica o que precisa do cliente.
export default function ProductDetails({ product }: { product: Product }) {
  const { addItem } = useCart()
  const { settings } = useSettings()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [cep, setCep] = useState("")
  const [shipping, setShipping] = useState<ShippingZone | null>(null)
  const [shippingError, setShippingError] = useState("")

  const images = product.product_images || []
  const currentImage = images[selectedImage]?.url
  const stock = product.stock_items?.[0]?.quantity ?? 0
  const installment = product.price >= 100 ? formatPrice(product.price / 2) : null

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image_url: currentImage || "",
        type: product.type,
      },
      quantity
    )
    toast.success("Produto adicionado ao carrinho", { description: product.name })
  }

  const handleShipping = async () => {
    setShippingError("")
    setShipping(null)
    const cleanCep = cep.replace(/\D/g, "")
    if (cleanCep.length !== 8) {
      setShippingError("CEP inválido")
      return
    }
    const { data } = await supabase
      .from("shipping_zones")
      .select("*")
      .eq("is_active", true)
      .lte("cep_start", cleanCep)
      .gte("cep_end", cleanCep)
      .limit(1)
      .single()
    if (data) setShipping(data)
    else setShippingError("Região não atendida")
  }

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number || settings.whatsapp}?text=${encodeURIComponent(
    `Olá! Tenho interesse no produto: ${product.name}`
  )}`

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Images */}
      <div>
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-50 to-amber-100" />
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedImage(i)}
                className={cn(
                  "relative w-16 h-16 rounded-md overflow-hidden border-2 flex-shrink-0",
                  selectedImage === i ? "border-primary" : "border-transparent"
                )}
              >
                <Image src={img.url} alt={`${product.name} — foto ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <div>
        <h1 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-brown mb-2">
          {product.name}
        </h1>

        {product.categories && (
          <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
            <span>{product.categories.name}</span>
            {product.subcategories && (
              <>
                <span>&gt;</span>
                <span>{product.subcategories.name}</span>
              </>
            )}
          </div>
        )}

        {product.guide_size && (
          <Badge variant="outline" className="text-primary border-primary mb-4">{product.guide_size}</Badge>
        )}

        <p className="text-3xl font-bold text-primary mb-1">{formatPrice(product.price)}</p>
        {installment && <p className="text-sm text-gray-500 mb-4">2x de {installment} sem juros</p>}

        <div className="mb-4">
          {stock > 10 && <span className="text-sm text-green-600 font-medium">Em estoque</span>}
          {stock > 0 && stock <= 10 && (
            <span className="text-sm text-orange-500 font-medium">Últimas {stock} unidades!</span>
          )}
          {stock <= 0 && <span className="text-sm text-red-500 font-medium">Sem estoque</span>}
        </div>

        {product.description && (
          <div className="text-sm text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
            {product.description}
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center border rounded-md">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-2 hover:bg-gray-50">
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => Math.min(Math.max(stock, 1), q + 1))}
              disabled={quantity >= stock}
              className="p-2 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <Button onClick={handleAddToCart} disabled={stock <= 0} className="w-full mb-3 bg-primary hover:bg-primary/90 text-white">
          <ShoppingBag className="w-4 h-4 mr-2" />
          {stock <= 0 ? "Sem estoque" : "Adicionar ao Carrinho"}
        </Button>

        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" className="w-full border-green-500 text-green-600 hover:bg-green-50">
            <MessageCircle className="w-4 h-4 mr-2" /> Perguntar pelo WhatsApp
          </Button>
        </a>

        <div className="mt-6 p-4 border rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Calcular frete</span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Digite seu CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              maxLength={9}
              className="flex-1"
            />
            <Button variant="outline" onClick={handleShipping}>Calcular</Button>
          </div>
          {shippingError && <p className="text-sm text-red-500 mt-2">{shippingError}</p>}
          {shipping && (
            <div className="mt-3 p-3 bg-gray-50 rounded-md">
              <p className="text-sm font-medium">{shipping.name}</p>
              <p className="text-sm text-gray-600">
                {shipping.price === 0 ? "Grátis" : formatPrice(shipping.price)} - {shipping.estimate}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
