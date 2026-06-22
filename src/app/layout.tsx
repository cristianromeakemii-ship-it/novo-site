import type { Metadata } from "next";
import { Cormorant_Garamond, Raleway } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Arte Fios de Luz | Artigos Religiosos Artesanais",
  description:
    "Peças artesanais carregadas de significado, fé, proteção e conexão espiritual. Artigos religiosos personalizados para Umbanda, Candomblé e espiritualidade.",
  keywords: [
    "artigos religiosos",
    "umbanda",
    "candomblé",
    "artesanal",
    "fios de luz",
    "proteção espiritual",
    "guias religiosos",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${raleway.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
