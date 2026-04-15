import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-2xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#recursos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Recursos
          </a>
          <a href="#como-funciona" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Como funciona
          </a>
          <a href="#depoimentos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Depoimentos
          </a>
          <a href="#planos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Preços
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-block">
            Entrar
          </Link>
          <Link
            to="/cadastro"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Começar agora
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
