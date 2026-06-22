"use client"

import Link from "next/link"
import { AtSign, Globe, MessageCircle } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"
import { useEffect, useState } from "react"
import { supabase, type Category } from "@/lib/supabase"
import BrandMark from "@/components/BrandMark"

export default function StoreFooter() {
  const { settings } = useSettings()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("name")
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  const whatsappLink = `https://wa.me/${settings.whatsapp_number || settings.whatsapp}`

  return (
    <footer className="bg-brown-dark text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Logo & description */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BrandMark className="w-6 h-6" />
              <span className="font-[var(--font-playfair)] text-lg font-bold text-white">Arte Fios de Luz</span>
            </div>
            <p className="text-sm leading-relaxed mb-4">{settings.store_description}</p>
            <div className="flex gap-3">
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><AtSign className="w-5 h-5" /></a>
              )}
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><Globe className="w-5 h-5" /></a>
              )}
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Categorias</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/categoria/${cat.slug}`} className="text-sm hover:text-primary transition-colors">{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Institucional */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Institucional</h3>
            <ul className="space-y-2">
              <li><Link href="/sobre" className="text-sm hover:text-primary transition-colors">Quem Somos</Link></li>
              <li><Link href="/contato" className="text-sm hover:text-primary transition-colors">Contato</Link></li>
              <li><Link href="/contato" className="text-sm hover:text-primary transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/contato" className="text-sm hover:text-primary transition-colors">Prazo de Entrega</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wide">Contato</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                  WhatsApp: +55 35 98989-9904
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-primary">{settings.email}</a>
              </li>
              <li>{settings.horario_atendimento}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <p>&copy; {new Date().getFullYear()} Arte Fios de Luz. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <span>PIX</span>
            <span>Boleto</span>
            <span className="flex items-center gap-1">🔒 Compra Segura</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
