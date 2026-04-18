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
        PolitrizIcon — fiel à referência, line-icon:
          1) Disco grande (o "O" da logo)
          2) Corpo/base alongado em diagonal ↙ — gordo perto do disco, fino na ponta
          3) Punho lateral perpendicular — saindo do lado esquerdo do corpo, perto do disco
          4) Listras de ventilação — dentro do corpo, perto do disco

        Eixo do corpo: ângulo 135° (de cima-direita para baixo-esquerda)
        - Centro do "ombro" do corpo (perto do disco): (60, 40)
        - Centro da ponta inferior do corpo: (15, 85)
        - Largura do corpo no ombro: ~22; na ponta: ~14
      */}
      <g
        className="text-primary"
        color="currentColor"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* 1) Disco — o "O" */}
        <circle cx="50" cy="50" r="41.5" strokeWidth="10" />

        {/*
          2) Corpo da politriz (forma de "boliche" alongado, atravessando o disco)
          Construído como contorno fechado, simétrico ao eixo 135°.
          Cápsula com leve estreitamento (gordo no ombro, fino na ponta).
          Coordenadas calculadas no eixo (u = ao longo, v = perpendicular).
          Eixo: dir = (cos135°, sin135°) = (-0.707, 0.707)
                perp = (-0.707, -0.707)
          Ombro centro: (60, 40), largura 22 → extremos:
            S1 = (60 + 11*-0.707, 40 + 11*-0.707) = (52.22, 32.22)
            S2 = (60 - 11*-0.707, 40 - 11*-0.707) = (67.78, 47.78)
          Meio centro: (37.5, 62.5), largura 19 → extremos:
            M1 = (37.5 + 9.5*-0.707, 62.5 + 9.5*-0.707) = (30.78, 55.78)
            M2 = (37.5 - 9.5*-0.707, 62.5 - 9.5*-0.707) = (44.22, 69.22)
          Ponta centro: (15, 85), largura 14 → extremos:
            P1 = (15 + 7*-0.707, 85 + 7*-0.707) = (10.05, 80.05)
            P2 = (15 - 7*-0.707, 85 - 7*-0.707) = (19.95, 89.95)
          Ponta arredondada via arco de raio 7.
        */}
        <path
          d="
            M 52.22 32.22
            L 30.78 55.78
            L 10.05 80.05
            A 7 7 0 0 0 19.95 89.95
            L 44.22 69.22
            L 67.78 47.78
            A 11 11 0 0 0 52.22 32.22
            Z
          "
          fill="hsl(var(--background))"
          strokeWidth="6"
        />

        {/*
          3) Punho lateral perpendicular — sai do lado esquerdo do "ombro" do corpo
          Eixo do punho: perpendicular ao corpo → dir perp = (-0.707, -0.707) — ↖
          Base do punho conectada ao corpo em ≈ (45, 47)
          Ponta do punho em ≈ (28, 30) — para ↖
          Largura do punho: ~10
          Construído como cápsula com ponta arredondada.
          Coordenadas:
            Base centro: (45, 47), perp ao punho = (0.707, -0.707) → largura 5:
              B1 = (45 + 5*0.707, 47 + 5*-0.707) = (48.54, 43.46)
              B2 = (45 - 5*0.707, 47 - 5*-0.707) = (41.46, 50.54)
            Ponta centro: (28, 30), extremos:
              T1 = (28 + 5*0.707, 30 + 5*-0.707) = (31.54, 26.46)
              T2 = (28 - 5*0.707, 30 - 5*-0.707) = (24.46, 33.54)
        */}
        <path
          d="
            M 48.54 43.46
            L 31.54 26.46
            A 5 5 0 0 0 24.46 33.54
            L 41.46 50.54
            Z
          "
          fill="hsl(var(--background))"
          strokeWidth="6"
        />

        {/*
          4) Listras de ventilação — duas linhas curtas dentro do corpo, perto do disco
          Posicionadas no centro do corpo, alinhadas ao eixo (135°).
          Centro entre o ombro e o meio: ≈ (50, 50) — mas dentro do corpo visível
          Listra 1: de (52, 48) a (44, 56)  (ao longo do eixo)
          Listra 2: de (56, 52) a (48, 60)
        */}
        <line x1="52" y1="48" x2="44" y2="56" strokeWidth="3" />
        <line x1="56" y1="52" x2="48" y2="60" strokeWidth="3" />
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
