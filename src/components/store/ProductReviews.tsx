"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Star } from "lucide-react"
import { supabase } from "@/lib/supabase"
import type { Review } from "@/lib/queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function ProductReviews({
  productId,
  initialReviews,
}: {
  productId: string
  initialReviews: Review[]
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const count = initialReviews.length
  const avg = count > 0 ? initialReviews.reduce((s, r) => s + r.rating, 0) / count : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !comment.trim()) {
      toast.error("Preencha seu nome e o comentário.")
      return
    }
    setSubmitting(true)
    const { error } = await supabase.from("reviews").insert({
      product_id: productId,
      customer_name: name.trim(),
      rating,
      comment: comment.trim(),
    })
    setSubmitting(false)
    if (error) {
      toast.error("Não foi possível enviar sua avaliação agora.")
      return
    }
    toast.success("Avaliação enviada. Obrigado!")
    setName("")
    setComment("")
    setRating(5)
    setShowForm(false)
    router.refresh()
  }

  return (
    <section className="mt-16">
      <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-brown mb-6">Avaliações</h2>

      <div className="flex items-center gap-3 mb-6">
        {count > 0 ? (
          <>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn("w-5 h-5", i < Math.round(avg) ? "fill-primary text-primary" : "text-gray-300")}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {avg.toFixed(1)} • {count} avaliação(ões)
            </span>
          </>
        ) : (
          <span className="text-sm text-gray-500">Seja o primeiro a avaliar este produto.</span>
        )}
        <Button variant="outline" size="sm" className="ml-auto" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancelar" : "Escrever avaliação"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-lg p-4 mb-8 space-y-3 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Nota:</span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1} estrelas`}>
                  <Star className={cn("w-6 h-6", i < rating ? "fill-primary text-primary" : "text-gray-300")} />
                </button>
              ))}
            </div>
          </div>
          <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea
            placeholder="Conte como foi sua experiência com a peça…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90 text-white">
            {submitting ? "Enviando…" : "Enviar avaliação"}
          </Button>
        </form>
      )}

      <div className="space-y-4">
        {initialReviews.map((r) => (
          <div key={r.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-brown">{r.customer_name}</p>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn("w-4 h-4", i < r.rating ? "fill-primary text-primary" : "text-gray-300")}
                  />
                ))}
              </div>
            </div>
            {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
