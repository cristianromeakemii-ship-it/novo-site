"use client"

import type { ReactNode } from "react"
import StoreHeader from "./StoreHeader"
import StoreFooter from "./StoreFooter"
import WhatsAppButton from "./WhatsAppButton"

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <StoreHeader />
      <main className="flex-1">{children}</main>
      <StoreFooter />
      <WhatsAppButton />
    </>
  )
}
