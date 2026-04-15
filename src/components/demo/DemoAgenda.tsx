import { Clock, Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
  { os: "OS-0143", car: "Onix 2022", client: "Maria Santos", servico: "Funilaria", colaborador: "João Silva", data: "16/04/2026", hora: "08:00", duracao: "8h" },
  { os: "OS-0144", car: "T-Cross 2023", client: "Pedro Rodrigues", servico: "Preparação", colaborador: "Rafael Lima", data: "16/04/2026", hora: "09:00", duracao: "4h" },
  { os: "OS-0139", car: "Tracker 2021", client: "Lucas Ferreira", servico: "Pintura", colaborador: "Pedro Souza", data: "17/04/2026", hora: "08:00", duracao: "6h" },
  { os: "OS-0142", car: "Kicks 2022", client: "Juliana Martins", servico: "Polimento", colaborador: "Pedro Souza", data: "18/04/2026", hora: "14:00", duracao: "2h" },
  { os: "OS-0140", car: "Creta 2022", client: "Fernanda Costa", servico: "Montagem", colaborador: "Rafael Lima", data: "18/04/2026", hora: "08:00", duracao: "3h" },
];

const DemoAgenda = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Agenda</h1>
      <p className="text-sm text-muted-foreground">Horários de trabalho e agendamentos</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-3">
      {/* Work schedule */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Horários de Trabalho</h3>
        </div>
        <div className="space-y-3">
          {horarios.sort((a, b) => a.dia - b.dia).map((h) => (
            <div key={h.dia} className={`flex items-center justify-between rounded-lg border px-4 py-2.5 ${h.ativo ? "border-white/10 bg-white/[0.02]" : "border-white/5 opacity-50"}`}>
              <span className="text-sm font-medium">{diasSemana[h.dia]}</span>
              <span className="text-sm text-muted-foreground">
                {h.ativo ? `${h.inicio} — ${h.fim}` : "Fechado"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Appointments list */}
      <div className="lg:col-span-2 rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Agendamentos</h3>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><ChevronLeft className="h-4 w-4" /></button>
            <span className="text-sm font-medium">Abril 2026</span>
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {["OS", "Veículo", "Serviço", "Colaborador", "Data", "Hora", "Duração"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {agendamentos.map((a) => (
                <tr key={a.os + a.servico} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-2.5 text-sm font-semibold text-primary">{a.os}</td>
                  <td className="px-4 py-2.5 text-sm">{a.car}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.servico}</td>
                  <td className="px-4 py-2.5 text-sm">{a.colaborador}</td>
                  <td className="px-4 py-2.5 text-sm">{a.data}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.hora}</td>
                  <td className="px-4 py-2.5 text-sm text-muted-foreground">{a.duracao}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </>
);

export default DemoAgenda;
