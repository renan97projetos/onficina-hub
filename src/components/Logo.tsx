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
  // Disco da politriz (o "O" da logo)
  const cx = 50;
  const cy = 50;
  const strokeW = 7; // espessura do traço (estilo line-icon)
  const outerR = 50 - strokeW / 2; // raio do disco
  const innerR = outerR * 0.55;
  const hubR = 3.2;

  // Layout do SVG inteiro
  const wheelSize = 100;
  const textX = wheelSize + 4;
  const fontSize = 92;
  const textY = 50;

  // ---- CABO da politriz (sai do lado esquerdo, vai ↙) ----
  // Ponto onde o cabo encontra o disco
  const joinAngle = (200 * Math.PI) / 180;
  const jx = cx + outerR * Math.cos(joinAngle);
  const jy = cy + outerR * Math.sin(joinAngle);

  // Corpo do cabo: retângulo girado em diagonal ↙
  const cableLength = 46;
  const cableThickness = 14;
  const cableAngleDeg = 215; // ↙
  const cableAngleRad = (cableAngleDeg * Math.PI) / 180;

  // Ponta final do cabo (empunhadura)
  const tipX = jx + cableLength * Math.cos(cableAngleRad);
  const tipY = jy + cableLength * Math.sin(cableAngleRad);

  // Quatro vértices do cabo (perpendicular ao eixo)
  const perp = cableAngleRad + Math.PI / 2;
  const half = cableThickness / 2;
  const p1x = jx + half * Math.cos(perp);
  const p1y = jy + half * Math.sin(perp);
  const p2x = jx - half * Math.cos(perp);
  const p2y = jy - half * Math.sin(perp);
  const p3x = tipX - half * Math.cos(perp);
  const p3y = tipY - half * Math.sin(perp);
  const p4x = tipX + half * Math.cos(perp);
  const p4y = tipY + half * Math.sin(perp);

  // Pescoço/colar onde o cabo encontra o disco (bloco perpendicular)
  const collarW = 18;
  const collarH = 9;
  const collarCenterX = jx + 4 * Math.cos(cableAngleRad);
  const collarCenterY = jy + 4 * Math.sin(cableAngleRad);

  // ---- ESTRELAS de brilho (canto superior direito do disco) ----
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
      viewBox="-10 -10 480 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto block ${className}`}
      aria-label="ONficina"
      role="img"
      preserveAspectRatio="xMinYMid meet"
    >
      <g className="text-primary" color="currentColor">
        {/* Cabo (atrás do disco) — contorno line-icon */}
        <path
          d={`M ${p1x} ${p1y} L ${p4x} ${p4y} L ${p3x} ${p3y} L ${p2x} ${p2y} Z`}
          stroke="currentColor"
          strokeWidth={strokeW * 0.7}
          strokeLinejoin="round"
          fill="none"
        />

        {/* Empunhadura (bloco preenchido na ponta do cabo) */}
        <rect
          x={tipX - 7}
          y={tipY - 5}
          width={14}
          height={10}
          rx={2}
          transform={`rotate(${cableAngleDeg - 180} ${tipX} ${tipY})`}
          fill="currentColor"
        />

        {/* Detalhes/listras na empunhadura */}
        <line
          x1={tipX - 3}
          y1={tipY - 3}
          x2={tipX - 3}
          y2={tipY + 3}
          stroke="hsl(var(--background))"
          strokeWidth={1.2}
          transform={`rotate(${cableAngleDeg - 180} ${tipX} ${tipY})`}
        />
        <line
          x1={tipX + 1}
          y1={tipY - 3}
          x2={tipX + 1}
          y2={tipY + 3}
          stroke="hsl(var(--background))"
          strokeWidth={1.2}
          transform={`rotate(${cableAngleDeg - 180} ${tipX} ${tipY})`}
        />

        {/* Colar/pescoço entre cabo e disco */}
        <rect
          x={collarCenterX - collarW / 2}
          y={collarCenterY - collarH / 2}
          width={collarW}
          height={collarH}
          rx={2}
          transform={`rotate(${cableAngleDeg + 90} ${collarCenterX} ${collarCenterY})`}
          fill="currentColor"
        />

        {/* Disco externo (o "O") — sobrepõe a base do cabo */}
        <circle
          cx={cx}
          cy={cy}
          r={outerR}
          stroke="currentColor"
          strokeWidth={strokeW}
          fill="hsl(var(--background))"
        />

        {/* Disco interno (pad de polimento) */}
        <circle
          cx={cx}
          cy={cy}
          r={innerR}
          stroke="currentColor"
          strokeWidth={1.5}
          opacity={0.4}
          fill="none"
        />

        {/* Centro (parafuso) */}
        <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />

        {/* Estrelas de brilho (canto superior direito, fora do disco) */}
        <path d={star(96, 6, 7)} fill="currentColor" opacity={1} />
        <path d={star(82, -4, 4.5)} fill="currentColor" opacity={0.7} />
        <path d={star(104, 22, 3)} fill="currentColor" opacity={0.45} />
      </g>

      {/* Texto: "N" + "ficina" (o "O" é o disco da politriz) */}
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
