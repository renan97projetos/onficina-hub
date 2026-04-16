interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: 20 },
  md: { text: "text-2xl", icon: 26 },
  lg: { text: "text-4xl", icon: 38 },
};

const TireIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="inline-block align-middle"
    style={{ marginBottom: "0.1em" }}
  >
    {/* Outer tire */}
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" />
    {/* Inner hub */}
    <circle cx="50" cy="50" r="18" stroke="currentColor" strokeWidth="6" />
    {/* Spokes */}
    <line x1="50" y1="32" x2="50" y2="8" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="50" y1="68" x2="50" y2="92" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="32" y1="50" x2="8" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    <line x1="68" y1="50" x2="92" y2="50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
    {/* Diagonal spokes */}
    <line x1="37.3" y1="37.3" x2="18.7" y2="18.7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="62.7" y1="62.7" x2="81.3" y2="81.3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="37.3" y1="62.7" x2="18.7" y2="81.3" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <line x1="62.7" y1="37.3" x2="81.3" y2="18.7" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    {/* Tread marks on outer edge */}
    <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="8" strokeDasharray="6 8" opacity="0.4" />
  </svg>
);

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const s = sizeMap[size];
  return (
    <span className={`font-extrabold tracking-tight ${s.text} ${className} inline-flex items-baseline`}>
      <span className="text-primary">
        <TireIcon size={s.icon} />
        <span>N</span>
      </span>
      <span className="text-foreground">ficina</span>
    </span>
  );
};

export default Logo;
