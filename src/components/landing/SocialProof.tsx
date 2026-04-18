import { MapPin, ArrowRight } from "lucide-react";

const SocialProof = () => {
  return (
    <section id="depoimentos" className="bg-[#0d0d0d] py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14">
          {/* Coluna esquerda: imagem placeholder */}
          <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <div className="flex h-full w-full items-center justify-center px-6 text-center">
              <p className="text-sm text-muted-foreground sm:text-base">
                Foto da oficina — Restauracar, Vila Velha ES
              </p>
            </div>
          </div>

          {/* Coluna direita: texto */}
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              A história por trás do sistema
            </p>
            <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
              Criado dentro de uma oficina de verdade
            </h2>
            <p className="text-muted-foreground">
              O ONficina nasceu da frustração de controlar OS em papel numa
              oficina de funilaria, pintura e estética em Vila Velha, ES. Cada
              funcionalidade foi pensada e testada na rotina real — não em uma
              sala de reunião.
            </p>

            <div className="my-6 h-px w-full bg-white/10" />

            <div className="flex items-center gap-2 text-sm text-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span>Restauracar — Vila Velha, Espírito Santo</span>
            </div>

            <a
              href="https://restauracar.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 rounded-md border border-white/15 bg-transparent px-3.5 py-2 text-xs font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-white/5"
            >
              Conheça a Restauracar
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
