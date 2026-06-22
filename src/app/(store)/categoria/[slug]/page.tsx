import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cn } from "@/lib/utils"
import { getCategoryBySlug, getSubcategories, getCategoryProducts } from "@/lib/queries"
import ProductCard from "@/components/store/ProductCard"
import CategorySort from "@/components/store/CategorySort"

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ sub?: string; sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Categoria não encontrada" }

  const desc = (
    category.description ||
    `Veja nossa coleção de ${category.name} — peças artesanais com fé e proteção da Arte Fios de Luz.`
  )
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)

  return {
    title: category.name,
    description: desc,
    alternates: { canonical: `/categoria/${category.slug}` },
    openGraph: {
      title: category.name,
      description: desc,
      url: `/categoria/${category.slug}`,
      type: "website",
    },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sub, sort = "recent" } = await searchParams
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = await getSubcategories(category.id)
  const activeSub = sub ? subcategories.find((s) => s.slug === sub) : null
  const products = await getCategoryProducts(category.id, sort, activeSub?.id ?? null)

  const buildHref = (subSlug: string | null) => {
    const sp = new URLSearchParams()
    if (subSlug) sp.set("sub", subSlug)
    if (sort && sort !== "recent") sp.set("sort", sort)
    const qs = sp.toString()
    return `/categoria/${category.slug}${qs ? `?${qs}` : ""}`
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-2">{category.name}</h1>
      {category.description && <p className="text-gray-600 mb-6">{category.description}</p>}

      {/* Subcategory pills (navegacao por URL) */}
      {subcategories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <Link
            href={buildHref(null)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm border transition-colors",
              !sub ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
            )}
          >
            Todos
          </Link>
          {subcategories.map((s) => (
            <Link
              key={s.id}
              href={buildHref(s.slug)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm border transition-colors",
                sub === s.slug ? "bg-primary text-white border-primary" : "border-gray-300 text-gray-600 hover:border-primary"
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
