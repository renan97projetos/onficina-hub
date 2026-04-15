const DemoConfig = () => (
  <>
    <h2 className="mb-6 text-sm font-bold uppercase tracking-wide">Configurações</h2>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Workshop data */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium">Dados da oficina</h3>
        <div className="space-y-3">
          {[
            { label: "Nome", value: "Demo Oficina" },
            { label: "CNPJ", value: "12.345.678/0001-90" },
            { label: "Endereço", value: "Rua das Oficinas, 123 — São Paulo" },
            { label: "Telefone", value: "(11) 3456-7890" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
              <input defaultValue={f.value} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium">Meu perfil</h3>
        <div className="space-y-3">
          {[
            { label: "Nome", value: "Demo Master" },
            { label: "E-mail", value: "admin@demo.com" },
          ].map((f) => (
            <div key={f.label}>
              <label className="block text-xs text-muted-foreground mb-1">{f.label}</label>
              <input defaultValue={f.value} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          ))}
        </div>
      </div>

      {/* Subscription */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium">Assinatura</h3>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-primary">Plano Pro</p>
            <p className="text-xs text-muted-foreground">Trial — 12 dias restantes</p>
          </div>
        </div>
        <button className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
          Escolher plano
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium">Notificações</h3>
        <div className="space-y-3">
          {[
            { label: "Nova OS criada", on: true },
            { label: "Orçamento aprovado", on: true },
            { label: "OS concluída", on: true },
            { label: "Pagamento recebido", on: false },
          ].map((n) => (
            <label key={n.label} className="flex items-center justify-between">
              <span className="text-sm">{n.label}</span>
              <div className={`h-5 w-9 rounded-full ${n.on ? "bg-primary" : "bg-white/10"} relative cursor-pointer`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${n.on ? "left-[18px]" : "left-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default DemoConfig;
