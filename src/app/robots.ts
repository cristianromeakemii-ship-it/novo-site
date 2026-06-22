import type { MetadataRoute } from "next"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artefiosdeluz.com.br"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/checkout",
        "/carrinho",
        "/minha-conta",
        "/entrar",
        "/criar-conta",
        "/pedido-confirmado",
        "/buscar",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
