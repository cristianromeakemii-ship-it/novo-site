"use client"

import { useEffect, useState, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import type { Category, Subcategory } from "@/lib/supabase"
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, X } from "lucide-react"
import { cn } from "@/lib/utils"

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

const emptyCategory = { name: "", slug: "", description: "", image_url: "", is_active: true }
const emptySubcategory = { name: "", slug: "", description: "", image_url: "", is_active: true, category_id: "" }

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  const [catDialog, setCatDialog] = useState(false)
  const [catEditId, setCatEditId] = useState<string | null>(null)
  const [catForm, setCatForm] = useState(emptyCategory)

  const [subDialog, setSubDialog] = useState(false)
  const [subEditId, setSubEditId] = useState<string | null>(null)
  const [subForm, setSubForm] = useState(emptySubcategory)

  const [deleteTarget, setDeleteTarget] = useState<{ type: "cat" | "sub"; id: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const [c, sc] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("subcategories").select("*").order("name"),
    ])
    setCategories(c.data || [])
    setSubcategories(sc.data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const openNewCat = () => { setCatEditId(null); setCatForm(emptyCategory); setCatDialog(true) }
  const openEditCat = (c: Category) => { setCatEditId(c.id); setCatForm({ name: c.name, slug: c.slug, description: c.description || "", image_url: c.image_url || "", is_active: c.is_active }); setCatDialog(true) }

  const saveCat = async () => {
    setSaving(true)
    const data = { ...catForm }
    if (catEditId) {
      await supabase.from("categories").update(data).eq("id", catEditId)
    } else {
      await supabase.from("categories").insert(data)
    }
    setCatDialog(false)
    setSaving(false)
    load()
  }

  const openNewSub = (categoryId: string) => { setSubEditId(null); setSubForm({ ...emptySubcategory, category_id: categoryId }); setSubDialog(true) }
  const openEditSub = (sc: Subcategory) => { setSubEditId(sc.id); setSubForm({ name: sc.name, slug: sc.slug, description: sc.description || "", image_url: sc.image_url || "", is_active: sc.is_active, category_id: sc.category_id }); setSubDialog(true) }

  const saveSub = async () => {
    setSaving(true)
    const data = { ...subForm }
    if (subEditId) {
      await supabase.from("subcategories").update(data).eq("id", subEditId)
    } else {
      await supabase.from("subcategories").insert(data)
    }
    setSubDialog(false)
    setSaving(false)
    load()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    if (deleteTarget.type === "cat") {
      await supabase.from("subcategories").delete().eq("category_id", deleteTarget.id)
      await supabase.from("categories").delete().eq("id", deleteTarget.id)
    } else {
      await supabase.from("subcategories").delete().eq("id", deleteTarget.id)
    }
    setDeleteTarget(null)
    load()
  }

  if (loading) return <p className="text-muted-foreground">Carregando...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Categorias</h2>
        <button onClick={openNewCat} className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90">
          <Plus size={18} /> Nova Categoria
        </button>
      </div>

      <div className="bg-background rounded-xl border divide-y">
        {categories.map((cat) => {
          const subs = subcategories.filter((sc) => sc.category_id === cat.id)
          const isExpanded = expanded[cat.id]
          return (
            <div key={cat.id}>
              <div className="flex items-center gap-3 p-4 hover:bg-muted/50">
                <button onClick={() => setExpanded({ ...expanded, [cat.id]: !isExpanded })} className="p-1">
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                <div className="flex-1">
                  <span className="font-medium">{cat.name}</span>
                  <span className={cn("ml-2 px-2 py-0.5 rounded-full text-xs", cat.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
                    {cat.is_active ? "Ativa" : "Inativa"}
                  </span>
                  <span className="ml-2 text-xs text-muted-foreground">{subs.length} subcategoria(s)</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openNewSub(cat.id)} className="p-1.5 rounded hover:bg-muted" title="Adicionar subcategoria"><Plus size={16} /></button>
                  <button onClick={() => openEditCat(cat)} className="p-1.5 rounded hover:bg-muted"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteTarget({ type: "cat", id: cat.id })} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                </div>
              </div>
              {isExpanded && subs.length > 0 && (
                <div className="pl-12 pb-2 space-y-1">
                  {subs.map((sc) => (
                    <div key={sc.id} className="flex items-center gap-3 px-4 py-2 rounded hover:bg-muted/50">
                      <div className="flex-1">
                        <span className="text-sm">{sc.name}</span>
                        <span className={cn("ml-2 px-2 py-0.5 rounded-full text-xs", sc.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800")}>
                          {sc.is_active ? "Ativa" : "Inativa"}
                        </span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEditSub(sc)} className="p-1.5 rounded hover:bg-muted"><Pencil size={14} /></button>
                        <button onClick={() => setDeleteTarget({ type: "sub", id: sc.id })} className="p-1.5 rounded hover:bg-red-50 text-red-600"><Trash2 size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {isExpanded && subs.length === 0 && (
                <p className="pl-12 pb-3 text-sm text-muted-foreground">Nenhuma subcategoria.</p>
              )}
            </div>
          )
        })}
        {categories.length === 0 && (
          <p className="p-8 text-center text-muted-foreground">Nenhuma categoria cadastrada.</p>
        )}
      </div>

      {/* Category Dialog */}
      {catDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCatDialog(false)}>
          <div className="bg-background rounded-xl border w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{catEditId ? "Editar Categoria" : "Nova Categoria"}</h3>
              <button onClick={() => setCatDialog(false)} className="p-1 rounded hover:bg-muted"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nome</label>
                <input value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value, slug: slugify(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Slug</label>
                <input value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <textarea value={catForm.description} onChange={(e) => setCatForm({ ...catForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">URL da Imagem</label>
                <input value={catForm.image_url} onChange={(e) => setCatForm({ ...catForm, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="cat-active" checked={catForm.is_active} onChange={(e) => setCatForm({ ...catForm, is_active: e.target.checked })} className="rounded" />
                <label htmlFor="cat-active" className="text-sm font-medium">Ativa</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setCatDialog(false)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
              <button onClick={saveCat} disabled={saving || !catForm.name} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Dialog */}
      {subDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setSubDialog(false)}>
          <div className="bg-background rounded-xl border w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{subEditId ? "Editar Subcategoria" : "Nova Subcategoria"}</h3>
              <button onClick={() => setSubDialog(false)} className="p-1 rounded hover:bg-muted"><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Nome</label>
                <input value={subForm.name} onChange={(e) => setSubForm({ ...subForm, name: e.target.value, slug: slugify(e.target.value) })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Slug</label>
                <input value={subForm.slug} onChange={(e) => setSubForm({ ...subForm, slug: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Descrição</label>
                <textarea value={subForm.description} onChange={(e) => setSubForm({ ...subForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded-md bg-background text-sm resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">URL da Imagem</label>
                <input value={subForm.image_url} onChange={(e) => setSubForm({ ...subForm, image_url: e.target.value })} className="w-full px-3 py-2 border rounded-md bg-background text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="sub-active" checked={subForm.is_active} onChange={(e) => setSubForm({ ...subForm, is_active: e.target.checked })} className="rounded" />
                <label htmlFor="sub-active" className="text-sm font-medium">Ativa</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setSubDialog(false)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
              <button onClick={saveSub} disabled={saving || !subForm.name} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50">
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-background rounded-xl border p-6 max-w-sm m-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Excluir {deleteTarget.type === "cat" ? "Categoria" : "Subcategoria"}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {deleteTarget.type === "cat"
                ? "Todas as subcategorias serão removidas. Esta ação não pode ser desfeita."
                : "Esta ação não pode ser desfeita."}
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">Cancelar</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700">Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
