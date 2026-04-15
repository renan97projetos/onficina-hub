import { Building2, User, Bell, Palette, Shield, CreditCard } from "lucide-react";

const DemoConfig = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Configurações</h1>
      <p className="text-sm text-muted-foreground">Gerencie sua oficina e preferências</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Dados da oficina */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Dados da Oficina</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nome", value: "Demo Oficina" },
            { label: "CNPJ", value: "12.345.678/0001-90" },
            { label: "Endereço", value: "Rua das Oficinas, 123 — São Paulo, SP" },
            { label: "Telefone", value: "(11) 3456-7890" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</label>
              <input
                defaultValue={f.value}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Perfil */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <User className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Meu Perfil</h3>
        </div>
        <div className="mb-4 flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">DM</div>
          <div>
            <p className="font-semibold">Demo Master</p>
            <p className="text-sm text-muted-foreground">admin@demo.com</p>
          </div>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nome", value: "Demo Master" },
            { label: "E-mail", value: "admin@demo.com" },
            { label: "Cargo", value: "Administrador" },
          ].map((f) => (
            <div key={f.label}>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{f.label}</label>
              <input
                defaultValue={f.value}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notificações */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <Bell className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Notificações</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: "Nova OS criada", checked: true },
            { label: "Orçamento aprovado pelo cliente", checked: true },
            { label: "OS concluída", checked: true },
            { label: "Pagamento recebido", checked: false },
            { label: "Lembrete de entrega", checked: true },
          ].map((n) => (
            <label key={n.label} className="flex items-center justify-between">
              <span className="text-sm">{n.label}</span>
              <div className={`h-5 w-9 rounded-full transition-colors ${n.checked ? "bg-primary" : "bg-white/10"} relative cursor-pointer`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${n.checked ? "left-[18px]" : "left-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Assinatura */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-4 flex items-center gap-3">
          <CreditCard className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Assinatura</h3>
        </div>
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-primary">Plano Profissional</p>
              <p className="text-xs text-muted-foreground">Trial gratuito — 12 dias restantes</p>
            </div>
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Trial</span>
          </div>
        </div>
        <button className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
          Escolher plano
        </button>
      </div>
    </div>
  </>
);

export default DemoConfig;
