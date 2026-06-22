"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import Link from "next/link"
import { supabase, type Product, type Category, type Subcategory } from "@/lib/supabase"
import ProductCard from "@/components/store/ProductCard"
import { cn } from "@/lib/utils"

export default function CategoryPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const subSlug = searchParams.get("sub")

  const [category, setCategory] = useState<Category | null>(null)
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [activeSub, setActiveSub] = useState<string | null>(subSlug)
  const [sort, setSort] = useState("recent")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data: cat } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single()
      if (!cat) { setLoading(false); return }
      setCategory(cat)

      const { data: subs } = await supabase
        .from("subcategories")
        .select("*")
        .eq("category_id", cat.id)
        .eq("is_active", true)
        .order("name")
      setSubcategories(subs || [])

      let query = supabase
        .from("products")
        .select("*, product_images(*), categories(*), subcategories(*), stock_items(*)")
        .eq("category_id", cat.id)
        .eq("status", "ATIVO")

      if (sort === "price_asc") query = query.order("price", { ascending: true })
      else if (sort === "price_desc") query = query.order("price", { ascending: false })
      else query = query.order("created_at", { ascending: false })

      const { data: prods } = await query
      let filtered = prods || []
      if (activeSub) {
        const sub = (subs || []).find((s) => s.slug === activeSub)
        if (sub) filtered = filtered.filter((p) => p.subcategory_id === sub.id)
      }
      setProducts(filtered)
      setLoading(false)
    }
    load()
  }, [slug, sort, activeSub])

  useEffect(() => {
    setActiveSub(subSlug)
  }, [subSlug])

  return (
    <div className="container mx-auto px-4 py-8">
      {category && (
        <>
          <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-[#3A2E1A] mb-2">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-600 mb-6">{category.description}</p>
          )}
        </>
      )}

      {/* Subcategory pills */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveSub(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm border transition-colors",
              !activeSub ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
            )}
          >
            Todos
          </button>
          {subcategories.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setActiveSub(sub.slug)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-colors",
                activeSub === sub.slug ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
              )}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} produto(s)</p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="recent">Mais Recentes</option>
          <option value="price_asc">Menor Preço</option>
          <option value="price_desc">Maior Preço</option>
        </select>
      </div>

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
      ) : products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Nenhum produto encontrado nesta categoria.</p>
          <Link href="/" className="text-primary hover:underline">Ver toda a loja</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
