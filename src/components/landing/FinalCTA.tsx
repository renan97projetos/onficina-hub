import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-primary/20 bg-primary/5 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-1/2 h-[300px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[100px]" />
          </div>

          <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              Pronto para organizar sua oficina?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-muted-foreground">
              Junte-se a mais de 500 oficinas que já transformaram sua operação
              com o ONficina. Comece hoje mesmo.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Começar teste grátis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Falar com especialista
              </button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              14 dias grátis. Sem cartão. Sem compromisso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
