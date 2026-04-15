import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
          <Logo size="sm" />

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#planos" className="transition-colors hover:text-foreground">Planos</a>
            <Link to="/cadastro" className="transition-colors hover:text-foreground">Cadastro</Link>
            <Link to="/login" className="transition-colors hover:text-foreground">Login</Link>
          </div>

          <p className="text-xs text-muted-foreground">
            © 2026 ONficina. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
