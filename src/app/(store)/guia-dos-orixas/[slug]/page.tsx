import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getOrixa, orixas } from "@/lib/orixas"
import { Button } from "@/components/ui/button"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artefiosdeluz.com.br"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return orixas.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const o = getOrixa(slug)
  if (!o) return { title: "Orixá não encontrado" }
  const desc = `${o.nome}: ${o.resumo} Saudação ${o.saudacao}, cores ${o.cores}, dia ${o.dia}.`
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160)
  return {
    title: `${o.nome}: significado, cores e guia`,
    description: desc,
    alternates: { canonical: `/guia-dos-orixas/${o.slug}` },
    openGraph: {
      title: `${o.nome} — Guia dos Orixás`,
      description: desc,
      url: `/guia-dos-orixas/${o.slug}`,
      type: "article",
    },
  }
}

export default async function OrixaArticlePage({ params }: Props) {
  const { slug } = await params
  const o = getOrixa(slug)
  if (!o) notFound()

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${o.nome}: significado, cores e guia`,
    about: o.nome,
    publisher: {
      "@type": "Organization",
      name: "Arte Fios de Luz",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    mainEntityOfPage: `${SITE_URL}/guia-dos-orixas/${o.slug}`,
  }
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: o.faq.map((f) => ({
      "@type": "Question",
      name: f.pergunta,
      acceptedAnswer: { "@type": "Answer", text: f.resposta },
    })),
  }

  return (
    <article className="container mx-auto px-4 py-12 max-w-3xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/guia-dos-orixas" className="hover:text-primary">Guia dos Orixás</Link>
        <span className="mx-1">›</span>
        <span className="text-gray-800">{o.nome}</span>
      </nav>

      <h1 className="font-[var(--font-playfair)] text-4xl font-bold text-brown mb-2">{o.nome}</h1>
      <p className="text-primary text-lg mb-6">{o.saudacao}</p>

      <div className="grid grid-cols-3 gap-3 mb-8 text-sm">
        <div className="bg-cream rounded-lg p-3">
          <p className="text-gray-500">Cores</p>
          <p className="font-medium text-brown">{o.cores}</p>
        </div>
        <div className="bg-cream rounded-lg p-3">
          <p className="text-gray-500">Dia</p>
          <p className="font-medium text-brown">{o.dia}</p>
        </div>
        <div className="bg-cream rounded-lg p-3">
          <p className="text-gray-500">Domínio</p>
          <p className="font-medium text-brown">{o.dominio}</p>
        </div>
      </div>

      <div className="text-gray-700 leading-relaxed space-y-4 mb-10">
        {o.paragrafos.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="bg-cream rounded-xl p-6 text-center mb-12">
        <h2 className="font-[var(--font-playfair)] text-xl font-bold text-brown mb-2">Guias de {o.nome}</h2>
        <p className="text-gray-600 text-sm mb-4">
          Veja nossas guias artesanais de {o.nome}, feitas à mão e personalizáveis.
        </p>
        <Link href={`/categoria/guias-de-orixas/${o.categoriaSub}`}>
          <Button className="bg-primary hover:bg-primary/90 text-white">Ver guias de {o.nome}</Button>
        </Link>
      </div>

      <section>
        <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-brown mb-4">Perguntas frequentes</h2>
        <div className="space-y-4">
          {o.faq.map((f, i) => (
            <div key={i} className="border-b pb-4">
              <h3 className="font-semibold text-brown mb-1">{f.pergunta}</h3>
              <p className="text-sm text-gray-600">{f.resposta}</p>
            </div>
          ))}
        </div>
      </section>
    </article>
  )
}
