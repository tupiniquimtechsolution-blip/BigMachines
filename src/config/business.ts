/**
 * CONFIGURAÇÃO CENTRAL DO NEGÓCIO
 * ------------------------------------------------------------------
 * Substitua pelos dados reais da empresa antes de publicar.
 * Todos os contatos de WhatsApp usam o formato internacional (55 + DDD + número).
 * Veja CLIENT_REPLACEMENT_GUIDE.md para o checklist completo.
 */

export interface Salesperson {
  name: string;
  role: string;
  phoneDisplay: string;
  whatsapp: string;
  email: string;
}

export const BUSINESS = {
  name: "TerraForte Máquinas",
  legalName: "TerraForte Comércio de Máquinas e Tratores Ltda.",
  slogan: "Máquinas que movem resultados",
  tagline:
    "Tratores, implementos e maquinário pesado para agricultura, construção e operações profissionais.",
  founded: 1999,
  cnpj: "00.000.000/0001-00", // substituir pelo CNPJ real

  phoneDisplay: "(16) 3911-4800",
  phoneRaw: "551639114800",
  whatsapp: "5516991184800",
  whatsappDisplay: "(16) 99118-4800",
  email: "vendas@terrafortemaquinas.com.br",

  address: {
    street: "Rod. Anhanguera, km 308 — Distrito Industrial",
    complement: "Pátio com 12.000 m² às margens da rodovia",
    city: "Ribeirão Preto",
    state: "SP",
    zip: "14000-000",
  },
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=concession%C3%A1ria+de+tratores+Ribeir%C3%A3o+Preto+SP",

  hours: [
    { days: "Segunda a sexta", time: "07h30 — 18h00" },
    { days: "Sábado", time: "08h00 — 12h30" },
    { days: "Domingo", time: "Fechado" },
  ],

  instagram: "@terrafortemaquinas",
  instagramUrl: "https://instagram.com/",
  facebookUrl: "https://facebook.com/",
  youtubeUrl: "https://youtube.com/",

  team: [
    {
      name: "Ricardo Almeida",
      role: "Tratores & Colheitadeiras",
      phoneDisplay: "(16) 99118-2210",
      whatsapp: "5516991182210",
      email: "ricardo@terrafortemaquinas.com.br",
    },
    {
      name: "João Pedro Sales",
      role: "Linha Pesada & Construção",
      phoneDisplay: "(16) 99118-2211",
      whatsapp: "5516991182211",
      email: "joao@terrafortemaquinas.com.br",
    },
    {
      name: "Marina Duarte",
      role: "Implementos, Peças & Financiamento",
      phoneDisplay: "(16) 99118-2212",
      whatsapp: "5516991182212",
      email: "marina@terrafortemaquinas.com.br",
    },
  ] as Salesperson[],

  stats: [
    { label: "Anos de estrada", value: 26, suffix: "" },
    { label: "Máquinas entregues", value: 1850, suffix: "+" },
    { label: "Cidades atendidas", value: 320, suffix: "+" },
    { label: "Oficina própria", value: 1200, suffix: " m²" },
  ],

  /** Exiba apenas marcas com as quais a empresa efetivamente trabalha */
  brands: [
    "John Deere",
    "Case IH",
    "New Holland",
    "Valtra",
    "Massey Ferguson",
    "Caterpillar",
    "JCB",
    "XCMG",
  ],
} as const;
