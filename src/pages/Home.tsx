import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BUSINESS } from "../config/business";
import {
  availableCount,
  CATEGORY_META,
  featuredMachines,
  IMPLEMENTS,
  MACHINES,
  machineBySlug,
  IMG,
} from "../data/machines";
import type { Category } from "../data/machines";
import {
  cx,
  formatBRL,
  formatNum,
  generalMessage,
  machineMessage,
  prefersReducedMotion,
  usePageMeta,
  waLink,
} from "../lib/utils";
import { useApp } from "../store/AppStore";
import { MachineCard } from "../components/MachineCard";
import {
  Btn,
  Counter,
  HazardStrip,
  IcArrow,
  IcArrowUpRight,
  IcCoin,
  IcShield,
  IcSwap,
  IcTractor,
  IcWhatsApp,
  IcWrench,
  Kicker,
  Reveal,
  SectionHead,
  StatusTag,
} from "../components/ui";

gsap.registerPlugin(ScrollTrigger);

/* ============ dados das seções ============ */

const MARQUEE = [
  "Tratores",
  "Colheitadeiras",
  "Escavadeiras",
  "Retroescavadeiras",
  "Implementos",
  "Peças & assistência",
  "Financiamento",
  "Consórcio",
];

const STORY = [
  {
    word: "Força",
    img: IMG.forca,
    copy: "Torque em baixa rotação, tração 4x4 e chassi para aguentar safra atrás de safra.",
    meta: "01 / 04",
  },
  {
    word: "Produtividade",
    img: IMG.produtividade,
    copy: "Colheita com baixa perda, plantio no janela certa e hora-máquina que fecha a conta.",
    meta: "02 / 04",
  },
  {
    word: "Tecnologia",
    img: IMG.tecnologia,
    copy: "Cabine climatizada, piloto automático e telemetria — o operador rende, a máquina reporta.",
    meta: "03 / 04",
  },
  {
    word: "Resultado",
    img: IMG.resultado,
    copy: "Talhão pronto, obra entregue, contrato renovado. Máquina boa é a que paga a si mesma.",
    meta: "04 / 04",
  },
];

const APPS: { title: string; img: string; machines: string; cat: Category }[] = [
  { title: "Agricultura", img: IMG.tratorVerde, machines: "Tratores 75–230 cv para plantio, preparo e transporte", cat: "tratores" },
  { title: "Colheita", img: IMG.produtividade, machines: "Colheitadeiras axiais e plataformas de 25 a 35 pés", cat: "colheitadeiras" },
  { title: "Terraplenagem", img: IMG.escavadeira, machines: "Escavadeiras classe 20 t com material rodante revisado", cat: "escavadeiras" },
  { title: "Construção", img: IMG.retroescavadeira, machines: "Retroescavadeiras 4x4 para obra urbana e saneamento", cat: "retroescavadeiras" },
  { title: "Pecuária", img: IMG.resultado, machines: "Compactos, roçadeiras, carretas e distribuidores", cat: "tratores" },
  { title: "Infraestrutura", img: IMG.hero, machines: "Frota completa para contratos, locação e prefeitura", cat: "escavadeiras" },
];

const SPOTS = [
  {
    id: "motor",
    x: "26%",
    y: "46%",
    title: "Motor PowerTech 4.5L",
    points: ["110 cv de potência máxima", "4 cilindros turbo, 468 Nm de torque", "Manutenção a cada 500 h", "Tanque de 255 L para turno inteiro"],
  },
  {
    id: "cabine",
    x: "55%",
    y: "20%",
    title: "Cabine & comandos",
    points: ["Ar-condicionado e rádio originais", "Assento pneumático de série", "Painel digital com diagnóstico", "Reversor eletro-hidráulico na alavanca"],
  },
  {
    id: "rodado",
    x: "33%",
    y: "80%",
    title: "Rodado & tração",
    points: ["4x4 com bloqueio de diferencial", "Pneus R1 com 70%+ de vida útil", "Eixo dianteiro heavy-duty"],
  },
  {
    id: "hidraulica",
    x: "80%",
    y: "58%",
    title: "Hidráulica & implementos",
    points: ["TDF 540 / 540E / 1000 rpm", "Até 114 L/min de vazão", "Compatível com plantadeiras de 11 linhas", "Engate para carreta e grade de 28 discos"],
  },
];

/* ============ blocos ============ */

function Hero() {
  const heroRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: 20,
        scale: 1.1,
        ease: "none",
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        ".hero-line > span",
        { yPercent: 112 },
        { yPercent: 0, duration: 1.1, stagger: 0.15, ease: "power4.out", delay: 0.25 },
      );
      gsap.fromTo(
        ".hero-fade",
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, delay: 0.85, ease: "power3.out" },
      );
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative flex h-[100svh] min-h-[620px] items-end overflow-hidden">
      <img
        ref={bgRef}
        src={IMG.hero}
        alt="Trator arando o solo ao pôr do sol"
        className="absolute inset-0 h-[120%] w-full object-cover will-change-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/35 to-coal-950/60" aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-r from-coal-950/70 via-transparent to-transparent" aria-hidden="true" />

      {/* régua lateral de estoque */}
      <div className="hero-fade absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-4 xl:flex">
        <span className="h-24 w-px bg-steel-500" aria-hidden="true" />
        <p className="rotate-90 whitespace-nowrap font-cond text-[13px] font-semibold uppercase tracking-[0.3em] text-steel-300">
          Pátio aberto · {availableCount()} máquinas disponíveis
        </p>
        <span className="h-24 w-px bg-steel-500" aria-hidden="true" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-(--container-site) px-6 pb-24 pt-40">
        <div className="hero-fade">
          <Kicker>{BUSINESS.name} · {BUSINESS.address.city}/{BUSINESS.address.state}</Kicker>
        </div>
        <h1 className="mt-5 max-w-5xl font-display uppercase leading-[0.92] text-shadow-hard">
          <span className="mask-line hero-line text-[clamp(2.8rem,9vw,7.2rem)]">
            <span>Máquinas que</span>
          </span>
          <span className="mask-line hero-line text-[clamp(2.8rem,9vw,7.2rem)]">
            <span>
              movem <em className="not-italic text-hz-400">resultados</em>
            </span>
          </span>
        </h1>
        <p className="hero-fade mt-6 max-w-xl text-lg leading-relaxed text-bone-200/90 md:text-xl">
          {BUSINESS.tagline} Estoque real no pátio, ficha técnica completa e negociação direta com quem entende.
        </p>
        <div className="hero-fade mt-9 flex flex-wrap items-center gap-4">
          <Btn to="/maquinas" size="lg" tone="hz">
            Ver máquinas <IcArrow size={17} />
          </Btn>
          <Btn href={waLink(BUSINESS.whatsapp, generalMessage())} size="lg" tone="outline">
            <IcWhatsApp size={17} /> Falar com um consultor
          </Btn>
          <span className="hero-fade font-cond text-[13px] font-semibold uppercase tracking-[0.22em] text-steel-300">
            Resposta em horário comercial
          </span>
        </div>
      </div>

      {/* indicador de scroll */}
      <div className="absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex" aria-hidden="true">
        <span className="font-cond text-[11px] font-semibold uppercase tracking-[0.34em] text-steel-300">Role</span>
        <span className="block h-12 w-px overflow-hidden bg-steel-500/40">
          <span className="animate-scroll-line block h-full w-full bg-hz-400" />
        </span>
      </div>
    </section>
  );
}

function MarqueeBand() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <div className="hazard relative z-20 overflow-hidden py-3" aria-hidden="true">
      <div className="animate-marquee flex w-max items-center gap-8">
        {items.map((m, i) => (
          <span key={i} className="flex items-center gap-8 font-display text-lg uppercase tracking-[0.1em] text-coal-950">
            {m} <span className="text-coal-950/60">///</span>
          </span>
        ))}
      </div>
    </div>
  );
}

function StorySection() {
  return (
    <section className="relative" aria-label="Nossa narrativa: força, produtividade, tecnologia e resultado">
      {STORY.map((s, i) => (
        <StoryPanel key={s.word} {...s} z={i + 1} />
      ))}
    </section>
  );
}

function StoryPanel({ word, img, copy, meta, z }: { word: string; img: string; copy: string; meta: string; z: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !ref.current || !imgRef.current) return;
    const tween = gsap.fromTo(
      imgRef.current,
      { yPercent: -9 },
      {
        yPercent: 9,
        ease: "none",
        scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true },
      },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div ref={ref} className="sticky top-0 flex h-[100svh] items-end overflow-hidden border-t border-line-dark" style={{ zIndex: z }}>
      <img ref={imgRef} src={img} alt={`${word} — ${copy}`} loading="lazy" className="absolute inset-0 h-[120%] w-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/25 to-coal-950/40" aria-hidden="true" />
      <div className="relative z-10 mx-auto w-full max-w-(--container-site) px-6 pb-16 md:pb-20">
        <p className="font-cond text-sm font-bold uppercase tracking-[0.3em] text-hz-300">{meta}</p>
        <h3 className="mt-2 font-display text-[clamp(3.4rem,13vw,9.5rem)] uppercase leading-[0.85] text-shadow-hard">
          {word}
          <span className="text-hz-400">.</span>
        </h3>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-bone-200/90">{copy}</p>
      </div>
      <div className="absolute right-6 top-6 z-10 hidden md:block" aria-hidden="true">
        <span className="block h-16 w-16 border-r-2 border-t-2 border-hz-400/70" />
      </div>
    </div>
  );
}

function Opportunities() {
  const feats = featuredMachines();
  const main = feats[0];
  const rest = feats.slice(1, 4);
  const { openQuote } = useApp();
  if (!main) return null;

  return (
    <section className="relative border-b border-line-dark bg-coal-950 py-24 md:py-32">
      <div className="mx-auto max-w-(--container-site) px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Oportunidades da semana"
            title={<>Máquina parada é <span className="text-hz-400">dinheiro parado</span></>}
            lead="Selecionadas pelo time comercial: prontas para faturar, com revisão de entrega e histórico transparente."
          />
          <Reveal delay={200}>
            <Btn to="/maquinas" tone="outline">
              Estoque completo <IcArrow size={16} />
            </Btn>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {main && (
            <Reveal className="lg:col-span-3" variant="left">
              <Link to={`/maquinas/${main.slug}`} className="group block border border-line-dark bg-coal-900 transition-all duration-300 hover:border-steel-500 hover:shadow-plate">
                <div className="grid md:grid-cols-2">
                  <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:min-h-[380px]">
                    <img src={main.images[0]} alt={`${main.brand} ${main.model} ${main.year}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]" />
                    <span className="clip-cut-sm absolute left-4 top-4 bg-safety-500 px-3 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-bone-100">
                      Destaque do pátio
                    </span>
                    {main.priceWas ? (
                      <span className="absolute bottom-4 left-4 bg-coal-950/90 px-3 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.16em] text-safety-400">
                        De {formatBRL(main.priceWas)} por {main.price ? formatBRL(main.price) : "consultar"}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-col p-7 md:p-8">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.26em] text-steel-400">{main.brand} · {main.code}</p>
                      <StatusTag status={main.status} />
                    </div>
                    <h3 className="mt-2 font-display text-4xl uppercase leading-none">{main.model}</h3>
                    <p className="mt-4 line-clamp-3 text-[15px] leading-relaxed text-steel-300">{main.description}</p>
                    <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-line-dark py-4 text-center">
                      {[
                        [String(main.year), "Ano"],
                        [main.hours != null ? `${formatNum(main.hours)}h` : "0h", "Horas"],
                        [main.powerCv ? `${main.powerCv} cv` : "—", "Potência"],
                      ].map(([v, l]) => (
                        <div key={l}>
                          <dd className="font-cond text-xl font-bold text-bone-100">{v}</dd>
                          <dt className="font-cond text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-500">{l}</dt>
                        </div>
                      ))}
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                      {main.price ? (
                        <p className="font-cond text-3xl font-bold text-hz-300">{formatBRL(main.price)}</p>
                      ) : (
                        <p className="font-cond text-lg font-semibold uppercase tracking-[0.16em] text-bone-100">A consultar</p>
                      )}
                      <span className="flex items-center gap-2 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-hz-300 transition-transform duration-300 group-hover:translate-x-1">
                        Ver ficha <IcArrowUpRight size={16} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="flex flex-col gap-6 lg:col-span-2">
            {rest.map((m, i) => (
              <Reveal key={m.id} delay={i * 90} variant="right" className="flex-1">
                <Link to={`/maquinas/${m.slug}`} className="group flex h-full items-stretch gap-5 border border-line-dark bg-coal-900 p-4 transition-all duration-300 hover:border-steel-500 hover:shadow-card">
                  <div className="relative w-32 shrink-0 overflow-hidden sm:w-40">
                    <img src={m.images[0]} alt={`${m.brand} ${m.model} ${m.year}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col py-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.22em] text-steel-400">{m.brand} · {m.year}</p>
                      {m.badges[0] ? (
                        <span className="border border-agri-500/40 bg-agri-500/10 px-1.5 py-0.5 font-cond text-[10px] font-bold uppercase tracking-[0.14em] text-agri-300">{m.badges[0]}</span>
                      ) : null}
                    </div>
                    <h3 className="mt-1 truncate font-display text-2xl uppercase">{m.model}</h3>
                    <p className="mt-1 font-cond text-[13px] uppercase tracking-[0.14em] text-steel-400">
                      {m.hours != null ? `${formatNum(m.hours)} h` : "0 h"} · {m.powerCv ? `${m.powerCv} cv` : m.category}
                    </p>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <span className="font-cond text-xl font-bold text-hz-300">{m.price ? formatBRL(m.price) : "Consultar"}</span>
                      <IcArrowUpRight size={18} className="text-steel-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-hz-300" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
            {main && (
              <button
                onClick={() => openQuote(main)}
                className="clip-cut-sm border border-hz-500/40 bg-hz-400/5 px-5 py-4 text-left font-cond text-sm font-bold uppercase tracking-[0.18em] text-hz-300 transition-colors hover:bg-hz-400/10"
              >
                Quero um orçamento da {main.brand} {main.model} →
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryTiles() {
  const cats = Object.entries(CATEGORY_META) as [keyof typeof CATEGORY_META, (typeof CATEGORY_META)[keyof typeof CATEGORY_META]][];
  const countFor = (c: keyof typeof CATEGORY_META) =>
    c === "implementos" ? IMPLEMENTS.length : MACHINES.filter((m) => m.category === c).length;
  const linkFor = (c: keyof typeof CATEGORY_META) => (c === "implementos" ? "/implementos" : `/maquinas?categoria=${c}`);

  return (
    <section className="border-b border-line-dark bg-coal-900 py-24 md:py-32">
      <div className="mx-auto max-w-(--container-site) px-6">
        <SectionHead
          kicker="Catálogo por categoria"
          title={<>O que você procura <span className="text-hz-400">está no pátio</span></>}
          lead="Navegue por categoria e use os filtros de potência, horas, ano e preço para achar a máquina certa em minutos."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6">
          {cats.map(([key, meta], i) => (
            <Reveal key={key} delay={i * 70} className={cx(i === 0 ? "sm:col-span-2 lg:col-span-2 lg:row-span-2" : "lg:col-span-2", i === 0 && "lg:row-span-2")}>
              <Link
                to={linkFor(key)}
                className={cx(
                  "group relative block overflow-hidden border border-line-dark transition-all duration-300 hover:border-hz-400/70 hover:shadow-plate",
                  i === 0 ? "h-full min-h-[320px]" : "h-[220px]",
                )}
              >
                <img src={meta.image} alt={meta.plural} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/30 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5">
                  <div>
                    <p className="font-cond text-[11px] font-bold uppercase tracking-[0.24em] text-hz-300">{countFor(key)} em estoque</p>
                    <h3 className="mt-1 font-display text-3xl uppercase leading-none">{meta.plural}</h3>
                    <p className="mt-2 hidden max-w-[240px] text-[13px] leading-snug text-steel-300 sm:block">{meta.blurb}</p>
                  </div>
                  <span className="grid h-11 w-11 shrink-0 place-items-center border border-bone-100/25 text-bone-100 transition-all duration-300 group-hover:border-hz-400 group-hover:bg-hz-400 group-hover:text-coal-950">
                    <IcArrowUpRight size={19} />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Applications() {
  const secRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const sec = secRef.current;
        if (!track || !sec) return;
        const amount = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const tween = gsap.to(track, {
          x: () => -amount(),
          ease: "none",
          scrollTrigger: {
            trigger: sec,
            start: "top top",
            end: () => `+=${amount()}`,
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
        return () => {
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });
    }, secRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={secRef} className="relative flex h-auto flex-col justify-center overflow-hidden border-b border-line-dark bg-coal-950 py-16 md:h-[100svh] md:py-0">
      <div className="mx-auto w-full max-w-(--container-site) px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHead
            kicker="Escolha pela aplicação"
            title={<>Cada operação pede <span className="text-hz-400">uma máquina</span></>}
          />
          <p className="mb-2 hidden font-cond text-[13px] font-semibold uppercase tracking-[0.24em] text-steel-400 md:block">
            Continue rolando — o trilho anda sozinho →
          </p>
        </div>
      </div>
      <div className="mt-10 overflow-x-auto pb-8 md:overflow-visible md:pb-0" data-lenis-prevent>
        <div ref={trackRef} className="flex w-max gap-6 px-6 md:px-[max(1.5rem,calc((100vw-84rem)/2+1.5rem))]">
          {APPS.map((a, i) => (
            <Link
              key={a.title}
              to={`/maquinas?categoria=${a.cat}`}
              className="group relative block h-[52svh] min-h-[340px] w-[82vw] shrink-0 overflow-hidden border border-line-dark transition-colors duration-300 hover:border-hz-400/70 sm:w-[420px] md:h-[46vh] md:w-[460px]"
            >
              <img src={a.img} alt={a.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal-950 via-coal-950/20 to-transparent" aria-hidden="true" />
              <span className="absolute right-5 top-5 font-display text-5xl text-bone-100/12">0{i + 1}</span>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-4xl uppercase leading-none md:text-5xl">{a.title}</h3>
                <p className="mt-3 max-w-[300px] text-[14px] leading-relaxed text-bone-200/85">{a.machines}</p>
                <span className="mt-4 inline-flex items-center gap-2 border-b border-hz-400 pb-1 font-cond text-[13px] font-bold uppercase tracking-[0.2em] text-hz-300 transition-all duration-300 group-hover:gap-3.5">
                  Ver máquinas <IcArrow size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function HotspotSection() {
  const [active, setActive] = useState(SPOTS[0]?.id ?? "");
  const spot = SPOTS.find((s) => s.id === active) ?? SPOTS[0];
  const machine = machineBySlug("john-deere-6110j-2021");

  return (
    <section className="border-b border-line-dark bg-coal-900 py-24 md:py-32">
      <div className="mx-auto max-w-(--container-site) px-6">
        <SectionHead
          kicker="Showroom digital"
          title={<>Por dentro da <span className="text-hz-400">6110J</span></>}
          lead="Toque nos pontos da máquina e veja o que ela entrega. Todos os dados vêm da ficha técnica do estoque — nada inventado."
        />
        <div className="mt-14 grid items-start gap-10 lg:grid-cols-5">
          <Reveal variant="left" className="lg:col-span-3">
            <div className="tick-corners relative overflow-hidden border border-line-dark">
              <img src={IMG.forca} alt="John Deere 6110J em vista frontal" className="aspect-[16/11] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-coal-950/50 to-transparent" aria-hidden="true" />
              {SPOTS.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  aria-pressed={active === s.id}
                  aria-label={`Ver detalhes: ${s.title}`}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: s.x, top: s.y }}
                >
                  <span
                    className={cx(
                      "grid h-10 w-10 place-items-center rounded-full border-2 font-cond text-[11px] font-bold transition-all duration-300",
                      active === s.id
                        ? "animate-pulse-ring scale-110 border-hz-400 bg-hz-400 text-coal-950"
                        : "border-bone-100/70 bg-coal-950/60 text-bone-100 backdrop-blur-sm hover:scale-110 hover:border-hz-300",
                    )}
                  >
                    +
                  </span>
                </button>
              ))}
              <span className="absolute bottom-3 left-3 bg-coal-950/85 px-3 py-1.5 font-cond text-[11px] font-semibold uppercase tracking-[0.22em] text-steel-300">
                {machine ? `${machine.brand} ${machine.model} ${machine.year} · ${machine.code}` : "Máquina do estoque"}
              </span>
            </div>
          </Reveal>

          <Reveal variant="right" delay={120} className="lg:col-span-2">
            <div className="border border-line-dark bg-coal-950 p-7">
              <p className="font-cond text-[12px] font-bold uppercase tracking-[0.26em] text-hz-300">Ponto ativo</p>
              <h3 className="mt-2 font-display text-3xl uppercase leading-tight">{spot.title}</h3>
              <ul className="mt-5 space-y-3">
                {spot.points.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-[15px] leading-relaxed text-steel-200">
                    <span className="mt-[9px] h-[2px] w-4 shrink-0 bg-hz-400" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-7 flex flex-wrap gap-2 border-t border-line-dark pt-5">
                {SPOTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={cx(
                      "px-3 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.14em] transition-colors",
                      active === s.id ? "bg-hz-400 text-coal-950" : "border border-line-dark text-steel-300 hover:border-hz-400 hover:text-hz-300",
                    )}
                  >
                    {s.id === "rodado" ? "Rodado" : s.id === "hidraulica" ? "Hidráulica" : s.title.split(" ")[0]}
                  </button>
                ))}
              </div>
              {machine && (
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <Btn to={`/maquinas/${machine.slug}`} tone="hz" className="flex-1">
                    Ficha completa
                  </Btn>
                  <Btn href={waLink(BUSINESS.whatsapp, machineMessage(machine))} tone="outline" className="flex-1">
                    <IcWhatsApp size={16} /> WhatsApp
                  </Btn>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServicesSection() {
  return (
    <section className="border-b border-line-dark bg-coal-950 py-24 md:py-32">
      <div className="mx-auto max-w-(--container-site) px-6">
        <SectionHead
          kicker="Da assinatura à operação"
          title={<>A compra é só <span className="text-hz-400">a primeira marcha</span></>}
          lead="Financiamento, consórcio, troca com avaliação e assistência técnica — estrutura completa para a máquina trabalhar desde o primeiro dia."
        />
        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          <Reveal className="lg:col-span-3 lg:row-span-2" variant="left">
            <div className="relative flex h-full flex-col overflow-hidden border border-agri-500/40 bg-coal-900 p-8 md:p-10">
              <div className="pointer-events-none absolute -right-10 -top-10 opacity-[0.06]" aria-hidden="true">
                <IcCoin size={280} />
              </div>
              <Kicker tone="agri">Financiamento & consórcio</Kicker>
              <h3 className="mt-4 font-display text-4xl uppercase leading-[0.95] md:text-5xl">
                Financie sua <span className="text-agri-300">máquina</span>
              </h3>
              <p className="mt-4 max-w-md text-[15px] leading-relaxed text-steel-300">
                Trabalhamos com as principais linhas do mercado para produtor rural e empresa. A simulação chega pelo WhatsApp, sem compromisso.
              </p>
              <ul className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  ["CDC rural", "Parcelas que acompanham o ciclo da safra"],
                  ["Finame / BNDES", "Taxas subsidiadas para CNPJ"],
                  ["Consórcio", "Entrada programada sem juros"],
                  ["Barter", "Parcelas atreladas à produção"],
                ].map(([t, d]) => (
                  <li key={t} className="border border-line-dark bg-coal-950/60 p-4">
                    <p className="font-cond text-[15px] font-bold uppercase tracking-[0.1em] text-bone-100">{t}</p>
                    <p className="mt-1 text-[13px] leading-snug text-steel-400">{d}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-3 pt-8">
                <Btn to="/financiamento" tone="agri">
                  Solicitar simulação <IcArrow size={16} />
                </Btn>
                <Btn to="/troca" tone="outline">
                  Usar minha máquina de entrada
                </Btn>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={100} variant="right">
            <div className="flex h-full flex-col border border-safety-500/40 bg-coal-900 p-7">
              <IcSwap size={30} className="text-safety-400" />
              <h3 className="mt-4 font-display text-3xl uppercase leading-tight">
                Dê sua máquina <span className="text-safety-400">na troca</span>
              </h3>
              <p className="mt-3 text-[14px] leading-relaxed text-steel-300">
                Avaliamos seu usado pelo estado real — horas, revisões e pneus — e o valor vira entrada na próxima.
              </p>
              <Btn to="/troca" tone="safety" className="mt-6 self-start">
                Avaliar minha máquina
              </Btn>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-2" delay={180} variant="right">
            <div className="flex h-full flex-col border border-line-dark bg-coal-900 p-7">
              <div className="flex items-center gap-4">
                <IcWrench size={28} className="text-hz-400" />
                <IcShield size={28} className="text-steel-400" />
              </div>
              <h3 className="mt-4 font-display text-3xl uppercase leading-tight">Peças & assistência</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-steel-300">
                Oficina própria de {BUSINESS.stats[3]?.value} m², peças originais e atendimento em campo na região. Máquina revisada sai com checklist de 120 pontos.
              </p>
              <Btn href={waLink(BUSINESS.whatsapp, "Olá! Preciso de peças/assistência técnica para minha máquina.")} tone="outline" className="mt-6 self-start">
                <IcWhatsApp size={16} /> Chamar a oficina
              </Btn>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function YardSection() {
  const bgRef = useRef<HTMLImageElement | null>(null);
  const secRef = useRef<HTMLElement | null>(null);
  const prontaEntrega = MACHINES.filter((m) => m.badges.includes("Pronta entrega") && m.status === "disponivel");

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !bgRef.current || !secRef.current) return;
    const tween = gsap.fromTo(
      bgRef.current,
      { yPercent: -10 },
      { yPercent: 10, ease: "none", scrollTrigger: { trigger: secRef.current, start: "top bottom", end: "bottom top", scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={secRef} className="relative overflow-hidden border-b border-line-dark">
      <img ref={bgRef} src={IMG.patio} alt="Pátio da TerraForte com máquinas em linha" loading="lazy" className="absolute inset-0 h-[120%] w-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-coal-950/82" aria-hidden="true" />
      <div className="relative mx-auto max-w-(--container-site) px-6 py-24 md:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Máquinas disponíveis agora"
            title={<>O pátio está <span className="text-hz-400">cheio</span></>}
            lead="Unidades com pronta entrega, faturamento imediato e frete combinado para toda a região."
          />
          <Reveal delay={150}>
            <div className="flex items-center gap-3 border border-agri-500/40 bg-agri-500/10 px-5 py-3">
              <span className="h-2.5 w-2.5 animate-pulse bg-agri-400" aria-hidden="true" />
              <p className="font-cond text-sm font-bold uppercase tracking-[0.2em] text-agri-300">
                {availableCount()} disponíveis hoje
              </p>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 flex snap-x gap-6 overflow-x-auto pb-6" data-lenis-prevent>
          {prontaEntrega.map((m, i) => (
            <div key={m.id} className="w-[300px] shrink-0 snap-start sm:w-[340px]">
              <MachineCard m={m} delay={i * 80} />
            </div>
          ))}
          <div className="flex w-[260px] shrink-0 snap-start items-center justify-center border border-dashed border-steel-500 p-6">
            <Btn to="/maquinas" tone="outline" className="w-full">
              Ver estoque completo
            </Btn>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t border-bone-100/10 pt-8 md:grid-cols-3">
          {BUSINESS.stats.slice(0, 3).map((s) => (
            <p key={s.label} className="font-cond text-sm uppercase tracking-[0.2em] text-steel-300">
              <span className="font-display text-3xl tracking-normal text-bone-100">
                <Counter to={s.value} suffix={s.suffix} />
              </span>{" "}
              — {s.label}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsBand() {
  const list = [...BUSINESS.brands, ...BUSINESS.brands];
  return (
    <section className="overflow-hidden border-b border-line-dark bg-coal-900 py-14" aria-label="Marcas trabalhadas">
      <p className="mb-8 text-center font-cond text-[13px] font-semibold uppercase tracking-[0.3em] text-steel-400">
        Marcas trabalhadas
      </p>
      <div className="animate-marquee flex w-max items-center gap-14" aria-hidden="true">
        {list.map((b, i) => (
          <span key={`${b}-${i}`} className="flex items-center gap-14">
            <span className="font-display text-4xl uppercase text-steel-500 transition-colors duration-300 hover:text-hz-300 md:text-5xl">{b}</span>
            <span className="h-2 w-2 rotate-45 bg-hz-400/50" />
          </span>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  const ctaRef = useRef<HTMLElement | null>(null);
  const bgRef = useRef<HTMLImageElement | null>(null);

  useLayoutEffect(() => {
    if (prefersReducedMotion() || !bgRef.current || !ctaRef.current) return;
    const tween = gsap.fromTo(
      bgRef.current,
      { yPercent: -12 },
      { yPercent: 12, ease: "none", scrollTrigger: { trigger: ctaRef.current, start: "top bottom", end: "bottom top", scrub: true } },
    );
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={ctaRef} className="relative overflow-hidden">
      <img ref={bgRef} src={IMG.hero} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-[124%] w-full object-cover will-change-transform" />
      <div className="absolute inset-0 bg-coal-950/78" aria-hidden="true" />
      <HazardStrip className="relative" />
      <div className="relative mx-auto max-w-(--container-site) px-6 py-28 text-center md:py-40">
        <Reveal>
          <Kicker tone="steel">{BUSINESS.slogan}</Kicker>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="mx-auto mt-6 max-w-4xl font-display text-[clamp(2.4rem,7vw,5.5rem)] uppercase leading-[0.92] text-shadow-hard">
            A próxima máquina do seu negócio <span className="text-hz-400">pode estar aqui</span>
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Btn to="/maquinas" size="lg" tone="hz">
              Ver estoque <IcArrow size={17} />
            </Btn>
            <Btn href={waLink(BUSINESS.whatsapp, generalMessage())} size="lg" tone="outline">
              <IcWhatsApp size={17} /> Falar com consultor
            </Btn>
          </div>
        </Reveal>
        <Reveal delay={280}>
          <p className="mt-8 font-cond text-[13px] font-semibold uppercase tracking-[0.24em] text-steel-300">
            <IcTractor size={18} className="mr-2 inline text-hz-400" />
            Pátio aberto para visita — {BUSINESS.address.street}, {BUSINESS.address.city}/{BUSINESS.address.state}
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Home() {
  usePageMeta(
    "TerraForte Máquinas — Tratores, Máquinas Agrícolas e Pesadas | Ribeirão Preto/SP",
    "Trator à venda, colheitadeira, escavadeira e retroescavadeira usada ou nova em Ribeirão Preto. Implementos agrícolas, financiamento, consórcio e troca. Visite o pátio.",
  );

  return (
    <>
      <Hero />
      <MarqueeBand />
      <StorySection />
      <Opportunities />
      <CategoryTiles />
      <Applications />
      <HotspotSection />
      <ServicesSection />
      <YardSection />
      <BrandsBand />
      <FinalCta />
    </>
  );
}
