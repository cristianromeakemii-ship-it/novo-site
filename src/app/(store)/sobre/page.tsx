import type { Metadata } from "next"
import AboutContent from "@/components/store/AboutContent"

export const metadata: Metadata = {
  title: "Quem Somos",
  description:
    "Conheça a Arte Fios de Luz — peças artesanais com fé, proteção e significado para Umbanda, Candomblé e espiritualidade. Guias, pulseiras e terços feitos à mão.",
  alternates: { canonical: "/sobre" },
  openGraph: {
    title: "Quem Somos — Arte Fios de Luz",
    description:
      "Peças artesanais com fé, proteção e significado para Umbanda, Candomblé e espiritualidade.",
    url: "/sobre",
    type: "website",
  },
}

export default function AboutPage() {
  return <AboutContent />
}
