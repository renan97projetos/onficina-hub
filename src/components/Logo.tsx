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
      {/* PolitrizIcon — estilo line-icon, igual à referência */}
      <g
        className="text-primary"
        color="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/*
          Eixo da politriz: diagonal ↙ → ↗
          - Disco (o "O" da logo): no canto superior-direito
          - Corpo alongado (cabo): vai do disco em diagonal pra baixo-esquerda
          - Punho lateral perpendicular: sai do topo do corpo, perto do disco

          Para manter o "O" no centro do espaço 0..100 (alinhado com "N"),
          desenhamos o disco em (50,50) com r=41.5 igual ao pneu original,
          e o cabo + punho ficam atravessando o disco.
        */}

        {/* Círculo externo — é o "O" da logo */}
        <circle cx="50" cy="50" r="41.5" strokeWidth="13" fill="none" />

        {/*
          Corpo alongado (cabo principal) — capsula em diagonal ↙
          Eixo do corpo:
            - extremidade superior (perto/dentro do disco): ≈ (62, 38)
            - extremidade inferior (ponta arredondada do cabo): ≈ (12, 88)
          Largura do corpo: ≈ 18
          Desenhado como contorno fechado (cápsula girada).
        */}
        <path
          d="
            M 56.36 31.64
            A 9 9 0 0 1 69.0 44.28
            L 18.64 94.64
            A 9 9 0 0 1 6 82
            L 56.36 31.64
            Z
          "
          fill="hsl(var(--background))"
          strokeWidth="6"
        />

        {/*
          Punho lateral perpendicular — sai do TOPO do corpo, perto do disco
          Perpendicular ao eixo do corpo (que tem ângulo 135°),
          então o punho sai a 45° (↖) do ponto ≈ (52, 42).
          Tamanho ~ 22 de comprimento, 12 de largura.
        */}
        <path
          d="
            M 49.66 31.34
            A 6 6 0 0 1 58.14 39.83
            L 42.83 55.14
            A 6 6 0 0 1 34.34 46.66
            L 49.66 31.34
            Z
          "
          fill="hsl(var(--background))"
          strokeWidth="6"
        />

        {/*
          Detalhes de "ventilação" no corpo — duas listras curtas paralelas
          ao eixo do corpo, posicionadas no terço superior (perto do disco).
        */}
        <line x1="46" y1="56" x2="54" y2="64" strokeWidth="4" />
        <line x1="40" y1="62" x2="48" y2="70" strokeWidth="4" />
      </g>

      {/* Texto: "N" primary + "ficina" foreground */}
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
