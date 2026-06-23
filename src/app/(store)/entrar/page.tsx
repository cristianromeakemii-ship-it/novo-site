"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    const { error: err } = await signIn(email, password)
    if (err) {
      setError("E-mail ou senha incorretos.")
      setLoading(false)
      return
    }
    router.push("/minha-conta/pedidos")
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-sm">
      <div className="text-center mb-8">
        <Sparkles className="w-8 h-8 text-primary mx-auto mb-3" />
        <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-brown">Entrar</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="text-sm text-gray-600 mb-1 block">E-mail</label>
          <Input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="login-senha" className="text-sm text-gray-600 mb-1 block">Senha</label>
          <Input id="login-senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary/90 text-white">
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Não tem conta?{" "}
        <Link href="/criar-conta" className="text-primary hover:underline font-medium">Criar conta</Link>
      </p>
    </div>
  )
}
