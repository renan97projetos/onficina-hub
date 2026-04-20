import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

const WHATSAPP_SUPORTE = "5527992373501";

const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-16">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-2">
            <Logo size="sm" />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              Sistema de gestão para oficinas de funilaria e pintura.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Produto</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li><a href="#recursos" className="transition-colors hover:text-foreground">Recursos</a></li>
              <li><a href="#planos" className="transition-colors hover:text-foreground">Preços</a></li>
              <li><a href="#faq" className="transition-colors hover:text-foreground">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-foreground">Suporte</h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_SUPORTE}?text=${encodeURIComponent(
                    "Olá, preciso de ajuda com o ONficina",
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-foreground"
                >
                  Central de ajuda
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 md:flex-row">
          <p className="text-xs text-muted-foreground">
            © 2026 ONficina. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-xs text-muted-foreground">
            <Link to="/termos" className="transition-colors hover:text-foreground">Termos de uso</Link>
            <Link to="/privacidade" className="transition-colors hover:text-foreground">Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
