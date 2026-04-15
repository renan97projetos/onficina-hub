import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" />
            <p className="mt-3 text-sm text-muted-foreground">
              Gestão completa para oficinas de funilaria e pintura.
            </p>
          </div>

          {/* Produto */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Produto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#recursos" className="transition-colors hover:text-foreground">Recursos</a></li>
              <li><a href="#planos" className="transition-colors hover:text-foreground">Preços</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Demonstração</a></li>
            </ul>
          </div>

          {/* Empresa */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Empresa</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Sobre</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Blog</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">Contato</a></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="mb-3 text-sm font-semibold">Suporte</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="transition-colors hover:text-foreground">Central de ajuda</a></li>
              <li><a href="#" className="transition-colors hover:text-foreground">WhatsApp</a></li>
              <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 ONficina. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">Termos de uso</a>
            <a href="#" className="transition-colors hover:text-foreground">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
