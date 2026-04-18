import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const Termos = () => (
  <div className="min-h-screen bg-background px-4 py-12">
    <div className="mx-auto max-w-3xl">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </Link>

      <div className="mt-6 mb-8 flex justify-center">
        <Logo size="md" />
      </div>

      <article className="space-y-6 rounded-2xl border border-border bg-card p-8 lg:p-12">
        <header>
          <h1 className="text-2xl font-bold">Termos de Uso — ONficina</h1>
          <p className="mt-1 text-sm text-muted-foreground">Última atualização: Abril de 2025</p>
        </header>

        <section>
          <h2 className="mb-2 text-lg font-semibold">1. Objeto</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O ONficina é um sistema de gestão SaaS para oficinas de funilaria e pintura, oferecido
            mediante assinatura mensal.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">2. Aceitação</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Ao criar uma conta, o usuário declara ter lido e concordado com estes termos.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">3. Cadastro e responsabilidades</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O usuário é responsável pela veracidade dos dados cadastrados e pela segurança de suas
            credenciais.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">4. Planos e pagamento</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Plano Starter: R$ 97/mês</li>
            <li>Plano Pro: R$ 197/mês</li>
            <li>Trial gratuito de 14 dias, sem necessidade de cartão de crédito.</li>
            <li>Pagamentos processados pelo Stripe.</li>
            <li>Cancelamento a qualquer momento pelo painel.</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">5. Cancelamento e reembolso</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Não há reembolso após o processamento da cobrança mensal. O acesso permanece ativo até
            o fim do período já pago.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">6. Limitação de responsabilidade</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            O ONficina não se responsabiliza por perdas causadas por falhas de infraestrutura de
            terceiros (Supabase, Stripe).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">7. Propriedade intelectual</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Todo o código, design e marca ONficina são de propriedade do desenvolvedor. É vedada a
            reprodução sem autorização prévia.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">8. Contato</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            contato@onficina.com.br
          </p>
        </section>
      </article>
    </div>
  </div>
);

export default Termos;
