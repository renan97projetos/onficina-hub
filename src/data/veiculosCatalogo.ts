/**
 * Catálogo de veículos do mercado brasileiro.
 *
 * Para atualizar a lista, edite os objetos abaixo.
 * Estrutura: { tipo → { marca → modelos[] } }
 *
 * Tipos suportados (TipoVeiculo):
 * - carro_passeio
 * - moto
 * - caminhao
 * - caminhonete
 * - picape
 * - suv
 * - van
 * - onibus
 * - outro
 */

export type TipoVeiculo =
  | "carro_passeio"
  | "moto"
  | "caminhao"
  | "caminhonete"
  | "picape"
  | "suv"
  | "van"
  | "onibus"
  | "outro";

export const TIPO_VEICULO_LABELS: Record<TipoVeiculo, string> = {
  carro_passeio: "Carro de passeio",
  moto: "Moto",
  caminhao: "Caminhão",
  caminhonete: "Caminhonete",
  picape: "Picape",
  suv: "SUV",
  van: "Van",
  onibus: "Ônibus",
  outro: "Outro",
};

export const TIPOS_VEICULO_ORDER: TipoVeiculo[] = [
  "carro_passeio",
  "moto",
  "caminhao",
  "caminhonete",
  "picape",
  "suv",
  "van",
  "onibus",
  "outro",
];

type CatalogoMap = Record<string, string[]>; // marca -> modelos

// =====================================================================
// CARRO DE PASSEIO
// =====================================================================
const CARRO_PASSEIO: CatalogoMap = {
  Audi: ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q3", "Q5", "Q7", "Q8", "RS3", "RS5", "RS6", "S3", "TT"],
  BMW: ["Série 1", "Série 2", "Série 3", "Série 4", "Série 5", "Série 7", "M2", "M3", "M4", "M5", "Z4"],
  BYD: ["Dolphin", "Dolphin Mini", "Han", "King", "Seal", "Song Plus", "Yuan Plus"],
  Caoa: ["Cherry Arrizo 5", "Cherry Arrizo 6", "Cherry QQ", "Cherry Tiggo 2", "Cherry Tiggo 3X", "Cherry Tiggo 5X"],
  Chery: ["Arrizo 5", "Arrizo 6", "Celer", "QQ", "Tiggo 2", "Tiggo 3X", "Tiggo 5X", "Tiggo 7", "Tiggo 8"],
  Chevrolet: [
    "Astra", "Camaro", "Celta", "Classic", "Cobalt", "Cruze", "Cruze Sport6", "Joy", "Joy Plus",
    "Monza", "Onix", "Onix Plus", "Prisma", "Sonic", "Spin", "Vectra", "Cobalt", "Bolt EV",
  ],
  Citroen: ["Aircross", "C3", "C3 Picasso", "C4", "C4 Cactus", "C4 Lounge", "C4 Pallas", "C5", "DS3"],
  Dodge: ["Charger", "Challenger", "Dart", "Journey", "Stratus"],
  Fiat: [
    "147", "500", "Argo", "Brava", "Bravo", "Cronos", "Doblò", "Elba", "Grand Siena", "Idea",
    "Linea", "Marea", "Mille", "Mobi", "Palio", "Pulse", "Punto", "Siena", "Stilo", "Tempra", "Uno",
  ],
  Ford: ["Belina", "Corcel", "Del Rey", "EcoSport", "Edge", "Escort", "Ka", "Ka Sedan", "Fiesta", "Focus", "Fusion", "Mondeo", "New Fiesta", "Verona"],
  GWM: ["Haval H6", "Ora 03", "Ora Cat", "Wey 03"],
  Honda: ["Accord", "City", "Civic", "Fit", "WR-V"],
  Hyundai: ["Azera", "Elantra", "HB20", "HB20S", "HB20X", "i30", "i30 CW", "Sonata", "Veloster"],
  Jaguar: ["E-Pace", "F-Pace", "F-Type", "I-Pace", "XE", "XF", "XJ"],
  Jeep: ["Grand Cherokee", "Cherokee"],
  Kia: ["Bongo", "Carens", "Carnival", "Cerato", "Picanto", "Rio", "Sephia", "Soul", "Stinger"],
  "Land Rover": ["Defender", "Range Rover Evoque", "Range Rover Velar"],
  Lexus: ["ES", "GS", "IS", "LS", "RC"],
  Lifan: ["320", "530", "620", "X60"],
  Maserati: ["Ghibli", "Quattroporte"],
  "Mercedes-Benz": ["Classe A", "Classe B", "Classe C", "Classe CLA", "Classe E", "Classe S", "AMG GT"],
  Mini: ["Cooper", "Cooper Cabrio", "Cooper Clubman", "Cooper S", "Countryman"],
  Mitsubishi: ["Eclipse", "Galant", "Lancer"],
  Nissan: ["March", "Sentra", "Tiida", "Versa", "Livina", "Kicks", "Leaf"],
  Peugeot: ["106", "206", "207", "208", "2008", "3008", "307", "308", "408", "508"],
  Porsche: ["911", "Boxster", "Cayman", "Panamera", "Taycan"],
  Renault: ["Clio", "Fluence", "Kwid", "Logan", "Megane", "Sandero", "Scala", "Stepway", "Symbol"],
  Suzuki: ["Baleno", "Celerio", "Swift", "SX4"],
  Toyota: ["Camry", "Corolla", "Corolla Cross", "Etios", "Etios Sedan", "Prius", "Yaris", "Yaris Sedan"],
  Volkswagen: [
    "Bora", "Brasília", "Fox", "Fusca", "Gol", "Golf", "Jetta", "Kombi", "Logus", "Nivus",
    "Parati", "Passat", "Pointer", "Polo", "Polo Sedan", "Quantum", "Santana", "Saveiro", "Senda",
    "T-Cross", "Tiguan", "Up", "Variant", "Virtus", "Voyage",
  ],
  Volvo: ["C30", "S60", "S90", "V40", "V60"],
};

// =====================================================================
// MOTO
// =====================================================================
const MOTO: CatalogoMap = {
  BMW: [
    "C 400", "C 650", "F 750 GS", "F 800 GS", "F 850 GS", "F 900 R", "F 900 XR",
    "G 310 GS", "G 310 R", "K 1600", "R 1250 GS", "R 1250 R", "R 1250 RT", "R nineT",
    "S 1000 R", "S 1000 RR", "S 1000 XR",
  ],
  Dafra: ["Apache", "Citycom 300i", "Maxsym 400", "Next 250", "Next 300", "Riva 150", "Roadwin 250R"],
  Ducati: ["Diavel", "Monster", "Multistrada V2", "Multistrada V4", "Panigale V2", "Panigale V4", "Scrambler", "Streetfighter V4"],
  Harley: ["883 Iron", "Fat Boy", "Heritage Classic", "Pan America", "Road Glide", "Road King", "Sportster S", "Street Bob", "Street Glide"],
  Honda: [
    "ADV 150", "Africa Twin", "Biz 110i", "Biz 125", "BROS 160", "CB 125", "CB 150", "CB 250 Twister",
    "CB 300F Twister", "CB 500F", "CB 500X", "CB 650R", "CB 1000R", "CBR 250R", "CBR 500R", "CBR 600RR",
    "CBR 650R", "CBR 1000RR", "CG 125", "CG 150", "CG 160 Cargo", "CG 160 Fan", "CG 160 Start",
    "CG 160 Titan", "CG Today", "Elite 125", "Lead 110", "NC 750X", "NXR Bros 160", "PCX",
    "Pop 100", "Pop 110i", "Sahara 300", "Shadow 750", "XRE 190", "XRE 300", "XRE 300 Sahara",
  ],
  Kasinski: ["CRZ 150", "Comet 150", "Comet 250", "Mirage 150", "Mirage 250"],
  Kawasaki: [
    "Concours", "ER-6n", "Ninja 300", "Ninja 400", "Ninja 650", "Ninja ZX-6R", "Ninja ZX-10R",
    "Ninja H2", "Versys 300", "Versys 650", "Versys 1000", "Vulcan S", "Z400", "Z650", "Z900", "Z H2",
  ],
  KTM: ["390 Adventure", "390 Duke", "790 Duke", "890 Adventure", "1290 Super Adventure", "1290 Super Duke"],
  Royal: ["Classic 350", "Continental GT 650", "Hunter 350", "Interceptor 650", "Meteor 350"],
  Shineray: ["Discover 200", "Jet 50", "Phoenix 50", "XY 50Q"],
  Suzuki: [
    "Bandit 1250", "Boulevard M800", "Burgman 125", "DL 1000 V-Strom", "DR 650", "GSX-R750",
    "GSX-R1000", "GSX-S750", "GSX-S1000", "Hayabusa", "Intruder 125", "V-Strom 650", "V-Strom 1000", "Yes 125",
  ],
  Triumph: ["Bonneville T100", "Bonneville T120", "Daytona", "Rocket 3", "Speed Triple", "Street Triple", "Tiger 800", "Tiger 900", "Tiger 1200"],
  Yamaha: [
    "Crosser 150", "Factor 125", "Factor 150", "Fazer 150", "Fazer 250", "FZ25", "Lander 250",
    "MT-03", "MT-07", "MT-09", "MT-10", "Neo 125", "NMax 160", "R3", "R6", "R1",
    "Tenere 250", "Tenere 700", "Tracer 900", "XJ6", "XT 660", "XTZ 150", "YBR 125", "YS 250 Fazer",
  ],
};

// =====================================================================
// CAMINHÃO
// =====================================================================
const CAMINHAO: CatalogoMap = {
  DAF: ["XF 105", "XF 480", "XF 530", "CF 85", "CF 410"],
  Ford: ["Cargo 815", "Cargo 1119", "Cargo 1319", "Cargo 1419", "Cargo 1719", "Cargo 1723", "Cargo 1933", "Cargo 2429", "Cargo 2629", "Cargo 2842"],
  Iveco: ["Daily 35", "Daily 55", "Daily 70", "Stralis 460", "Stralis 480", "Stralis 530", "Tector 170E22", "Tector 240E25", "Tector 260E25"],
  MAN: ["TGX 28.440", "TGX 29.440", "TGX 33.440"],
  "Mercedes-Benz": [
    "Accelo 815", "Accelo 1016", "Atego 1419", "Atego 1719", "Atego 2426", "Atego 2729",
    "Axor 2540", "Axor 2544", "Axor 3344", "Atron 1635", "Atron 2729",
    "Actros 2546", "Actros 2651", "Actros 4844",
  ],
  Scania: ["G 360", "G 380", "G 410", "G 440", "G 480", "P 310", "P 360", "R 440", "R 450", "R 480", "R 540", "S 540", "S 660"],
  Volkswagen: [
    "Constellation 17.190", "Constellation 19.320", "Constellation 24.280",
    "Constellation 25.420", "Constellation 26.260", "Constellation 31.330",
    "Delivery 6.160", "Delivery 8.160", "Delivery 9.170", "Delivery 11.180",
    "Meteor 28.460", "Meteor 29.520", "Worker 8.160", "Worker 13.190", "Worker 17.230",
  ],
  Volvo: ["FH 460", "FH 500", "FH 540", "FH 16 750", "FM 380", "FM 420", "FM 460", "FM 500", "VM 220", "VM 270"],
};

// =====================================================================
// CAMINHONETE (utilitários médios/leves)
// =====================================================================
const CAMINHONETE: CatalogoMap = {
  Chevrolet: ["D-20", "Montana", "S10 Cabine Simples"],
  Fiat: ["Fiorino", "Strada", "Strada Adventure", "Strada Working", "Toro"],
  Ford: ["Courier", "F-1000", "F-4000"],
  Renault: ["Oroch"],
  Volkswagen: ["Saveiro", "Saveiro Cross", "Saveiro Robust"],
};

// =====================================================================
// PICAPE (médias e grandes)
// =====================================================================
const PICAPE: CatalogoMap = {
  Chevrolet: ["S10", "S10 High Country", "S10 Z71", "Silverado"],
  Dodge: ["Dakota", "Ram 1500", "Ram 2500", "Ram 3500"],
  Fiat: ["Toro", "Toro Volcano"],
  Ford: ["F-150", "F-250", "Maverick", "Ranger", "Ranger Raptor"],
  GWM: ["Poer", "Poer P30"],
  Mitsubishi: ["L200 Triton", "L200 Triton Sport"],
  Nissan: ["Frontier"],
  Toyota: ["Hilux", "Hilux SRX"],
  Volkswagen: ["Amarok", "Amarok V6"],
};

// =====================================================================
// SUV
// =====================================================================
const SUV: CatalogoMap = {
  Audi: ["Q3", "Q5", "Q7", "Q8", "e-tron"],
  BMW: ["X1", "X2", "X3", "X4", "X5", "X6", "X7", "iX"],
  BYD: ["Song Plus", "Song Pro", "Tan", "Yuan Plus"],
  Caoa: ["Tiggo 5X", "Tiggo 7", "Tiggo 8"],
  Chery: ["Tiggo 2", "Tiggo 3X", "Tiggo 5X", "Tiggo 7", "Tiggo 8"],
  Chevrolet: ["Captiva", "Equinox", "Tracker", "Trailblazer", "TrailBlazer LTZ"],
  Citroen: ["Aircross", "C4 Cactus", "C5 Aircross"],
  Fiat: ["Fastback", "Pulse"],
  Ford: ["Bronco Sport", "EcoSport", "Edge", "Territory"],
  GWM: ["Haval H6", "Haval H9"],
  Honda: ["CR-V", "HR-V", "WR-V", "ZR-V"],
  Hyundai: ["Creta", "Ioniq 5", "Kona", "Santa Fe", "Tucson"],
  Jaguar: ["E-Pace", "F-Pace", "I-Pace"],
  Jeep: ["Cherokee", "Commander", "Compass", "Grand Cherokee", "Renegade", "Wrangler"],
  Kia: ["EV6", "Mohave", "Niro", "Seltos", "Sorento", "Sportage"],
  "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Evoque", "Range Rover Sport", "Range Rover Velar"],
  Lexus: ["NX", "RX", "UX"],
  Mahindra: ["XUV300", "XUV700"],
  "Mercedes-Benz": ["GLA", "GLB", "GLC", "GLE", "GLS", "EQB", "EQC"],
  Mitsubishi: ["ASX", "Eclipse Cross", "Outlander", "Pajero Dakar", "Pajero Full", "Pajero Sport", "Pajero TR4"],
  Nissan: ["Kicks", "Murano", "X-Trail"],
  Peugeot: ["2008", "3008", "5008"],
  Porsche: ["Cayenne", "Macan"],
  Renault: ["Captur", "Duster", "Koleos"],
  Suzuki: ["Grand Vitara", "Jimny", "Jimny Sierra", "Vitara"],
  Toyota: ["Corolla Cross", "Land Cruiser", "RAV4", "SW4"],
  Volkswagen: ["Nivus", "T-Cross", "Taos", "Tiguan", "Touareg"],
  Volvo: ["XC40", "XC60", "XC90"],
};

// =====================================================================
// VAN (utilitários grandes / passageiros e carga)
// =====================================================================
const VAN: CatalogoMap = {
  Citroen: ["Berlingo", "Jumper", "Jumpy"],
  Fiat: ["Doblò Cargo", "Ducato", "Fiorino Furgão", "Scudo", "Talento"],
  Ford: ["Transit"],
  Hyundai: ["H100", "HR"],
  Iveco: ["Daily", "Daily Furgão", "Daily Minibus"],
  Kia: ["Bongo K2500"],
  "Mercedes-Benz": ["Sprinter 311", "Sprinter 313", "Sprinter 415", "Sprinter 515", "Sprinter Furgão", "Vito"],
  Peugeot: ["Boxer", "Expert", "Partner"],
  Renault: ["Kangoo", "Master", "Trafic"],
  Volkswagen: ["Crafter", "Kombi", "Transporter"],
};

// =====================================================================
// ÔNIBUS
// =====================================================================
const ONIBUS: CatalogoMap = {
  Agrale: ["MA 9.2", "MA 12.0", "MA 15.0", "MA 17.0"],
  Ford: ["B-1621", "B-1721"],
  Iveco: ["CityClass", "Daily Minibus", "GranWay"],
  MAN: ["15.190", "15.210"],
  "Mercedes-Benz": ["LO-916", "OF-1519", "OF-1721", "OF-1724", "OH-1218", "OH-1623", "OH-1721", "OH-1724", "O-500"],
  Scania: ["K 270", "K 310", "K 360", "K 410", "K 440", "F 250", "F 310"],
  Volkswagen: ["8.160 OD", "9.160 OD", "15.190 EOD", "17.230 EOD", "18.280 EOT"],
  Volvo: ["B 270 F", "B 290 R", "B 340 R", "B 380 R", "B 420 R", "B 450 R"],
};

const CATALOGO: Record<TipoVeiculo, CatalogoMap> = {
  carro_passeio: CARRO_PASSEIO,
  moto: MOTO,
  caminhao: CAMINHAO,
  caminhonete: CAMINHONETE,
  picape: PICAPE,
  suv: SUV,
  van: VAN,
  onibus: ONIBUS,
  outro: {},
};

export function getMarcasPorTipo(tipo: TipoVeiculo): string[] {
  return Object.keys(CATALOGO[tipo] || {}).sort((a, b) =>
    a.localeCompare(b, "pt-BR", { sensitivity: "base" }),
  );
}

export function getModelosPorMarca(tipo: TipoVeiculo, marca: string): string[] {
  const map = CATALOGO[tipo];
  if (!map) return [];
  // case-insensitive lookup
  const matchKey = Object.keys(map).find(
    (k) => k.toLowerCase() === marca.toLowerCase(),
  );
  return matchKey ? [...map[matchKey]].sort((a, b) => a.localeCompare(b, "pt-BR")) : [];
}

export function getTipoLabel(tipo: string | null | undefined): string {
  if (!tipo) return "";
  return TIPO_VEICULO_LABELS[tipo as TipoVeiculo] || tipo;
}
