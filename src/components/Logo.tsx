import logoSrc from "@/assets/logo-onficina.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-10",
  md: "h-14",
  lg: "h-24",
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  return (
    <img
      src={logoSrc}
      alt="ONficina"
      className={`${sizeMap[size]} w-auto object-contain ${className}`}
    />
  );
};

export default Logo;
