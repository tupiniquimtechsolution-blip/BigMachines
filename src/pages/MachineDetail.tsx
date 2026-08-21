import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BUSINESS } from "../config/business";
import { CATEGORY_META, machineBySlug, similarTo } from "../data/machines";
import { cx, financeMessage, formatBRL, formatNum, machineMessage, usePageMeta, waLink } from "../lib/utils";
import { useApp } from "../store/AppStore";
import { MachineCard } from "../components/MachineCard";
import { Lightbox } from "../components/overlays";
import {
  Btn,
  HazardStrip,
  IcCalendar,
  IcClock,
  IcEngine,
  IcFuel,
  IcGauge,
  IcGear,
  IcHeart,
  IcPhone,
  IcPin,
  IcPlay,
  IcScale,
  IcShield,
  IcSwap,
  IcWeight,
  IcWhatsApp,
  Kicker,
  Reveal,
  StatusTag,
} from "../components/ui";

export default function MachineDetail() {
  const { slug } = useParams();
  const machine = slug ? machineBySlug(slug) : undefined;
  const { isFavorite, toggleFavorite, inCompare, toggleCompare, openQuote } = useApp();
  const [imgIdx, setImgIdx] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const jsonLd = useMemo(() => {
    if (!machine) return undefined;
    const product: Record<string, unknown> = {
      "@type": "Product",
      name: `${machine.brand} ${machine.model} ${machine.year}`,
      description: machine.description,
      brand: { "@type": "Brand", name: machine.brand },
      sku: machine.code,
      image: machine.images,
    };
    if (machine.price && machine.status !== "vendida") {
      product.offers = {
        "@type": "Offer",
        price: machine.price,
        priceCurrency: "BRL",
        availability:
          machine.status === "disponivel" ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
      };
    }
    return {
      "@context": "https://schema.org",
      "@graph": [
        product,
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: "#/" },
            { "@type": "ListItem", position: 2, name: "Máquinas", item: "#/maquinas" },
            {
              "@type": "ListItem",
              position: 3,
              name: CATEGORY_META[machine.category].plural,
              item: `#/maquinas?categoria=${machine.category}`,
            },
            { "@type": "ListItem", position: 4, name: `${machine.brand} ${machine.model}` },
          ],
        },
      ],
    };
  }, [machine]);

  usePageMeta(
    machine
      ? `${machine.brand} ${machine.model} ${machine.year} ${machine.condition === "novo" ? "nova" : "usada"} — ${BUSINESS.name}`
      : "Máquina não encontrada",
    machine ? machine.description.slice(0, 158) : undefined,
    jsonLd,
  );

  if (!machine) {
    return (
      <div className="grid min-h-[70vh] place-items-center px-6 pt-32 text-center">
        <div>
          <p className="font-cond text-[13px] font-bold uppercase tracking-[0.3em] text-safety-400">Erro 404</p>
          <h1 className="mt-3 font-display text-5xl uppercase">Máquina não encontrada</h1>
          <p className="mx-auto mt-4 max-w-md text-steel-300">O link pode estar quebrado ou a máquina saiu do estoque. Dá uma olhada no catálogo atualizado.</p>
          <Btn to="/maquinas" className="mt-8">Ver estoque completo</Btn>
        </div>
      </div>
    );
  }

  const sold = machine.status === "vendida";
  const similar = similarTo(machine);
  const title = `${machine.brand} ${machine.model} ${machine.year}`;

  const specIcons = [
    { icon: IcCalendar, label: "Ano", value: String(machine.year) },
    { icon: IcClock, label: "Horas", value: machine.hours != null ? `${formatNum(machine.hours)} h` : "0 h" },
    { icon: IcGauge, label: "Potência", value: machine.powerCv ? `${machine.powerCv} cv` : null },
    { icon: IcFuel, label: "Combustível", value: machine.fuel ?? null },
    { icon: IcGear, label: "Transmissão", value: machine.transmission ?? null },
    { icon: IcWeight, label: "Peso", value: machine.weightKg ? `${formatNum(machine.weightKg)} kg` : null },
  ].filter((s) => s.value !== null);

  return (
    <div className="pt-[76px] lg:pt-[118px]">
      {/* breadcrumb */}
      <nav aria-label="Trilha de navegação" className="border-b border-line-dark bg-coal-900">
        <div className="mx-auto flex max-w-(--container-site) flex-wrap items-center gap-2 px-6 py-3.5 font-cond text-[12px] font-semibold uppercase tracking-[0.18em] text-steel-400">
          <Link to="/" className="transition-colors hover:text-hz-300">Início</Link>
          <span aria-hidden="true">/</span>
          <Link to="/maquinas" className="transition-colors hover:text-hz-300">Máquinas</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/maquinas?categoria=${machine.category}`} className="transition-colors hover:text-hz-300">
            {CATEGORY_META[machine.category].plural}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-bone-100">{title}</span>
        </div>
      </nav>

      <div className="mx-auto max-w-(--container-site) px-6 py-10 md:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          {/* galeria */}
          <div>
            <Reveal variant="left">
              <div className="tick-corners relative overflow-hidden border border-line-dark bg-coal-800">
                <button onClick={() => setLightbox(true)} className="group block w-full" aria-label="Abrir galeria em tela cheia">
                  <img src={machine.images[imgIdx]} alt={`${title} — foto ${imgIdx + 1}`} className={cx("aspect-[16/10] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]", sold && "grayscale")} />
                </button>
                {sold && (
                  <div className="pointer-events-none absolute inset-0 grid place-items-center bg-coal-950/40">
                    <span className="-rotate-6 border-2 border-safety-400 bg-coal-950/90 px-8 py-3 font-display text-3xl uppercase tracking-[0.14em] text-safety-400">Vendida</span>
                  </div>
                )}
                <div className="absolute left-4 top-4 flex gap-2">
                  <span className={cx("clip-cut-sm px-3 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.18em]", machine.condition === "novo" ? "bg-hz-400 text-coal-950" : "bg-coal-950/85 text-bone-100")}>
                    {machine.condition === "novo" ? "Novo" : "Usado"}
                  </span>
                  {machine.badges.map((b) => (
                    <span key={b} className="clip-cut-sm bg-agri-500 px-3 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-bone-100">
                      {b}
                    </span>
                  ))}
                </div>
                <span className="absolute bottom-4 right-4 flex items-center gap-2 bg-coal-950/85 px-3 py-1.5 font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-bone-100">
                  <IcPlay size={13} className="text-hz-400" /> Ampliar fotos
                </span>
              </div>
            </Reveal>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              {machine.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={cx("h-20 w-28 overflow-hidden border transition-all duration-200", i === imgIdx ? "border-hz-400" : "border-line-dark opacity-60 hover:opacity-100")}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === imgIdx}
                >
                  <img src={img} alt="" className={cx("h-full w-full object-cover", sold && "grayscale")} />
                </button>
              ))}
              <span
                className="grid h-20 w-28 cursor-not-allowed place-items-center border border-dashed border-steel-500 text-center font-cond text-[10px] font-semibold uppercase tracking-[0.16em] text-steel-500"
                title="Recurso pronto — ativa quando houver sequência fotográfica da máquina"
              >
                360°<br />em breve
              </span>
            </div>

            {/* descrição + ficha */}
            <Reveal className="mt-12">
              <Kicker>Sobre esta máquina</Kicker>
              <h2 className="mt-3 font-display text-3xl uppercase leading-tight md:text-4xl">{title}</h2>
              <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-steel-200">{machine.description}</p>
              <p className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-cond text-[13px] font-semibold uppercase tracking-[0.16em] text-steel-400">
                <span className="flex items-center gap-2"><IcPin size={15} className="text-hz-400" /> {machine.location}</span>
                <span className="flex items-center gap-2"><IcEngine size={15} className="text-hz-400" /> Aplicação: {machine.application}</span>
                <span className="flex items-center gap-2"><IcShield size={15} className="text-hz-400" /> Código {machine.code}</span>
              </p>
            </Reveal>

            <Reveal className="mt-12" delay={80}>
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl uppercase">Ficha técnica</h3>
                <span className="hidden font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-steel-500 sm:block">
                  Só exibimos o que está confirmado no pátio
                </span>
              </div>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {machine.specGroups.map((g, gi) => (
                  <div key={g.title} className={cx("border border-line-dark p-6", gi === 0 && "bg-coal-900")}>
                    <p className="flex items-center gap-3 font-cond text-[13px] font-bold uppercase tracking-[0.24em] text-hz-300">
                      <span className="h-[2px] w-6 bg-hz-400" aria-hidden="true" /> {g.title}
                    </p>
                    <dl className="mt-4">
                      {g.rows.map(([k, v]) => (
                        <div key={k} className="flex items-baseline justify-between gap-4 border-b border-line-dark/70 py-2.5 last:border-b-0">
                          <dt className="text-[14px] text-steel-400">{k}</dt>
                          <dd className="text-right font-cond text-[15px] font-semibold text-bone-100">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* resumo lateral */}
          <aside className="lg:sticky lg:top-32 lg:self-start">
            <div className="border border-line-dark bg-coal-900">
              <div className="hazard-thin h-1.5 w-full opacity-60" aria-hidden="true" />
              <div className="p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-cond text-[12px] font-bold uppercase tracking-[0.26em] text-steel-400">
                    {machine.brand} · {machine.code}
                  </p>
                  <StatusTag status={machine.status} />
                </div>
                <h1 className="mt-2 font-display text-4xl uppercase leading-[0.95]">{machine.model}</h1>
                <p className="mt-2 font-cond text-[14px] font-semibold uppercase tracking-[0.18em] text-steel-300">
                  {CATEGORY_META[machine.category].label} · {machine.year} · {machine.location}
                </p>

                <div className="mt-6 border-y-2 border-hz-400/60 py-4">
                  {machine.price ? (
                    <div className="flex flex-wrap items-baseline gap-3">
                      <p className="font-cond text-[34px] font-bold leading-none text-hz-300">{formatBRL(machine.price)}</p>
                      {machine.priceWas ? <p className="font-cond text-[16px] text-steel-400 line-through">{formatBRL(machine.priceWas)}</p> : null}
                    </div>
                  ) : (
                    <p className="font-cond text-xl font-semibold uppercase tracking-[0.14em] text-bone-100">Preço a consultar</p>
                  )}
                  <p className="mt-1.5 text-[13px] text-steel-400">
                    {sold ? "Vendida — fale conosco para unidades semelhantes." : machine.status === "reservada" ? "Reservada — entre na lista de espera." : "Valor para faturamento à vista. Financiamento sujeito a análise."}
                  </p>
                </div>

                <dl className="mt-5 grid grid-cols-2 gap-3">
                  {specIcons.map((s) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="flex items-center gap-2.5 border border-line-dark bg-coal-950 px-3 py-2.5">
                        <Icon size={16} className="shrink-0 text-hz-400" />
                        <div className="min-w-0">
                          <dt className="font-cond text-[10px] font-semibold uppercase tracking-[0.18em] text-steel-500">{s.label}</dt>
                          <dd className="truncate font-cond text-[14px] font-semibold text-bone-100">{s.value}</dd>
                        </div>
                      </div>
                    );
                  })}
                </dl>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => toggleFavorite(machine.id)}
                    aria-pressed={isFavorite(machine.id)}
                    className={cx(
                      "flex flex-1 items-center justify-center gap-2 border px-3 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.12em] transition-colors",
                      isFavorite(machine.id) ? "border-safety-500/60 bg-safety-500/10 text-safety-400" : "border-line-dark text-steel-300 hover:border-safety-400 hover:text-safety-400",
                    )}
                  >
                    <IcHeart size={15} filled={isFavorite(machine.id)} /> Salvar
                  </button>
                  <button
                    onClick={() => toggleCompare(machine.id)}
                    aria-pressed={inCompare(machine.id)}
                    className={cx(
                      "flex flex-1 items-center justify-center gap-2 border px-3 py-3 font-cond text-[12px] font-bold uppercase tracking-[0.12em] transition-colors",
                      inCompare(machine.id) ? "border-hz-400 bg-hz-400/10 text-hz-300" : "border-line-dark text-steel-300 hover:border-hz-400 hover:text-hz-300",
                    )}
                  >
                    <IcScale size={15} /> Comparar
                  </button>
                </div>

                <div className="mt-4 grid gap-3">
                  {sold ? (
                    <Btn href={waLink(BUSINESS.whatsapp, `Olá! Vi a ${title} (${machine.code}) vendida. Me avisem quando entrar uma semelhante?`)} tone="safety" size="lg">
                      <IcWhatsApp size={18} /> Quero uma semelhante
                    </Btn>
                  ) : (
                    <>
                      <Btn href={waLink(BUSINESS.whatsapp, machineMessage(machine))} tone="agri" size="lg">
                        <IcWhatsApp size={18} /> WhatsApp sobre esta máquina
                      </Btn>
                      <div className="grid grid-cols-2 gap-3">
                        <Btn onClick={() => openQuote(machine)} tone="hz">
                          Orçamento
                        </Btn>
                        <Btn href={`tel:+${BUSINESS.phoneRaw}`} tone="dark">
                          <IcPhone size={16} /> Ligar
                        </Btn>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Btn to={`/financiamento?maquina=${encodeURIComponent(machine.code)}`} tone="outline">
                          Financiar
                        </Btn>
                        <Btn to="/troca" tone="outline">
                          <IcSwap size={16} /> Troca
                        </Btn>
                      </div>
                    </>
                  )}
                </div>

                <p className="mt-5 border-t border-line-dark pt-4 text-[12px] leading-relaxed text-steel-500">
                  Atendimento em horário comercial: Seg–Sex 07h30–18h · Sáb 08h–12h30. Visita ao pátio com hora marcada.
                </p>
              </div>
            </div>

            <div className="mt-5 hidden border border-agri-500/40 bg-agri-500/5 p-5 lg:block">
              <p className="font-cond text-[13px] font-bold uppercase tracking-[0.2em] text-agri-300">Aceitamos troca</p>
              <p className="mt-2 text-[14px] leading-relaxed text-steel-300">
                Seu usado pode virar entrada. Envie marca, modelo e horas que retornamos com a avaliação.
              </p>
              <Link to="/troca" className="mt-3 inline-flex items-center gap-2 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-hz-300 hover:text-hz-400">
                Avaliar minha máquina →
              </Link>
            </div>
          </aside>
        </div>

        {/* semelhantes */}
        {similar.length > 0 && (
          <section className="mt-20" aria-label="Máquinas semelhantes">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Kicker>Continue olhando</Kicker>
                <h2 className="mt-3 font-display text-3xl uppercase md:text-4xl">Semelhantes no pátio</h2>
              </div>
              <Btn to={`/maquinas?categoria=${machine.category}`} tone="outline">
                Ver {CATEGORY_META[machine.category].plural.toLowerCase()}
              </Btn>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((m, i) => (
                <MachineCard key={m.id} m={m} delay={i * 80} />
              ))}
            </div>
          </section>
        )}
      </div>

      <HazardStrip className="opacity-60" />

      {/* barra mobile de conversão */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-dark bg-coal-900/97 p-3 backdrop-blur-md lg:hidden" style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>
        <div className="grid grid-cols-3 gap-2">
          <a
            href={waLink(BUSINESS.whatsapp, sold ? `Olá! Vi a ${title} (${machine.code}) vendida. Me avisem quando entrar uma semelhante?` : machineMessage(machine))}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-agri-500 px-2 py-3.5 font-cond text-[12px] font-bold uppercase tracking-[0.1em] text-bone-100"
          >
            <IcWhatsApp size={16} /> WhatsApp
          </a>
          <a href={`tel:+${BUSINESS.phoneRaw}`} className="flex items-center justify-center gap-2 border border-line-dark bg-coal-800 px-2 py-3.5 font-cond text-[12px] font-bold uppercase tracking-[0.1em] text-bone-100">
            <IcPhone size={15} /> Ligar
          </a>
          <button
            onClick={() => (sold ? window.open(waLink(BUSINESS.whatsapp, machineMessage(machine)), "_blank") : openQuote(machine))}
            className="clip-cut-sm bg-hz-400 px-2 py-3.5 font-cond text-[12px] font-bold uppercase tracking-[0.1em] text-coal-950"
          >
            Orçamento
          </button>
        </div>
      </div>

      {lightbox && <Lightbox images={machine.images} index={imgIdx} onIndex={setImgIdx} onClose={() => setLightbox(false)} title={title} />}
    </div>
  );
}
