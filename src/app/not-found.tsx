import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-20">
      <p className="font-[var(--font-playfair)] text-6xl font-bold text-brown mb-3">404</p>
      <h1 className="text-xl font-semibold text-gray-800 mb-2">Página não encontrada</h1>
      <p className="text-gray-500 mb-6 max-w-md">
        A página que você procura não existe ou foi movida. Que tal voltar e continuar explorando nossas peças?
      </p>
      <Link
        href="/"
        className="inline-block bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2.5 text-sm font-medium transition-colors"
      >
        Voltar à loja
      </Link>
    </div>
  )
}
