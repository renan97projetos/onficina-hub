const WHATSAPP_SUPORTE = "5527992373501";
const MENSAGEM = "Olá, tenho interesse no ONficina";

const WhatsAppFloat = () => {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_SUPORTE}?text=${encodeURIComponent(MENSAGEM)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o suporte no WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg shadow-black/40 transition-transform duration-200 hover:scale-110"
    >
      {/* Tooltip */}
      <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-[#1a1a1a] px-3 py-1.5 text-xs font-medium text-foreground opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
        Falar com o suporte
      </span>

      {/* Ícone WhatsApp */}
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7 fill-white"
        aria-hidden="true"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.478-1.318.13-.31.227-.605.27-.93.013-.16.016-.323.016-.487 0-.16-.06-.32-.21-.41-.16-.115-.385-.187-.557-.272-.342-.187-.66-.4-.99-.587a.69.69 0 0 0-.27-.114m-3.024-13.74C8.24 3.464 1.97 9.75 2.012 17.495c0 2.535.674 5.025 1.965 7.205L2 31.844c-.058.234-.058.487 0 .72.087.317.342.587.66.687.142.043.298.058.444.058.087 0 .175-.014.262-.029l7.51-1.962a16.157 16.157 0 0 0 7.21 1.68c8.567 0 15.512-6.945 15.512-15.512S22.654 1.984 16.087 1.984m9.674 25.137a13.46 13.46 0 0 1-9.585 3.97c-2.336 0-4.628-.6-6.66-1.745a.992.992 0 0 0-.488-.13c-.087 0-.175.014-.247.043l-5.628 1.476 1.504-5.518a1.018 1.018 0 0 0-.1-.745A13.475 13.475 0 0 1 2.7 17.508a13.49 13.49 0 0 1 13.474-13.5c3.61 0 7.005 1.404 9.557 3.97a13.477 13.477 0 0 1 3.97 9.557c0 3.61-1.405 7.005-3.97 9.586" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
