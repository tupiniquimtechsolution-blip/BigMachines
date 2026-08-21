import { useEffect, useRef, useState } from "react";
import { BUSINESS } from "../config/business";
import type { Machine } from "../data/machines";

export const cx = (...parts: (string | false | null | undefined)[]) =>
  parts.filter(Boolean).join(" ");

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

export const formatNum = (v: number) => v.toLocaleString("pt-BR");

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- WhatsApp contextual ---------------- */

export const waLink = (phone: string, message: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;

export const machineMessage = (m: Machine) =>
  [
    "Olá! Tenho interesse na máquina abaixo:",
    "",
    `• Marca: ${m.brand}`,
    `• Modelo: ${m.model}`,
    `• Ano: ${m.year}`,
    m.hours != null ? `• Horas: ${formatNum(m.hours)} h` : "",
    m.price ? `• Preço: ${formatBRL(m.price)}` : "• Preço: a consultar",
    `• Código: ${m.code}`,
    "",
    `Encontrei no site da ${BUSINESS.name} e gostaria de receber mais informações.`,
  ]
    .filter(Boolean)
    .join("\n");

export const financeMessage = (m: Machine) =>
  [
    "Olá! Gostaria de uma SIMULAÇÃO DE FINANCIAMENTO:",
    "",
    `• Máquina: ${m.brand} ${m.model} ${m.year} (${m.code})`,
    m.price ? `• Valor: ${formatBRL(m.price)}` : "• Valor: a consultar",
    "",
    "Pode me apresentar as opções de CDC, Finame ou consórcio?",
  ].join("\n");

export const quoteMessage = (data: {
  name: string;
  company?: string;
  phone: string;
  city: string;
  machine?: string;
  message?: string;
}) =>
  [
    "Olá! Quero solicitar um ORÇAMENTO pelo site:",
    "",
    `• Nome: ${data.name}`,
    data.company ? `• Empresa: ${data.company}` : "",
    `• Telefone: ${data.phone}`,
    `• Cidade: ${data.city}`,
    data.machine ? `• Máquina de interesse: ${data.machine}` : "",
    data.message ? `• Mensagem: ${data.message}` : "",
    "",
    "Aguardo retorno.",
  ]
    .filter(Boolean)
    .join("\n");

export const tradeMessage = (data: {
  name: string;
  brand: string;
  model: string;
  year: string;
  hours: string;
  state: string;
  city: string;
  phone: string;
  desc?: string;
  photos: number;
}) =>
  [
    "Olá! Quero DAR MINHA MÁQUINA NA TROCA:",
    "",
    `• Marca: ${data.brand}`,
    `• Modelo: ${data.model}`,
    `• Ano: ${data.year}`,
    data.hours ? `• Horas: ${data.hours}` : "",
    `• Estado de conservação: ${data.state}`,
    `• Cidade: ${data.city}`,
    `• Contato: ${data.phone} (${data.name})`,
    data.desc ? `• Observações: ${data.desc}` : "",
    data.photos ? `• Tenho ${data.photos} foto(s) para enviar na sequência.` : "",
    "",
    "Como seguimos com a avaliação?",
  ]
    .filter(Boolean)
    .join("\n");

export const generalMessage = () =>
  `Olá! Vim pelo site da ${BUSINESS.name} e gostaria de falar com um consultor.`;

/* ---------------- SEO por página ---------------- */

export function usePageMeta(title: string, description?: string, jsonLd?: object) {
  useEffect(() => {
    document.title = title;
    if (description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute("content", description);
    }
    const prev = document.getElementById("page-jsonld");
    if (prev) prev.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "page-jsonld";
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
    return () => {
      const el = document.getElementById("page-jsonld");
      if (el) el.remove();
    };
  }, [title, description, jsonLd]);
}

/* ---------------- IntersectionObserver ---------------- */

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, inView };
}
