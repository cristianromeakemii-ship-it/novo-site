"use client"

import Link from "next/link"
import Image from "next/image"
import { Sparkles, Eye } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"
import { formatPrice } from "@/lib/utils"
import type { Product } from "@/lib/supabase"
import { Badge } from "@/components/ui/badge"

export default function ProductCard({ product }: { product: Product }) {
  const { settings } = useSettings()

  const imageUrl = product.product_images?.[0]?.url
  const freeShipping = product.price >= (settings.free_shipping_above ?? 200)
  const installment = product.price >= 100 ? formatPrice(product.price / 2) : null

  return (
    <Link href={`/produto/${product.slug}`} className="group block">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
            <Sparkles className="w-12 h-12 text-primary/30" />
          </div>
        )}

        {/* Hover overlay: clicar abre a pagina do produto (detalhes + adicionar ao carrinho) */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-white text-gray-800 px-5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 group-hover:bg-primary group-hover:text-white transition-colors">
            <Eye className="w-4 h-4" /> Ver produto
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {freeShipping && (
            <Badge className="bg-green-600 text-white text-[10px]">Frete Grátis</Badge>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="text-[13px] text-gray-700 line-clamp-2 leading-snug">{product.name}</h3>
        <p className="text-lg font-bold text-primary">{formatPrice(product.price)}</p>
        {installment && (
          <p className="text-[11px] text-gray-500">2x de {installment} sem juros</p>
        )}
      </div>
    </Link>
  )
}
