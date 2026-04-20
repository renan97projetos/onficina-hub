/**
 * Catálogo de veículos do mercado brasileiro.
 *
 * Estrutura: { tipo → { marca → { modelo: versoes[] } } }
 *
 * Para atualizar, basta editar os objetos abaixo.
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

// modelo -> versões conhecidas (pode ser [] = sem sugestões pré-cadastradas)
type ModeloMap = Record<string, string[]>;
type CatalogoMap = Record<string, ModeloMap>; // marca -> modelos -> versões

// =====================================================================
// CARRO DE PASSEIO
// =====================================================================
const CARRO_PASSEIO: CatalogoMap = {
  Audi: {
    A1: ["Sportback", "Sportback Attraction", "Sportback Ambition"],
    A3: ["Sedan", "Sportback", "Cabriolet", "1.4 TFSI", "2.0 TFSI", "Performance"],
    A4: ["Sedan", "Avant", "Allroad", "1.8 TFSI", "2.0 TFSI", "Ambiente", "Attraction", "Performance"],
    A5: ["Coupé", "Sportback", "Cabriolet", "Ambition", "Performance"],
    A6: ["Sedan", "Avant", "Allroad", "Ambiente", "Performance"],
    A7: ["Sportback", "Performance"],
    A8: ["L", "Security"],
    Q3: ["Ambiente", "Ambition", "Performance", "Black"],
    Q5: ["Ambiente", "Ambition", "Performance", "Black"],
    Q7: ["Ambiente", "Performance", "Black"],
    Q8: ["Performance", "Black"],
    RS3: ["Sedan", "Sportback"],
    RS5: ["Coupé", "Sportback"],
    RS6: ["Avant Performance"],
    S3: ["Sedan", "Sportback"],
    TT: ["Coupé", "Roadster", "TTS", "TT RS"],
    "e-tron": ["Performance", "Sportback"],
  },
  BMW: {
    "Série 1": ["116i", "118i", "120i", "M135i", "Active Edition", "Sport"],
    "Série 2": ["220i", "228i", "230i", "M240i", "Active Tourer", "Gran Coupé"],
    "Série 3": ["316i", "318i", "320i", "328i", "330i", "330e", "M Sport", "GT"],
    "Série 4": ["420i", "428i", "430i", "M Sport", "Cabrio", "Gran Coupé"],
    "Série 5": ["520i", "528i", "530i", "530e", "540i", "M Sport"],
    "Série 7": ["730i", "740i", "745e", "750i", "M Sport"],
    M2: ["Coupé", "Competition"],
    M3: ["Sedan", "Competition", "CS"],
    M4: ["Coupé", "Cabrio", "Competition", "CS"],
    M5: ["Sedan", "Competition"],
    Z4: ["sDrive20i", "sDrive30i", "M40i"],
  },
  BYD: {
    Dolphin: ["GL", "GS", "Plus"],
    "Dolphin Mini": ["GL", "GS"],
    Han: ["EV", "DM-i"],
    King: ["GL", "GS", "DM-i"],
    Seal: ["AWD", "RWD", "Performance"],
    "Song Plus": ["EV", "DM-i", "Premium"],
    "Yuan Plus": ["GL", "GS", "Premium"],
  },
  Caoa: {
    "Cherry Arrizo 5": ["RX", "RXT", "Pro"],
    "Cherry Arrizo 6": ["GSX", "Pro"],
    "Cherry QQ": ["Look", "Mais"],
    "Cherry Tiggo 2": ["Look", "Comfort", "Act"],
    "Cherry Tiggo 3X": ["Look", "Comfort", "Plus"],
    "Cherry Tiggo 5X": ["Look", "Comfort", "Pro"],
  },
  Chery: {
    "Arrizo 5": ["RX", "RXT", "Pro"],
    "Arrizo 6": ["GSX", "Pro"],
    Celer: ["Sedan", "Hatch"],
    QQ: ["Look", "Mais"],
    "Tiggo 2": ["Look", "Comfort", "Act"],
    "Tiggo 3X": ["Look", "Comfort", "Plus"],
    "Tiggo 5X": ["Look", "Comfort", "Pro", "Plus"],
    "Tiggo 7": ["Pro", "Pro Max"],
    "Tiggo 8": ["Pro", "Pro Max", "Pro Plus"],
  },
  Chevrolet: {
    Astra: ["GL", "GLS", "Advantage", "Elegance", "Comfort", "Sedan", "Hatch"],
    Camaro: ["SS", "RS", "ZL1", "Conversível"],
    Celta: ["Life", "Spirit", "LT", "Super", "Energy", "1.0", "1.4"],
    Classic: ["Life", "LS", "Spirit", "1.0", "1.6"],
    Cobalt: ["LT", "LTZ", "Elite", "Advantage", "1.4", "1.8"],
    Cruze: ["LT", "LTZ", "Sport6", "Premier", "Sedan", "Hatch", "1.4 Turbo", "1.8"],
    "Cruze Sport6": ["LT", "LTZ", "Premier"],
    Joy: ["Sedan", "Hatch", "1.0", "Black"],
    "Joy Plus": ["Sedan", "Hatch", "Black"],
    Monza: ["GL", "GLS", "SL/E", "Classic", "500 EF"],
    Onix: ["LT", "LTZ", "Premier", "Joy", "Activ", "1.0", "1.4", "1.0 Turbo", "RS"],
    "Onix Plus": ["LT", "LTZ", "Premier", "Joy", "1.0 Turbo"],
    Prisma: ["LT", "LTZ", "Advantage", "Joy", "1.0", "1.4"],
    Sonic: ["LT", "LTZ", "Sedan", "Hatch"],
    Spin: ["LS", "LT", "LTZ", "Activ", "Premier", "1.8"],
    Vectra: ["GL", "GLS", "CD", "Elegance", "Expression", "Elite", "GT"],
    "Bolt EV": ["Premier"],
  },
  Citroen: {
    Aircross: ["GL", "GLX", "Tendance", "Exclusive", "Live", "Feel", "Shine"],
    C3: ["GL", "GLX", "Exclusive", "Tendance", "Picasso", "Live", "Feel", "Shine", "1.0", "1.4", "1.5", "1.6"],
    "C3 Picasso": ["GL", "GLX", "Exclusive", "Tendance"],
    C4: ["GLX", "Exclusive", "Tendance", "VTR", "Pallas", "Lounge", "Cactus", "Hatch", "Sedan"],
    "C4 Cactus": ["Live", "Feel", "Feel Pack", "Shine", "Shine Pack"],
    "C4 Lounge": ["Origine", "Tendance", "Exclusive", "THP", "Flex"],
    "C4 Pallas": ["GLX", "Exclusive"],
    C5: ["Exclusive", "Tourer"],
    "C5 Aircross": ["Feel", "Shine"],
    DS3: ["Cabrio", "Sport Chic"],
  },
  Dodge: {
    Charger: ["SXT", "R/T", "SRT Hellcat"],
    Challenger: ["SXT", "R/T", "SRT Hellcat"],
    Dart: ["SE", "SXT", "Limited"],
    Journey: ["SE", "SXT", "RT"],
    Stratus: ["SE", "RT"],
  },
  Fiat: {
    "147": ["L", "C", "CL", "Spazio", "Pickup"],
    "500": ["Cult", "Sport", "Lounge", "Cabrio", "Abarth"],
    Argo: ["Drive", "Trekking", "Precision", "HGT", "S-Design", "1.0", "1.3", "1.8"],
    Brava: ["SX", "ELX", "HGT"],
    Bravo: ["Essence", "Sporting", "Absolute", "Wolverine"],
    Cronos: ["Drive", "Precision", "S-Design", "1.3", "1.8"],
    Doblò: ["ELX", "Essence", "Adventure", "Cargo", "1.4", "1.8"],
    Elba: ["CS", "CSL", "Weekend"],
    "Grand Siena": ["Attractive", "Essence", "Tetrafuel", "1.0", "1.4", "1.6"],
    Idea: ["ELX", "Essence", "Sporting", "Adventure", "Attractive"],
    Linea: ["LX", "HLX", "Essence", "Absolute", "T-Jet"],
    Marea: ["SX", "ELX", "HLX", "Weekend"],
    Mille: ["Fire", "Economy", "Way", "EX"],
    Mobi: ["Easy", "Like", "Trekking", "Way", "1.0"],
    Palio: ["EX", "ELX", "Fire", "Weekend", "Adventure", "Attractive", "Essence", "Sporting", "1.0", "1.4", "1.8"],
    Pulse: ["Drive", "Audace", "Impetus", "Abarth", "1.3", "1.0 Turbo"],
    Punto: ["Attractive", "Essence", "Sporting", "Blackmotion", "1.4", "1.6", "1.8"],
    Siena: ["EX", "ELX", "Essence", "Attractive", "1.0", "1.4", "1.6"],
    Stilo: ["Connect", "Sporting", "Blackmotion", "Abarth"],
    Tempra: ["IE", "SX", "8V", "16V", "Turbo"],
    Uno: ["Mille", "Way", "Vivace", "Attractive", "Sporting", "1.0", "1.4"],
  },
  Ford: {
    Belina: ["L", "LDO", "Ghia"],
    Corcel: ["I", "II", "L", "LDO"],
    "Del Rey": ["L", "GL", "Ghia", "Belina"],
    EcoSport: ["XL", "XLS", "XLT", "Freestyle", "Titanium", "Storm", "1.6", "2.0"],
    Edge: ["SE", "SEL", "Limited", "Titanium", "ST"],
    Escort: ["L", "GL", "Ghia", "XR3", "RS"],
    Ka: ["SE", "SE Plus", "SEL", "FreeStyle", "Trail", "1.0", "1.5"],
    "Ka Sedan": ["SE", "SE Plus", "SEL", "Titanium"],
    Fiesta: ["Sedan", "Hatch", "SE", "SEL", "Titanium", "Trail", "1.0", "1.5", "1.6", "Class"],
    Focus: ["GL", "GLX", "Ghia", "SE", "SEL", "Titanium", "Hatch", "Sedan", "1.6", "2.0"],
    Fusion: ["SEL", "Titanium", "Hybrid", "AWD", "2.5", "2.0 EcoBoost"],
    Mondeo: ["GLX", "CLX", "Ghia"],
    "New Fiesta": ["SE", "SEL", "Titanium"],
    Verona: ["GL", "GLX", "Ghia"],
  },
  GWM: {
    "Haval H6": ["GT", "Premium", "HEV"],
    "Ora 03": ["Skin", "Pro", "GT"],
    "Ora Cat": ["Pro", "GT"],
    "Wey 03": ["Premium"],
  },
  Honda: {
    Accord: ["EX", "EXL", "LX", "Sport"],
    City: ["DX", "LX", "EX", "EXL", "Touring", "Sedan", "Hatch", "Personal", "1.5"],
    Civic: ["LX", "EX", "EXS", "EXL", "Sport", "Touring", "Si", "Type R", "1.8", "2.0", "Hybrid"],
    Fit: ["LX", "EX", "EXL", "DX", "Twist", "Personal", "1.4", "1.5"],
    "WR-V": ["LX", "EX", "EXL"],
  },
  Hyundai: {
    Azera: ["GLS", "Premium"],
    Elantra: ["GLS", "Special Edition"],
    HB20: ["Sense", "Vision", "Comfort", "Comfort Plus", "Limited", "Premium", "Platinum", "Evolution", "1.0", "1.6", "Turbo"],
    HB20S: ["Comfort", "Comfort Plus", "Premium", "Diamond", "1.0", "1.6"],
    HB20X: ["Style", "Premium"],
    i30: ["GLS", "CW", "Top"],
    "i30 CW": ["GLS"],
    Sonata: ["GLS"],
    Veloster: ["1.6", "Turbo"],
  },
  Jaguar: {
    "E-Pace": ["S", "SE", "HSE", "R-Dynamic"],
    "F-Pace": ["S", "SE", "HSE", "SVR"],
    "F-Type": ["Coupé", "Conversível", "R", "SVR"],
    "I-Pace": ["S", "SE", "HSE"],
    XE: ["Pure", "Prestige", "R-Sport"],
    XF: ["Premium", "Portfolio", "R-Sport"],
    XJ: ["Premium", "Portfolio"],
  },
  Jeep: {
    "Grand Cherokee": ["Laredo", "Limited", "Overland", "Trailhawk", "Summit", "SRT"],
    Cherokee: ["Sport", "Longitude", "Limited", "Trailhawk"],
  },
  Kia: {
    Bongo: ["K2500", "K2700"],
    Carens: ["LX", "EX"],
    Carnival: ["LX", "EX"],
    Cerato: ["EX", "SX"],
    Picanto: ["EX", "EX2", "EX3"],
    Rio: ["EX", "SX"],
    Sephia: ["RS", "GS"],
    Soul: ["EX", "EX2", "EX3"],
    Stinger: ["GT", "GT-Line"],
  },
  "Land Rover": {
    Defender: ["S", "SE", "HSE", "X"],
    "Range Rover Evoque": ["S", "SE", "HSE", "Dynamic"],
    "Range Rover Velar": ["S", "SE", "HSE", "R-Dynamic"],
  },
  Lexus: {
    ES: ["300h", "350"],
    GS: ["300", "350"],
    IS: ["300h", "350"],
    LS: ["500", "500h"],
    RC: ["300", "F"],
  },
  Lifan: {
    "320": ["Sport", "VIP"],
    "530": ["Sedan"],
    "620": ["1.6"],
    X60: ["Talent", "VIP"],
  },
  Maserati: {
    Ghibli: ["S", "GranSport", "GranLusso"],
    Quattroporte: ["S", "GTS", "Trofeo"],
  },
  "Mercedes-Benz": {
    "Classe A": ["A 200", "A 250", "A 35 AMG", "A 45 AMG", "Sedan", "Hatch"],
    "Classe B": ["B 200", "B 250"],
    "Classe C": ["C 180", "C 200", "C 250", "C 300", "C 43 AMG", "C 63 AMG", "Coupé", "Sedan"],
    "Classe CLA": ["CLA 200", "CLA 250", "CLA 45 AMG"],
    "Classe E": ["E 250", "E 300", "E 350", "E 400", "E 63 AMG"],
    "Classe S": ["S 450", "S 500", "S 560", "S 63 AMG"],
    "AMG GT": ["GT", "GT S", "GT R", "Black Series"],
  },
  Mini: {
    Cooper: ["S", "Cabrio", "Clubman", "JCW"],
    "Cooper Cabrio": ["S", "JCW"],
    "Cooper Clubman": ["S", "JCW"],
    "Cooper S": ["Hatch", "Cabrio", "JCW"],
    Countryman: ["Cooper", "Cooper S", "JCW"],
  },
  Mitsubishi: {
    Eclipse: ["GT", "GS"],
    Galant: ["GLS", "VR-4"],
    Lancer: ["HL", "HLS", "GT", "Evolution"],
  },
  Nissan: {
    March: ["S", "SV", "SL", "1.0", "1.6"],
    Sentra: ["S", "SV", "SL", "Exclusive", "2.0"],
    Tiida: ["S", "SL", "SR"],
    Versa: ["S", "SV", "SL", "Exclusive", "Advance", "1.6"],
    Livina: ["S", "SL", "SL X-Gear"],
    Kicks: ["S", "Sense", "Advance", "Exclusive", "XPlay", "1.6"],
    Leaf: ["SV", "SL"],
  },
  Peugeot: {
    "106": ["Quiksilver", "Soleil", "Selection"],
    "206": ["Selection", "Allure", "Feline", "Escapade", "SW", "1.4", "1.6", "RC"],
    "207": ["XR", "XR Sport", "XS", "Passion", "Quiksilver", "SW", "Hatch", "Sedan"],
    "208": ["Active", "Allure", "Like", "Style", "Griffe", "GT", "1.6", "1.0", "Turbo"],
    "2008": ["Active", "Allure", "Griffe", "Crossway"],
    "3008": ["Active", "Allure", "Griffe"],
    "307": ["Presence", "Feline", "Sedan", "Hatch", "SW"],
    "308": ["Active", "Allure", "Griffe", "Feline"],
    "408": ["Allure", "Griffe", "Feline"],
    "508": ["Allure", "Griffe"],
  },
  Porsche: {
    "911": ["Carrera", "Carrera S", "Turbo", "Turbo S", "GT3", "GT3 RS", "Targa"],
    Boxster: ["S", "GTS", "Spyder"],
    Cayman: ["S", "GTS", "GT4"],
    Panamera: ["4", "4S", "GTS", "Turbo", "Turbo S"],
    Taycan: ["4S", "Turbo", "Turbo S", "GTS"],
  },
  Renault: {
    Clio: ["Authentique", "Expression", "Privilège", "Campus", "RS", "1.0", "1.6"],
    Fluence: ["Expression", "Dynamique", "Privilège", "GT"],
    Kwid: ["Life", "Zen", "Intense", "Outsider", "1.0"],
    Logan: ["Expression", "Dynamique", "Privilège", "Authentique", "1.0", "1.6"],
    Megane: ["Expression", "Dynamique", "Privilège", "GT"],
    Sandero: ["Expression", "Dynamique", "Privilège", "GT Line", "Stepway", "Authentique", "1.0", "1.6", "RS"],
    Scala: ["Expression"],
    Stepway: ["Iconic", "Zen"],
    Symbol: ["Expression", "Privilège"],
  },
  Suzuki: {
    Baleno: ["GLX"],
    Celerio: ["GA"],
    Swift: ["R", "RS", "Sport"],
    SX4: ["GLS"],
  },
  Toyota: {
    Camry: ["XLE", "Hybrid"],
    Corolla: ["GLi", "XEi", "Altis", "XRS", "GR-S", "Hybrid", "1.8", "2.0", "Sedan"],
    "Corolla Cross": ["XR", "XRE", "XRX", "GR-Sport", "Hybrid"],
    Etios: ["X", "XS", "XLS", "Cross", "Platinum", "1.3", "1.5"],
    "Etios Sedan": ["X", "XS", "XLS", "Platinum"],
    Prius: ["Hybrid"],
    Yaris: ["XL", "XL Plus", "XS", "XLS", "1.3", "1.5", "Hatch"],
    "Yaris Sedan": ["XL", "XL Plus", "XS", "XLS"],
  },
  Volkswagen: {
    Bora: ["1.8 T", "2.0", "Highline"],
    Brasília: ["LS", "Sport"],
    Fox: ["City", "Plus", "Trend", "Comfortline", "Highline", "Pepper", "Xtreme", "Rock in Rio", "1.0", "1.6"],
    Fusca: ["1300", "1500", "1600", "Itamar"],
    Gol: ["CL", "GL", "GLS", "GTI", "City", "Trend", "Comfortline", "Highline", "Power", "1.0", "1.6", "1.8", "Saveiro"],
    Golf: ["GL", "GLS", "Comfortline", "Highline", "GTI", "R", "Variant", "Sportline"],
    Jetta: ["Comfortline", "Highline", "GLI", "Trendline", "1.4 TSI", "2.0"],
    Kombi: ["Standard", "Furgão", "Lotação", "Last Edition"],
    Logus: ["CL", "GL", "GLS"],
    Nivus: ["Comfortline", "Highline", "Outfit", "200 TSI"],
    Parati: ["CL", "GL", "GLS", "Crossover", "Surf", "Track & Field"],
    Passat: ["Comfortline", "Highline", "Variant", "1.8 TSI", "2.0 TSI", "GTS"],
    Pointer: ["CL", "GL", "GLi"],
    Polo: ["1.0", "1.6", "200 TSI", "Comfortline", "Highline", "GTS", "Track", "Sedan", "Hatch"],
    "Polo Sedan": ["Comfortline", "Highline"],
    Quantum: ["CL", "GL", "GLS", "Exclusiv"],
    Santana: ["CL", "GL", "GLS", "Comfortline", "Quantum"],
    Saveiro: ["CL", "Trend", "Cross", "Robust", "Extreme", "1.6", "1.8", "Cabine Simples", "Cabine Estendida", "Cabine Dupla"],
    Senda: ["CL", "GL"],
    "T-Cross": ["Comfortline", "Highline", "Sense", "200 TSI", "250 TSI"],
    Tiguan: ["Allspace", "Comfortline", "Highline", "R-Line"],
    Up: ["Take", "Move", "High", "Cross", "TSI", "Speed"],
    Variant: ["LS", "Sport"],
    Virtus: ["Comfortline", "Highline", "GTS", "200 TSI", "1.6 MSI"],
    Voyage: ["CL", "GL", "Trend", "Comfortline", "Highline", "1.0", "1.6"],
  },
  Volvo: {
    C30: ["1.8", "2.0", "T5"],
    S60: ["T4", "T5", "Polestar"],
    S90: ["T5", "T6", "Inscription"],
    V40: ["T4", "T5", "Cross Country"],
    V60: ["T5", "Cross Country"],
  },
};

// =====================================================================
// MOTO
// =====================================================================
const MOTO: CatalogoMap = {
  BMW: {
    "C 400": ["GT", "X"],
    "C 650": ["Sport", "GT"],
    "F 750 GS": ["Premium", "Style"],
    "F 800 GS": ["Adventure"],
    "F 850 GS": ["Adventure", "Premium"],
    "F 900 R": ["Standard", "Premium"],
    "F 900 XR": ["Standard", "Premium"],
    "G 310 GS": ["Standard"],
    "G 310 R": ["Standard"],
    "K 1600": ["GT", "GTL", "Bagger", "Grand America"],
    "R 1250 GS": ["Standard", "Adventure", "Premium"],
    "R 1250 R": ["Standard"],
    "R 1250 RT": ["Standard"],
    "R nineT": ["Standard", "Pure", "Scrambler", "Urban G/S"],
    "S 1000 R": ["Standard"],
    "S 1000 RR": ["Standard", "M Sport", "Race"],
    "S 1000 XR": ["Standard"],
  },
  Dafra: {
    Apache: ["RTR 150", "RTR 160"],
    "Citycom 300i": ["Standard"],
    "Maxsym 400": ["Standard"],
    "Next 250": ["Standard"],
    "Next 300": ["Standard"],
    "Riva 150": ["Standard"],
    "Roadwin 250R": ["Standard"],
  },
  Ducati: {
    Diavel: ["1260", "V4"],
    Monster: ["797", "821", "1200", "Plus"],
    "Multistrada V2": ["Standard", "S"],
    "Multistrada V4": ["Standard", "S", "Pikes Peak"],
    "Panigale V2": ["Standard"],
    "Panigale V4": ["Standard", "S", "Speciale", "R"],
    Scrambler: ["Icon", "Café Racer", "Desert Sled", "Full Throttle"],
    "Streetfighter V4": ["Standard", "S", "SP"],
  },
  Harley: {
    "883 Iron": ["Standard"],
    "Fat Boy": ["114", "Anniversary"],
    "Heritage Classic": ["114"],
    "Pan America": ["1250", "Special"],
    "Road Glide": ["Standard", "Special", "Limited", "ST"],
    "Road King": ["Standard", "Special"],
    "Sportster S": ["Standard"],
    "Street Bob": ["114"],
    "Street Glide": ["Standard", "Special", "ST"],
  },
  Honda: {
    "ADV 150": ["Standard"],
    "Africa Twin": ["Standard", "Adventure Sports", "DCT"],
    "Biz 110i": ["Standard"],
    "Biz 125": ["ES", "EX"],
    "BROS 160": ["ESDD"],
    "CB 125": ["Twister"],
    "CB 150": ["Invicta"],
    "CB 250 Twister": ["Standard", "ABS"],
    "CB 300F Twister": ["ABS"],
    "CB 500F": ["Standard", "ABS"],
    "CB 500X": ["Standard", "ABS"],
    "CB 650R": ["Standard", "ABS"],
    "CB 1000R": ["Standard", "Black Edition"],
    "CBR 250R": ["Standard", "ABS"],
    "CBR 500R": ["Standard", "ABS"],
    "CBR 600RR": ["Standard"],
    "CBR 650R": ["Standard", "ABS"],
    "CBR 1000RR": ["Fireblade", "SP"],
    "CG 125": ["Cargo", "Fan", "Titan"],
    "CG 150": ["Fan", "Titan", "Sport", "ESI", "ESD"],
    "CG 160 Cargo": ["Standard"],
    "CG 160 Fan": ["ES", "ESDi"],
    "CG 160 Start": ["Standard"],
    "CG 160 Titan": ["S", "ES", "EX"],
    "CG Today": ["Standard"],
    "Elite 125": ["Standard"],
    "Lead 110": ["Standard"],
    "NC 750X": ["Standard", "DCT"],
    "NXR Bros 160": ["ESDD"],
    PCX: ["Sport", "DLX", "ABS"],
    "Pop 100": ["Standard"],
    "Pop 110i": ["Standard"],
    "Sahara 300": ["Standard", "Rally"],
    "Shadow 750": ["Standard"],
    "XRE 190": ["ABS"],
    "XRE 300": ["Standard", "ABS", "Adventure", "Rally"],
    "XRE 300 Sahara": ["Standard", "Rally"],
  },
  Kasinski: {
    "CRZ 150": ["Standard"],
    "Comet 150": ["Standard"],
    "Comet 250": ["Standard"],
    "Mirage 150": ["Standard"],
    "Mirage 250": ["Standard"],
  },
  Kawasaki: {
    Concours: ["1400 ABS"],
    "ER-6n": ["Standard", "ABS"],
    "Ninja 300": ["Standard", "ABS", "SE"],
    "Ninja 400": ["Standard", "ABS", "KRT"],
    "Ninja 650": ["Standard", "ABS", "KRT"],
    "Ninja ZX-6R": ["Standard", "ABS", "KRT"],
    "Ninja ZX-10R": ["Standard", "ABS", "KRT", "RR"],
    "Ninja H2": ["Standard", "Carbon", "R", "SX"],
    "Versys 300": ["Standard", "ABS"],
    "Versys 650": ["Standard", "ABS", "Tourer"],
    "Versys 1000": ["Standard", "Grand Tourer", "SE"],
    "Vulcan S": ["Standard", "ABS", "Café"],
    Z400: ["Standard", "ABS"],
    Z650: ["Standard", "ABS"],
    Z900: ["Standard", "ABS", "70th Anniversary"],
    "Z H2": ["Standard", "SE"],
  },
  KTM: {
    "390 Adventure": ["Standard"],
    "390 Duke": ["Standard"],
    "790 Duke": ["Standard"],
    "890 Adventure": ["Standard", "R"],
    "1290 Super Adventure": ["S", "R"],
    "1290 Super Duke": ["R", "RR"],
  },
  Royal: {
    "Classic 350": ["Standard", "Chrome"],
    "Continental GT 650": ["Standard"],
    "Hunter 350": ["Standard"],
    "Interceptor 650": ["Standard"],
    "Meteor 350": ["Fireball", "Stellar", "Supernova"],
  },
  Shineray: {
    "Discover 200": ["Standard"],
    "Jet 50": ["Standard"],
    "Phoenix 50": ["Standard"],
    "XY 50Q": ["Standard"],
  },
  Suzuki: {
    "Bandit 1250": ["S", "ABS"],
    "Boulevard M800": ["Standard"],
    "Burgman 125": ["Standard"],
    "DL 1000 V-Strom": ["Standard"],
    "DR 650": ["Standard"],
    "GSX-R750": ["Standard"],
    "GSX-R1000": ["Standard", "R"],
    "GSX-S750": ["Standard", "ABS"],
    "GSX-S1000": ["Standard", "F"],
    Hayabusa: ["Standard"],
    "Intruder 125": ["Standard"],
    "V-Strom 650": ["Standard", "XT"],
    "V-Strom 1000": ["Standard", "XT"],
    "Yes 125": ["Standard"],
  },
  Triumph: {
    "Bonneville T100": ["Standard", "Black"],
    "Bonneville T120": ["Standard", "Black"],
    Daytona: ["675", "765"],
    "Rocket 3": ["R", "GT"],
    "Speed Triple": ["1200 RS", "1200 RR"],
    "Street Triple": ["R", "RS"],
    "Tiger 800": ["XR", "XRX", "XCA", "XCX"],
    "Tiger 900": ["GT", "Rally", "Rally Pro", "GT Pro"],
    "Tiger 1200": ["Rally Pro", "GT Pro", "GT Explorer", "Rally Explorer"],
  },
  Yamaha: {
    "Crosser 150": ["S", "Z", "ED"],
    "Factor 125": ["E", "ED", "K"],
    "Factor 150": ["UBS", "ABS"],
    "Fazer 150": ["SED", "UBS", "ABS"],
    "Fazer 250": ["BlueFlex", "ABS", "Limited"],
    FZ25: ["Fazer", "ABS"],
    "Lander 250": ["Standard", "ABS"],
    "MT-03": ["Standard", "ABS"],
    "MT-07": ["Standard", "ABS"],
    "MT-09": ["Standard", "SP"],
    "MT-10": ["Standard", "SP"],
    "Neo 125": ["UBS"],
    "NMax 160": ["ABS", "Connected"],
    R3: ["Standard", "ABS"],
    R6: ["Standard"],
    R1: ["Standard", "M"],
    "Tenere 250": ["Standard", "BlueFlex"],
    "Tenere 700": ["Standard", "Rally"],
    "Tracer 900": ["GT"],
    XJ6: ["N", "F"],
    "XT 660": ["R", "Z Tenere"],
    "XTZ 150": ["Crosser", "Crosser Z", "Crosser ED"],
    "YBR 125": ["E", "ED", "K"],
    "YS 250 Fazer": ["BlueFlex", "Limited"],
  },
};

// =====================================================================
// CAMINHÃO
// =====================================================================
const CAMINHAO: CatalogoMap = {
  DAF: {
    "XF 105": ["Standard", "Space Cab"],
    "XF 480": ["FT", "FTS", "FTT"],
    "XF 530": ["FT", "FTS", "FTT"],
    "CF 85": ["Standard"],
    "CF 410": ["FT", "FTS"],
  },
  Ford: {
    "Cargo 815": ["Standard"],
    "Cargo 1119": ["Standard"],
    "Cargo 1319": ["Standard"],
    "Cargo 1419": ["Standard"],
    "Cargo 1719": ["Standard"],
    "Cargo 1723": ["Standard"],
    "Cargo 1933": ["Standard"],
    "Cargo 2429": ["Standard"],
    "Cargo 2629": ["6x4"],
    "Cargo 2842": ["6x2"],
  },
  Iveco: {
    "Daily 35": ["S14", "S17"],
    "Daily 55": ["C16", "C17"],
    "Daily 70": ["C16", "C17"],
    "Stralis 460": ["6x2", "6x4"],
    "Stralis 480": ["6x2", "6x4"],
    "Stralis 530": ["6x4"],
    "Tector 170E22": ["Standard"],
    "Tector 240E25": ["Standard"],
    "Tector 260E25": ["6x2"],
  },
  MAN: {
    "TGX 28.440": ["6x2"],
    "TGX 29.440": ["6x4"],
    "TGX 33.440": ["6x4"],
  },
  "Mercedes-Benz": {
    "Accelo 815": ["Standard"],
    "Accelo 1016": ["Standard"],
    "Atego 1419": ["Standard"],
    "Atego 1719": ["Standard"],
    "Atego 2426": ["6x2"],
    "Atego 2729": ["6x4"],
    "Axor 2540": ["6x2"],
    "Axor 2544": ["6x2"],
    "Axor 3344": ["6x4"],
    "Atron 1635": ["Standard"],
    "Atron 2729": ["6x4"],
    "Actros 2546": ["6x2"],
    "Actros 2651": ["6x4"],
    "Actros 4844": ["8x4"],
  },
  Scania: {
    "G 360": ["6x2", "6x4"],
    "G 380": ["6x2", "6x4"],
    "G 410": ["6x2", "6x4"],
    "G 440": ["6x2", "6x4"],
    "G 480": ["6x2", "6x4"],
    "P 310": ["Standard"],
    "P 360": ["Standard"],
    "R 440": ["6x2", "6x4"],
    "R 450": ["6x2", "6x4"],
    "R 480": ["6x2", "6x4"],
    "R 540": ["6x4"],
    "S 540": ["6x4"],
    "S 660": ["6x4"],
  },
  Volkswagen: {
    "Constellation 17.190": ["Standard"],
    "Constellation 19.320": ["Standard"],
    "Constellation 24.280": ["6x2"],
    "Constellation 25.420": ["6x2"],
    "Constellation 26.260": ["6x4"],
    "Constellation 31.330": ["6x4"],
    "Delivery 6.160": ["Standard"],
    "Delivery 8.160": ["Standard"],
    "Delivery 9.170": ["Standard"],
    "Delivery 11.180": ["Standard"],
    "Meteor 28.460": ["6x2"],
    "Meteor 29.520": ["6x4"],
    "Worker 8.160": ["Standard"],
    "Worker 13.190": ["Standard"],
    "Worker 17.230": ["Standard"],
  },
  Volvo: {
    "FH 460": ["6x2", "6x4"],
    "FH 500": ["6x2", "6x4"],
    "FH 540": ["6x4"],
    "FH 16 750": ["6x4", "8x4"],
    "FM 380": ["6x2", "6x4"],
    "FM 420": ["6x2", "6x4"],
    "FM 460": ["6x2", "6x4"],
    "FM 500": ["6x4"],
    "VM 220": ["4x2", "6x2"],
    "VM 270": ["4x2", "6x2"],
  },
};

// =====================================================================
// CAMINHONETE
// =====================================================================
const CAMINHONETE: CatalogoMap = {
  Chevrolet: {
    "D-20": ["Custom", "Custom S", "De Luxe", "SR"],
    Montana: ["LS", "LT", "LTZ", "Sport", "Conquest", "Premier", "1.4", "1.8"],
    "S10 Cabine Simples": ["Advantage", "LS", "LT"],
  },
  Fiat: {
    Fiorino: ["Furgão", "Working", "Endurance", "Hard Working", "1.3", "1.4"],
    Strada: ["Working", "Adventure", "Trekking", "Freedom", "Volcano", "Ranch", "Cabine Simples", "Cabine Dupla", "Cabine Estendida", "1.3", "1.4", "1.8"],
    "Strada Adventure": ["Standard", "Locker"],
    "Strada Working": ["Hard"],
    Toro: ["Endurance", "Freedom", "Volcano", "Ranch", "Ultra", "Diesel", "Flex"],
  },
  Ford: {
    Courier: ["L", "LX", "XL", "XLS"],
    "F-1000": ["Standard", "Super Serie"],
    "F-4000": ["4x2", "4x4"],
  },
  Renault: {
    Oroch: ["Express", "Dynamique", "Outsider", "Hi-Flex"],
  },
  Volkswagen: {
    Saveiro: ["Robust", "Trendline", "Cross", "Extreme", "Cabine Simples", "Cabine Estendida", "Cabine Dupla"],
    "Saveiro Cross": ["1.6 16V"],
    "Saveiro Robust": ["1.6 8V"],
  },
};

// =====================================================================
// PICAPE
// =====================================================================
const PICAPE: CatalogoMap = {
  Chevrolet: {
    S10: ["LS", "LT", "LTZ", "Midnight", "High Country", "Z71", "Cabine Dupla", "Cabine Simples", "2.5 Flex", "2.8 Diesel"],
    "S10 High Country": ["Standard"],
    "S10 Z71": ["Standard"],
    Silverado: ["Standard", "DLX", "Conquest"],
  },
  Dodge: {
    Dakota: ["Sport", "SLT", "R/T"],
    "Ram 1500": ["Big Horn", "Laramie", "Limited", "Rebel", "TRX"],
    "Ram 2500": ["Laramie", "Heavy Duty"],
    "Ram 3500": ["Laramie"],
  },
  Fiat: {
    Toro: ["Endurance", "Freedom", "Volcano", "Ranch", "Ultra", "Diesel"],
    "Toro Volcano": ["Diesel", "T270"],
  },
  Ford: {
    "F-150": ["XL", "XLT", "Lariat", "Raptor", "Limited", "King Ranch"],
    "F-250": ["XL", "XLT", "Lariat"],
    Maverick: ["XL", "XLT", "Lariat", "Tremor"],
    Ranger: ["XL", "XLS", "XLT", "Limited", "Storm", "Black", "Wildtrak", "Raptor", "2.2 Diesel", "3.2 Diesel", "2.5 Flex"],
    "Ranger Raptor": ["Standard"],
  },
  GWM: {
    Poer: ["Standard", "P30"],
    "Poer P30": ["Standard"],
  },
  Mitsubishi: {
    "L200 Triton": ["GLS", "HPE", "Sport HPE-S", "Athletic", "Outdoor", "Savana"],
    "L200 Triton Sport": ["GLS", "HPE", "HPE-S"],
  },
  Nissan: {
    Frontier: ["S", "XE", "SE", "SL", "LE", "Attack", "Pro-4X", "Platinum"],
  },
  Toyota: {
    Hilux: ["DX", "SR", "SRV", "SRX", "GR-Sport", "Cabine Simples", "Cabine Dupla", "2.7 Flex", "2.8 Diesel", "4x4"],
    "Hilux SRX": ["Standard"],
  },
  Volkswagen: {
    Amarok: ["S", "SE", "Trendline", "Comfortline", "Highline", "Extreme", "V6", "Aventura"],
    "Amarok V6": ["Highline", "Extreme", "Aventura"],
  },
};

// =====================================================================
// SUV
// =====================================================================
const SUV: CatalogoMap = {
  Audi: {
    Q3: ["Ambiente", "Ambition", "Performance", "Black", "Sportback"],
    Q5: ["Ambiente", "Ambition", "Performance", "Black", "Sportback"],
    Q7: ["Ambiente", "Performance", "Black"],
    Q8: ["Performance", "Black"],
    "e-tron": ["Performance", "Sportback"],
  },
  BMW: {
    X1: ["sDrive18i", "sDrive20i", "xDrive25i", "M Sport"],
    X2: ["sDrive20i", "M35i"],
    X3: ["xDrive20i", "xDrive30i", "M40i", "M Sport"],
    X4: ["xDrive30i", "M40i", "M Competition"],
    X5: ["xDrive30d", "xDrive40i", "xDrive45e", "M50i", "M Competition"],
    X6: ["xDrive40i", "M50i", "M Competition"],
    X7: ["xDrive40i", "M50i"],
    iX: ["xDrive40", "xDrive50", "M60"],
  },
  BYD: {
    "Song Plus": ["EV", "DM-i", "Premium"],
    "Song Pro": ["DM-i"],
    Tan: ["EV"],
    "Yuan Plus": ["GL", "GS", "Premium"],
  },
  Caoa: {
    "Tiggo 5X": ["Look", "Comfort", "Pro"],
    "Tiggo 7": ["Pro", "Pro Max"],
    "Tiggo 8": ["Pro", "Pro Max", "Pro Plus"],
  },
  Chery: {
    "Tiggo 2": ["Look", "Comfort", "Act"],
    "Tiggo 3X": ["Look", "Comfort", "Plus"],
    "Tiggo 5X": ["Look", "Comfort", "Pro", "Plus"],
    "Tiggo 7": ["Pro", "Pro Max"],
    "Tiggo 8": ["Pro", "Pro Max", "Pro Plus"],
  },
  Chevrolet: {
    Captiva: ["Sport", "LT", "LTZ", "Ecotec", "V6"],
    Equinox: ["LT", "Premier", "Midnight"],
    Tracker: ["LS", "LT", "LTZ", "Premier", "RS", "Midnight", "1.0 Turbo", "1.2 Turbo"],
    Trailblazer: ["LT", "LTZ", "Premier", "2.5 Flex", "2.8 Diesel"],
    "TrailBlazer LTZ": ["Diesel"],
  },
  Citroen: {
    Aircross: ["Live", "Feel", "Shine", "Pack"],
    "C4 Cactus": ["Live", "Feel", "Feel Pack", "Shine", "Shine Pack"],
    "C5 Aircross": ["Feel", "Shine", "Pack"],
  },
  Fiat: {
    Fastback: ["Audace", "Impetus", "Limited Edition", "Abarth"],
    Pulse: ["Drive", "Audace", "Impetus", "Abarth", "1.3", "1.0 Turbo"],
  },
  Ford: {
    "Bronco Sport": ["Big Bend", "Wildtrak"],
    EcoSport: ["XL", "XLS", "XLT", "Freestyle", "Titanium", "Storm", "SE"],
    Edge: ["SE", "SEL", "Limited", "Titanium", "ST"],
    Territory: ["Titanium", "SEL"],
  },
  GWM: {
    "Haval H6": ["GT", "Premium", "HEV", "PHEV"],
    "Haval H9": ["Premium"],
  },
  Honda: {
    "CR-V": ["LX", "EX", "EXL", "Touring", "Hybrid"],
    "HR-V": ["LX", "EX", "EXL", "Touring", "Advance", "Sport", "1.5", "1.8"],
    "WR-V": ["LX", "EX", "EXL"],
    "ZR-V": ["EX", "EXL", "Touring", "Advance"],
  },
  Hyundai: {
    Creta: ["Comfort", "Comfort Plus", "Limited", "Pulse", "Action", "Prestige", "Ultimate", "Sport", "1.6", "2.0"],
    "Ioniq 5": ["Standard", "Long Range", "Performance"],
    Kona: ["GLS", "Eletric", "N Line"],
    "Santa Fe": ["GLS", "Top"],
    Tucson: ["GLS", "GLB", "Limited", "1.6 Turbo", "2.0", "Hybrid"],
  },
  Jaguar: {
    "E-Pace": ["S", "SE", "HSE", "R-Dynamic"],
    "F-Pace": ["S", "SE", "HSE", "SVR"],
    "I-Pace": ["S", "SE", "HSE"],
  },
  Jeep: {
    Cherokee: ["Sport", "Longitude", "Limited", "Trailhawk"],
    Commander: ["Limited", "Overland", "Blackhawk"],
    Compass: ["Sport", "Longitude", "Limited", "Trailhawk", "S", "Série S", "Blackhawk", "Night Eagle", "Hybrid", "1.3 Turbo", "2.0 Diesel"],
    "Grand Cherokee": ["Laredo", "Limited", "Overland", "Trailhawk", "Summit", "SRT"],
    Renegade: ["Sport", "Longitude", "Limited", "Trailhawk", "Moab", "S", "Night Eagle", "1.3 Turbo", "1.8 Flex", "2.0 Diesel"],
    Wrangler: ["Sport", "Sahara", "Rubicon", "Unlimited"],
  },
  Kia: {
    EV6: ["GT", "GT-Line"],
    Mohave: ["EX", "EX2"],
    Niro: ["EX", "Hybrid", "EV"],
    Seltos: ["EX", "SX", "GT-Line"],
    Sorento: ["EX", "EX2", "EX2 7L"],
    Sportage: ["EX", "LX", "GT-Line", "Hybrid"],
  },
  "Land Rover": {
    Defender: ["S", "SE", "HSE", "X"],
    Discovery: ["S", "SE", "HSE"],
    "Discovery Sport": ["S", "SE", "HSE", "R-Dynamic"],
    "Range Rover": ["Standard", "Vogue", "SVAutobiography"],
    "Range Rover Evoque": ["S", "SE", "HSE", "Dynamic"],
    "Range Rover Sport": ["HSE", "Autobiography", "SVR"],
    "Range Rover Velar": ["S", "SE", "HSE", "R-Dynamic"],
  },
  Lexus: {
    NX: ["300", "300h", "350h", "F-Sport"],
    RX: ["350", "450h", "F-Sport"],
    UX: ["250h", "F-Sport"],
  },
  Mahindra: {
    XUV300: ["W4", "W6", "W8"],
    XUV700: ["MX", "AX5", "AX7"],
  },
  "Mercedes-Benz": {
    GLA: ["200", "250", "35 AMG", "45 AMG"],
    GLB: ["200", "250"],
    GLC: ["220d", "300", "300e", "43 AMG", "63 AMG", "Coupé"],
    GLE: ["350d", "400d", "450", "53 AMG", "63 AMG"],
    GLS: ["400d", "450", "63 AMG"],
    EQB: ["250", "300", "350"],
    EQC: ["400"],
  },
  Mitsubishi: {
    ASX: ["GL", "GLS", "Outdoor", "AWD"],
    "Eclipse Cross": ["HPE", "HPE-S"],
    Outlander: ["GT", "GLS", "HPE", "PHEV"],
    "Pajero Dakar": ["3.2 Diesel", "3.5 Flex"],
    "Pajero Full": ["HPE", "3.2 Diesel"],
    "Pajero Sport": ["HPE", "HPE-S"],
    "Pajero TR4": ["GLS", "Flex"],
  },
  Nissan: {
    Kicks: ["S", "Sense", "Advance", "Exclusive", "XPlay", "1.6"],
    Murano: ["SL", "Platinum"],
    "X-Trail": ["SL", "Platinum"],
  },
  Peugeot: {
    "2008": ["Active", "Allure", "Griffe", "Crossway", "GT"],
    "3008": ["Active", "Allure", "Griffe"],
    "5008": ["Allure", "Griffe"],
  },
  Porsche: {
    Cayenne: ["Standard", "S", "GTS", "Turbo", "Turbo S Hybrid"],
    Macan: ["Standard", "S", "GTS", "Turbo"],
  },
  Renault: {
    Captur: ["Zen", "Intense", "Iconic", "Bose", "1.6", "1.3 Turbo"],
    Duster: ["Expression", "Dynamique", "Iconic", "Outsider", "Oroch", "1.6", "2.0", "1.3 Turbo"],
    Koleos: ["Dynamique", "Privilège"],
  },
  Suzuki: {
    "Grand Vitara": ["2WD", "4WD", "Limited"],
    Jimny: ["4ALL", "Sierra", "4Sport"],
    "Jimny Sierra": ["Standard"],
    Vitara: ["GLS", "Limited"],
  },
  Toyota: {
    "Corolla Cross": ["XR", "XRE", "XRX", "GR-Sport", "Hybrid"],
    "Land Cruiser": ["VX", "VXR", "GR-Sport"],
    RAV4: ["S", "SX", "Top", "Hybrid"],
    SW4: ["SR", "SRV", "SRX", "Diamond", "GR-Sport", "5L", "7L", "2.7 Flex", "2.8 Diesel"],
  },
  Volkswagen: {
    Nivus: ["Comfortline", "Highline", "Outfit", "200 TSI"],
    "T-Cross": ["Comfortline", "Highline", "Sense", "200 TSI", "250 TSI"],
    Taos: ["Comfortline", "Highline"],
    Tiguan: ["Allspace", "Comfortline", "Highline", "R-Line"],
    Touareg: ["V6 TDI", "V8"],
  },
  Volvo: {
    XC40: ["Momentum", "Inscription", "R-Design", "Recharge"],
    XC60: ["Momentum", "Inscription", "R-Design", "Recharge"],
    XC90: ["Momentum", "Inscription", "R-Design", "Recharge"],
  },
};

// =====================================================================
// VAN
// =====================================================================
const VAN: CatalogoMap = {
  Citroen: {
    Berlingo: ["Furgão", "Multispace"],
    Jumper: ["Furgão", "Minibus"],
    Jumpy: ["Furgão"],
  },
  Fiat: {
    "Doblò Cargo": ["1.4", "1.8"],
    Ducato: ["Furgão", "Minibus", "Maxicargo", "Cargo"],
    "Fiorino Furgão": ["Standard", "Hard Working"],
    Scudo: ["Furgão", "Multi"],
    Talento: ["Furgão"],
  },
  Ford: {
    Transit: ["Furgão", "Chassi", "Minibus"],
  },
  Hyundai: {
    H100: ["Standard"],
    HR: ["Standard", "Longo"],
  },
  Iveco: {
    Daily: ["Furgão", "Chassi", "Minibus"],
    "Daily Furgão": ["35S14", "55C16"],
    "Daily Minibus": ["Standard"],
  },
  Kia: {
    "Bongo K2500": ["Standard"],
  },
  "Mercedes-Benz": {
    "Sprinter 311": ["Furgão", "Chassi"],
    "Sprinter 313": ["Furgão", "Chassi"],
    "Sprinter 415": ["Furgão", "Chassi", "Street"],
    "Sprinter 515": ["Furgão", "Chassi", "Street"],
    "Sprinter Furgão": ["Standard"],
    Vito: ["Tourer", "Furgão"],
  },
  Peugeot: {
    Boxer: ["Furgão", "Minibus"],
    Expert: ["Furgão"],
    Partner: ["Furgão"],
  },
  Renault: {
    Kangoo: ["Express", "Furgão"],
    Master: ["Furgão", "Chassi", "Minibus"],
    Trafic: ["Furgão", "Minibus"],
  },
  Volkswagen: {
    Crafter: ["Furgão", "Chassi"],
    Kombi: ["Standard", "Furgão", "Lotação"],
    Transporter: ["Standard"],
  },
};

// =====================================================================
// ÔNIBUS
// =====================================================================
const ONIBUS: CatalogoMap = {
  Agrale: {
    "MA 9.2": ["Standard"],
    "MA 12.0": ["Standard"],
    "MA 15.0": ["Standard"],
    "MA 17.0": ["Standard"],
  },
  Ford: {
    "B-1621": ["Standard"],
    "B-1721": ["Standard"],
  },
  Iveco: {
    CityClass: ["Standard"],
    "Daily Minibus": ["Standard"],
    GranWay: ["Standard"],
  },
  MAN: {
    "15.190": ["Standard"],
    "15.210": ["Standard"],
  },
  "Mercedes-Benz": {
    "LO-916": ["Standard"],
    "OF-1519": ["Standard"],
    "OF-1721": ["Standard"],
    "OF-1724": ["Standard"],
    "OH-1218": ["Standard"],
    "OH-1623": ["Standard"],
    "OH-1721": ["Standard"],
    "OH-1724": ["Standard"],
    "O-500": ["U", "M", "R", "RS", "RSD"],
  },
  Scania: {
    "K 270": ["Standard"],
    "K 310": ["Standard"],
    "K 360": ["Standard"],
    "K 410": ["Standard"],
    "K 440": ["Standard"],
    "F 250": ["Standard"],
    "F 310": ["Standard"],
  },
  Volkswagen: {
    "8.160 OD": ["Standard"],
    "9.160 OD": ["Standard"],
    "15.190 EOD": ["Standard"],
    "17.230 EOD": ["Standard"],
    "18.280 EOT": ["Standard"],
  },
  Volvo: {
    "B 270 F": ["Standard"],
    "B 290 R": ["Standard"],
    "B 340 R": ["Standard"],
    "B 380 R": ["Standard"],
    "B 420 R": ["Standard"],
    "B 450 R": ["Standard"],
  },
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
  const matchKey = Object.keys(map).find(
    (k) => k.toLowerCase() === marca.toLowerCase(),
  );
  if (!matchKey) return [];
  return Object.keys(map[matchKey]).sort((a, b) =>
    a.localeCompare(b, "pt-BR"),
  );
}

export function getVersoesPorModelo(
  tipo: TipoVeiculo,
  marca: string,
  modelo: string,
): string[] {
  const map = CATALOGO[tipo];
  if (!map) return [];
  const marcaKey = Object.keys(map).find(
    (k) => k.toLowerCase() === marca.toLowerCase(),
  );
  if (!marcaKey) return [];
  const modelos = map[marcaKey];
  const modeloKey = Object.keys(modelos).find(
    (k) => k.toLowerCase() === modelo.toLowerCase(),
  );
  if (!modeloKey) return [];
  return [...modelos[modeloKey]].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function getTipoLabel(tipo: string | null | undefined): string {
  if (!tipo) return "";
  return TIPO_VEICULO_LABELS[tipo as TipoVeiculo] || tipo;
}
