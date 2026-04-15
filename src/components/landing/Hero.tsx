import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[140px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              14 dias grátis — sem cartão de crédito
            </div>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Gestão completa para sua{" "}
              <span className="text-primary">oficina</span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              Controle financeiro, pipeline de orçamentos, notificações automáticas e
              acompanhamento em tempo real. Tudo em um só lugar.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Começar teste grátis
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button
                className="flex items-center justify-center gap-2 rounded-xl border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary"
              >
                <Play className="h-4 w-4" />
                Ver demonstração
              </button>
            </div>

            <div className="mt-10 flex items-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Setup em 10 min
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Sem fidelidade
              </div>
            </div>
          </div>

          {/* Right — dashboard preview */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/5">
              <img
                src={dashboardPreview}
                alt="Painel de gestão ONficina com pipeline kanban e controle financeiro"
                width={1280}
                height={800}
                className="w-full"
              />
            </div>
            {/* Glow behind image */}
            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
