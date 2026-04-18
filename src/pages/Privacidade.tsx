import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/Logo";

const Privacidade = () => (
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
          <h1 className="text-2xl font-bold">Política de Privacidade — ONficina</h1>
          <p className="mt-1 text-sm text-muted-foreground">Última atualização: Abril de 2025</p>
        </header>

        <section>
          <h2 className="mb-2 text-lg font-semibold">1. Controlador dos dados</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            ONficina — contato@onficina.com.br
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">2. Dados coletados</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-muted-foreground">
            <li>Dados da oficina: nome, CNPJ, telefone, endereço</li>
            <li>Dados dos clientes da oficina: nome, telefone, placa do veículo</li>
            <li>Dados de uso: logs de acesso e ações no sistema</li>
            <li>Dados de pagamento: processados pelo Stripe (não armazenamos dados de cartão)</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">3. Finalidade</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Prestação do serviço de gestão descrito nos Termos de Uso.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">4. Base legal (LGPD — Lei 13.709/2018)</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Execução de contrato (Art. 7º, inciso V).
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">5. Compartilhamento</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Stripe (pagamentos) · Supabase (infraestrutura) · Google (avaliações, opcional pelo usuário)
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">6. Retenção</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Dados mantidos durante a vigência do contrato e por 5 anos após o encerramento, conforme
            obrigação legal.
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">7. Direitos do titular</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Acesso, correção, exclusão e portabilidade mediante solicitação para
            contato@onficina.com.br
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold">8. Cookies</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Apenas cookies essenciais de autenticação, sem rastreamento de terceiros.
          </p>
        </section>
      </article>
    </div>
  </div>
);

export default Privacidade;
