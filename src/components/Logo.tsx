interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-5",
  md: "h-7",
  lg: "h-10",
};

/**
 * Logo ONficina — um único SVG contendo a roda (no lugar do "O") + texto "Nficina".
 * Tudo desenhado juntos garante alinhamento perfeito em qualquer tamanho/lugar.
 */
const Logo = ({ className = "", size = "md" }: LogoProps) => {
  // Geometria da roda
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

  // viewBox: roda 100x100 + texto começa em x=110
  // texto centralizado verticalmente (y=50, dominantBaseline central)
  const VIEW_W = 540;
  const VIEW_H = 100;

  return (
    <svg
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto ${className}`}
      role="img"
      aria-label="ONficina"
    >
      {/* Roda (cor primary via currentColor no grupo) */}
      <g style={{ color: "hsl(var(--primary))" }}>
        <circle cx={cx} cy={cy} r={outerR} stroke="currentColor" strokeWidth={tireWidth} fill="none" />
        <circle cx={cx} cy={cy} r={rimR} stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
        {spokes.map((d, i) => (
          <path key={i} d={d} fill="currentColor" />
        ))}
        <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />
        <circle cx={cx} cy={cy} r="5" fill="hsl(var(--background))" />
      </g>

      {/* Texto "Nficina" — N em primary, resto em foreground */}
      <text
        x="105"
        y="50"
        dominantBaseline="central"
        textAnchor="start"
        style={{
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
          fontWeight: 800,
          fontSize: "82px",
          letterSpacing: "-2px",
        }}
      >
        <tspan fill="hsl(var(--primary))">N</tspan>
        <tspan fill="hsl(var(--foreground))">ficina</tspan>
      </text>
    </svg>
  );
};

export default Logo;
