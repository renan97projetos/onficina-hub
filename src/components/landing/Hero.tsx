import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

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
              <a href="#como-funciona" className="flex items-center justify-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-4 text-base font-semibold text-foreground transition-all hover:bg-white/5">
                Como funciona
              </a>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Sem cartão de crédito. Cancele quando quiser.
            </p>
          </div>

          {/* Right — 3 mockups conectados */}
          <div className="relative">
            <div className="relative flex flex-col gap-4 lg:gap-0">
              {/* Linha de cima: 2 mockups lado a lado */}
              <div className="relative grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-0">
                {/* Mockup 1 — Pipeline OS (escuro) */}
                <div
                  className="overflow-hidden rounded-2xl border border-white/30 bg-card p-4 shadow-xl opacity-0 animate-[fade-in_0.5s_ease-out_forwards]"
                  style={{ animationDelay: '0ms' }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-xs font-semibold text-foreground">Ordens de Serviço</h3>
                    <span className="text-[10px] text-primary">Abril 2026</span>
                  </div>

                  <div className="mb-3 grid grid-cols-3 gap-1.5">
                    {[
                      { label: "Andamento", value: "12" },
                      { label: "Aguardando", value: "8" },
                      { label: "Finalizadas", value: "47" },
                    ].map((m) => (
                      <div key={m.label} className="rounded-lg border border-white/10 bg-white/5 p-2 text-center">
                        <div className="text-base font-bold text-foreground">{m.value}</div>
                        <div className="text-[9px] text-muted-foreground">{m.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {[
                      { car: "Honda Civic 2022", desc: "Repintura completa", status: "Pintura", primary: true },
                      { car: "Toyota Corolla", desc: "Reparo lateral", status: "Funilaria", primary: false },
                      { car: "VW Golf 2023", desc: "Para-choque", status: "Orçamento", primary: false },
                    ].map((os) => (
                      <div key={os.car} className="flex items-center justify-between rounded-lg border border-white/10 p-2">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <div>
                            <div className="text-[10px] font-medium text-foreground">{os.car}</div>
                            <div className="text-[9px] text-muted-foreground">{os.desc}</div>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-medium ${os.primary ? 'bg-primary text-primary-foreground' : 'border border-white/10 bg-white/5 text-foreground'}`}>
                          {os.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mockup 2 — ServiçoAo Vivo (claro) */}
                <div
                  className="overflow-hidden rounded-2xl border border-white/30 bg-white p-4 shadow-xl opacity-0 animate-[fade-in_0.5s_ease-out_forwards]"
                  style={{ animationDelay: '150ms' }}
                >
                  {/* Header laranja */}
                  <div className="-m-4 mb-3 bg-primary px-4 py-2">
                    <div className="text-[11px] font-semibold text-primary-foreground">ServiçoAo Vivo</div>
                  </div>

                  <div className="mb-3 text-[11px] font-semibold text-gray-800">
                    Honda Civic · GHJ-4F52
                  </div>

                  {/* Tracker 6 etapas */}
                  <div className="mb-3">
                    <div className="relative flex items-center justify-between">
                      {/* Linha de fundo */}
                      <div className="absolute left-2 right-2 top-1/2 h-0.5 -translate-y-1/2 bg-gray-200" />
                      {/* Linha preenchida até etapa 4 */}
                      <div className="absolute left-2 top-1/2 h-0.5 -translate-y-1/2 bg-primary" style={{ width: 'calc((100% - 1rem) * 0.6)' }} />
                      {[0, 1, 2, 3, 4, 5].map((i) => {
                        const done = i < 3;
                        const active = i === 3;
                        return (
                          <div
                            key={i}
                            className={`relative z-10 flex h-4 w-4 items-center justify-center rounded-full ${
                              done ? 'bg-primary' : active ? 'bg-blue-500 animate-pulse' : 'bg-gray-200'
                            }`}
                          >
                            {done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-1.5 flex justify-between text-[7px] text-gray-500">
                      {['Aberta', 'Alocado', 'Aguard.', 'Serviço', 'Pagto.', 'Entrega'].map((l) => (
                        <span key={l} className="w-8 text-center">{l}</span>
                      ))}
                    </div>
                  </div>

                  {/* Em andamento */}
                  <div className="rounded-lg bg-gray-50 p-2">
                    <div className="mb-1.5 text-[9px] font-semibold text-gray-700">Em andamento</div>
                    <div className="space-y-1.5">
                      <div>
                        <div className="mb-0.5 flex justify-between text-[9px] text-gray-600">
                          <span>Funilaria</span><span>75%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full bg-primary" style={{ width: '75%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="mb-0.5 flex justify-between text-[9px] text-gray-600">
                          <span>Pintura</span><span>30%</span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                          <div className="h-full bg-primary" style={{ width: '30%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[9px] font-medium text-green-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    Ao vivo
                  </div>
                </div>

                {/* Conector único central — posicionado na borda inferior da linha de cima, ponto de encontro dos 3 */}
                <div
                  className="pointer-events-none absolute bottom-0 left-1/2 z-20 hidden lg:flex h-9 w-9 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full text-white"
                  style={{
                    background: 'radial-gradient(circle, #F59E0B, #D97706)',
                    boxShadow:
                      '0 0 16px 6px rgba(245, 158, 11, 0.6), 0 0 32px 12px rgba(245, 158, 11, 0.25)',
                    fontSize: '18px',
                    fontWeight: 700,
                    lineHeight: 1,
                  }}
                  aria-hidden="true"
                >
                  +
                </div>
              </div>

              {/* Linha de baixo: mockup central — mesma largura da linha de cima para conectar */}
              <div className="flex">
                <div
                  className="w-full overflow-hidden rounded-2xl border border-white/30 bg-card p-4 shadow-xl opacity-0 animate-[fade-in_0.5s_ease-out_forwards]"
                  style={{ animationDelay: '300ms' }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-xs font-semibold text-foreground">Gestão de Pátio</h3>
                    <span className="rounded-full bg-purple-500/20 px-2 py-0.5 text-[9px] font-medium text-purple-300">Pro</span>
                  </div>

                  {/* Tabs */}
                  <div className="mb-3 flex gap-3 border-b border-white/10 text-[10px]">
                    <button className="relative pb-1.5 font-medium text-foreground">
                      Por técnico
                      <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />
                    </button>
                    <button className="pb-1.5 text-muted-foreground">Por serviço</button>
                    <button className="pb-1.5 text-muted-foreground">Por OS</button>
                  </div>

                  {/* 3 colunas técnicos */}
                  <div className="grid grid-cols-3 gap-2">
                    {/* Carlos */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-foreground">Carlos</span>
                        <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[8px] font-medium text-green-400">2/3</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                          <span className="text-[9px] text-foreground">BMW · ABC</span>
                        </div>
                        <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="text-[9px] text-foreground">Golf · DEF</span>
                        </div>
                      </div>
                    </div>

                    {/* Marcos */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-foreground">Marcos</span>
                        <span className="rounded-full bg-amber-500/20 px-1.5 py-0.5 text-[8px] font-medium text-amber-400">3/3</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                          <span className="text-[9px] text-foreground">Civic · GHJ</span>
                        </div>
                        <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                          <span className="text-[9px] text-foreground">Uno · MNO</span>
                        </div>
                        <div className="rounded border border-white/10 bg-white/5 p-1.5 text-[9px] text-muted-foreground">
                          + 1 mais
                        </div>
                      </div>
                    </div>

                    {/* João */}
                    <div>
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-[10px] font-medium text-foreground">João</span>
                        <span className="rounded-full bg-green-500/20 px-1.5 py-0.5 text-[8px] font-medium text-green-400">1/3</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 rounded border border-white/10 bg-white/5 p-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          <span className="text-[9px] text-foreground">Corolla ✓</span>
                        </div>
                        <div className="rounded border border-dashed border-white/15 p-1.5 text-center text-[9px] text-muted-foreground">
                          2 vagas
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
