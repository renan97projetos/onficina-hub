import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl lg:text-5xl">
          Pronto para organizar sua oficina?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
          Junte-se a mais de 500 oficinas que já usam o ONficina para gerenciar
          seus serviços de funilaria e pintura.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/cadastro"
            className="group inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90"
          >
            Começar teste grátis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted">
            Falar com especialista
          </button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          14 dias grátis. Sem cartão. Sem compromisso.
        </p>
      </div>
    </section>
  );
};

export default FinalCTA;