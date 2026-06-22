import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { getProductBySlug, getRelatedProducts } from "@/lib/queries"
import ProductDetails from "@/components/store/ProductDetails"
import ProductCard from "@/components/store/ProductCard"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artefiosdeluz.com.br"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Produto não encontrado" }

  const desc = (product.description || `${product.name} — peça artesanal da Arte Fios de Luz.`)
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)
  const image = product.product_images?.[0]?.url

  return {
    title: product.name,
    description: desc,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: desc,
      url: `/produto/${product.slug}`,
      type: "website",
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const related = product.category_id
    ? await getRelatedProducts(product.category_id, product.id)
    : []
  const stock = product.stock_items?.[0]?.quantity ?? 0
  const images = (product.product_images || []).map((img) => img.url)

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: images,
    description: product.description || undefined,
    sku: product.id,
    brand: { "@type": "Brand", name: "Arte Fios de Luz" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability: stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${SITE_URL}/produto/${product.slug}`,
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: SITE_URL },
      ...(product.categories
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: product.categories.name,
              item: `${SITE_URL}/categoria/${product.categories.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.categories ? 3 : 2,
        name: product.name,
        item: `${SITE_URL}/produto/${product.slug}`,
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-primary">Início</Link>
        <ChevronRight className="w-3 h-3" />
        {product.categories && (
          <>
            <Link href={`/categoria/${product.categories.slug}`} className="hover:text-primary">
              {product.categories.name}
            </Link>
            <ChevronRight className="w-3 h-3" />
          </>
        )}
        <span className="text-gray-800 truncate">{product.name}</span>
      </nav>

      <ProductDetails product={product} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-brown mb-6">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
