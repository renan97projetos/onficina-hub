import { useState } from "react";
import DemoLayout from "@/components/demo/DemoLayout";
import DemoDashboard from "@/components/demo/DemoDashboard";
import DemoOS from "@/components/demo/DemoOS";
import DemoVeiculos from "@/components/demo/DemoVeiculos";
import DemoClientes from "@/components/demo/DemoClientes";
import DemoFinanceiro from "@/components/demo/DemoFinanceiro";
import DemoRelatorios from "@/components/demo/DemoRelatorios";
import DemoConfig from "@/components/demo/DemoConfig";

const pages: Record<string, React.ComponentType> = {
  dashboard: DemoDashboard,
  os: DemoOS,
  veiculos: DemoVeiculos,
  clientes: DemoClientes,
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
