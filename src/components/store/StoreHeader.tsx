"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, ShoppingBag, Menu, X, Phone, ChevronDown } from "lucide-react"
import BrandMark from "@/components/BrandMark"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { useSettings } from "@/contexts/SettingsContext"
import type { Category, Subcategory } from "@/lib/supabase"
import { cn } from "@/lib/utils"

export default function StoreHeader({
  categories,
}: {
  categories: (Category & { subcategories?: Subcategory[] })[]
}) {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const { settings } = useSettings()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
  const [hoveredCat, setHoveredCat] = useState<string | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const term = searchQuery.trim()
    if (!term) return
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
    setSearchOpen(false)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {settings.announcement_enabled && settings.announcement_text && (
        <div className="bg-primary text-white text-center text-xs py-1.5 px-4">
          {settings.announcement_text}
        </div>
      )}

      <div className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Mobile menu toggle */}
          <button className="lg:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <BrandMark className="w-7 h-7" />
            <span className="font-[var(--font-playfair)] text-xl font-bold text-brown">
              Arte Fios de Luz
            </span>
          </Link>

          {/* Desktop search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="submit" aria-label="Buscar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Action icons */}
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-5 h-5" />
            </button>
            <Link href="/contato" className="hidden sm:flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
              <Phone className="w-4 h-4" />
              <span className="hidden md:inline">Atendimento</span>
            </Link>
            <Link href={user ? "/minha-conta/pedidos" : "/entrar"} className="flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
              <User className="w-5 h-5" />
              <span className="hidden md:inline">Minha conta</span>
            </Link>
            <Link href="/carrinho" className="relative flex items-center gap-1 text-sm text-gray-600 hover:text-primary">
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden md:inline">Meu carrinho</span>
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="lg:hidden px-4 pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button type="submit" aria-label="Buscar" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary">
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Desktop nav */}
      <nav className="hidden lg:block border-b bg-white">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-6 h-11 text-sm">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="relative"
                onMouseEnter={() => setHoveredCat(cat.id)}
                onMouseLeave={() => setHoveredCat(null)}
              >
                <Link
                  href={`/categoria/${cat.slug}`}
                  className="uppercase tracking-wide text-gray-700 hover:text-primary border-b-2 border-transparent hover:border-primary pb-3 pt-3 inline-block transition-colors"
                >
                  {cat.name}
                </Link>
                {hoveredCat === cat.id && cat.subcategories && cat.subcategories.length > 0 && (
                  <div className="absolute top-full left-0 bg-white shadow-lg rounded-b-md py-2 min-w-[180px] z-50">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categoria/${cat.slug}?sub=${sub.slug}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 top-[64px] bg-white z-40 overflow-y-auto">
          <nav className="p-4">
            {categories.map((cat) => (
              <div key={cat.id} className="border-b">
                <div className="flex items-center justify-between">
                  <Link
                    href={`/categoria/${cat.slug}`}
                    className="py-3 text-sm font-medium uppercase text-gray-800"
                    onClick={() => setMobileOpen(false)}
                  >
                    {cat.name}
                  </Link>
                  {cat.subcategories && cat.subcategories.length > 0 && (
                    <button onClick={() => setExpandedCat(expandedCat === cat.id ? null : cat.id)}>
                      <ChevronDown className={cn("w-4 h-4 transition-transform", expandedCat === cat.id && "rotate-180")} />
                    </button>
                  )}
                </div>
                {expandedCat === cat.id && cat.subcategories && (
                  <div className="pl-4 pb-2 space-y-1">
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/categoria/${cat.slug}?sub=${sub.slug}`}
                        className="block py-1.5 text-sm text-gray-600"
                        onClick={() => setMobileOpen(false)}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-4 space-y-3">
              <Link href="/contato" className="flex items-center gap-2 text-sm text-gray-700" onClick={() => setMobileOpen(false)}>
                <Phone className="w-4 h-4" /> Atendimento
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
