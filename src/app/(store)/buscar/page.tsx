"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Search } from "lucide-react"
import { supabase, type Product } from "@/lib/supabase"
import ProductCard from "@/components/store/ProductCard"

function SearchResults() {
  const searchParams = useSearchParams()
  const q = (searchParams.get("q") || "").trim()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!q) {
        setProducts([])
        setLoading(false)
        return
      }
      setLoading(true)
      // Remove caracteres que quebrariam a sintaxe do filtro .or do PostgREST.
      const safe = q.replace(/[,()%]/g, " ").trim()
      const { data } = await supabase
        .from("products")
        .select("*, product_images(*), categories(*), subcategories(*), stock_items(*)")
        .eq("status", "ATIVO")
        .or(`name.ilike.%${safe}%,description.ilike.%${safe}%`)
        .order("created_at", { ascending: false })
        .limit(48)
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [q])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-2xl md:text-3xl font-bold text-brown mb-2">
        {q ? <>Resultados para “{q}”</> : "Buscar produtos"}
      </h1>
      {!loading && q && (
        <p className="text-sm text-gray-500 mb-6">{products.length} produto(s) encontrado(s)</p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-3" />
              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Search className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            {q
              ? "Nenhum produto encontrado para sua busca."
              : "Digite o nome de um produto, orixá ou entidade para buscar."}
          </p>
          <Link href="/" className="text-primary hover:underline">
            Voltar à loja
          </Link>
        </div>
      )}
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-16 text-center text-gray-500">Carregando…</div>
      }
    >
      <SearchResults />
    </Suspense>
  )
}
