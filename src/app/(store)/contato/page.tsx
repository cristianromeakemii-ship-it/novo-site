"use client"

import { useState } from "react"
import { MessageCircle, Phone, Mail, Clock, AtSign, Globe } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
  const { settings } = useSettings()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!name || !email || !message) {
      setError("Preencha todos os campos obrigatórios.")
      return
    }
    const { error: insertError } = await supabase
      .from("contacts")
      .insert({ name, email, phone, message })
    if (insertError) {
      setError("Erro ao enviar mensagem. Tente novamente.")
      return
    }
    setSent(true)
  }

  const whatsappUrl = `https://wa.me/${settings.whatsapp_number || settings.whatsapp}`

  const cards = [
    { icon: MessageCircle, label: "WhatsApp", value: "+55 35 98989-9904", href: whatsappUrl, color: "text-green-500" },
    { icon: Phone, label: "Telefone", value: "+55 35 98989-9904", href: `tel:${settings.phone}`, color: "text-blue-500" },
    { icon: Mail, label: "E-mail", value: settings.email, href: `mailto:${settings.email}`, color: "text-red-500" },
    { icon: Clock, label: "Horário", value: settings.horario_atendimento, href: null, color: "text-primary" },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-[#3A2E1A] mb-8 text-center">
        Contato
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {cards.map(({ icon: Icon, label, value, href, color }) => (
          <div key={label} className="border rounded-lg p-6 text-center">
            <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} />
            <h3 className="font-semibold text-sm mb-1">{label}</h3>
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary">
                {value}
              </a>
            ) : (
              <p className="text-sm text-gray-600">{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* Social */}
      <div className="flex justify-center gap-4 mb-12">
        {settings.instagram_url && (
          <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
            <AtSign className="w-5 h-5" /> Instagram
          </a>
        )}
        {settings.facebook_url && (
          <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary">
            <Globe className="w-5 h-5" /> Facebook
          </a>
        )}
      </div>

      {/* Contact form */}
      <div className="max-w-lg mx-auto">
        <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-[#3A2E1A] mb-6 text-center">
          Envie uma Mensagem
        </h2>
        {sent ? (
          <div className="text-center py-8">
            <p className="text-green-600 font-medium text-lg mb-2">Mensagem enviada com sucesso!</p>
            <p className="text-gray-500 text-sm">Responderemos em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Nome *</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">E-mail *</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Telefone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="text-sm text-gray-600 mb-1 block">Mensagem *</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">Enviar</Button>
          </form>
        )}
      </div>
    </div>
  )
}
