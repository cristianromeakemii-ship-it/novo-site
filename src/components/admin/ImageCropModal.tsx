"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { getCroppedImg, type CropArea } from "@/lib/crop-image"

export default function ImageCropModal({
  imageSrc,
  onCancel,
  onConfirm,
}: {
  imageSrc: string
  onCancel: () => void
  onConfirm: (blob: Blob) => void
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [area, setArea] = useState<CropArea | null>(null)
  const [processing, setProcessing] = useState(false)

  const onCropComplete = useCallback((_: unknown, areaPixels: CropArea) => {
    setArea(areaPixels)
  }, [])

  const confirm = async () => {
    if (!area) return
    setProcessing(true)
    try {
      const blob = await getCroppedImg(imageSrc, area)
      onConfirm(blob)
    } catch {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4" onClick={onCancel}>
      <div className="bg-background rounded-xl w-full max-w-lg overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="relative h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Aproximar</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={onCancel} className="px-4 py-2 rounded-md border text-sm hover:bg-muted">
              Cancelar
            </button>
            <button
              onClick={confirm}
              disabled={processing}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {processing ? "Processando..." : "Cortar e adicionar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
