import type { Metadata } from "next"
import Link from "next/link"
import { orixas } from "@/lib/orixas"

export const metadata: Metadata = {
  title: "Guia dos Orixás — Significado, Cores e Saudações",
  description:
    "Conheça os orixás: significado, cores, dias, saudações e as guias de cada um. Guia da Arte Fios de Luz sobre Umbanda e Candomblé.",
  alternates: { canonical: "/guia-dos-orixas" },
  openGraph: {
    title: "Guia dos Orixás — Arte Fios de Luz",
    description: "Significado, cores, dias e saudações dos orixás.",
    url: "/guia-dos-orixas",
    type: "website",
  },
}

export default function GuiaOrixasPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-2 text-center">Guia dos Orixás</h1>
      <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
        Significado, cores, dias e saudações dos orixás — e as guias artesanais de cada um.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {orixas.map((o) => (
          <Link
            key={o.slug}
            href={`/guia-dos-orixas/${o.slug}`}
            className="block border border-primary/20 rounded-xl p-6 bg-white hover:shadow-md hover:border-primary/40 transition"
          >
            <h2 className="font-[var(--font-playfair)] text-xl font-bold text-brown mb-1">{o.nome}</h2>
            <p className="text-sm text-primary mb-2">{o.saudacao}</p>
            <p className="text-sm text-gray-600 mb-3">{o.resumo}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
              <span>
                <strong>Cores:</strong> {o.cores}
              </span>
              <span>
                <strong>Dia:</strong> {o.dia}
              </span>
            </div>
            <span className="inline-block mt-4 text-sm text-primary font-medium">Ler mais →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
