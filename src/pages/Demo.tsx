import { useState } from "react";
import DemoLayout from "@/components/demo/DemoLayout";
import DemoOS from "@/components/demo/DemoOS";
import DemoServicos from "@/components/demo/DemoServicos";
import DemoColaboradores from "@/components/demo/DemoColaboradores";
import DemoAgenda from "@/components/demo/DemoAgenda";
import DemoVeiculos from "@/components/demo/DemoVeiculos";
import DemoEmAtendimento from "@/components/demo/DemoEmAtendimento";
import DemoFinanceiro from "@/components/demo/DemoFinanceiro";
import DemoRelatorios from "@/components/demo/DemoRelatorios";

const pages: Record<string, React.ComponentType> = {
  os: DemoOS,
  servicos: DemoServicos,
  colaboradores: DemoColaboradores,
  agenda: DemoAgenda,
  veiculos: DemoVeiculos,
  atendimento: DemoEmAtendimento,
  financeiro: DemoFinanceiro,
  relatorios: DemoRelatorios,
};

const Demo = () => {
  const [activeKey, setActiveKey] = useState("os");
  const Page = pages[activeKey] || DemoOS;

  return (
    <DemoLayout activeKey={activeKey} onNavigate={setActiveKey}>
      <Page />
    </DemoLayout>
  );
};

export default Demo;
