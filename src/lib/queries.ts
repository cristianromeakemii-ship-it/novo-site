import { cache } from "react"
import { supabaseServer } from "@/lib/supabase-server"
import type { Product, Category, Subcategory, StoreSettings } from "@/lib/supabase"

const PRODUCT_SELECT = "*, product_images(*), categories(*), subcategories(*), stock_items(*)"

// cache() memoiza a busca dentro do mesmo request, evitando que generateMetadata
// e a propria pagina consultem o Supabase duas vezes pelo mesmo recurso.
export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const { data } = await supabaseServer
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("status", "ATIVO")
    .single()
  if (data?.product_images) {
    data.product_images.sort(
      (a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order
    )
  }
  return (data as Product) ?? null
})

export const getRelatedProducts = cache(
  async (categoryId: string, excludeId: string): Promise<Product[]> => {
    const { data } = await supabaseServer
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("category_id", categoryId)
      .eq("status", "ATIVO")
      .neq("id", excludeId)
      .limit(4)
    return (data as Product[]) ?? []
  }
)

export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const { data } = await supabaseServer.from("categories").select("*").eq("slug", slug).single()
  return (data as Category) ?? null
})

export const getSubcategories = cache(async (categoryId: string): Promise<Subcategory[]> => {
  const { data } = await supabaseServer
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("name")
  return (data as Subcategory[]) ?? []
})

export const getCategoryProducts = cache(
  async (categoryId: string, sort: string, subId: string | null): Promise<Product[]> => {
    let query = supabaseServer
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("category_id", categoryId)
      .eq("status", "ATIVO")
    if (subId) query = query.eq("subcategory_id", subId)
    if (sort === "price_asc") query = query.order("price", { ascending: true })
    else if (sort === "price_desc") query = query.order("price", { ascending: false })
    else query = query.order("created_at", { ascending: false })
    const { data } = await query
    return (data as Product[]) ?? []
  }
)

export const getStoreSettings = cache(async (): Promise<StoreSettings | null> => {
  const { data } = await supabaseServer.from("store_settings").select("*").limit(1).single()
  return (data as StoreSettings) ?? null
})

export const getHomeData = cache(async () => {
  const [newP, featured, cats] = await Promise.all([
    supabaseServer
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "ATIVO")
      .order("created_at", { ascending: false })
      .limit(8),
    supabaseServer
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("status", "ATIVO")
      .eq("is_featured", true)
      .limit(8),
    supabaseServer.from("categories").select("*").eq("is_active", true).order("name").limit(3),
  ])
  return {
    newProducts: (newP.data as Product[]) ?? [],
    featuredProducts: (featured.data as Product[]) ?? [],
    topCategories: (cats.data as Category[]) ?? [],
  }
})

// Atalhos por Orixa/Entidade para a home (descoberta + links internos de SEO).
export const getDiscoveryNav = cache(
  async (): Promise<
    { category: { id: string; name: string; slug: string }; subs: { name: string; slug: string }[] }[]
  > => {
    const { data: cats } = await supabaseServer
      .from("categories")
      .select("id, name, slug")
      .in("slug", ["guias-de-orixas", "guias-de-entidades"])
      .eq("is_active", true)
    if (!cats || cats.length === 0) return []
    const catIds = (cats as { id: string }[]).map((c) => c.id)
    const { data: subs } = await supabaseServer
      .from("subcategories")
      .select("category_id, name, slug")
      .in("category_id", catIds)
      .eq("is_active", true)
      .order("name")
    return (cats as { id: string; name: string; slug: string }[]).map((c) => ({
      category: c,
      subs: ((subs as { category_id: string; name: string; slug: string }[]) || []).filter(
        (s) => s.category_id === c.id
      ),
    }))
  }
)

export type Review = {
  id: string
  product_id: string
  customer_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export const getProductReviews = cache(async (productId: string): Promise<Review[]> => {
  // Se a tabela reviews ainda nao existir, retorna [] (graceful).
  const { data } = await supabaseServer
    .from("reviews")
    .select("*")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
  return (data as Review[]) ?? []
})
