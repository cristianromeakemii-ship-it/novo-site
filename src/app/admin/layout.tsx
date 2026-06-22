"use client"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (!loading && !isLoginPage && (!user || !isAdmin)) {
      router.push("/admin/login")
    }
  }, [user, isAdmin, loading, router, isLoginPage])

  if (isLoginPage) {
    return (
      <>
        <head>
          <meta name="robots" content="noindex,nofollow" />
        </head>
        {children}
      </>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    )
  }

  if (!user || !isAdmin) return null

  return (
    <>
      <head>
        <meta name="robots" content="noindex,nofollow" />
      </head>
      <div className="flex min-h-screen bg-muted/30">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 bg-background border-b px-6 py-4">
            <h1 className="text-xl font-semibold">Painel Administrativo</h1>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </>
  )
}
