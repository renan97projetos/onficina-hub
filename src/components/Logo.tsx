interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: "0.85em" },
  md: { text: "text-2xl", icon: "0.85em" },
  lg: { text: "text-4xl", icon: "0.85em" },
};

const TireIcon = ({ size }: { size: string }) => {
  // 5-spoke alloy wheel with thick curved spokes
  const cx = 50, cy = 50;
  const outerR = 46;
  const hubR = 13;

  // 5 spokes at 72° intervals, starting from top (-90°)
  const spokes = Array.from({ length: 5 }, (_, i) => {
    const angle = (-90 + i * 72) * (Math.PI / 180);
    const nextAngle = (-90 + (i + 1) * 72) * (Math.PI / 180);
    const midAngle = (angle + nextAngle) / 2;

    // Hub edge point
    const hx = cx + hubR * Math.cos(angle);
    const hy = cy + hubR * Math.sin(angle);

    // Rim inner edge point (where spoke meets inner rim)
    const rimR = 36;
    const rx = cx + rimR * Math.cos(angle);
    const ry = cy + rimR * Math.sin(angle);

    // Spoke is a thick curved shape - two edges curving outward
    const spokeWidth = 14;
    const perpAngle = angle + Math.PI / 2;
    const sw = spokeWidth / 2;

    // Hub attachment points (narrower)
    const hsw = 6;
    const h1x = hx + hsw * Math.cos(perpAngle);
    const h1y = hy + hsw * Math.sin(perpAngle);
    const h2x = hx - hsw * Math.cos(perpAngle);
    const h2y = hy - hsw * Math.sin(perpAngle);

    // Rim attachment points (wider)
    const r1x = rx + sw * Math.cos(perpAngle);
    const r1y = ry + sw * Math.sin(perpAngle);
    const r2x = rx - sw * Math.cos(perpAngle);
    const r2y = ry - sw * Math.sin(perpAngle);

    // Curve control points - offset toward the next spoke direction for curve effect
    const curveBias = 8;
    const c1x = (hx + rx) / 2 + curveBias * Math.cos(midAngle);
    const c1y = (hy + ry) / 2 + curveBias * Math.sin(midAngle);
    const c2x = (hx + rx) / 2 - curveBias * Math.cos(midAngle);
    const c2y = (hy + ry) / 2 - curveBias * Math.sin(midAngle);

    return `M${h1x},${h1y} Q${c1x},${c1y} ${r1x},${r1y} L${r2x},${r2y} Q${c2x},${c2y} ${h2x},${h2y} Z`;
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
      style={{ verticalAlign: "baseline", marginBottom: "-0.08em" }}
    >
      {/* Outer tire */}
      <circle cx={cx} cy={cy} r={outerR} stroke="currentColor" strokeWidth="8" />
      {/* Inner rim circle */}
      <circle cx={cx} cy={cy} r="36" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {/* 5 curved spokes */}
      {spokes.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
      {/* Center hub */}
      <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />
      {/* Hub hole */}
      <circle cx={cx} cy={cy} r="5" fill="var(--background, #0F172A)" />
    </svg>
  );
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const s = sizeMap[size];
  return (
    <span className={`font-extrabold tracking-tight ${s.text} ${className} inline-flex items-baseline`}>
      <span className="text-primary inline-flex items-baseline gap-0">
        <TireIcon size={s.icon} />
        <span>N</span>
      </span>
      <span className="text-foreground">ficina</span>
    </span>
  );
};

export default Logo;
