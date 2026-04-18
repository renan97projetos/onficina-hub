import { useState } from "react";
import DemoLayout from "@/components/demo/DemoLayout";
import DemoOS from "@/components/demo/DemoOS";
import DemoOrcamentos from "@/components/demo/DemoOrcamentos";
import DemoClientes from "@/components/demo/DemoClientes";
import DemoServicos from "@/components/demo/DemoServicos";
import DemoColaboradores from "@/components/demo/DemoColaboradores";
import DemoAgenda from "@/components/demo/DemoAgenda";
import DemoVeiculos from "@/components/demo/DemoVeiculos";
import DemoFinanceiro from "@/components/demo/DemoFinanceiro";
import DemoRelatorios from "@/components/demo/DemoRelatorios";
import DemoTreinamentos from "@/components/demo/DemoTreinamentos";
import DemoConfig from "@/components/demo/DemoConfig";
import DemoPatio from "@/components/demo/DemoPatio";
import OnboardingChecklist from "@/components/demo/OnboardingChecklist";

const pages: Record<string, React.ComponentType> = {
  os: DemoOS,
  orcamentos: DemoOrcamentos,
  clientes: DemoClientes,
  servicos: DemoServicos,
  colaboradores: DemoColaboradores,
  agenda: DemoAgenda,
  veiculos: DemoVeiculos,
  financeiro: DemoFinanceiro,
  relatorios: DemoRelatorios,
  treinamentos: DemoTreinamentos,
  config: DemoConfig,
  patio: DemoPatio,
};

const Admin = () => {
  const [activeKey, setActiveKey] = useState("os");
  const Page = pages[activeKey] || DemoOS;

  return (
    <DemoLayout activeKey={activeKey} onNavigate={setActiveKey}>
      <OnboardingChecklist onNavigate={setActiveKey} />
      {activeKey === "orcamentos" ? (
        <DemoOrcamentos onNavigate={setActiveKey} />
      ) : (
        <Page />
      )}
    </DemoLayout>
  );
};

export default Admin;
