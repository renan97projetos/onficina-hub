interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { width: 140, height: 44 },
  md: { width: 170, height: 52 },
  lg: { width: 220, height: 68 },
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const s = sizeMap[size];
  return (
    <svg
      width={s.width}
      height={s.height}
      viewBox="0 0 220 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Minimalist car outline */}
      <path
        d="M30 50 L18 50 A8 8 0 0 1 10 42 L10 34 L22 18 A6 6 0 0 1 27 16 L120 16 A6 6 0 0 1 125 18.5 L140 28 L200 28 A10 10 0 0 1 210 38 L210 42 A8 8 0 0 1 202 50 L190 50"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Roof line accent */}
      <path
        d="M22 18 L120 18"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.25"
      />
      {/* Window divider */}
      <line
        x1="80" y1="16" x2="80" y2="28"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        opacity="0.25"
      />
      {/* Front wheel */}
      <circle cx="50" cy="50" r="8" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="50" cy="50" r="3" fill="hsl(var(--primary))" opacity="0.3" />
      {/* Rear wheel */}
      <circle cx="180" cy="50" r="8" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" opacity="0.4" />
      <circle cx="180" cy="50" r="3" fill="hsl(var(--primary))" opacity="0.3" />

      {/* Text centered inside car body */}
      <text
        x="115"
        y="43"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="-0.5"
      >
        <tspan fill="hsl(var(--primary))">ON</tspan>
        <tspan fill="hsl(var(--foreground))">ficina</tspan>
      </text>
    </svg>
  );
};

export default Logo;
