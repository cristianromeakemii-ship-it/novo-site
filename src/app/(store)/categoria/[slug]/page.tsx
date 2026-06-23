import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getCategoryBySlug, getSubcategories, getCategoryProducts } from "@/lib/queries"
import CategoryView from "@/components/store/CategoryView"

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
    openGraph: { title: category.name, description: desc, url: `/categoria/${category.slug}`, type: "website" },
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { sub, sort = "recent" } = await searchParams

  // URL antiga ?sub= -> redireciona para a URL limpa /categoria/[slug]/[sub]
  if (sub) {
    redirect(`/categoria/${slug}/${sub}${sort && sort !== "recent" ? `?sort=${sort}` : ""}`)
  }

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = await getSubcategories(category.id)
  const products = await getCategoryProducts(category.id, sort, null)

  return (
    <CategoryView
      category={category}
      subcategories={subcategories}
      activeSubSlug={null}
      heading={category.name}
      description={category.description || null}
      products={products}
    />
  )
}
