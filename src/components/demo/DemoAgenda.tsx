import { CalendarDays } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const DemoAgenda = () => (
  <EmptyModuleState
    icon={CalendarDays}
    title="Agenda em breve"
    description="A agenda permitirá receber agendamentos online dos seus clientes e organizar a fila de atendimento da oficina por dia e horário."
    helperText="Em breve você poderá configurar horários de funcionamento e abrir slots para agendamentos."
  />
);

export default DemoAgenda;
