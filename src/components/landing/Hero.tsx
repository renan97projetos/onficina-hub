import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative flex min-h-screen items-center pt-16 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-[#111111]" />
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.5\'/%3E%3C/svg%3E")' }} />

      <div className="container relative z-10 mx-auto max-w-[1280px] px-6 py-20 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left content */}
          <div className="max-w-xl">
            <p className="mb-6 text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Gestão de oficinas de funilaria e pintura
            </p>

            <h1 className="mb-4 text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
              Menos papel.
              <br />
              Mais carros prontos.
            </h1>

            <p className="mb-6 text-lg font-medium text-primary">
              Criado por quem tem oficina, para quem tem oficina.
            </p>

            <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
              O sistema completo para organizar sua oficina de funilaria e pintura.
              Ordens de serviço, controle financeiro e acompanhamento de cada veículo em
              um só lugar.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/cadastro"
                className="group flex items-center justify-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-primary-foreground transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}
              >
                Testar grátis por 14 dias
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/5">
                Ver demonstração
              </button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          {/* Right — dashboard mockup */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-card p-6 shadow-xl">
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
                  <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-4 text-center">
                    <div className="text-2xl font-bold text-foreground">{m.value}</div>
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                  </div>
                ))}
              </div>

              {/* OS list */}
              <div className="space-y-3">
                {[
                  { car: "Honda Civic 2022", desc: "Repintura completa", status: "Pintura", color: "bg-primary text-primary-foreground" },
                  { car: "Toyota Corolla 2021", desc: "Reparo lateral + pintura", status: "Funilaria", color: "border border-white/10 bg-white/5 text-foreground" },
                  { car: "VW Golf 2023", desc: "Para-choque dianteiro", status: "Orçamento", color: "border border-white/10 bg-white/5 text-foreground" },
                ].map((os) => (
                  <div key={os.car} className="flex items-center justify-between rounded-xl border border-white/10 p-4">
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
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-white/10 bg-card px-4 py-2.5 shadow-lg sm:-bottom-4 sm:-right-4 sm:left-auto">
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