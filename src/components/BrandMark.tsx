type BrandMarkProps = {
  className?: string
  title?: string
}

/**
 * Marca da Arte Fios de Luz: um nucleo luminoso com fios de luz irradiando,
 * em degrade dourado (paleta da marca). Use no header, footer e admin.
 */
export default function BrandMark({ className, title = "Arte Fios de Luz" }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="afl-gold" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#D4A843" />
          <stop offset="0.5" stopColor="#B8860B" />
          <stop offset="1" stopColor="#8B6914" />
        </linearGradient>
      </defs>
      <g stroke="url(#afl-gold)" strokeWidth="1.4" strokeLinecap="round">
        <line x1="36" y1="24" x2="45" y2="24" />
        <line x1="32.5" y1="32.5" x2="38.9" y2="38.9" />
        <line x1="24" y1="36" x2="24" y2="45" />
        <line x1="15.5" y1="32.5" x2="9.1" y2="38.9" />
        <line x1="12" y1="24" x2="3" y2="24" />
        <line x1="15.5" y1="15.5" x2="9.1" y2="9.1" />
        <line x1="24" y1="12" x2="24" y2="3" />
        <line x1="32.5" y1="15.5" x2="38.9" y2="9.1" />
      </g>
      <circle cx="24" cy="24" r="9.5" stroke="url(#afl-gold)" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="4.5" fill="url(#afl-gold)" />
    </svg>
  )
}
