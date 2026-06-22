"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { supabase, type StoreSettings } from "@/lib/supabase"

const defaultSettings: StoreSettings = {
  id: "",
  store_name: "Arte Fios de Luz",
  store_description: "Peças artesanais carregadas de significado, fé, proteção e conexão espiritual.",
  logo_url: "",
  home_title: "Arte Fios de Luz",
  home_subtitle: "Peças artesanais carregadas de significado",
  hero_image_url: "",
  hero_cta_text: "Ver Produtos",
  hero_cta_link: "/produtos",
  image_fit: "cover",
  theme_primary: "#C87941",
  theme_secondary: "#8B6914",
  theme_background: "#FFFFFF",
  theme_text: "#333333",
  theme_accent: "#B8944A",
  font_family: "Playfair Display",
  base_font_size: "16px",
  border_radius: "8px",
  button_style: "rounded",
  card_shadow: "md",
  announcement_enabled: false,
  announcement_text: "",
  whatsapp: "5535989899904",
  phone: "5535989899904",
  email: "artefiodeluz@gmail.com",
  horario_atendimento: "Seg-Sex 9h às 18h",
  instagram_url: "",
  facebook_url: "",
  tiktok_url: "",
  whatsapp_button_enabled: true,
  whatsapp_number: "5535989899904",
  whatsapp_message: "Olá! Gostaria de saber mais sobre os produtos.",
  whatsapp_button_position: "bottom-right",
  whatsapp_show_on: "all",
  delivery_enabled: true,
  delivery_modalities: [],
  free_shipping_above: 200,
  delivery_provider: "correios",
  delivery_integration_active: false,
  pix_enabled: true,
  boleto_enabled: false,
  pix_expiration_minutes: 30,
  payment_provider: "mercadopago",
  payment_webhook_active: false,
  storage_bucket_name: "products",
  search_enabled: true,
  footer_links: null,
  about_text: "",
  about_image_url: "",
}

type SettingsContextType = {
  settings: StoreSettings
  loading: boolean
}

const SettingsContext = createContext<SettingsContextType>({ settings: defaultSettings, loading: true })

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from("store_settings")
      .select("*")
      .limit(1)
      .single()
      .then(({ data }) => {
        if (data) setSettings({ ...defaultSettings, ...data })
        setLoading(false)
      })
  }, [])

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
