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
  // Geometria da roda (no espaço do SVG)
  const cx = 50;
  const cy = 50;
  const tireWidth = 17;
  const outerR = 50 - tireWidth / 2;
  const rimR = outerR - tireWidth / 2;
  const hubR = 11;

  const spokes = Array.from({ length: 5 }, (_, i) => {
    const angle = (-90 + i * 72) * (Math.PI / 180);
    const nextAngle = (-90 + (i + 1) * 72) * (Math.PI / 180);
    const midAngle = (angle + nextAngle) / 2;

    const hx = cx + hubR * Math.cos(angle);
    const hy = cy + hubR * Math.sin(angle);
    const rx = cx + rimR * Math.cos(angle);
    const ry = cy + rimR * Math.sin(angle);

    const spokeWidth = 9;
    const perpAngle = angle + Math.PI / 2;
    const sw = spokeWidth / 2;
    const hsw = 6;

    const h1x = hx + hsw * Math.cos(perpAngle);
    const h1y = hy + hsw * Math.sin(perpAngle);
    const h2x = hx - hsw * Math.cos(perpAngle);
    const h2y = hy - hsw * Math.sin(perpAngle);

    const r1x = rx + sw * Math.cos(perpAngle);
    const r1y = ry + sw * Math.sin(perpAngle);
    const r2x = rx - sw * Math.cos(perpAngle);
    const r2y = ry - sw * Math.sin(perpAngle);

    const curveBias = 8;
    const c1x = (hx + rx) / 2 + curveBias * Math.cos(midAngle);
    const c1y = (hy + ry) / 2 + curveBias * Math.sin(midAngle);
    const c2x = (hx + rx) / 2 - curveBias * Math.cos(midAngle);
    const c2y = (hy + ry) / 2 - curveBias * Math.sin(midAngle);

    return `M${h1x},${h1y} Q${c1x},${c1y} ${r1x},${r1y} L${r2x},${r2y} Q${c2x},${c2y} ${h2x},${h2y} Z`;
  });

  // Layout do SVG inteiro (roda + texto como um único elemento)
  // viewBox: largura calculada pra caber a roda + "ONficina"
  // Roda ocupa 0..100, texto começa logo após
  const wheelSize = 100;
  const textX = wheelSize + 4;
  const fontSize = 92;
  const textY = 50; // baseline central via dominantBaseline

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
      {/* Roda (cor primary) */}
      <g className="text-primary" color="currentColor">
        <circle cx={cx} cy={cy} r={outerR} stroke="currentColor" strokeWidth={tireWidth} fill="none" />
        <circle cx={cx} cy={cy} r={rimR} stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        {spokes.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
        <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />
        <circle cx={cx} cy={cy} r="5" fill="hsl(var(--background))" />
      </g>

      {/* Texto: "N" primary + "ficina" foreground, tudo na mesma baseline */}
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
