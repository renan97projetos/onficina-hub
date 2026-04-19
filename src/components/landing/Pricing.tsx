import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    desc: "Para digitalizar sua oficina do jeito certo",
    monthlyPrice: 97,
    popular: false,
    features: [
      "Orçamentos profissionais em PDF com envio pelo WhatsApp",
      "Gestão completa de OS pela Pipeline",
      "Mensagens prontas no WhatsApp em cada etapa",
      "Serviço Ao Vivo — cliente acompanha o carro em tempo real",
      "Painel do técnico no celular — sem instalar nenhum app",
      "Registro de fotos de entrada e saída do veículo",
      "CRM — Controle e gestão de clientes",
      "Avaliação no sistema e no Google",
      "Controle financeiro — recebimentos, despesas e saldo",
      "Indicadores da sua oficina",
      "Notificações automáticas por e-mail para a oficina",
      "Onboarding guiado + módulo de treinamentos",
      "1 usuário · Suporte por WhatsApp",
    ],
  },
  {
    name: "Pro",
    desc: "Para oficinas que querem crescer com controle",
    monthlyPrice: 197,
    popular: true,
    features: [
      "Tudo do Starter",
      "Gestão de Pátio — veja onde está cada carro por técnico, serviço e OS",
      "Controle de Agendamento — gerencie entradas ou libere para o cliente escolher o dia",
      "Site próprio da sua oficina — 3 modelos prontos + personalizado sob consulta",
      "Gestão de performance da equipe",
      "Analytics avançado do negócio",
      "Acesso para sua equipe com permissões separadas",
      "Suporte prioritário",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="planos" className="py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Preços
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-muted-foreground">
            Comece grátis por 14 dias. Sem compromisso, sem cartão de crédito.
          </p>
        </div>

        <div className="mx-auto grid max-w-3xl grid-cols-1 gap-6 md:grid-cols-2">
          {plans.map((plan) => {
            const price = plan.monthlyPrice;
            return (
              <div
                key={plan.name}
                className={`relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 ${
                  plan.popular
                    ? "border-primary/80 shadow-[0_0_30px_rgba(249,115,22,0.35),0_0_60px_rgba(249,115,22,0.15)] hover:shadow-[0_0_40px_rgba(249,115,22,0.5),0_0_80px_rgba(249,115,22,0.25)]"
                    : "border-white/30 shadow-[0_0_20px_rgba(255,255,255,0.1),0_0_40px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2),0_0_60px_rgba(255,255,255,0.08)]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-primary-foreground" style={{ background: "linear-gradient(180deg, #f97316, #ea580c)" }}>
                    Mais popular
                  </div>
                )}

                <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>

                <div className="mt-6 mb-8">
                  <span className="text-sm text-muted-foreground">R$ </span>
                  <span className="text-5xl font-bold text-foreground">{price}</span>
                  <span className="text-sm text-muted-foreground">/mês</span>
                </div>

                <ul className="mb-8 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/cadastro"
                  className={`block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-all ${
                    plan.popular
                      ? "text-primary-foreground hover:brightness-110"
                      : "border border-white/20 text-foreground hover:bg-white/5"
                  }`}
                  style={plan.popular ? { background: "linear-gradient(180deg, #f97316, #ea580c)" } : undefined}
                >
                  Começar teste grátis
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
