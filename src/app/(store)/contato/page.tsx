import type { Metadata } from "next"
import ContactContent from "@/components/store/ContactContent"

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com a Arte Fios de Luz pelo WhatsApp, telefone ou e-mail. Tire dúvidas e faça encomendas de guias, pulseiras e terços artesanais.",
  alternates: { canonical: "/contato" },
  openGraph: {
    title: "Contato — Arte Fios de Luz",
    description: "Fale com a Arte Fios de Luz pelo WhatsApp, telefone ou e-mail e faça sua encomenda.",
    url: "/contato",
    type: "website",
  },
}

export default function ContactPage() {
  return <ContactContent />
}
