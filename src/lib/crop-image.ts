export type CropArea = { x: number; y: number; width: number; height: number }

// Gera um Blob JPEG recortado a partir da area selecionada (em pixels) do react-easy-crop.
export async function getCroppedImg(imageSrc: string, crop: CropArea): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = imageSrc
  })

  const canvas = document.createElement("canvas")
  canvas.width = Math.round(crop.width)
  canvas.height = Math.round(crop.height)
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("Canvas não suportado")

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("Falha ao recortar"))), "image/jpeg", 0.9)
  })
}
