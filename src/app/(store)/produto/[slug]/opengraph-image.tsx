import { ImageResponse } from "next/og"
import { getProductBySlug } from "@/lib/queries"

export const alt = "Arte Fios de Luz"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// Imagem de preview (WhatsApp/Facebook) gerada por produto, com a marca.
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const name = (product?.name || "Arte Fios de Luz").slice(0, 80)
  const price = product
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(product.price)
    : ""

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #241B10 0%, #3A2E1A 100%)",
          padding: "70px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", color: "#D4A843", fontSize: 34, letterSpacing: 2 }}>
          ✦ ARTE FIOS DE LUZ
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 68, fontWeight: 700, lineHeight: 1.1 }}>
            {name}
          </div>
          {price ? (
            <div style={{ display: "flex", color: "#D4A843", fontSize: 48, fontWeight: 700, marginTop: 24 }}>
              {price}
            </div>
          ) : null}
        </div>
        <div style={{ display: "flex", color: "#F4EEE0", fontSize: 30 }}>
          Arte, fé e proteção em cada criação
        </div>
      </div>
    ),
    { ...size }
  )
}
