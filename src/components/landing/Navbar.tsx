import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="sm" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#funcionalidades" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Funcionalidades
          </a>
          <a href="#planos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Planos
          </a>
          <a href="#faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            FAQ
          </a>
          <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Login
          </Link>
          <Link
            to="/cadastro"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            Começar grátis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
