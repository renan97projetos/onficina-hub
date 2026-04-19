import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

const Navbar = () => {
  const { session } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-8">
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
          <a href="#planos" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Preços
          </a>
        </div>

        <div className="flex items-center gap-3">
          {session ? (
            <Link
              to="/admin"
              className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
            >
              Acessar painel
            </Link>
          ) : (
            <>
              <Link to="/login" className="hidden text-sm text-foreground transition-colors hover:text-muted-foreground sm:inline-block">
                Entrar
              </Link>
              <Link
                to="/cadastro"
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
              >
                Começar agora
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
