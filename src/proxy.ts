import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Next 16: o antigo "middleware" foi renomeado para "proxy".
// Guarda server-side da area /admin: bloqueia o acesso ANTES de renderizar,
// em vez de depender apenas da verificacao client-side em admin/layout.tsx.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // A pagina de login precisa ficar acessivel para autenticar.
  if (pathname === "/admin/login") return response

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Sem env configurado nao ha sessao para validar; nao bloqueia o build/preview.
  if (!supabaseUrl || !supabaseAnonKey) return response

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        )
      },
    },
  })

  const loginUrl = new URL("/admin/login", request.url)

  // getUser() valida o JWT no servidor de auth (mais seguro que getSession()).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(loginUrl)

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .single()

  if (!roleRow || roleRow.role !== "admin") {
    return NextResponse.redirect(loginUrl)
  }

  return response
}

export const config = {
  // Protege /admin e tudo abaixo dele (a pagina de login e liberada na funcao).
  matcher: ["/admin", "/admin/:path*"],
}
