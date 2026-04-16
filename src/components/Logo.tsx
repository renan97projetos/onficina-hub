interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: "0.9em" },
  md: { text: "text-2xl", icon: "0.9em" },
  lg: { text: "text-4xl", icon: "0.9em" },
};

const TireIcon = ({ size }: { size: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
    style={{ verticalAlign: "baseline", marginBottom: "-0.05em" }}
  >
    {/* Outer tire rubber */}
    <circle cx="50" cy="50" r="44" stroke="currentColor" strokeWidth="11" />
    {/* Inner hub */}
    <circle cx="50" cy="50" r="15" fill="currentColor" />
    {/* Hub hole */}
    <circle cx="50" cy="50" r="6" fill="var(--background, #0F172A)" />
    {/* Curved spokes using quadratic bezier curves */}
    {/* Top spoke */}
    <path d="M50 35 Q56 28 50 18" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Top-right spoke */}
    <path d="M62 40 Q68 38 76 26" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Bottom-right spoke */}
    <path d="M62 60 Q68 62 76 74" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Bottom spoke */}
    <path d="M50 65 Q44 72 50 82" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Bottom-left spoke */}
    <path d="M38 60 Q32 62 24 74" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
    {/* Top-left spoke */}
    <path d="M38 40 Q32 38 24 26" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" fill="none" />
  </svg>
);

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
