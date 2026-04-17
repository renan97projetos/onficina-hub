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

const SprayGun = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    stroke="currentColor"
    strokeWidth="6"
    strokeLinecap="square"
    strokeLinejoin="miter"
    className={className ?? "block h-full w-full"}
    style={style}
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Paint cup (top, slightly tilted) */}
    <path d="M38 8 L70 8 L72 38 L40 42 Z" />
    {/* Cup neck connecting to body */}
    <path d="M48 42 L52 52" />
    {/* Gun body (horizontal) */}
    <path d="M18 52 L86 52 L86 64 L18 64 Z" />
    {/* Air cap on left tip */}
    <path d="M10 54 L18 54 M10 62 L18 62" />
    {/* Rear cap on right */}
    <path d="M86 54 L94 54 M86 62 L94 62" />
    {/* Trigger pivot */}
    <circle cx="56" cy="64" r="3" fill="currentColor" stroke="none" />
    {/* Handle */}
    <path d="M48 64 L42 92 L62 92 L66 64" />
    {/* Trigger */}
    <path d="M52 68 Q58 76 60 84" />
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
      <span className="relative inline-block leading-none">
        <span className="relative z-0 text-foreground leading-none">ficina</span>
        <SprayGun
          className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-[170%] w-auto -translate-x-1/2 -translate-y-1/2 text-primary"
          style={{ opacity: 0.85, aspectRatio: "1 / 1" }}
        />
      </span>
    </span>
  );
};

export default Logo;
