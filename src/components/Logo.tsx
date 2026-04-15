import logoSrc from "@/assets/logo-onficina.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-30",
  md: "h-14",
  lg: "h-24",
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  return (
    <img
      src={logoSrc}
      alt="ONficina"
      className={`${sizeMap[size]} w-auto object-contain px-0 py-0 my-0 mx-0 ${className}`}
    />
  );
};

export default Logo;
