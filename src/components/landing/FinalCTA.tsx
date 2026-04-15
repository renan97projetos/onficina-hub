import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FinalCTA = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto max-w-[1280px] px-6 text-center lg:px-8">
        <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          Pronto para organizar sua oficina?
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
          Comece hoje mesmo a gerenciar seus serviços de funilaria e pintura com o ONficina.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            to="/cadastro"
            className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
          >
            Começar teste grátis
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button className="rounded-full border border-white/20 bg-transparent px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/5">
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