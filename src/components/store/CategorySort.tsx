"use client"

import { useRouter, usePathname, useSearchParams } from "next/navigation"

// Ordenacao da categoria via URL (?sort=) — mantem a pagina como Server Component
// e preserva o estado ao usar o botao Voltar.
export default function CategorySort() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get("sort") || "recent"

  const onChange = (value: string) => {
    const sp = new URLSearchParams(searchParams.toString())
    if (value === "recent") sp.delete("sort")
    else sp.set("sort", value)
    const qs = sp.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ""}`)
  }

  return (
    <select
      value={current}
      onChange={(e) => onChange(e.target.value)}
      className="text-sm border rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/30"
    >
      <option value="recent">Mais Recentes</option>
      <option value="price_asc">Menor Preço</option>
      <option value="price_desc">Maior Preço</option>
    </select>
  )
}
