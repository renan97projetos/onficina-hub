import { Car } from "lucide-react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: { text: "text-xl", icon: 18 },
  md: { text: "text-2xl", icon: 22 },
  lg: { text: "text-4xl", icon: 32 },
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const s = sizeMap[size];
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className={`${s.text} font-extrabold tracking-tight`}>
        <span className="text-primary">ON</span>
        <span className="text-foreground">ficina</span>
      </span>
      <Car size={s.icon} className="text-primary" />
    </div>
  );
};

export default Logo;
