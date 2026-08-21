/**
 * Design System — TerraForte Máquinas
 * Tokens centrais espelhados em src/index.css (@theme do Tailwind v4).
 * Edite aqui E no CSS para manter a paridade.
 */
export const THEME = {
  colors: {
    coal: { 950: "#0a0b09", 900: "#10120f", 800: "#161914", 700: "#1e221b", 600: "#2a2f26", 500: "#3a4034" },
    steel: { 500: "#565d50", 400: "#6d7466", 300: "#8f968a", 200: "#b4baae" },
    bone: { 100: "#efece2", 200: "#e4e0d2", 300: "#d6d1bf" },
    hazard: { 300: "#ffd23f", 400: "#f5b70a", 500: "#d99e00", 600: "#a97b00" },
    agri: { 300: "#7fb98b", 400: "#4f8f5c", 500: "#35713f", 600: "#275731", 700: "#1c4025" },
    safety: { 400: "#f0662b", 500: "#d9531e" },
    lines: { dark: "#24281f", light: "#c9c4b2" },
  },
  fonts: {
    /** Títulos — condensado pesado, cara de chapa de aço estampada */
    display: '"Anton", "Arial Narrow", sans-serif',
    /** Corpo e leitura */
    body: '"Barlow", "Segoe UI", sans-serif',
    /** Etiquetas técnicas, specs e dados */
    condensed: '"Barlow Condensed", "Arial Narrow", sans-serif',
  },
  spacing: { page: "clamp(1.25rem, 4vw, 4rem)", section: "clamp(4.5rem, 10vw, 9rem)" },
  container: { max: "84rem" },
  radius: { none: "0", sm: "2px", md: "4px" },
  shadows: {
    plate: "0 24px 60px -24px rgba(0,0,0,.7)",
    card: "0 14px 40px -18px rgba(0,0,0,.65)",
  },
  breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 },
} as const;

export type Theme = typeof THEME;
