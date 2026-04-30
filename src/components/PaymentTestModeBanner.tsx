const clientToken = import.meta.env.VITE_PAYMENTS_CLIENT_TOKEN;

export function PaymentTestModeBanner() {
  if (!clientToken?.startsWith("pk_test_")) return null;

  return (
    <div className="w-full border-b border-warning/30 bg-warning/10 px-4 py-2 text-center text-xs text-warning">
      Modo de teste — nenhum pagamento real será cobrado.{" "}
      <a
        href="https://docs.lovable.dev/features/payments#test-and-live-environments"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium underline"
      >
        Saiba mais
      </a>
    </div>
  );
}
