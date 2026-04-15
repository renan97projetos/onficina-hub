import { Link } from "react-router-dom";
import { ArrowRight, Play, TrendingUp } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-primary/8 blur-[140px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <p className="mb-4 text-sm font-medium tracking-wide text-primary">
              Gestão de oficinas de funilaria e pintura
            </p>

            <h1 className="mb-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Menos papel.{" "}
              <span className="text-primary">Mais carros prontos.</span>
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              Sistema completo para organizar orçamentos, ordens de serviço,
              financeiro e comunicação com o cliente. Tudo em um só lugar.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="group flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                Testar grátis por 14 dias
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-secondary">
                <Play className="h-4 w-4" />
                Ver demonstração
              </button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          {/* Right — dashboard preview mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card p-6 shadow-2xl shadow-primary/5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">Ordens de Serviço — Abril 2026</h3>
                <span className="text-xs text-muted-foreground">Atualizado agora</span>
              </div>

              {/* Metrics */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Em andamento", value: "12", color: "text-primary" },
                  { label: "Aguardando", value: "8", color: "text-warning" },
                  { label: "Finalizadas", value: "47", color: "text-success" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border/50 bg-secondary p-3 text-center">
                    <div className={`text-2xl font-bold ${m.color}`}>{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* OS list */}
              <div className="space-y-3">
                {[
                  { car: "Honda Civic 2023", status: "Pintura", progress: 75 },
                  { car: "Toyota Corolla 2022", status: "Funilaria", progress: 40 },
                  { car: "VW Golf 2024", status: "Aguardando peça", progress: 20 },
                ].map((os) => (
                  <div key={os.car} className="flex items-center justify-between rounded-lg border border-border/50 bg-background p-3">
                    <div>
                      <div className="text-sm font-medium">{os.car}</div>
                      <div className="text-xs text-muted-foreground">{os.status}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${os.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{os.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 flex items-center gap-2 rounded-full border border-border/50 bg-card px-4 py-2 shadow-lg">
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="text-sm font-semibold">+32%</span>
              <span className="text-xs text-muted-foreground">Produtividade vs. mês anterior</span>
            </div>

            <div className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
