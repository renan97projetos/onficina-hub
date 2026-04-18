interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6",
  md: "h-7",
  lg: "h-10",
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  // Layout do SVG inteiro (politriz + texto como um único elemento)
  // A seção 0..100 do viewBox X é a "PolitrizIcon" (o "O" da logo)
  const wheelSize = 100;
  const textX = wheelSize + 4;
  const fontSize = 92;
  const textY = 50;

  return (
    <svg
      viewBox="0 0 470 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto block ${className}`}
      aria-label="ONficina"
      role="img"
      preserveAspectRatio="xMinYMid meet"
    >
      {/* PolitrizIcon — desenhada no espaço 0..100 (mesmo do TireIcon original) */}
      <g className="text-primary" color="currentColor">
        {/* Círculo externo — é o "O" da logo (mesmo raio/stroke do pneu original) */}
        <circle cx="50" cy="50" r="41.5" stroke="currentColor" strokeWidth="17" fill="none" />

        {/* Círculo interno sutil — aro interno */}
        <circle cx="50" cy="50" r="24" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.3" />

        {/* Disco da politriz — centrado levemente acima */}
        <circle cx="50" cy="44" r="13" stroke="currentColor" strokeWidth="3" fill="none" />

        {/* Parafuso central da politriz */}
        <circle cx="50" cy="44" r="4.5" fill="currentColor" />

        {/* Cabeçote superior da máquina */}
        <rect x="42" y="32" width="16" height="7" rx="2" stroke="currentColor" strokeWidth="2.5" fill="none" />

        {/* Cabo diagonal para baixo-esquerda ↙ */}
        <path d="M40 56 Q34 64 28 74" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />

        {/* Empunhadura no final do cabo */}
        <rect x="22" y="71" width="9" height="12" rx="2.5" fill="currentColor" opacity="0.85" />

        {/* Estrela grande — brilho canto superior direito */}
        <path
          d="M74 20 L76 15 L78 20 L83 20 L79 23 L81 28 L76 25 L71 28 L73 23 L68 20 Z"
          fill="currentColor"
          opacity="0.95"
        />

        {/* Estrela média */}
        <path
          d="M82 12 L83.5 8 L85 12 L89 12 L86 14 L87 18 L83.5 16 L80 18 L81 14 L78 12 Z"
          fill="currentColor"
          opacity="0.7"
        />

        {/* Ponto brilhante pequeno */}
        <circle cx="90" cy="7" r="2.5" fill="currentColor" opacity="0.45" />
      </g>

      {/* Texto: "N" primary + "ficina" foreground, na mesma baseline do "O" */}
      <text
        x={textX}
        y={textY}
        dominantBaseline="central"
        textAnchor="start"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        letterSpacing="-3"
      >
        <tspan className="fill-primary">N</tspan>
        <tspan className="fill-foreground">ficina</tspan>
      </text>
    </svg>
  );
};

export default Logo;
