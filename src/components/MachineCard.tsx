import { Link } from "react-router-dom";
import { BUSINESS } from "../config/business";
import type { Implement, Machine } from "../data/machines";
import { cx, formatBRL, formatNum, machineMessage, waLink } from "../lib/utils";
import { useApp } from "../store/AppStore";
import { IcArrow, IcCalendar, IcClock, IcGauge, IcHeart, IcPin, IcScale, IcWhatsApp, StatusTag } from "./ui";

function PricePlate({ price, priceWas }: { price: number | null; priceWas?: number }) {
  return (
    <div className="clip-cut-sm absolute bottom-3 left-3 z-10 bg-coal-950/92 px-4 py-2.5 backdrop-blur-sm">
      {price ? (
        <div className="flex items-baseline gap-2.5">
          <span className="font-cond text-[22px] font-bold leading-none text-hz-300">{formatBRL(price)}</span>
          {priceWas ? (
            <span className="font-cond text-[13px] text-steel-400 line-through">{formatBRL(priceWas)}</span>
          ) : null}
        </div>
      ) : (
        <span className="font-cond text-[16px] font-semibold uppercase tracking-[0.18em] text-bone-100">
          Preço a consultar
        </span>
      )}
    </div>
  );
}

function HeartBtn({ id, className }: { id: string; className?: string }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(id);
  return (
    <button
      onClick={() => toggleFavorite(id)}
      aria-pressed={fav}
      aria-label={fav ? "Remover das minhas máquinas" : "Salvar nas minhas máquinas"}
      title="Minhas máquinas"
      className={cx(
        "grid h-10 w-10 place-items-center border backdrop-blur-sm transition-all duration-200",
        fav
          ? "border-safety-500/60 bg-safety-500/15 text-safety-400"
          : "border-line-dark bg-coal-950/70 text-steel-300 hover:border-safety-400 hover:text-safety-400",
        className,
      )}
    >
      <IcHeart size={17} filled={fav} />
    </button>
  );
}

function CompareBtn({ id }: { id: string }) {
  const { inCompare, toggleCompare } = useApp();
  const on = inCompare(id);
  return (
    <button
      onClick={() => toggleCompare(id)}
      aria-pressed={on}
      title={on ? "Remover da comparação" : "Adicionar à comparação (até 3)"}
      aria-label={on ? "Remover da comparação" : "Adicionar à comparação"}
      className={cx(
        "grid h-[46px] w-[46px] shrink-0 place-items-center border transition-all duration-200",
        on
          ? "border-hz-400 bg-hz-400 text-coal-950"
          : "border-line-dark bg-coal-800 text-steel-300 hover:border-hz-400 hover:text-hz-300",
      )}
    >
      <IcScale size={18} />
    </button>
  );
}

export function MachineCard({ m, delay = 0 }: { m: Machine; delay?: number }) {
  const sold = m.status === "vendida";
  return (
    <article
      className={cx(
        "group relative flex flex-col border border-line-dark bg-coal-900 transition-all duration-300",
        sold ? "opacity-75" : "hover:-translate-y-1.5 hover:border-steel-500 hover:shadow-plate",
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[3/2] overflow-hidden bg-coal-800">
        <Link to={`/maquinas/${m.slug}`} tabIndex={-1} aria-hidden="true">
          <img
            src={m.images[0]}
            alt={`${m.brand} ${m.model} ${m.year} — ${sold ? "vendida" : "disponível no pátio"}`}
            loading="lazy"
            className={cx(
              "h-full w-full object-cover transition-transform duration-700 ease-out",
              sold ? "grayscale" : "group-hover:scale-[1.06]",
            )}
          />
        </Link>
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <div className="flex flex-col gap-2">
            <span
              className={cx(
                "clip-cut-sm px-2.5 py-1 font-cond text-[12px] font-bold uppercase tracking-[0.18em]",
                m.condition === "novo" ? "bg-hz-400 text-coal-950" : "bg-coal-950/85 text-bone-100 backdrop-blur-sm",
              )}
            >
              {m.condition === "novo" ? "Novo" : "Usado"}
            </span>
            <StatusTag status={m.status} />
          </div>
          <div className="flex gap-2">
            <HeartBtn id={m.id} />
          </div>
        </div>
        {sold ? (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-coal-950/40">
            <span className="-rotate-6 border-2 border-safety-400 bg-coal-950/90 px-6 py-2 font-display text-2xl uppercase tracking-[0.14em] text-safety-400">
              Vendida
            </span>
          </div>
        ) : (
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full bg-hz-400 py-2 text-center font-cond text-[13px] font-bold uppercase tracking-[0.2em] text-coal-950 transition-transform duration-300 group-hover:translate-y-0">
            Ver ficha completa →
          </div>
        )}
        <PricePlate price={m.price} priceWas={m.priceWas} />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.24em] text-steel-400">
              {m.brand} · {m.code}
            </p>
            <h3 className="mt-1 font-display text-[26px] leading-none uppercase">
              <Link to={`/maquinas/${m.slug}`} className="transition-colors hover:text-hz-300">
                {m.model}
              </Link>
            </h3>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-line-dark py-3.5 text-[14px] text-steel-200">
          <div className="flex items-center gap-2">
            <IcCalendar size={15} className="text-hz-400" />
            <dt className="sr-only">Ano</dt>
            <dd className="font-cond font-semibold tracking-wide">{m.year}</dd>
          </div>
          <div className="flex items-center gap-2">
            <IcClock size={15} className="text-hz-400" />
            <dt className="sr-only">Horas de uso</dt>
            <dd className="font-cond font-semibold tracking-wide">{m.hours != null ? `${formatNum(m.hours)} h` : "0 h"}</dd>
          </div>
          {m.powerCv ? (
            <div className="flex items-center gap-2">
              <IcGauge size={15} className="text-hz-400" />
              <dt className="sr-only">Potência</dt>
              <dd className="font-cond font-semibold tracking-wide">{m.powerCv} cv</dd>
            </div>
          ) : null}
          <div className="flex items-center gap-2">
            <IcPin size={15} className="text-hz-400" />
            <dt className="sr-only">Localização</dt>
            <dd className="font-cond font-semibold tracking-wide">{m.location}</dd>
          </div>
        </dl>

        {m.badges.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {m.badges.map((b) => (
              <li key={b} className="border border-agri-500/40 bg-agri-500/10 px-2 py-0.5 font-cond text-[11px] font-semibold uppercase tracking-[0.14em] text-agri-300">
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-auto flex items-center gap-2 pt-5">
          {sold ? (
            <a
              href={waLink(BUSINESS.whatsapp, `Olá! Vi a ${m.brand} ${m.model} ${m.year} (${m.code}) que foi vendida. Me avisem quando entrar uma semelhante?`)}
              target="_blank"
              rel="noreferrer"
              className="clip-cut-sm flex flex-1 items-center justify-center gap-2 bg-coal-700 px-4 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-bone-100 transition-colors hover:bg-coal-600"
            >
              <IcWhatsApp size={16} /> Quero uma semelhante
            </a>
          ) : (
            <>
              <Link
                to={`/maquinas/${m.slug}`}
                className="clip-cut-sm flex flex-1 items-center justify-center gap-2 border border-steel-500 px-4 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-bone-100 transition-all duration-200 hover:border-hz-400 hover:text-hz-300"
              >
                Detalhes <IcArrow size={15} />
              </Link>
              <a
                href={waLink(BUSINESS.whatsapp, machineMessage(m))}
                target="_blank"
                rel="noreferrer"
                aria-label={`Falar no WhatsApp sobre ${m.brand} ${m.model}`}
                title="WhatsApp"
                className="grid h-[46px] w-[46px] shrink-0 place-items-center bg-agri-500 text-bone-100 transition-all duration-200 hover:bg-agri-400"
              >
                <IcWhatsApp size={19} />
              </a>
              <CompareBtn id={m.id} />
            </>
          )}
        </div>
      </div>
    </article>
  );
}

/* ---------------- Implementos (ilustração técnica em SVG) ---------------- */

function ImplGlyph({ type }: { type: Implement["glyph"] }) {
  const paths: Record<Implement["glyph"], React.ReactNode> = {
    arado: (
      <>
        <path d="M14 28h92" />
        <path d="M28 28v14M58 28v10M88 28v14" />
        <circle cx="28" cy="52" r="10" />
        <circle cx="58" cy="50" r="10" />
        <circle cx="88" cy="52" r="10" />
      </>
    ),
    grade: (
      <>
        <path d="M16 30h88M28 52h76" />
        <circle cx="28" cy="30" r="8" /><circle cx="52" cy="30" r="8" /><circle cx="76" cy="30" r="8" /><circle cx="100" cy="30" r="8" />
        <circle cx="40" cy="52" r="8" /><circle cx="64" cy="52" r="8" /><circle cx="88" cy="52" r="8" />
      </>
    ),
    rocadeira: (
      <>
        <circle cx="60" cy="42" r="24" />
        <path d="M60 42l17-17M60 42l-17 17M60 42l20 10M60 18v-8h-14" />
      </>
    ),
    plantadeira: (
      <>
        <path d="M20 18h16l-3 16h-10l-3-16ZM52 18h16l-3 16h-10l-3-16ZM84 18h16l-3 16h-10l-3-16Z" />
        <path d="M12 44h96" />
        <circle cx="28" cy="56" r="9" /><circle cx="60" cy="56" r="9" /><circle cx="92" cy="56" r="9" />
      </>
    ),
    carreta: (
      <>
        <path d="M20 22h56v26H20z" />
        <path d="M76 40l28 14M16 22v26" />
        <circle cx="36" cy="58" r="9" /><circle cx="62" cy="58" r="9" />
      </>
    ),
    distribuidor: (
      <>
        <path d="M34 20h52l-19 22H53L34 20Z" />
        <path d="M60 44l-32 24M60 44l-11 26M60 44v26M60 44l11 26M60 44l32 24" />
      </>
    ),
    lamina: (
      <>
        <path d="M18 56Q60 16 102 56" />
        <path d="M18 56h84M40 38l-8-14M80 38l8-14" />
      </>
    ),
    subsolador: (
      <>
        <path d="M14 26h92" />
        <path d="M30 26q-4 22 8 36M60 26q-4 22 8 36M90 26q-4 22 8 36" />
        <path d="M38 62h10M68 62h10" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 120 80" className="h-20 w-auto text-hz-400 transition-colors duration-300 group-hover:text-hz-300" fill="none" stroke="currentColor" strokeWidth="2.6" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}

export function ImplementCard({ it, delay = 0 }: { it: Implement; delay?: number }) {
  const msg = `Olá! Tenho interesse no implemento:\n\n• Tipo: ${it.type}\n• Marca: ${it.brand}\n• Modelo: ${it.model}${it.price ? `\n• Preço: ${formatBRL(it.price)}` : "\n• Preço: a consultar"}\n\nEncontrei no site da ${BUSINESS.name}.`;
  return (
    <article
      className="group relative flex flex-col border border-line-dark bg-coal-900 transition-all duration-300 hover:-translate-y-1.5 hover:border-steel-500 hover:shadow-plate"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className="relative flex aspect-[3/2] items-center justify-center overflow-hidden border-b border-line-dark bg-coal-800"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line-dark) 1px, transparent 1px), linear-gradient(90deg, var(--color-line-dark) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <ImplGlyph type={it.glyph} />
        <div className="absolute left-3 top-3 flex flex-col gap-2">
          <span className="clip-cut-sm bg-hz-400 px-2.5 py-1 font-cond text-[12px] font-bold uppercase tracking-[0.18em] text-coal-950">
            {it.type}
          </span>
          <span
            className={cx(
              "px-2.5 py-1 font-cond text-[11px] font-bold uppercase tracking-[0.18em]",
              it.condition === "novo" ? "bg-agri-500 text-bone-100" : "bg-coal-950/85 text-steel-200",
            )}
          >
            {it.condition}
          </span>
        </div>
        <HeartBtn id={it.id} className="absolute right-3 top-3" />
        <span className="absolute bottom-3 left-3 font-cond text-[11px] uppercase tracking-[0.2em] text-steel-500">
          Foto no pátio — {it.code}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.24em] text-steel-400">{it.brand}</p>
        <h3 className="mt-1 font-display text-[24px] leading-tight uppercase">{it.model}</h3>
        <p className="mt-3 line-clamp-2 text-[14px] leading-relaxed text-steel-300">{it.description}</p>
        <p className="mt-3 font-cond text-[13px] font-semibold uppercase tracking-[0.14em] text-agri-300">
          Compatível: {it.compat}
        </p>
        <div className="mt-4 border-t border-line-dark pt-4">
          {it.price ? (
            <p className="font-cond text-[22px] font-bold text-hz-300">{formatBRL(it.price)}</p>
          ) : (
            <p className="font-cond text-[15px] font-semibold uppercase tracking-[0.18em] text-bone-100">Preço a consultar</p>
          )}
        </div>
        <div className="mt-auto flex gap-2 pt-4">
          <a
            href={waLink(BUSINESS.whatsapp, msg)}
            target="_blank"
            rel="noreferrer"
            className="clip-cut-sm flex flex-1 items-center justify-center gap-2 bg-agri-500 px-4 py-3 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-bone-100 transition-colors hover:bg-agri-400"
          >
            <IcWhatsApp size={16} /> WhatsApp
          </a>
          <CompareBtn id={it.id} />
        </div>
      </div>
    </article>
  );
}
