import Link from "next/link"
import Image from "next/image"
import { Sparkles, Hand, Truck, CreditCard, RotateCcw, Star, ArrowRight, ChevronDown } from "lucide-react"
import { getHomeData, getStoreSettings, getDiscoveryNav } from "@/lib/queries"
import ProductCard from "@/components/store/ProductCard"
import { Button } from "@/components/ui/button"

// Revalida a home a cada 10 min: novos produtos/destaques aparecem sem redeploy.
export const revalidate = 600

const testimonials = [
  { name: "Maria S.", text: "Peças maravilhosas! Cada guia tem uma energia especial. Recomendo demais!", rating: 5 },
  { name: "Carlos A.", text: "Atendimento impecável e entrega rápida. Minha guia ficou perfeita.", rating: 5 },
  { name: "Ana Paula R.", text: "Trabalho artesanal de muita qualidade. Fiquei encantada com o terço!", rating: 5 },
]

export default async function HomePage() {
  const [{ newProducts, featuredProducts, topCategories }, settings, discovery] = await Promise.all([
    getHomeData(),
    getStoreSettings(),
    getDiscoveryNav(),
  ])

  const whatsapp = settings?.whatsapp_number || settings?.whatsapp || "5535989899904"
  const whatsappUrl = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer um pedido sob medida.")}`
  const heroTitle = settings?.home_title || "Arte Fios de Luz"
  const heroImage = settings?.hero_image_url
  const heroCtaText = settings?.hero_cta_text || "Ver Coleção"
  // Corrige o CTA default que apontava para /produtos (rota inexistente)
  const heroCtaLink =
    settings?.hero_cta_link && settings.hero_cta_link !== "/produtos"
      ? settings.hero_cta_link
      : "/categoria/guias-de-orixas"
  const instagramUrl = settings?.instagram_url || "https://instagram.com/artefiosdeluz"
  const freeShippingAbove = settings?.free_shipping_above ?? 200

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brown to-brown-dark">
        {heroImage && (
          <Image src={heroImage} alt="Arte Fios de Luz" fill className="object-cover opacity-40" priority />
        )}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {heroTitle}
          </h1>
          <p className="text-lg md:text-xl text-cream mb-8">Arte, fé e proteção em cada criação</p>
          <Link href={heroCtaLink}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 text-base">
              {heroCtaText} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-cream py-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Hand, text: "Feito à Mão" },
            { icon: Truck, text: `Frete Grátis acima de R$ ${freeShippingAbove}` },
            { icon: CreditCard, text: "Pix e Cartão" },
            { icon: RotateCcw, text: "Troca até 30 dias" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 text-sm text-brown">
              <Icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Navegue por Orixá / Entidade (dropdowns) */}
      {discovery.some((d) => d.subs.length > 0) && (
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-brown mb-2 text-center">
              Encontre pelo seu Orixá ou Entidade
            </h2>
            <p className="text-gray-500 text-sm text-center mb-6">Clique para ver as opções</p>
            <div className="space-y-3">
              {discovery.map(({ category, subs }) =>
                subs.length > 0 ? (
                  <details
                    key={category.id}
                    className="group border border-primary/20 rounded-xl bg-white overflow-hidden"
                  >
                    <summary className="flex items-center justify-between cursor-pointer px-5 py-3.5 font-medium text-brown list-none [&::-webkit-details-marker]:hidden">
                      <span>{category.name}</span>
                      <ChevronDown className="w-4 h-4 text-primary transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="flex flex-wrap gap-2 px-5 pb-4 pt-1 border-t border-primary/10">
                      {subs.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/categoria/${category.slug}/${s.slug}`}
                          className="px-3.5 py-1.5 rounded-full text-sm border border-primary/30 text-brown hover:bg-primary hover:text-white hover:border-primary transition-colors"
                        >
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : null
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured categories */}
      {topCategories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-brown mb-10">
              Nossas Categorias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categoria/${cat.slug}`}
                  className="group relative h-64 rounded-xl overflow-hidden border border-primary/20"
                >
                  {cat.image_url ? (
                    <Image src={cat.image_url} alt={cat.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brown to-brown-dark" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary/30">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white">{cat.name}</h3>
                    <p className="text-sm text-gray-300 mt-1 group-hover:text-primary transition-colors">
                      Ver produtos →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Novidades */}
      {newProducts.length > 0 && (
        <section className="py-16 bg-cream">
          <div className="container mx-auto px-4">
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-brown mb-10">
              Novidades
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Destaques */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-brown mb-10">
              Destaques
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA banner */}
      <section className="py-16 bg-gradient-to-r from-brown to-brown-dark">
        <div className="container mx-auto px-4 text-center">
          <Sparkles className="w-8 h-8 text-primary mx-auto mb-4" />
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-4">Peça Sob Medida</h2>
          <p className="text-cream mb-8 max-w-xl mx-auto">
            Quer uma peça personalizada? Entre em contato pelo WhatsApp e crie algo único com a gente.
          </p>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white rounded-full px-8">
              Falar no WhatsApp
            </Button>
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-4">
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-brown mb-10">
            O Que Dizem Nossos Clientes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <p className="font-semibold text-sm text-brown">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-4">Siga-nos no Instagram</h2>
          <p className="text-gray-600 mb-6">@artefiosdeluz</p>
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8">
              Seguir no Instagram
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
