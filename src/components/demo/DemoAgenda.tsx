import { Calendar, ChevronLeft, ChevronRight, Clock } from "lucide-react";

const DemoAgenda = () => (
  <div className="grid gap-6 lg:grid-cols-3">
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Horários</h2>
      </div>

      <div className="rounded-lg border border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground">
        Nenhum horário de funcionamento configurado ainda.
      </div>
    </div>

    <div className="rounded-xl border border-border bg-card p-5 lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Agendamentos</h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <button type="button" className="transition-colors hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
          <span>Mês atual</span>
          <button type="button" className="transition-colors hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="rounded-lg border border-dashed border-border bg-background px-4 py-10 text-center">
        <p className="text-sm font-medium text-foreground">Nenhum agendamento encontrado</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Os horários marcados pelos seus clientes vão aparecer aqui quando você começar a usar a agenda com dados reais.
        </p>
      </div>
    </div>
  </div>
);

export default DemoAgenda;
