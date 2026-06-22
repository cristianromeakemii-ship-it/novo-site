"use client"

import { MessageCircle } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"

export default function WhatsAppButton() {
  const { settings } = useSettings()

  if (!settings.whatsapp_button_enabled) return null

  const number = settings.whatsapp_number || settings.whatsapp
  const message = encodeURIComponent(settings.whatsapp_message || "Olá!")
  const url = `https://wa.me/${number}?text=${message}`

  const position = settings.whatsapp_button_position === "bottom-left" ? "left-4" : "right-4"

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-4 ${position} z-50 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-transform hover:scale-110`}
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}
