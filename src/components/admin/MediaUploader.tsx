"use client"

import { useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { Upload, X, GripVertical, Film, ImageIcon } from "lucide-react"

type MediaItem = {
  id?: string
  url: string
  sort_order: number
  media_type: "image" | "video"
}

type Props = {
  productId?: string
  media: MediaItem[]
  onChange: (media: MediaItem[]) => void
}

const MAX_IMAGE_WIDTH = 1200
const MAX_IMAGE_HEIGHT = 1200
const JPEG_QUALITY = 0.85

async function resizeImage(file: File): Promise<Blob> {
  return new Promise((resolve) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img

      if (width <= MAX_IMAGE_WIDTH && height <= MAX_IMAGE_HEIGHT) {
        resolve(file)
        return
      }

      const ratio = Math.min(MAX_IMAGE_WIDTH / width, MAX_IMAGE_HEIGHT / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)

      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")!
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(
        (blob) => resolve(blob!),
        "image/jpeg",
        JPEG_QUALITY
      )
    }
    img.src = url
  })
}

function isVideo(file: File) {
  return file.type.startsWith("video/")
}

export default function MediaUploader({ productId, media, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)

    const newMedia: MediaItem[] = [...media]

    for (const file of Array.from(files)) {
      const isVid = isVideo(file)
      let uploadFile: Blob = file
      let ext = "jpg"

      if (!isVid) {
        uploadFile = await resizeImage(file)
        ext = "jpg"
      } else {
        ext = file.name.split(".").pop() || "mp4"
      }

      const path = `${productId || "temp"}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from("product-media")
        .upload(path, uploadFile, {
          contentType: isVid ? file.type : "image/jpeg",
          upsert: false,
        })

      if (!error) {
        const { data: urlData } = supabase.storage
          .from("product-media")
          .getPublicUrl(path)

        newMedia.push({
          url: urlData.publicUrl,
          sort_order: newMedia.length,
          media_type: isVid ? "video" : "image",
        })
      }
    }

    onChange(newMedia)
    setUploading(false)
    if (inputRef.current) inputRef.current.value = ""
  }

  const removeItem = (idx: number) => {
    const updated = media.filter((_, i) => i !== idx).map((m, i) => ({ ...m, sort_order: i }))
    onChange(updated)
  }

  const handleDragStart = (idx: number) => setDragIdx(idx)
  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    const items = [...media]
    const [moved] = items.splice(dragIdx, 1)
    items.splice(idx, 0, moved)
    onChange(items.map((m, i) => ({ ...m, sort_order: i })))
    setDragIdx(idx)
  }
  const handleDragEnd = () => setDragIdx(null)

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Fotos e Vídeos</label>

      <div
        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          {uploading ? "Enviando..." : "Clique ou arraste fotos e vídeos"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          JPG, PNG, HEIC, MP4 • Imagens são redimensionadas automaticamente
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif,video/mp4,video/quicktime,video/webm"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {media.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {media.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className={`relative group rounded-lg border overflow-hidden aspect-square bg-muted ${dragIdx === idx ? "opacity-50" : ""} ${idx === 0 ? "ring-2 ring-primary" : ""}`}
            >
              {item.media_type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900">
                  <Film size={24} className="text-white" />
                </div>
              ) : (
                <img src={item.url} alt="" className="w-full h-full object-cover" />
              )}

              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Principal
                </span>
              )}

              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button
                  type="button"
                  onClick={() => removeItem(idx)}
                  className="p-1 bg-red-600 text-white rounded-full"
                >
                  <X size={12} />
                </button>
              </div>

              <div className="absolute bottom-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical size={14} className="text-white drop-shadow" />
              </div>

              <div className="absolute bottom-1 right-1">
                {item.media_type === "video" ? (
                  <Film size={12} className="text-white drop-shadow" />
                ) : (
                  <ImageIcon size={12} className="text-white drop-shadow" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
