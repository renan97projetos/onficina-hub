interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: "0.83em" },
  md: { text: "text-2xl", icon: "0.83em" },
  lg: { text: "text-4xl", icon: "0.83em" },
};

const TireIcon = () => {
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

  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="block"
      aria-hidden="true"
    >
      <circle cx={cx} cy={cy} r={outerR} stroke="currentColor" strokeWidth={tireWidth} fill="none" />
      <circle cx={cx} cy={cy} r={rimR} stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      {spokes.map((d, i) => (
        <path key={i} d={d} fill="currentColor" />
      ))}
      <circle cx={cx} cy={cy} r={hubR} fill="currentColor" />
      <circle cx={cx} cy={cy} r="5" fill="var(--background, #0F172A)" />
    </svg>
  );
};

const SprayGun = () => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="block h-full w-full"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Body / nozzle */}
    <path d="M10 42 L58 42 L58 56 L10 56 Z" />
    {/* Tip */}
    <path d="M58 46 L72 46 L78 50 L72 54 L58 54" />
    {/* Spray cone */}
    <path d="M80 50 L92 42 M80 50 L94 50 M80 50 L92 58" opacity="0.7" />
    {/* Top paint cup */}
    <path d="M22 42 L22 28 L40 28 L40 42" />
    <path d="M22 28 Q31 22 40 28" />
    {/* Trigger handle */}
    <path d="M28 56 L24 78 L40 78 L36 56" />
    {/* Trigger */}
    <path d="M30 60 Q34 64 38 60" />
  </svg>
);

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const s = sizeMap[size];

  return (
    <span className={`font-extrabold tracking-tight ${s.text} ${className} inline-flex items-center leading-none`}>
      <span className="text-primary inline-flex items-center gap-[0.02em] leading-none">
        <span className="flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon }}>
          <TireIcon />
        </span>
        <span className="leading-none">N</span>
      </span>
      <span className="relative inline-flex items-center leading-none">
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-primary/40"
          style={{ width: "140%", height: "140%" }}
          aria-hidden="true"
        >
          <SprayGun />
        </span>
        <span className="relative z-10 text-foreground leading-none">ficina</span>
      </span>
    </span>
  );
};

export default Logo;
