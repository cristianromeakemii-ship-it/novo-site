import type { Metadata } from "next";
import { Playfair_Display, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { CartProvider } from "@/contexts/CartContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-opensans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://artefiosdeluz.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Arte Fios de Luz | Artigos Religiosos Artesanais",
    template: "%s | Arte Fios de Luz",
  },
  description:
    "Peças artesanais carregadas de significado, fé, proteção e conexão espiritual. Guias, pulseiras, terços e artigos religiosos personalizados para Umbanda, Candomblé e espiritualidade.",
  keywords: [
    "artigos religiosos",
    "umbanda",
    "candomblé",
    "guias de orixás",
    "guias de entidades",
    "pulseiras de orixás",
    "artesanal",
    "fios de luz",
    "proteção espiritual",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Arte Fios de Luz",
    url: SITE_URL,
    title: "Arte Fios de Luz | Artigos Religiosos Artesanais",
    description:
      "Peças artesanais com fé, proteção e conexão espiritual. Guias, pulseiras, terços e artigos personalizados para Umbanda e Candomblé.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Arte Fios de Luz | Artigos Religiosos Artesanais",
    description:
      "Peças artesanais com fé, proteção e conexão espiritual para Umbanda e Candomblé.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${openSans.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Arte Fios de Luz",
              url: SITE_URL,
              logo: `${SITE_URL}/icon.svg`,
              description:
                "Artigos religiosos artesanais e personalizados para Umbanda, Candomblé e espiritualidade.",
              sameAs: ["https://instagram.com/artefiosdeluz"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Arte Fios de Luz",
              url: SITE_URL,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${SITE_URL}/buscar?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              {children}
              <Toaster richColors position="top-center" />
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
