/**
 * CATÁLOGO DE MÁQUINAS — fonte única de dados do site.
 * ------------------------------------------------------------------
 * Hoje: arquivo estático (preparado para virar CMS/painel admin).
 * Fotos: placeholders gerados por IA (ver ASSET_SOURCES.md).
 * Para publicar estoque real: edite este arquivo ou conecte um backend
 * mantendo a mesma interface Machine.
 */

/* Imagens centrais — substitua pelas fotos reais (Instagram/Google Maps/estúdio) */
export const IMG = {
  hero: "https://image.qwenlm.ai/generated-images/7629fdd8-ad0f-4a5e-af97-0f34edf3daa0/_result.png",
  forca: "https://image.qwenlm.ai/generated-images/ee368c4e-4f83-43af-87e0-bea2aa5a50f5/_result.png",
  produtividade: "https://image.qwenlm.ai/generated-images/e1534e13-fd4c-429c-9e6e-1a7ab580cc85/_result.png",
  tecnologia: "https://image.qwenlm.ai/generated-images/26144723-34f5-4663-901d-5be78f77c10c/_result.png",
  resultado: "https://image.qwenlm.ai/generated-images/b02296ab-6987-42b6-8a57-00a32a8cdbc3/_result.png",
  tratorVerde: "https://image.qwenlm.ai/generated-images/1215dc3a-774f-4646-95c2-09b82c3cc9d3/_result.png",
  tratorVermelho: "https://image.qwenlm.ai/generated-images/6534fd8a-14a1-434a-bb73-d7dbe9da6bdd/_result.png",
  escavadeira: "https://image.qwenlm.ai/generated-images/c578c028-9950-4ddb-ba88-3bb36d9675d3/_result.png",
  retroescavadeira: "https://image.qwenlm.ai/generated-images/6161c70d-128a-4e62-9187-bdce34c57b00/_result.png",
  patio: "https://image.qwenlm.ai/generated-images/313131ad-55f0-461e-a64d-be3b9a2db533/_result.png",
};

export type Category =
  | "tratores"
  | "colheitadeiras"
  | "escavadeiras"
  | "retroescavadeiras";

export type Condition = "novo" | "usado";
export type StockStatus = "disponivel" | "reservada" | "vendida";

export interface SpecGroup {
  title: string;
  rows: [string, string][];
}

export interface Machine {
  id: string;
  slug: string;
  code: string;
  brand: string;
  model: string;
  year: number;
  category: Category;
  condition: Condition;
  status: StockStatus;
  price: number | null;
  priceWas?: number;
  hours: number | null;
  powerCv?: number;
  weightKg?: number;
  fuel?: string;
  transmission?: string;
  drive?: string;
  application: string;
  location: string;
  badges: string[];
  featured?: boolean;
  images: string[];
  description: string;
  specGroups: SpecGroup[];
}

export interface Implement {
  id: string;
  slug: string;
  code: string;
  type: string;
  brand: string;
  model: string;
  year: number | null;
  condition: Condition;
  status: "disponivel" | "vendida";
  price: number | null;
  compat: string;
  width?: string;
  weightKg?: number;
  location: string;
  glyph:
    | "arado"
    | "grade"
    | "rocadeira"
    | "plantadeira"
    | "carreta"
    | "distribuidor"
    | "lamina"
    | "subsolador";
  description: string;
  featured?: boolean;
}

export const CATEGORY_META: Record<
  Category | "implementos",
  { label: string; plural: string; blurb: string; image: string }
> = {
  tratores: {
    label: "Trator",
    plural: "Tratores",
    blurb: "Do fruteiro ao alta potência, 4x4 prontos para o talhão.",
    image: IMG.tratorVerde,
  },
  colheitadeiras: {
    label: "Colheitadeira",
    plural: "Colheitadeiras",
    blurb: "Grãos com baixa perda e plataforma compatível.",
    image: IMG.produtividade,
  },
  escavadeiras: {
    label: "Escavadeira",
    plural: "Escavadeiras",
    blurb: "20 toneladas de força para terraplenagem e obra.",
    image: IMG.escavadeira,
  },
  retroescavadeiras: {
    label: "Retroescavadeira",
    plural: "Retroescavadeiras",
    blurb: "A máquina que resolve carga, vala e limpeza no mesmo dia.",
    image: IMG.retroescavadeira,
  },
  implementos: {
    label: "Implemento",
    plural: "Implementos",
    blurb: "Arados, grades, plantadeiras, carretas e distribuidores.",
    image: IMG.resultado,
  },
};

const CTY = "Ribeirão Preto/SP";

export const MACHINES: Machine[] = [
  {
    id: "m-6110j",
    slug: "john-deere-6110j-2021",
    code: "TF-0143",
    brand: "John Deere",
    model: "6110J",
    year: 2021,
    category: "tratores",
    condition: "usado",
    status: "disponivel",
    price: 389000,
    hours: 1850,
    powerCv: 110,
    weightKg: 4930,
    fuel: "Diesel S-10",
    transmission: "PowerShift 24x24",
    drive: "4x4 (TDA)",
    application: "Grãos, cana e pecuária",
    location: CTY,
    badges: ["Revisado", "Único dono"],
    featured: true,
    images: [IMG.tratorVerde, IMG.forca, IMG.tecnologia],
    description:
      "Trator de porte médio com histórico de único dono, manutenção em dia na concessionária e horímetro original. Revisão completa de entrega com troca de filtros, óleo e checagem de 120 pontos. Pronto para plantio, preparo e transporte.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência máxima", "110 cv"],
          ["Motor", "John Deere PowerTech 4.5L — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
          ["Torque máximo", "468 Nm @ 1.400 rpm"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "PowerShift 24x24 com reversor eletro-hidráulico"],
          ["Tração", "4x4 com bloqueio de diferencial"],
          ["TDF", "540/540E/1000 rpm"],
        ],
      },
      {
        title: "Dimensões e pesos",
        rows: [
          ["Peso operacional", "4.930 kg"],
          ["Tanque de combustível", "255 L"],
          ["Vazão hidráulica", "114 L/min (opcional)"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2021"],
          ["Horímetro", "1.850 h"],
          ["Condição", "Usado — revisado 120 pontos"],
          ["Garantia", "90 dias (motor e transmissão)"],
        ],
      },
    ],
  },
  {
    id: "m-t7230",
    slug: "new-holland-t7-230-2022",
    code: "TF-0151",
    brand: "New Holland",
    model: "T7.230",
    year: 2022,
    category: "tratores",
    condition: "usado",
    status: "disponivel",
    price: 695000,
    hours: 950,
    powerCv: 230,
    weightKg: 8400,
    fuel: "Diesel S-10",
    transmission: "Auto Command CVT",
    drive: "4x4 (TDA)",
    application: "Grãos em larga escala e canaviais",
    location: CTY,
    badges: ["Baixas horas", "Revisado"],
    featured: true,
    images: [IMG.tratorVermelho, IMG.forca],
    description:
      "Alta potência com menos de 1.000 horas reais, saída de frota de produtor de grãos da região. Transmissão continuamente variável, piloto automático de fábrica e pneus com mais de 70% de vida útil. Documentação em dia para transferência imediata.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência máxima", "230 cv (com EPM)"],
          ["Motor", "FPT NEF 6.7L — 6 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "Auto Command — CVT"],
          ["Tração", "4x4 com suspensão de eixo"],
          ["TDF", "540E/1000 rpm"],
        ],
      },
      {
        title: "Dimensões e pesos",
        rows: [
          ["Peso operacional", "8.400 kg"],
          ["Tanque de combustível", "410 L"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2022"],
          ["Horímetro", "950 h"],
          ["Condição", "Usado — único dono, nota fiscal de origem"],
          ["Garantia", "90 dias (motor e transmissão)"],
        ],
      },
    ],
  },
  {
    id: "m-320d2",
    slug: "caterpillar-320d2-2020",
    code: "TF-0129",
    brand: "Caterpillar",
    model: "320D2 L",
    year: 2020,
    category: "escavadeiras",
    condition: "usado",
    status: "disponivel",
    price: 520000,
    priceWas: 545000,
    hours: 3400,
    powerCv: 158,
    weightKg: 20500,
    fuel: "Diesel S-10",
    transmission: "Hidrostática",
    application: "Terraplenagem, mineração e infraestrutura",
    location: CTY,
    badges: ["Revisado", "Redução de preço"],
    featured: true,
    images: [IMG.escavadeira, IMG.resultado],
    description:
      "Escavadeira hidráulica classe 20 toneladas com manutenção 100% registrada. Bomba e comandos revisados, material rodante com 60% de vida e caçamba de 1,2 m³. Máquina de procedência, pronta para contrato de locação ou obra própria.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência líquida", "158 hp"],
          ["Motor", "Cat C4.4 ACERT — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Sistema hidráulico",
        rows: [
          ["Vazão máxima", "2x 205 L/min"],
          ["Pressão de operação", "35.000 kPa"],
        ],
      },
      {
        title: "Dimensões e pesos",
        rows: [
          ["Peso operacional", "20.500 kg"],
          ["Capacidade da caçamba", "0,9 – 1,3 m³"],
          ["Alcance máximo", "9,86 m"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2020"],
          ["Horímetro", "3.400 h"],
          ["Condição", "Usada — revisada"],
          ["Garantia", "90 dias (motor e hidráulica)"],
        ],
      },
    ],
  },
  {
    id: "m-3cx",
    slug: "jcb-3cx-2019",
    code: "TF-0118",
    brand: "JCB",
    model: "3CX",
    year: 2019,
    category: "retroescavadeiras",
    condition: "usado",
    status: "disponivel",
    price: 268000,
    hours: 4280,
    powerCv: 92,
    weightKg: 8070,
    fuel: "Diesel S-10",
    transmission: "Powershuttle 4x4",
    drive: "4x4",
    application: "Obras urbanas, saneamento e serviços rurais",
    location: CTY,
    badges: ["Único dono"],
    images: [IMG.retroescavadeira],
    description:
      "Retroescavadeira 4x4 de único dono, usada em contrato de saneamento urbano. Caçamba 4-em-1, engate rápido traseiro e pneus novos na dianteira. Ideal para prefeitura, construtora ou produtor que precisa de máquina versátil.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência", "92 hp"],
          ["Motor", "JCB Dieselmax — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "Powershuttle 4 marchas"],
          ["Tração", "4x4"],
        ],
      },
      {
        title: "Dimensões e pesos",
        rows: [
          ["Peso operacional", "8.070 kg"],
          ["Profundidade de escavação", "5,46 m"],
          ["Capacidade da caçamba frontal", "1,0 m³"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2019"],
          ["Horímetro", "4.280 h"],
          ["Condição", "Usada — único dono"],
          ["Garantia", "90 dias (motor e transmissão)"],
        ],
      },
    ],
  },
  {
    id: "m-4130",
    slug: "case-axial-flow-4130-2019",
    code: "TF-0107",
    brand: "Case IH",
    model: "Axial-Flow 4130",
    year: 2019,
    category: "colheitadeiras",
    condition: "usado",
    status: "disponivel",
    price: 1480000,
    hours: 3150,
    powerCv: 354,
    fuel: "Diesel S-10",
    transmission: "Hidrostática 3 velocidades",
    application: "Soja, milho e trigo",
    location: CTY,
    badges: ["Oportunidade"],
    featured: true,
    images: [IMG.produtividade, IMG.resultado],
    description:
      "Colheitadeira de rotor axial com plataforma de 30 pés inclusa. Revisão de entressafra concluída: correias, rotores e sistema de limpeza inspecionados. Monitor de produtividade e piloto em funcionamento. Aceita trator de menor porte na troca.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência máxima", "354 cv"],
          ["Motor", "FPT Cursor 9 — 6 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Colheita",
        rows: [
          ["Sistema", "Rotor axial único"],
          ["Plataforma inclusa", "30 pés (flex)"],
          ["Tanque graneleiro", "10.570 L"],
          ["Taxa de descarga", "106 L/s"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2019"],
          ["Horímetro", "3.150 h"],
          ["Condição", "Usada — revisão de entressafra"],
          ["Garantia", "Safra 2025/26 (motor)"],
        ],
      },
    ],
  },
  {
    id: "m-5078e",
    slug: "john-deere-5078e-2024",
    code: "TF-0160",
    brand: "John Deere",
    model: "5078E",
    year: 2024,
    category: "tratores",
    condition: "novo",
    status: "disponivel",
    price: null,
    hours: 0,
    powerCv: 78,
    fuel: "Diesel S-10",
    transmission: "Sincronizada 12x12 com reversor",
    drive: "4x4 (TDA)",
    application: "Pecuária, café e pequenas propriedades",
    location: CTY,
    badges: ["Pronta entrega"],
    featured: true,
    images: [IMG.tratorVerde, IMG.resultado],
    description:
      "Unidade nova no pátio, nota fiscal de fábrica e garantia total John Deere. Compacto por fora, robusto por dentro: o queridinho da pecuária com baixo custo por hora. Financiamento em até 96 meses sujeito a análise.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência", "78 cv"],
          ["Motor", "John Deere PowerTech 2.9L — 3 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "Sincronizada 12x12 com reversor mecânico"],
          ["Tração", "4x4"],
          ["TDF", "540 rpm"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2024 (0 h)"],
          ["Condição", "Nova — pronta entrega"],
          ["Garantia", "Fábrica"],
        ],
      },
    ],
  },
  {
    id: "m-farmall110",
    slug: "case-farmall-110-2023",
    code: "TF-0158",
    brand: "Case IH",
    model: "Farmall 110",
    year: 2023,
    category: "tratores",
    condition: "novo",
    status: "disponivel",
    price: null,
    hours: 0,
    powerCv: 110,
    fuel: "Diesel S-10",
    transmission: "Mecânica 16x16 com super-redutor",
    drive: "4x4 (TDA)",
    application: "Grãos, cana e serviços gerais",
    location: CTY,
    badges: ["Pronta entrega"],
    images: [IMG.tratorVermelho],
    description:
      "Farmall 110 novo, faturamento direto da fábrica com bônus de pronta entrega. Hidráulica de 3 válvulas, ideal para carreta, plantadeira e implementos de barra. Consulte condição especial para produtor rural com CNPJ.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência", "110 cv"],
          ["Motor", "FPT NEF 4.5L — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "Mecânica 16x16 com super-redutor"],
          ["Tração", "4x4"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2023 (0 h)"],
          ["Condição", "Novo — pronta entrega"],
          ["Garantia", "Fábrica"],
        ],
      },
    ],
  },
  {
    id: "m-320gc",
    slug: "caterpillar-320-gc-2024",
    code: "TF-0163",
    brand: "Caterpillar",
    model: "320 GC",
    year: 2024,
    category: "escavadeiras",
    condition: "novo",
    status: "reservada",
    price: null,
    hours: 0,
    powerCv: 162,
    weightKg: 20100,
    fuel: "Diesel S-10",
    transmission: "Hidrostática",
    application: "Terraplenagem e obras de infraestrutura",
    location: CTY,
    badges: ["Pronta entrega"],
    featured: true,
    images: [IMG.escavadeira],
    description:
      "Unidade 2024 reservada — lista de espera aberta para as próximas posições. A 320 GC entrega o custo de propriedade mais baixo da categoria, com consumo até 25% menor que a geração anterior. Entre na fila com sinal e carta de crédito.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência líquida", "162 hp"],
          ["Motor", "Cat C4.4 — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Dimensões e pesos",
        rows: [
          ["Peso operacional", "20.100 kg"],
          ["Capacidade da caçamba", "0,9 – 1,3 m³"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2024 (0 h)"],
          ["Condição", "Nova — reservada"],
          ["Garantia", "Fábrica"],
        ],
      },
    ],
  },
  {
    id: "m-a134",
    slug: "valtra-a134-2025",
    code: "TF-0165",
    brand: "Valtra",
    model: "A134",
    year: 2025,
    category: "tratores",
    condition: "novo",
    status: "disponivel",
    price: null,
    hours: 0,
    powerCv: 127,
    fuel: "Diesel S-10",
    transmission: "Sincronizada 16x16",
    drive: "4x4 (TDA)",
    application: "Grãos, cana e transporte",
    location: CTY,
    badges: ["Pronta entrega"],
    images: [IMG.tratorVerde, IMG.forca],
    description:
      "Série A de última geração com cabine original, ar-condicionado de fábrica e preparação para piloto automático. Faturamento com bônus de safra e frete incluso para um raio de 300 km.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência", "127 cv"],
          ["Motor", "AGCO Power 4.4L — 4 cilindros"],
          ["Combustível", "Diesel S-10"],
        ],
      },
      {
        title: "Transmissão",
        rows: [
          ["Tipo", "Sincronizada 16x16"],
          ["Tração", "4x4"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2025 (0 h)"],
          ["Condição", "Novo — pronta entrega"],
          ["Garantia", "Fábrica"],
        ],
      },
    ],
  },
  {
    id: "m-mf4300",
    slug: "massey-ferguson-4300-2017",
    code: "TF-0092",
    brand: "Massey Ferguson",
    model: "MF 4300",
    year: 2017,
    category: "tratores",
    condition: "usado",
    status: "vendida",
    price: 198000,
    hours: 7900,
    powerCv: 130,
    fuel: "Diesel",
    transmission: "Mecânica 12x4",
    drive: "4x4 (TDA)",
    application: "Grãos e serviços gerais",
    location: CTY,
    badges: [],
    images: [IMG.tratorVermelho],
    description:
      "Vendida em janeiro para produtor de grãos de Barretos/SP. Mantemos o registro para transparência de histórico — fale com um consultor para entrar na lista de máquinas semelhantes.",
    specGroups: [
      {
        title: "Motor",
        rows: [
          ["Potência", "130 cv"],
          ["Motor", "AGCO Power 4.9L — 4 cilindros"],
          ["Combustível", "Diesel"],
        ],
      },
      {
        title: "Operação",
        rows: [
          ["Ano", "2017"],
          ["Horímetro", "7.900 h"],
          ["Condição", "Vendida"],
        ],
      },
    ],
  },
];

export const IMPLEMENTS: Implement[] = [
  {
    id: "i-arado",
    slug: "arado-reversivel-tatu-5-discos",
    code: "TF-I201",
    type: "Arado",
    brand: "Tatu",
    model: "ARPC 5 discos",
    year: 2022,
    condition: "usado",
    status: "disponivel",
    price: 24500,
    compat: "Tratores 90–140 cv",
    weightKg: 1450,
    location: CTY,
    glyph: "arado",
    featured: true,
    description:
      "Arado reversível de 5 discos com rodas de controle de profundidade. Revisado e com discos novos. Excelente revolvimento para plantio direto após correção.",
  },
  {
    id: "i-grade",
    slug: "grade-aradora-baldan-28-discos",
    code: "TF-I187",
    type: "Grade",
    brand: "Baldan",
    model: "GAPL 28 discos",
    year: 2021,
    condition: "usado",
    status: "disponivel",
    price: 31800,
    compat: "Tratores 100–150 cv",
    width: "3,2 m",
    location: CTY,
    glyph: "grade",
    description:
      "Grade aradora pesada de 28 discos de 26\", rolamentos novos e controle remoto. Nivelamento uniforme mesmo em palhada densa.",
  },
  {
    id: "i-rocadeira",
    slug: "rocadeira-hidraulica-kf-1800",
    code: "TF-I233",
    type: "Roçadeira",
    brand: "KF",
    model: "RH 1800",
    year: null,
    condition: "novo",
    status: "disponivel",
    price: null,
    compat: "Tratores 50–90 cv",
    width: "1,8 m",
    location: CTY,
    glyph: "rocadeira",
    description:
      "Roçadeira hidráulica de arrasto para pastagem, beira de cerca e aceiros. Facas balanceadas e cardan com embreagem. Disponível em 3 tamanhos.",
  },
  {
    id: "i-plantadeira",
    slug: "plantadeira-titan-7-linhas",
    code: "TF-I154",
    type: "Plantadeira",
    brand: "Titan",
    model: "PAM 7 linhas",
    year: 2020,
    condition: "usado",
    status: "disponivel",
    price: 86000,
    compat: "Tratores 100–160 cv",
    width: "4,2 m",
    location: CTY,
    glyph: "plantadeira",
    featured: true,
    description:
      "Plantadeira-adubadeira de 7 linhas com pantógrafos revisados e dosadores de precisão. Espaçamento de 0,60 m, pronta para soja e milho.",
  },
  {
    id: "i-carreta",
    slug: "carreta-graneleira-10t-kf",
    code: "TF-I198",
    type: "Carreta",
    brand: "KF",
    model: "CG 10.000",
    year: 2023,
    condition: "usado",
    status: "disponivel",
    price: 48500,
    compat: "Tratores 90 cv+",
    weightKg: 3200,
    location: CTY,
    glyph: "carreta",
    description:
      "Carreta graneleira 10 toneladas com bica alta e freio a ar. Pneus novos, chassi sem soldas. Perfeita para safra e entressafra.",
  },
  {
    id: "i-distribuidor",
    slug: "distribuidor-calcario-6000l",
    code: "TF-I176",
    type: "Distribuidor",
    brand: "Semeato",
    model: "DCA 6000",
    year: 2019,
    condition: "usado",
    status: "disponivel",
    price: 39900,
    compat: "Tratores 85–130 cv",
    weightKg: 2100,
    location: CTY,
    glyph: "distribuidor",
    description:
      "Distribuidor de calcário e fertilizante de 6.000 L com esteira regulável. Aplicação uniforme testada em campo.",
  },
  {
    id: "i-lamina",
    slug: "lamina-dianteira-cat-924",
    code: "TF-I142",
    type: "Lâmina",
    brand: "Caterpillar",
    model: "VPAT 924",
    year: 2018,
    condition: "usado",
    status: "disponivel",
    price: 58000,
    compat: "Carregadeiras série K",
    location: CTY,
    glyph: "lamina",
    description:
      "Lâmina VPAT original para carregadeiras, com cilindros sem vazamento. Para nivelamento fino de pátio e estradas vicinais.",
  },
  {
    id: "i-subsolador",
    slug: "subsolador-7-hastes-riomaq",
    code: "TF-I165",
    type: "Subsolador",
    brand: "Riomaq",
    model: "SS 7H",
    year: 2024,
    condition: "novo",
    status: "disponivel",
    price: null,
    compat: "Tratores 130–180 cv",
    weightKg: 1780,
    location: CTY,
    glyph: "subsolador",
    featured: true,
    description:
      "Subsolador de 7 hastes curvas com rolo destorroador. Quebra de compactação profunda com mínimo revolvimento. Novo, nota de fábrica.",
  },
];

/* ---------- seletores ---------- */

export const machineBySlug = (slug: string) => MACHINES.find((m) => m.slug === slug);
export const availableCount = () => MACHINES.filter((m) => m.status === "disponivel").length;
export const featuredMachines = () => MACHINES.filter((m) => m.featured && m.status !== "vendida");
export const brandsInStock = () => [...new Set(MACHINES.map((m) => m.brand))];
export const locations = () => [...new Set(MACHINES.map((m) => m.location))];
export const similarTo = (m: Machine, n = 3) =>
  MACHINES.filter((x) => x.slug !== m.slug && (x.category === m.category || x.brand === m.brand))
    .filter((x) => x.status !== "vendida")
    .slice(0, n);
