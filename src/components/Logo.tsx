interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-4xl",
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  return (
    <span className={`font-extrabold tracking-tight ${sizeMap[size]} ${className}`}>
      <span className="text-primary">ON</span>
      <span className="text-foreground">ficina</span>
    </span>
  );
};

export default Logo;
