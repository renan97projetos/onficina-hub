import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "Preciso de cartão para o teste?",
    a: "Não. O período de teste de 14 dias é totalmente gratuito e não requer cartão de crédito.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Sim. Você pode cancelar sua assinatura a qualquer momento, sem multa ou fidelidade.",
  },
  {
    q: "O sistema funciona no celular?",
    a: "Sim. O ONficina é totalmente responsivo e funciona perfeitamente em qualquer dispositivo.",
  },
  {
    q: "Quanto tempo leva para configurar?",
    a: "Menos de 10 minutos. Cadastre sua oficina, adicione seus serviços e colaboradores e comece a usar.",
  },
  {
    q: "Meus dados estão seguros?",
    a: "Sim. Todos os dados ficam armazenados em servidores com criptografia e backup automático diário. Você pode exportar suas informações a qualquer momento.",
  },
];

const FAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="bg-[#111111] py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            FAQ
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">Perguntas frequentes</h2>
        </div>

        <div className="mx-auto max-w-2xl space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-card overflow-hidden transition-colors hover:border-primary/20"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <span className="font-medium">{faq.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${
                    open === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;