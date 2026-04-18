interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-6",
  md: "h-7",
  lg: "h-10",
};

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const wheelSize = 100;
  const textX = wheelSize + 4;
  const fontSize = 92;
  const textY = 50;

  return (
    <svg
      viewBox="0 0 470 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${sizeMap[size]} w-auto block ${className}`}
      aria-label="ONficina"
      role="img"
      preserveAspectRatio="xMinYMid meet"
    >
      {/*
        PolitrizIcon — estilo SÓLIDO (filled), fiel à referência:
          1) Disco grande (o "O" da logo) — sólido com recorte interno
             que revela o pad de polimento dentro
          2) Corpo/base alongado em diagonal ↙ — sólido, formato cápsula
          3) Punho lateral perpendicular saindo do TOPO do corpo (perto do disco)
          4) Punho/empunhadura na PONTA inferior do corpo
          5) Duas listras vazadas (background) no corpo, perto do disco

        Eixo do corpo: 135° (↘ se invertido / ↙ no sentido do desenho)
        - Centro do "ombro" (perto do disco): (60, 40)
        - Centro da "base" (ponta inferior do corpo): (22, 78)
      */}
      <g
        className="text-primary"
        color="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* === 1) DISCO GRANDE (o "O") — usando fill-rule evenodd para criar o "buraco" do pad === */}
        {/* Anel sólido externo + abertura interna onde "aparece" o pad sendo polido */}
        <path
          fillRule="evenodd"
          fill="currentColor"
          stroke="none"
          d="
            M 50 8.5
            A 41.5 41.5 0 1 1 49.99 8.5
            Z
            M 50 22
            A 28 28 0 1 0 50.01 22
            Z
          "
        />
        {/* Aro interno traço fino (definição do pad de polimento) */}
        <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="3" />

        {/* === 2) CORPO/BASE da politriz — cápsula sólida em diagonal ↙ === */}
        {/* Eixo: do ombro (60,40) à base (22,78) — ângulo 135°
            Largura ~22 (cápsula uniforme), pontas arredondadas */}
        <path
          fill="currentColor"
          stroke="none"
          d="
            M 52.22 32.22
            A 11 11 0 0 1 67.78 47.78
            L 29.78 85.78
            A 11 11 0 0 1 14.22 70.22
            Z
          "
        />

        {/* === 3) PUNHO PERPENDICULAR no TOPO === */}
        {/* Sai do "ombro" do corpo (60,40) em direção ↖ (perpendicular ao eixo)
            Comprimento ~18, largura ~11
            Eixo do punho: dir = (-0.707,-0.707), perp = (0.707,-0.707)
            Centro base: (60,40); Centro ponta: (47.27, 27.27) */}
        <path
          fill="currentColor"
          stroke="none"
          d="
            M 63.89 36.11
            A 5.5 5.5 0 0 1 56.11 43.89
            L 43.39 31.16
            A 5.5 5.5 0 0 1 51.16 23.39
            Z
          "
        />
        {/* Pequeno colar/conexão entre punho e disco (detalhe da referência) */}
        <rect
          x="48"
          y="34"
          width="4"
          height="10"
          rx="1"
          fill="currentColor"
          stroke="none"
          transform="rotate(-45 50 39)"
        />

        {/* === 4) EMPUNHADURA NA PONTA INFERIOR (segundo "punho" arredondado) === */}
        {/* Pequeno círculo/cápsula sólida na extremidade da base, ↙ */}
        <circle cx="14" cy="86" r="8" fill="currentColor" stroke="none" />
        {/* Conexão visual entre base e empunhadura */}
        <path
          fill="currentColor"
          stroke="none"
          d="
            M 18.5 78.5
            L 24.5 84.5
            L 18.5 90.5
            L 12.5 84.5
            Z
          "
        />

        {/* === 5) LISTRAS VAZADAS no corpo (perto do disco) === */}
        {/* Duas linhas curtas em background (parecem "cortar" o sólido) */}
        <line
          x1="52"
          y1="44"
          x2="44"
          y2="52"
          stroke="hsl(var(--background))"
          strokeWidth="3"
        />
        <line
          x1="58"
          y1="50"
          x2="50"
          y2="58"
          stroke="hsl(var(--background))"
          strokeWidth="3"
        />
      </g>

      {/* Texto: "N" primary + "ficina" foreground */}
      <text
        x={textX}
        y={textY}
        dominantBaseline="central"
        textAnchor="start"
        fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif"
        fontWeight="800"
        fontSize={fontSize}
        letterSpacing="-3"
      >
        <tspan className="fill-primary">N</tspan>
        <tspan className="fill-foreground">ficina</tspan>
      </text>
    </svg>
  );
};

export default Logo;
