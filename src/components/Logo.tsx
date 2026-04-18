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
      <g
        className="text-primary"
        color="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Círculo externo — é o "O" da logo (mesmo raio/stroke do pneu original) */}
        <circle cx="50" cy="50" r="41.5" strokeWidth="17" fill="none" />

        {/* === POLITRIZ (corpo line-icon, estilo da referência) === */}
        {/* Corpo alongado em diagonal ↘ — contorno fechado, traço fino sobre o disco */}
        {/* Eixo do corpo: do punho (≈ 30,30) descendo até a "boca" do disco (≈ 70,72) */}
        <path
          d="
            M 28 24
            L 42 24
            L 46 32
            L 70 56
            Q 76 62 70 68
            Q 64 74 58 68
            L 34 44
            L 26 40
            Z
          "
          fill="hsl(var(--background))"
          strokeWidth="3"
        />

        {/* Punho retangular saindo da extremidade superior-esquerda (fora do disco) */}
        <rect
          x="20"
          y="20"
          width="14"
          height="9"
          rx="1.5"
          fill="hsl(var(--background))"
          strokeWidth="3"
        />

        {/* Detalhes de "ventilação" na parte central do corpo — duas linhas paralelas */}
        <line x1="50" y1="46" x2="56" y2="52" strokeWidth="2" />
        <line x1="54" y1="42" x2="60" y2="48" strokeWidth="2" />
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
