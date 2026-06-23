import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategories, getCategoryProducts } from "@/lib/queries"
import CategoryView from "@/components/store/CategoryView"

type Props = {
  params: Promise<{ slug: string; sub: string }>
  searchParams: Promise<{ sort?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, sub } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "Categoria não encontrada" }
  const subs = await getSubcategories(category.id)
  const activeSub = subs.find((s) => s.slug === sub)
  if (!activeSub) return { title: category.name }

  const baseDesc =
    activeSub.description ||
    `${activeSub.name}: ${category.name} artesanais e personalizadas da Arte Fios de Luz. Fé, proteção e significado em cada peça.`
  const desc = baseDesc.replace(/\s+/g, " ").trim().slice(0, 160)
  const title = `${activeSub.name} — ${category.name}`

  return {
    title,
    description: desc,
    alternates: { canonical: `/categoria/${category.slug}/${activeSub.slug}` },
    openGraph: { title, description: desc, url: `/categoria/${category.slug}/${activeSub.slug}`, type: "website" },
  }
}

export default async function SubcategoryPage({ params, searchParams }: Props) {
  const { slug, sub } = await params
  const { sort = "recent" } = await searchParams

  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = await getSubcategories(category.id)
  const activeSub = subcategories.find((s) => s.slug === sub)
  if (!activeSub) notFound()

  const products = await getCategoryProducts(category.id, sort, activeSub.id)

  return (
    <CategoryView
      category={category}
      subcategories={subcategories}
      activeSubSlug={activeSub.slug}
      heading={activeSub.name}
      description={activeSub.description || `${activeSub.name} — ${category.name}`}
      products={products}
    />
  )
}
