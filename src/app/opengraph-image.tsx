import { ImageResponse } from "next/og"

export const alt = "Arte Fios de Luz — Artigos Religiosos Artesanais"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

// OG image padrao (fallback) para todas as paginas sem imagem propria.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #241B10 0%, #3A2E1A 100%)",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", width: 64, height: 4, background: "#D4A843", marginBottom: 24 }} />
        <div style={{ display: "flex", color: "#ffffff", fontSize: 84, fontWeight: 700 }}>
          Arte Fios de Luz
        </div>
        <div style={{ display: "flex", color: "#F4EEE0", fontSize: 34, marginTop: 18 }}>
          Arte, fé e proteção em cada criação
        </div>
      </div>
    ),
    { ...size }
  )
}
