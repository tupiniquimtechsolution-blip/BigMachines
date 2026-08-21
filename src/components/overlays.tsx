import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { BUSINESS } from "../config/business";
import { IMPLEMENTS, MACHINES } from "../data/machines";
import type { Implement, Machine } from "../data/machines";
import { cx, formatBRL, formatNum, quoteMessage, waLink } from "../lib/utils";
import { useApp } from "../store/AppStore";
import { Btn, IcCheck, IcChevronL, IcChevronR, IcScale, IcWhatsApp, IcX } from "./ui";

/* ================= LIGHTBOX ================= */

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
  title,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
  title: string;
}) {
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndex((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndex((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [index, images.length, onClose, onIndex]);

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-coal-950/97 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Galeria — ${title}`}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <p className="font-cond text-sm font-semibold uppercase tracking-[0.2em] text-steel-300">
          {title} · <span className="text-hz-300">{index + 1}/{images.length}</span>
        </p>
        <button
          onClick={onClose}
          className="grid h-11 w-11 place-items-center border border-line-dark text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300"
          aria-label="Fechar galeria"
        >
          <IcX size={20} />
        </button>
      </div>
      <div
        className="relative flex flex-1 items-center justify-center px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
        onTouchEnd={(e) => {
          const start = touchX.current;
          const end = e.changedTouches[0]?.clientX ?? null;
          if (start != null && end != null) {
            const dx = end - start;
            if (dx < -50) onIndex((index + 1) % images.length);
            if (dx > 50) onIndex((index - 1 + images.length) % images.length);
          }
          touchX.current = null;
        }}
      >
        <img src={images[index]} alt={`${title} — foto ${index + 1}`} className="max-h-[74vh] max-w-full object-contain shadow-plate" />
        {images.length > 1 && (
          <>
            <button
              onClick={() => onIndex((index - 1 + images.length) % images.length)}
              className="absolute left-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-line-dark bg-coal-950/80 text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300"
              aria-label="Foto anterior"
            >
              <IcChevronL size={22} />
            </button>
            <button
              onClick={() => onIndex((index + 1) % images.length)}
              className="absolute right-4 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-line-dark bg-coal-950/80 text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300"
              aria-label="Próxima foto"
            >
              <IcChevronR size={22} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-2 px-4 pb-5" onClick={(e) => e.stopPropagation()}>
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onIndex(i)}
              className={cx("h-14 w-20 overflow-hidden border transition-all", i === index ? "border-hz-400 opacity-100" : "border-line-dark opacity-50 hover:opacity-80")}
              aria-label={`Ver foto ${i + 1}`}
            >
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= ORÇAMENTO ================= */

const inputCls =
  "w-full border border-line-dark bg-coal-800 px-4 py-3 text-[15px] text-bone-100 placeholder:text-steel-500 transition-colors focus:border-hz-400 focus:outline-none";
const labelCls = "mb-1.5 block font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-steel-300";

export function QuoteModal() {
  const { quoteMachine, quoteLabel, closeQuote, openQuote } = useApp();
  const open = quoteMachine !== null || quoteLabel !== "";
  const [sent, setSent] = useState(false);
  const firstField = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState({ name: "", company: "", phone: "", city: "", machine: "", message: "" });

  useEffect(() => {
    if (open) {
      setSent(false);
      setForm((f) => ({ ...f, machine: quoteLabel }));
      setTimeout(() => firstField.current?.focus(), 60);
    }
  }, [open, quoteLabel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeQuote();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeQuote]);

  if (!open) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = quoteMessage({
      name: form.name,
      company: form.company || undefined,
      phone: form.phone,
      city: form.city,
      machine: form.machine || undefined,
      message: form.message || undefined,
    });
    window.open(waLink(BUSINESS.whatsapp, msg), "_blank", "noopener");
    setSent(true);
  };

  const available = MACHINES.filter((m) => m.status !== "vendida");

  return (
    <div className="fixed inset-0 z-[85] flex items-end justify-center bg-coal-950/85 p-0 backdrop-blur-sm sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Solicitar orçamento">
      <div className="noise relative max-h-[92vh] w-full max-w-xl overflow-y-auto border border-line-dark bg-coal-900 shadow-plate">
        <div className="hazard-thin h-1.5 w-full opacity-70" aria-hidden="true" />
        <div className="flex items-start justify-between gap-4 px-7 pt-6">
          <div>
            <p className="font-cond text-[12px] font-semibold uppercase tracking-[0.26em] text-hz-300">Orçamento sem compromisso</p>
            <h2 className="mt-2 font-display text-3xl uppercase leading-none">Solicitar orçamento</h2>
            <p className="mt-2 text-sm text-steel-300">
              Preencha e a solicitação abre direto no WhatsApp do nosso time comercial — sem formulários que somem.
            </p>
          </div>
          <button onClick={closeQuote} className="grid h-10 w-10 shrink-0 place-items-center border border-line-dark text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300" aria-label="Fechar">
            <IcX size={18} />
          </button>
        </div>

        {sent ? (
          <div className="px-7 py-10 text-center">
            <span className="mx-auto grid h-16 w-16 place-items-center border-2 border-agri-400 text-agri-300">
              <IcCheck size={30} />
            </span>
            <h3 className="mt-5 font-display text-2xl uppercase">Solicitação pronta</h3>
            <p className="mx-auto mt-3 max-w-sm text-[15px] leading-relaxed text-steel-300">
              Abrimos o seu WhatsApp com o orçamento preenchido. É só conferir e apertar enviar — um consultor responde em horário comercial.
            </p>
            <Btn tone="dark" className="mt-6" onClick={closeQuote}>
              Fechar
            </Btn>
          </div>
        ) : (
          <form onSubmit={submit} className="grid gap-4 px-7 py-6 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="q-name" className={labelCls}>Nome *</label>
              <input ref={firstField} id="q-name" required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Seu nome" />
            </div>
            <div className="sm:col-span-1">
              <label htmlFor="q-company" className={labelCls}>Empresa / fazenda</label>
              <input id="q-company" className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Opcional" />
            </div>
            <div>
              <label htmlFor="q-phone" className={labelCls}>Telefone / WhatsApp *</label>
              <input id="q-phone" required inputMode="tel" className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(00) 00000-0000" />
            </div>
            <div>
              <label htmlFor="q-city" className={labelCls}>Cidade *</label>
              <input id="q-city" required className={inputCls} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="Cidade/UF" />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="q-machine" className={labelCls}>Máquina de interesse</label>
              <select id="q-machine" className={inputCls} value={form.machine} onChange={(e) => setForm({ ...form, machine: e.target.value })}>
                <option value="">Ainda não escolhi</option>
                {available.map((m) => (
                  <option key={m.id} value={`${m.brand} ${m.model} ${m.year} (${m.code})`}>
                    {m.brand} {m.model} {m.year} — {m.price ? formatBRL(m.price) : "consultar"}
                  </option>
                ))}
                {IMPLEMENTS.filter((i) => i.status === "disponivel").map((i) => (
                  <option key={i.id} value={`${i.type} ${i.brand} ${i.model} (${i.code})`}>
                    {i.type} {i.brand} {i.model}
                  </option>
                ))}
                {quoteLabel && !available.some((m) => `${m.brand} ${m.model} ${m.year} (${m.code})` === quoteLabel) ? (
                  <option value={quoteLabel}>{quoteLabel}</option>
                ) : null}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="q-msg" className={labelCls}>Mensagem</label>
              <textarea id="q-msg" rows={3} className={inputCls} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Condição de pagamento, prazo de entrega, troca…" />
            </div>
            <div className="sm:col-span-2">
              <Btn type="submit" tone="hz" size="lg" className="w-full">
                <IcWhatsApp size={18} /> Enviar pelo WhatsApp
              </Btn>
              <p className="mt-2 text-center text-[12px] text-steel-500">
                Você será direcionado ao WhatsApp com a mensagem pronta. Nenhum dado é enviado a terceiros.
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

/* ================= COMPARADOR ================= */

type AnyItem = Machine | Implement;
const isMachine = (x: AnyItem): x is Machine => "category" in x;

export function CompareTray() {
  const { compare, toggleCompare, clearCompare, compareOpen, setCompareOpen } = useApp();
  if (compare.length === 0 || compareOpen) return null;
  const items = compare
    .map((id) => MACHINES.find((m) => m.id === id) ?? IMPLEMENTS.find((i) => i.id === id))
    .filter(Boolean) as AnyItem[];

  return (
    <div className="fixed bottom-5 left-5 z-40 flex max-w-[calc(100vw-6.5rem)] items-center gap-3 border border-line-dark bg-coal-900/95 p-3 shadow-plate backdrop-blur-md">
      <span className="hidden h-10 w-10 shrink-0 place-items-center bg-hz-400 text-coal-950 sm:grid" aria-hidden="true">
        <IcScale size={20} />
      </span>
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
        {items.map((it) => (
          <span key={it.id} className="flex shrink-0 items-center gap-2 border border-line-dark bg-coal-800 py-1.5 pl-2.5 pr-1.5">
            <span className="max-w-[130px] truncate font-cond text-[13px] font-semibold uppercase tracking-wide text-bone-100">
              {it.brand} {it.model}
            </span>
            <button onClick={() => toggleCompare(it.id)} aria-label={`Remover ${it.brand} ${it.model} da comparação`} className="grid h-6 w-6 place-items-center text-steel-400 transition-colors hover:text-safety-400">
              <IcX size={13} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex shrink-0 flex-col gap-1.5">
        <button
          onClick={() => setCompareOpen(true)}
          disabled={items.length < 2}
          className="clip-cut-sm bg-hz-400 px-4 py-2 font-cond text-[13px] font-bold uppercase tracking-[0.14em] text-coal-950 transition-all hover:bg-hz-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Comparar ({items.length})
        </button>
        <button onClick={clearCompare} className="text-left font-cond text-[11px] font-semibold uppercase tracking-[0.16em] text-steel-400 transition-colors hover:text-safety-400">
          Limpar
        </button>
      </div>
    </div>
  );
}

export function CompareModal() {
  const { compare, compareOpen, setCompareOpen, toggleCompare } = useApp();

  useEffect(() => {
    if (!compareOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setCompareOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [compareOpen, setCompareOpen]);

  if (!compareOpen) return null;

  const items = compare
    .map((id) => MACHINES.find((m) => m.id === id) ?? IMPLEMENTS.find((i) => i.id === id))
    .filter(Boolean) as AnyItem[];

  const rows: { label: string; get: (x: AnyItem) => string }[] = [
    { label: "Preço", get: (x) => (x.price ? formatBRL(x.price) : "A consultar") },
    { label: "Condição", get: (x) => (x.condition === "novo" ? "Novo" : "Usado") },
    { label: "Ano", get: (x) => (x.year ? String(x.year) : "—") },
    { label: "Horas", get: (x) => (isMachine(x) && x.hours != null ? `${formatNum(x.hours)} h` : "—") },
    { label: "Potência", get: (x) => (isMachine(x) && x.powerCv ? `${x.powerCv} cv` : "—") },
    { label: "Peso", get: (x) => (x.weightKg ? `${formatNum(x.weightKg)} kg` : "—") },
    { label: "Transmissão", get: (x) => (isMachine(x) && x.transmission ? x.transmission : "—") },
    { label: "Combustível", get: (x) => (isMachine(x) && x.fuel ? x.fuel : "—") },
    { label: "Aplicação", get: (x) => (isMachine(x) ? x.application : x.compat) },
  ];

  return (
    <div className="fixed inset-0 z-[85] flex items-center justify-center bg-coal-950/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Comparação de máquinas">
      <div className="flex max-h-[90vh] w-full max-w-5xl flex-col border border-line-dark bg-coal-900 shadow-plate">
        <div className="flex items-center justify-between border-b border-line-dark px-6 py-4">
          <h2 className="font-display text-2xl uppercase">Comparar máquinas</h2>
          <button onClick={() => setCompareOpen(false)} className="grid h-10 w-10 place-items-center border border-line-dark text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300" aria-label="Fechar comparação">
            <IcX size={18} />
          </button>
        </div>
        <div className="overflow-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr>
                <th className="sticky left-0 w-40 border-b border-r border-line-dark bg-coal-900 px-4 py-3 font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-steel-400">
                  Critério
                </th>
                {items.map((it) => (
                  <th key={it.id} className="border-b border-line-dark px-4 py-3 align-bottom">
                    {isMachine(it) && it.images[0] ? (
                      <img src={it.images[0]} alt="" className="mb-2 h-24 w-full object-cover" loading="lazy" />
                    ) : null}
                    <p className="font-cond text-[11px] font-semibold uppercase tracking-[0.2em] text-steel-400">{it.brand}</p>
                    <p className="font-display text-lg leading-tight uppercase">{it.model}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {isMachine(it) ? (
                        <Link to={`/maquinas/${it.slug}`} onClick={() => setCompareOpen(false)} className="font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-hz-300 hover:text-hz-400">
                          Ver detalhes →
                        </Link>
                      ) : (
                        <span className="font-cond text-[12px] uppercase tracking-[0.14em] text-steel-500">Implemento</span>
                      )}
                      <button onClick={() => toggleCompare(it.id)} className="ml-auto font-cond text-[12px] font-semibold uppercase tracking-[0.14em] text-steel-400 transition-colors hover:text-safety-400">
                        Remover
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={r.label} className={ri % 2 === 0 ? "bg-coal-800/50" : undefined}>
                  <td className="sticky left-0 border-r border-line-dark bg-coal-900 px-4 py-3 font-cond text-[13px] font-semibold uppercase tracking-[0.16em] text-steel-300">
                    {r.label}
                  </td>
                  {items.map((it) => (
                    <td key={it.id} className="px-4 py-3 text-[15px] text-bone-100">
                      {r.get(it)}
                    </td>
                  ))}
                </tr>
              ))}
              <tr>
                <td className="sticky left-0 border-t border-line-dark bg-coal-900 px-4 py-3" />
                {items.map((it) =>
                  isMachine(it) && it.status !== "vendida" ? (
                    <td key={it.id} className="border-t border-line-dark px-4 py-3">
                      <a
                        href={waLink(BUSINESS.whatsapp, `Olá! Estou comparando máquinas no site e quero falar sobre a ${it.brand} ${it.model} ${it.year} (${it.code}).`)}
                        target="_blank"
                        rel="noreferrer"
                        className="clip-cut-sm inline-flex items-center gap-2 bg-agri-500 px-4 py-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.14em] text-bone-100 transition-colors hover:bg-agri-400"
                      >
                        <IcWhatsApp size={15} /> Negociar
                      </a>
                    </td>
                  ) : (
                    <td key={it.id} className="border-t border-line-dark px-4 py-3" />
                  ),
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

