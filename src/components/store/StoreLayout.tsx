"use client"

import type { ReactNode } from "react"
import type { Category, Subcategory } from "@/lib/supabase"
import StoreHeader from "./StoreHeader"
import StoreFooter from "./StoreFooter"
import WhatsAppButton from "./WhatsAppButton"
import MiniCart from "./MiniCart"

type NavCategory = Category & { subcategories: Subcategory[] }

export default function StoreLayout({
  children,
  navCategories,
}: {
  children: ReactNode
  navCategories: NavCategory[]
}) {
  return (
    <>
      <StoreHeader categories={navCategories} />
      <main className="flex-1">{children}</main>
      <StoreFooter categories={navCategories} />
      <WhatsAppButton />
      <MiniCart />
    </>
  )
}
