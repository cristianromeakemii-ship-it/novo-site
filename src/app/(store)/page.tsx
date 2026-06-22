"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Sparkles, Hand, Truck, CreditCard, RotateCcw, Star, ArrowRight } from "lucide-react"
import { supabase, type Product, type Category } from "@/lib/supabase"
import { useSettings } from "@/contexts/SettingsContext"
import ProductCard from "@/components/store/ProductCard"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const { settings } = useSettings()
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [topCategories, setTopCategories] = useState<Category[]>([])

  useEffect(() => {
    supabase
      .from("products")
      .select("*, product_images(*), categories(*), subcategories(*), stock_items(*)")
      .eq("status", "ATIVO")
      .order("created_at", { ascending: false })
      .limit(8)
      .then(({ data }) => { if (data) setNewProducts(data) })

    supabase
      .from("products")
      .select("*, product_images(*), categories(*), subcategories(*), stock_items(*)")
      .eq("status", "ATIVO")
      .eq("is_featured", true)
      .limit(8)
      .then(({ data }) => { if (data) setFeaturedProducts(data) })

    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .limit(3)
      .then(({ data }) => { if (data) setTopCategories(data) })
  }, [])

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number || settings.whatsapp}?text=${encodeURIComponent("Olá! Gostaria de fazer um pedido sob medida.")}`

  const testimonials = [
    { name: "Maria S.", text: "Peças maravilhosas! Cada guia tem uma energia especial. Recomendo demais!", rating: 5 },
    { name: "Carlos A.", text: "Atendimento impecável e entrega rápida. Minha guia ficou perfeita.", rating: 5 },
    { name: "Ana Paula R.", text: "Trabalho artesanal de muita qualidade. Fiquei encantada com o terço!", rating: 5 },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-brown to-brown-dark">
        {settings.hero_image_url && (
          <Image
            src={settings.hero_image_url}
            alt="Arte Fios de Luz"
            fill
            className="object-cover opacity-40"
            priority
          />
        )}
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="font-[var(--font-playfair)] text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {settings.home_title || "Arte Fios de Luz"}
          </h1>
          <p className="text-lg md:text-xl text-[#F4EEE0] mb-8">
            Arte, fé e proteção em cada criação
          </p>
          <Link href={settings.hero_cta_link || "/categoria/guias-de-orixas"}>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-3 text-base">
              {settings.hero_cta_text || "Ver Coleção"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-[#F4EEE0] py-6">
        <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Hand, text: "Feito à Mão" },
            { icon: Truck, text: "Frete Grátis acima de R$ 199" },
            { icon: CreditCard, text: "Pix e Cartão" },
            { icon: RotateCcw, text: "Troca até 30 dias" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center justify-center gap-2 text-sm text-[#3A2E1A]">
              <Icon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="font-medium">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      {topCategories.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-[#3A2E1A] mb-10">
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
                    <Image src={cat.image_url} alt={cat.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-brown to-brown-dark" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-primary/30">
                    <h3 className="font-[var(--font-playfair)] text-xl font-bold text-white">
                      {cat.name}
                    </h3>
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
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-[#3A2E1A] mb-10">
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
            <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-[#3A2E1A] mb-10">
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
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-white mb-4">
            Peça Sob Medida
          </h2>
          <p className="text-[#F4EEE0] mb-8 max-w-xl mx-auto">
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
      <section className="py-16 bg-[#F4EEE0]">
        <div className="container mx-auto px-4">
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-center text-[#3A2E1A] mb-10">
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
                <p className="font-semibold text-sm text-[#3A2E1A]">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-[var(--font-playfair)] text-3xl font-bold text-[#3A2E1A] mb-4">
            Siga-nos no Instagram
          </h2>
          <p className="text-gray-600 mb-6">@artefiosdeluz</p>
          <a
            href={settings.instagram_url || "https://instagram.com/artefiosdeluz"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8">
              Seguir no Instagram
            </Button>
          </a>
        </div>
      </section>
    </div>
  )
}
