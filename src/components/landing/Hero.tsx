import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center pt-16">
      <div className="container relative z-10 mx-auto px-4 py-20">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Gestão de oficinas de funilaria e pintura
            </p>

            <h1 className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Menos papel.
              <br />
              Mais carros prontos.
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              O sistema completo para organizar sua oficina de funilaria e pintura.
              Ordens de serviço, controle financeiro e acompanhamento de cada veículo em
              um só lugar.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="group flex items-center justify-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-semibold text-background transition-all hover:bg-foreground/90"
              >
                Testar grátis por 14 dias
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-muted">
                Ver demonstração
              </button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          {/* Right — dashboard mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border bg-background p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">Ordens de Serviço</h3>
                <span className="text-sm text-primary">Abril 2026</span>
              </div>

              {/* Metrics */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                {[
                  { label: "Em andamento", value: "12" },
                  { label: "Aguardando", value: "8" },
                  { label: "Finalizadas", value: "47" },
                ].map((m) => (
                  <div key={m.label} className="rounded-xl border border-border bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* OS list */}
              <div className="space-y-3">
                {[
                  { car: "Honda Civic 2022", desc: "Repintura completa", status: "Pintura", color: "bg-primary text-primary-foreground" },
                  { car: "Toyota Corolla 2021", desc: "Reparo lateral + pintura", status: "Funilaria", color: "border border-border text-foreground" },
                  { car: "VW Golf 2023", desc: "Para-choque dianteiro", status: "Orçamento", color: "border border-border text-foreground" },
                ].map((os) => (
                  <div key={os.car} className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <div>
                        <div className="text-sm font-medium text-foreground">{os.car}</div>
                        <div className="text-xs text-muted-foreground">{os.desc}</div>
                      </div>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${os.color}`}>
                      {os.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2.5 shadow-lg sm:-bottom-4 sm:-right-4 sm:left-auto">
              <span className="text-sm font-bold text-primary">+32%</span>
              <div>
                <div className="text-sm font-semibold text-foreground">Produtividade</div>
                <div className="text-xs text-muted-foreground">vs. mês anterior</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;