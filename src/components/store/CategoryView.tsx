import Link from "next/link"
import { cn } from "@/lib/utils"
import type { Category, Subcategory, Product } from "@/lib/supabase"
import ProductCard from "@/components/store/ProductCard"
import CategorySort from "@/components/store/CategorySort"

// Listagem compartilhada entre /categoria/[slug] e /categoria/[slug]/[sub].
export default function CategoryView({
  category,
  subcategories,
  activeSubSlug,
  heading,
  description,
  products,
}: {
  category: Category
  subcategories: Subcategory[]
  activeSubSlug: string | null
  heading: string
  description: string | null
  products: Product[]
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-2">{heading}</h1>
      {description && <p className="text-gray-600 mb-6 max-w-3xl whitespace-pre-line">{description}</p>}

      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={`/categoria/${category.slug}`}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm border transition-colors",
              !activeSubSlug ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
            )}
          >
            Todos
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s.id}
              href={`/categoria/${category.slug}/${s.slug}`}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-colors",
                activeSubSlug === s.slug ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
              )}
            >
              {s.name}
            </Link>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">{products.length} produto(s)</p>
        <CategorySort />
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Nenhum produto encontrado nesta categoria.</p>
          <Link href="/" className="text-primary hover:underline">Ver toda a loja</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
