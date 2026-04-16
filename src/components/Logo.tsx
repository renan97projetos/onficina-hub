interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: "1em" },
  md: { text: "text-2xl", icon: "1em" },
  lg: { text: "text-4xl", icon: "1em" },
};

const TireIcon = ({ size }: { size: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block"
    style={{ verticalAlign: "middle", marginBottom: "0.15em" }}
  >
    {/* Thick outer tire (borracha grossa) */}
    <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="16" />
    {/* Inner hub circle */}
    <circle cx="50" cy="50" r="14" fill="currentColor" />
    {/* Hub hole */}
    <circle cx="50" cy="50" r="6" fill="var(--background, #0F172A)" />
    {/* 5 spokes */}
    <line x1="50" y1="28" x2="50" y2="14" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="29.1" y1="42.2" x2="22.4" y2="32.9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="29.1" y1="57.8" x2="22.4" y2="67.1" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="70.9" y1="42.2" x2="77.6" y2="32.9" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="70.9" y1="57.8" x2="77.6" y2="67.1" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
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
