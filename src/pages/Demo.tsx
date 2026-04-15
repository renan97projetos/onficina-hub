import { useState } from "react";
import DemoLayout from "@/components/demo/DemoLayout";
import DemoDashboard from "@/components/demo/DemoDashboard";
import DemoOS from "@/components/demo/DemoOS";
import DemoVeiculos from "@/components/demo/DemoVeiculos";
import DemoClientes from "@/components/demo/DemoClientes";
import DemoFinanceiro from "@/components/demo/DemoFinanceiro";
import DemoRelatorios from "@/components/demo/DemoRelatorios";
import DemoConfig from "@/components/demo/DemoConfig";
import DemoServicos from "@/components/demo/DemoServicos";
import DemoColaboradores from "@/components/demo/DemoColaboradores";
import DemoAgenda from "@/components/demo/DemoAgenda";
import DemoEmAtendimento from "@/components/demo/DemoEmAtendimento";

const pages: Record<string, React.ComponentType> = {
  dashboard: DemoDashboard,
  os: DemoOS,
  servicos: DemoServicos,
  colaboradores: DemoColaboradores,
  agenda: DemoAgenda,
  veiculos: DemoVeiculos,
  clientes: DemoClientes,
  atendimento: DemoEmAtendimento,
  financeiro: DemoFinanceiro,
  relatorios: DemoRelatorios,
  config: DemoConfig,
};

const Demo = () => {
  const [activeKey, setActiveKey] = useState("dashboard");
  const Page = pages[activeKey] || DemoDashboard;

  return (
    <DemoLayout activeKey={activeKey} onNavigate={setActiveKey}>
      <Page />
    </DemoLayout>
  );
};

export default Demo;
