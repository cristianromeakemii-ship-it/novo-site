"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { formatPrice, cn } from "@/lib/utils"
import type { Product, Category, Subcategory, StockItem } from "@/lib/supabase"
import { Plus, Pencil, Trash2, Search, X } from "lucide-react"
import MediaUploader from "@/components/admin/MediaUploader"

type MediaItem = {
  id?: string
  url: string
  sort_order: number
  media_type: "image" | "video"
}

type ProductWithRelations = Product & {
  categories: Category | null
  stock_items: StockItem[]
}

const STATUS_OPTIONS = ["ATIVO", "INATIVO", "RASCUNHO", "INDISPONIVEL"] as const
const TYPE_OPTIONS = ["FISICO", "DIGITAL"] as const
const GUIDE_SIZES = ["60", "65", "70"]

const statusBadge: Record<string, string> = {
  ATIVO: "bg-green-100 text-green-800",
  INATIVO: "bg-gray-100 text-gray-800",
  RASCUNHO: "bg-yellow-100 text-yellow-800",
  INDISPONIVEL: "bg-red-100 text-red-800",
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

const emptyForm = {
  name: "",
  slug: "",
  description: "",
  type: "FISICO" as Product["type"],
  status: "ATIVO" as Product["status"],
  price: 0,
  cost_price: 0,
  category_id: "",
  subcategory_id: "",
  is_featured: false,
  guide_size: "",
  image_url: "",
  stock_quantity: 0,
  stock_min_quantity: 1,
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<ProductWithRelations[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])

  const load = useCallback(async () => {
    const [p, c, sc] = await Promise.all([
      supabase.from("products").select("*, categories(*), stock_items(*), product_images(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name"),
      supabase.from("subcategories").select("*").order("name"),
    ])
    setProducts((p.data || []) as ProductWithRelations[])
    setCategories(c.data || [])
    setSubcategories(sc.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase())
  )

  const filteredSubcats = subcategories.filter((sc) => sc.category_id === form.category_id)

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setMediaItems([])
    setDialogOpen(true)
  }

  const openEdit = async (p: ProductWithRelations) => {
    setEditingId(p.id)
    const stock = p.stock_items?.[0]
    setForm({
      name: p.name,
      slug: p.slug,
      description: p.description || "",
      type: p.type,
      status: p.status,
      price: p.price,
      cost_price: p.cost_price,
      category_id: p.category_id || "",
      subcategory_id: p.subcategory_id || "",
      is_featured: p.is_featured,
      guide_size: p.guide_size || "",
      image_url: "",
      stock_quantity: stock?.quantity || 0,
      stock_min_quantity: stock?.min_quantity || 1,
    })
    const { data: imgs } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", p.id)
      .order("sort_order")
    setMediaItems(
      (imgs || []).map((img: any) => ({
        id: img.id,
        url: img.url,
        sort_order: img.sort_order,
        media_type: (img.media_type || "image") as "image" | "video",
      }))
    )
    setDialogOpen(true)
  }

  const handleSave = async () => {
    setSaving(true)
    const productData = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      type: form.type,
      status: form.status,
      price: form.price,
      cost_price: form.cost_price,
      category_id: form.category_id || null,
      subcategory_id: form.subcategory_id || null,
      is_featured: form.is_featured,
      guide_size: form.guide_size || null,
    }

    let productId = editingId

    if (editingId) {
      await supabase.from("products").update(productData).eq("id", editingId)
    } else {
      const { data } = await supabase.from("products").insert(productData).select("id").single()
      productId = data?.id || null
    }

    if (productId) {
      await supabase.from("stock_items").upsert(
        { product_id: productId, quantity: form.stock_quantity, min_quantity: form.stock_min_quantity },
        { onConflict: "product_id" }
      )

      await supabase.from("product_images").delete().eq("product_id", productId)
      if (mediaItems.length > 0) {
        await supabase.from("product_images").insert(
          mediaItems.map((m, i) => ({
            product_id: productId,
            url: m.url,
            sort_order: i,
            media_type: m.media_type,
          }))
        )
      }
    }

    setDialogOpen(false)
    setSaving(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await supabase.from("stock_items").delete().eq("product_id", deleteId)
    await supabase.from("product_images").delete().eq("product_id", deleteId)
    await supabase.from("products").delete().eq("id", deleteId)
    setDeleteId(null)
    load()
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Produtos</h2>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          <Plus size={18} /> Novo Produto
        </button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar produto..."
          className="w-full pl-9 pr-3 py-2 border rounded-md bg-background text-sm"
        />
      </div>

      <div className="bg-background rounded-xl border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Imagem</th>
              <th className="p-3">Nome</th>
              <th className="p-3">Categoria</th>
              <th className="p-3">Preço</th>
              <th className="p-3">Status</th>
              <th className="p-3">Estoque</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-muted/50">
                <td className="p-3">
                  {p.product_images?.[0]?.url ? (
                    <img src={p.product_images[0].url} alt="" className="w-10 h-10 rounded object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded bg-muted" />
                  )}
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-muted-foreground">{p.categories?.name || "-"}</td>
                <td className="p-3">{formatPrice(p.price)}</td>
                <td className="p-3">
                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", statusBadge[p.status])}>
                    {p.status}
                  </span>
                </td>
                <td className="p-3">{p.stock_items?.[0]?.quantity ?? 0}</td>
                <td className="p-3">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded hover:bg-muted"><Pencil size={16} /></button>
                    <button onClick={() => setDeleteId(p.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">Nenhum produto encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Product Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDialogOpen(false)}>
          <div className="bg-background rounded-xl border w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{editingId ? "Editar Produto" : "Novo Produto"}</h3>
              <button onClick={() => setDialogOpen(false)} className="p-1 rounded hover:bg-muted"><X size={20} /></button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Nome</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value, slug: slugify(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Slug</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as Product["type"] })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  {TYPE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Product["status"] })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Guia de Tamanho</label>
                <select value={form.guide_size} onChange={(e) => setForm({ ...form, guide_size: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="">Nenhum</option>
                  {GUIDE_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Preço</label>
                <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Preço de Custo</label>
                <input type="number" step="0.01" min="0" value={form.cost_price} onChange={(e) => setForm({ ...form, cost_price: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Estoque</label>
                <input type="number" min="0" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Estoque Mínimo</label>
                <input type="number" min="0" value={form.stock_min_quantity} onChange={(e) => setForm({ ...form, stock_min_quantity: Number(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Categoria</label>
                <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value, subcategory_id: "" })} className="w-full px-3 py-2 border rounded-md bg-background text-sm">
                  <option value="">Selecione</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Subcategoria</label>
                <select value={form.subcategory_id} onChange={(e) => setForm({ ...form, subcategory_id: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" disabled={!form.category_id}>
                  <option value="">Selecione</option>
                  {filteredSubcats.map((sc) => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <MediaUploader
                  productId={editingId || undefined}
                  media={mediaItems}
                  onChange={setMediaItems}
                />
              </div>
              <div className="col-span-2 flex items-center gap-2">
                <input type="checkbox" id="featured" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="rounded" />
                <label htmlFor="featured" className="text-sm font-medium">Produto Destaque</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setDialogOpen(false)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
              <button onClick={handleSave} disabled={saving || !form.name} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteId(null)}>
          <div className="bg-background rounded-xl border p-6 max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Excluir Produto</h3>
            <p className="text-sm text-muted-foreground mb-4">Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
