"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { StoreSettings, ShippingZone } from "@/lib/supabase"
import { Save, Plus, Trash2 } from "lucide-react"
import { formatPrice } from "@/lib/utils"

const TABS = [
  { key: "aparencia", label: "Aparência" },
  { key: "contato", label: "Contato" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "entrega", label: "Entrega" },
  { key: "pagamentos", label: "Pagamentos" },
  { key: "sobre", label: "Sobre Nós" },
] as const

const FONTS = [
  "Inter", "Poppins", "Roboto", "Open Sans", "Montserrat", "Lato", "Playfair Display", "Merriweather",
]

type TabKey = (typeof TABS)[number]["key"]

export default function ConfiguracoesPage() {
  const [tab, setTab] = useState<TabKey>("aparencia")
  const [settings, setSettings] = useState<Partial<StoreSettings>>({})
  const [zones, setZones] = useState<ShippingZone[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const load = useCallback(async () => {
    const [s, z] = await Promise.all([
      supabase.from("store_settings").select("*").single(),
      supabase.from("shipping_zones").select("*").order("name"),
    ])
    setSettings(s.data || {})
    setZones(z.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const update = (field: string, value: any) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setSaved(false)
  }

  const saveSettings = async () => {
    setSaving(true)
    const { id, ...rest } = settings as any
    if (id) {
      await supabase.from("store_settings").update(rest).eq("id", id)
    } else {
      await supabase.from("store_settings").insert(rest)
    }
    setSaving(false)
    setSaved(true)
  }

  // Shipping zones
  const [zoneForm, setZoneForm] = useState({ name: "", cep_start: "", cep_end: "", price: 0, estimate: "" })
  const [zoneDialog, setZoneDialog] = useState(false)

  const addZone = async () => {
    await supabase.from("shipping_zones").insert({ ...zoneForm, is_active: true })
    setZoneForm({ name: "", cep_start: "", cep_end: "", price: 0, estimate: "" })
    setZoneDialog(false)
    const { data } = await supabase.from("shipping_zones").select("*").order("name")
    setZones(data || [])
  }

  const deleteZone = async (id: string) => {
    await supabase.from("shipping_zones").delete().eq("id", id)
    setZones((prev) => prev.filter((z) => z.id !== id))
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Configurações</h2>
        <button onClick={saveSettings} disabled={saving} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50">
          <Save size={18} /> {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-background rounded-xl border p-6">
        {/* Aparência */}
        {tab === "aparencia" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <label className="text-sm font-medium">Nome da Loja</label>
              <input value={settings.store_name || ""} onChange={(e) => update("store_name", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Descrição</label>
              <textarea value={settings.store_description || ""} onChange={(e) => update("store_description", e.target.value)} rows={2} className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">URL do Logo</label>
              <input value={settings.logo_url || ""} onChange={(e) => update("logo_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Título do Hero</label>
                <input value={settings.home_title || ""} onChange={(e) => update("home_title", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Subtítulo do Hero</label>
                <input value={settings.home_subtitle || ""} onChange={(e) => update("home_subtitle", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Imagem do Hero (URL)</label>
                <input value={settings.hero_image_url || ""} onChange={(e) => update("hero_image_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Texto do CTA</label>
                <input value={settings.hero_cta_text || ""} onChange={(e) => update("hero_cta_text", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Link do CTA</label>
              <input value={settings.hero_cta_link || ""} onChange={(e) => update("hero_cta_link", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Fonte</label>
              <select value={settings.font_family || "Inter"} onChange={(e) => update("font_family", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="announcement" checked={settings.announcement_enabled || false} onChange={(e) => update("announcement_enabled", e.target.checked)} className="rounded" />
              <label htmlFor="announcement" className="text-sm font-medium">Barra de anúncio ativa</label>
            </div>
            {settings.announcement_enabled && (
              <div className="space-y-1">
                <label className="text-sm font-medium">Texto do Anúncio</label>
                <input value={settings.announcement_text || ""} onChange={(e) => update("announcement_text", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
            )}
          </div>
        )}

        {/* Contato */}
        {tab === "contato" && (
          <div className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">WhatsApp</label>
                <input value={settings.whatsapp || ""} onChange={(e) => update("whatsapp", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Telefone</label>
                <input value={settings.phone || ""} onChange={(e) => update("phone", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">E-mail</label>
              <input value={settings.email || ""} onChange={(e) => update("email", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Horário de Atendimento</label>
              <input value={settings.horario_atendimento || ""} onChange={(e) => update("horario_atendimento", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="Seg a Sex, 9h às 18h" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Instagram URL</label>
              <input value={settings.instagram_url || ""} onChange={(e) => update("instagram_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Facebook URL</label>
              <input value={settings.facebook_url || ""} onChange={(e) => update("facebook_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">TikTok URL</label>
              <input value={settings.tiktok_url || ""} onChange={(e) => update("tiktok_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
          </div>
        )}

        {/* WhatsApp */}
        {tab === "whatsapp" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="wp-enabled" checked={settings.whatsapp_button_enabled || false} onChange={(e) => update("whatsapp_button_enabled", e.target.checked)} className="rounded" />
              <label htmlFor="wp-enabled" className="text-sm font-medium">Botão flutuante ativo</label>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Número do WhatsApp</label>
              <input value={settings.whatsapp_number || ""} onChange={(e) => update("whatsapp_number", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="5511999999999" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Mensagem Padrão</label>
              <input value={settings.whatsapp_message || ""} onChange={(e) => update("whatsapp_message", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="Olá! Gostaria de saber mais..." />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Posição</label>
              <select value={settings.whatsapp_button_position || "bottom-right"} onChange={(e) => update("whatsapp_button_position", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                <option value="bottom-right">Inferior Direito</option>
                <option value="bottom-left">Inferior Esquerdo</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Exibir em</label>
              <select value={settings.whatsapp_show_on || "all"} onChange={(e) => update("whatsapp_show_on", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                <option value="all">Todas as páginas</option>
                <option value="home">Apenas na Home</option>
                <option value="products">Apenas em Produtos</option>
              </select>
            </div>
          </div>
        )}

        {/* Entrega */}
        {tab === "entrega" && (
          <div className="space-y-6 max-w-3xl">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="delivery" checked={settings.delivery_enabled || false} onChange={(e) => update("delivery_enabled", e.target.checked)} className="rounded" />
              <label htmlFor="delivery" className="text-sm font-medium">Entrega habilitada</label>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Frete grátis acima de (R$)</label>
              <input type="number" step="0.01" min="0" value={settings.free_shipping_above || 0} onChange={(e) => update("free_shipping_above", Number(e.target.value))} className="w-full max-w-xs px-3 py-2 border rounded-md bg-background text-sm" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">Zonas de Entrega</h4>
                <button onClick={() => setZoneDialog(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90">
                  <Plus size={16} /> Nova Zona
                </button>
              </div>
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="p-3">Nome</th>
                      <th className="p-3">CEP Início</th>
                      <th className="p-3">CEP Fim</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Prazo</th>
                      <th className="p-3">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {zones.map((z) => (
                      <tr key={z.id} className="border-b last:border-0">
                        <td className="p-3">{z.name}</td>
                        <td className="p-3">{z.cep_start}</td>
                        <td className="p-3">{z.cep_end}</td>
                        <td className="p-3">{formatPrice(z.price)}</td>
                        <td className="p-3">{z.estimate}</td>
                        <td className="p-3">
                          <button onClick={() => deleteZone(z.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                    {zones.length === 0 && (
                      <tr><td colSpan={6} className="p-4 text-center text-muted-foreground">Nenhuma zona cadastrada.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Zone Dialog */}
            {zoneDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setZoneDialog(false)}>
                <div className="bg-background rounded-xl border w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
                  <h3 className="text-lg font-semibold mb-4">Nova Zona de Entrega</h3>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium">Nome</label>
                      <input value={zoneForm.name} onChange={(e) => setZoneForm({ ...zoneForm, name: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="Capital SP" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">CEP Início</label>
                        <input value={zoneForm.cep_start} onChange={(e) => setZoneForm({ ...zoneForm, cep_start: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="01000000" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">CEP Fim</label>
                        <input value={zoneForm.cep_end} onChange={(e) => setZoneForm({ ...zoneForm, cep_end: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="09999999" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Preço (R$)</label>
                        <input type="number" step="0.01" min="0" value={zoneForm.price} onChange={(e) => setZoneForm({ ...zoneForm, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium">Prazo Estimado</label>
                        <input value={zoneForm.estimate} onChange={(e) => setZoneForm({ ...zoneForm, estimate: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" placeholder="3-5 dias úteis" />
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button onClick={() => setZoneDialog(false)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
                    <button onClick={addZone} disabled={!zoneForm.name} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">Adicionar</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Pagamentos */}
        {tab === "pagamentos" && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="pix" checked={settings.pix_enabled || false} onChange={(e) => update("pix_enabled", e.target.checked)} className="rounded" />
              <label htmlFor="pix" className="text-sm font-medium">PIX habilitado</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="boleto" checked={settings.boleto_enabled || false} onChange={(e) => update("boleto_enabled", e.target.checked)} className="rounded" />
              <label htmlFor="boleto" className="text-sm font-medium">Boleto habilitado</label>
            </div>
          </div>
        )}

        {/* Sobre Nós */}
        {tab === "sobre" && (
          <div className="space-y-4 max-w-2xl">
            <div className="space-y-1">
              <label className="text-sm font-medium">URL da Imagem</label>
              <input value={settings.about_image_url || ""} onChange={(e) => update("about_image_url", e.target.value)} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Texto Sobre Nós</label>
              <textarea value={settings.about_text || ""} onChange={(e) => update("about_text", e.target.value)} rows={8} className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
