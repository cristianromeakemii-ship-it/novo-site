"use client"

import Image from "next/image"
import { Sparkles } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"

export default function AboutContent() {
  const { settings } = useSettings()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-[var(--font-playfair)] text-3xl font-bold text-brown mb-8 text-center">
        Quem Somos
      </h1>

      <div className="grid md:grid-cols-2 gap-10 items-start max-w-4xl mx-auto">
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100">
          {settings.about_image_url ? (
            <Image
              src={settings.about_image_url}
              alt="Sobre Arte Fios de Luz"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-amber-100">
              <Sparkles className="w-16 h-16 text-primary/20" />
            </div>
          )}
        </div>

        <div className="space-y-4 text-gray-600 leading-relaxed">
          {settings.about_text ? (
            settings.about_text
              .split("\n")
              .filter(Boolean)
              .map((p, i) => <p key={i}>{p}</p>)
          ) : (
            <>
              <p>
                A <strong className="text-brown">Arte Fios de Luz</strong> nasceu do amor pela espiritualidade e
                pela arte. Cada peça é criada à mão com dedicação, carregando consigo significado, fé, proteção e
                conexão espiritual.
              </p>
              <p>
                Trabalhamos com guias de Orixás e Entidades, terços, pulseiras, e outros artigos religiosos, sempre
                respeitando a tradição e a individualidade de cada cliente.
              </p>
              <p>
                Nossa missão é levar arte, fé e proteção em cada criação, criando peças únicas que acompanham nossos
                clientes em sua jornada espiritual.
              </p>
              <p>
                Acreditamos que cada fio, cada conta e cada material utilizado carrega uma energia especial. Por isso,
                selecionamos cuidadosamente todos os insumos para garantir a qualidade e a beleza de cada produto.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
