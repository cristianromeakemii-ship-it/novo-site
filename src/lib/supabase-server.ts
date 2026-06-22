import { createClient } from "@supabase/supabase-js"

// Cliente Supabase para LEITURAS PUBLICAS no servidor (sitemap, Server Components).
// Usa a anon key e nao lida com sessao/cookies — para auth no servidor use @supabase/ssr.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder"

export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey)
