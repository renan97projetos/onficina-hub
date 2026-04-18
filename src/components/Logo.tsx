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
  // Geometria do disco da politriz (o "O" da logo)
  // Mantém o mesmo diâmetro/posição da roda anterior
  const cx = 50;
  const cy = 50;
  const tireWidth = 17; // mesma espessura do traço externo (pneu antigo)
  const outerR = 50 - tireWidth / 2; // raio do disco externo (≈ 41.5)
  const innerR = outerR * 0.55; // disco interno (~55% do raio externo)
  const hubR = 5; // parafuso central

  // Layout do SVG inteiro (politriz + texto como um único elemento)
  const wheelSize = 100;
  const textX = wheelSize + 4;
  const fontSize = 92;
  const textY = 50;

  // --- CABO da politriz ---
  // Sai do lado ESQUERDO do disco, descendo em diagonal ↙
  // Ponto de saída do disco (lado esquerdo, levemente abaixo do centro)
  const handleStartAngle = (200 * Math.PI) / 180; // ~200° (esquerda-baixo)
  const hsx = cx + outerR * Math.cos(handleStartAngle);
  const hsy = cy + outerR * Math.sin(handleStartAngle);

  // Ponto final do cabo (fora do disco, ↙)
  const handleEndX = hsx - 28;
  const handleEndY = hsy + 34;

  // Curva de controle (leve curvatura)
  const handleCtrlX = hsx - 18;
  const handleCtrlY = hsy + 12;

  const handlePath = `M ${hsx} ${hsy} Q ${handleCtrlX} ${handleCtrlY} ${handleEndX} ${handleEndY}`;

  // Bloco/retângulo da base do cabo (empunhadura)
  const gripW = 10;
  const gripH = 6;

  // --- ESTRELAS de brilho (canto superior direito) ---
  // Estrela de 4 pontas via path
  const star = (sx: number, sy: number, r: number) => {
    const inner = r * 0.32;
    return [
      `M ${sx} ${sy - r}`,
      `L ${sx + inner} ${sy - inner}`,
      `L ${sx + r} ${sy}`,
      `L ${sx + inner} ${sy + inner}`,
      `L ${sx} ${sy + r}`,
      `L ${sx - inner} ${sy + inner}`,
      `L ${sx - r} ${sy}`,
      `L ${sx - inner} ${sy - inner}`,
      "Z",
    ].join(" ");
  };

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
      {/* Politriz (cor primary) — disco serve como o "O" da logo */}
      <g className="text-primary" color="currentColor">
        {/* Cabo (atrás do disco) */}
        <path
          d={handlePath}
          stroke="currentColor"
          strokeWidth={tireWidth * 0.55}
          strokeLinecap="round"
          fill="none"
        />
        {/* Empunhadura (bloco na base do cabo) */}
        <rect
          x={handleEndX - gripW / 2}
          y={handleEndY - gripH / 2}
          width={gripW}
          height={gripH}
          rx={1.5}
          transform={`rotate(50 ${handleEndX} ${handleEndY})`}
          fill="currentColor"
        />

        {/* Disco externo (o "O") */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke="currentColor"
          strokeWidth={tireWidth}
          fill="none"
        />

        {/* Disco interno (pad de polimento) */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.35"
          fill="none"
        />

        {/* Centro (parafuso) */}
        <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />

        {/* Estrelas de brilho (canto superior direito, fora do disco) */}
        <path d={star(92, 12, 6)} fill="currentColor" opacity="1" />
        <path d={star(80, 4, 4)} fill="currentColor" opacity="0.7" />
        <path d={star(96, 28, 2.8)} fill="currentColor" opacity="0.45" />
      </g>

      {/* Texto: "ficina" (o "O" é o disco da politriz) */}
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
