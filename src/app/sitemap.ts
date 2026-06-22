import type { MetadataRoute } from "next"
import { supabaseServer } from "@/lib/supabase-server"
import { getDiscoveryNav } from "@/lib/queries"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artefiosdeluz.com.br"

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contato`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ]

  try {
    const [{ data: categories }, { data: products }] = await Promise.all([
      supabaseServer.from("categories").select("slug, updated_at").eq("is_active", true),
      supabaseServer.from("products").select("slug, updated_at").eq("status", "ATIVO"),
    ])

    const categoryEntries: MetadataRoute.Sitemap = (categories || []).map((c: { slug: string; updated_at?: string }) => ({
      url: `${SITE_URL}/categoria/${c.slug}`,
      lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }))

    const productEntries: MetadataRoute.Sitemap = (products || []).map((p: { slug: string; updated_at?: string }) => ({
      url: `${SITE_URL}/produto/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    }))

    // Atalhos por orixá/entidade (paginas filtradas indexaveis)
    const nav = await getDiscoveryNav()
    const subEntries: MetadataRoute.Sitemap = nav.flatMap(({ category, subs }) =>
      subs.map((s) => ({
        url: `${SITE_URL}/categoria/${category.slug}?sub=${s.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      }))
    )

    return [...staticEntries, ...categoryEntries, ...productEntries, ...subEntries]
  } catch {
    // Sem env do Supabase (ex.: build local) cai aqui e devolve so as paginas estaticas.
    return staticEntries
  }
}
