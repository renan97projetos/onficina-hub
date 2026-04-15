import { Clock, ChevronLeft, ChevronRight } from "lucide-react";

const diasSemana = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const horarios = [
  { dia: 1, inicio: "08:00", fim: "18:00", ativo: true },
  { dia: 2, inicio: "08:00", fim: "18:00", ativo: true },
  { dia: 3, inicio: "08:00", fim: "18:00", ativo: true },
  { dia: 4, inicio: "08:00", fim: "18:00", ativo: true },
  { dia: 5, inicio: "08:00", fim: "17:00", ativo: true },
  { dia: 6, inicio: "08:00", fim: "12:00", ativo: true },
  { dia: 0, inicio: "—", fim: "—", ativo: false },
];

const agendamentos = [
  { os: "OS-0143", car: "Onix 2022", servico: "Funilaria", colaborador: "João Silva", data: "16/04", hora: "08:00" },
  { os: "OS-0144", car: "T-Cross 2023", servico: "Preparação", colaborador: "Rafael Lima", data: "16/04", hora: "09:00" },
  { os: "OS-0139", car: "Tracker 2021", servico: "Pintura", colaborador: "Pedro Souza", data: "17/04", hora: "08:00" },
  { os: "OS-0142", car: "Kicks 2022", servico: "Polimento", colaborador: "Pedro Souza", data: "18/04", hora: "14:00" },
];

const DemoAgenda = () => (
  <>
    <div className="grid gap-6 lg:grid-cols-3">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-bold uppercase tracking-wide">Horários</h2>
        </div>
        <div className="space-y-1">
          {horarios.sort((a, b) => a.dia - b.dia).map((h) => (
            <div key={h.dia} className={`flex items-center justify-between rounded-lg border border-white/10 px-4 py-2.5 text-sm ${!h.ativo ? "opacity-40" : ""}`}>
              <span>{diasSemana[h.dia]}</span>
              <span className="text-muted-foreground">{h.ativo ? `${h.inicio} — ${h.fim}` : "Fechado"}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wide">Agendamentos</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <button className="hover:text-foreground"><ChevronLeft className="h-4 w-4" /></button>
            <span>Abril 2026</span>
            <button className="hover:text-foreground"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="space-y-1">
          {agendamentos.map((a) => (
            <div key={a.os + a.servico} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-primary">{a.os}</span>
                <span className="text-sm">{a.car}</span>
                <span className="text-xs text-muted-foreground">— {a.servico}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{a.colaborador}</span>
                <span>{a.data} {a.hora}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default DemoAgenda;
