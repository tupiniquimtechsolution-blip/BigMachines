import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BUSINESS } from "../config/business";
import { CATEGORY_META, IMPLEMENTS, MACHINES } from "../data/machines";
import type { Category, Machine } from "../data/machines";
import { cx, usePageMeta } from "../lib/utils";
import { useApp } from "../store/AppStore";
import { ImplementCard, MachineCard } from "../components/MachineCard";
import { Btn, IcChevronD, IcFilter, IcHeart, IcSearch, IcX, Kicker, Reveal } from "../components/ui";

export type CatalogMode = "all" | "novos" | "usados" | "implementos" | "favoritas";

const MODE_META: Record<CatalogMode, { kicker: string; title: string; sub: string }> = {
  all: {
    kicker: "Estoque completo",
    title: "Todas as máquinas",
    sub: "Tratores, colheitadeiras, escavadeiras e retroescavadeiras — novas e usadas, com ficha técnica e preço transparente.",
  },
  novos: {
    kicker: "Zero hora",
    title: "Máquinas novas",
    sub: "Unidades zero hora no pátio ou sob encomenda, com garantia de fábrica e pronta entrega sinalizada.",
  },
  usados: {
    kicker: "Revisados no pátio",
    title: "Máquinas usadas",
    sub: "Usados selecionados com histórico, horímetro verificado e revisão de entrega de 120 pontos.",
  },
  implementos: {
    kicker: "Para acoplar e trabalhar",
    title: "Implementos",
    sub: "Arados, grades, plantadeiras, carretas, roçadeiras e distribuidores prontos para o talhão.",
  },
  favoritas: {
    kicker: "Minhas máquinas",
    title: "Sua lista salva",
    sub: "Máquinas que você marcou com o coração ficam guardadas neste navegador.",
  },
};

const BADGE_OPTIONS = ["Revisado", "Único dono", "Baixas horas", "Pronta entrega", "Oportunidade", "Redução de preço"];

interface Filters {
  q: string;
  categorias: Category[];
  marcas: string[];
  condicao: "" | "novo" | "usado";
  status: "" | "disponivel" | "reservada" | "vendida";
  pot: "" | "ate100" | "100a200" | "200mais";
  anoMin: string;
  horasMax: string;
  preco: "" | "ate300" | "300a700" | "700mais" | "consultar";
  badges: string[];
}

const EMPTY: Filters = { q: "", categorias: [], marcas: [], condicao: "", status: "", pot: "", anoMin: "", horasMax: "", preco: "", badges: [] };

type SortKey = "relevancia" | "menor-preco" | "maior-preco" | "menor-horas" | "mais-novo" | "maior-potencia";

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-line-dark py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between" aria-expanded={open}>
        <span className="font-cond text-[13px] font-bold uppercase tracking-[0.2em] text-bone-100">{title}</span>
        <IcChevronD size={16} className={cx("text-steel-400 transition-transform duration-300", !open && "-rotate-90")} />
      </button>
      <div className={cx("grid transition-all duration-300", open ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}

function CheckRow({ label, checked, onToggle, count }: { label: string; checked: boolean; onToggle: () => void; count?: number }) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5">
      <input type="checkbox" checked={checked} onChange={onToggle} className="peer sr-only" />
      <span
        className={cx(
          "grid h-5 w-5 shrink-0 place-items-center border transition-all duration-200",
          checked ? "border-hz-400 bg-hz-400 text-coal-950" : "border-steel-500 bg-transparent group-hover:border-hz-400",
        )}
        aria-hidden="true"
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4">
            <path d="m4 12 5 5L20 6" />
          </svg>
        )}
      </span>
      <span className={cx("text-[14px] transition-colors", checked ? "text-bone-100" : "text-steel-300 group-hover:text-bone-100")}>{label}</span>
      {count != null && <span className="ml-auto font-cond text-[12px] text-steel-500">{count}</span>}
    </label>
  );
}

const selectCls =
  "w-full border border-line-dark bg-coal-800 px-3 py-2.5 font-cond text-[13px] font-semibold uppercase tracking-[0.1em] text-bone-100 focus:border-hz-400 focus:outline-none";

function FiltersPanel({
  f,
  setF,
  mode,
}: {
  f: Filters;
  setF: (f: Filters) => void;
  mode: CatalogMode;
}) {
  const machinesInScope = useMemo(() => {
    if (mode === "novos") return MACHINES.filter((m) => m.condition === "novo");
    if (mode === "usados") return MACHINES.filter((m) => m.condition === "usado");
    return MACHINES;
  }, [mode]);

  const cats = (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).filter((c) => c !== "implementos");
  const marcas = [...new Set(machinesInScope.map((m) => m.brand))];
  const activeCount =
    f.categorias.length + f.marcas.length + f.badges.length + (f.condicao ? 1 : 0) + (f.status ? 1 : 0) + (f.pot ? 1 : 0) + (f.anoMin ? 1 : 0) + (f.horasMax ? 1 : 0) + (f.preco ? 1 : 0);

  const toggleIn = <T,>(arr: T[], v: T): T[] => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-cond text-[14px] font-bold uppercase tracking-[0.24em] text-hz-300">Filtros</p>
        {activeCount > 0 && (
          <button onClick={() => setF({ ...EMPTY, q: f.q })} className="font-cond text-[12px] font-bold uppercase tracking-[0.16em] text-safety-400 transition-colors hover:text-safety-500">
            Limpar ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title="Categoria">
        {cats.map((c) => (
          <CheckRow
            key={c}
            label={CATEGORY_META[c].plural}
            count={machinesInScope.filter((m) => m.category === c).length}
            checked={f.categorias.includes(c)}
            onToggle={() => setF({ ...f, categorias: toggleIn(f.categorias, c) })}
          />
        ))}
      </FilterGroup>

      {mode !== "novos" && mode !== "usados" && (
        <FilterGroup title="Condição">
          {(["novo", "usado"] as const).map((c) => (
            <CheckRow key={c} label={c === "novo" ? "Novo" : "Usado"} checked={f.condicao === c} onToggle={() => setF({ ...f, condicao: f.condicao === c ? "" : c })} />
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Marca">
        {marcas.map((m) => (
          <CheckRow key={m} label={m} count={machinesInScope.filter((x) => x.brand === m).length} checked={f.marcas.includes(m)} onToggle={() => setF({ ...f, marcas: toggleIn(f.marcas, m) })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Potência">
        <select className={selectCls} value={f.pot} onChange={(e) => setF({ ...f, pot: e.target.value as Filters["pot"] })} aria-label="Faixa de potência">
          <option value="">Todas</option>
          <option value="ate100">Até 100 cv</option>
          <option value="100a200">100 – 200 cv</option>
          <option value="200mais">Acima de 200 cv</option>
        </select>
      </FilterGroup>

      <FilterGroup title="Ano & horas">
        <div className="grid grid-cols-2 gap-2">
          <select className={selectCls} value={f.anoMin} onChange={(e) => setF({ ...f, anoMin: e.target.value })} aria-label="Ano mínimo">
            <option value="">Ano mín.</option>
            {[2025, 2023, 2021, 2019, 2017].map((y) => (
              <option key={y} value={y}>{y}+</option>
            ))}
          </select>
          <select className={selectCls} value={f.horasMax} onChange={(e) => setF({ ...f, horasMax: e.target.value })} aria-label="Horas máximas">
            <option value="">Horas máx.</option>
            <option value="1000">1.000 h</option>
            <option value="2000">2.000 h</option>
            <option value="3500">3.500 h</option>
            <option value="5000">5.000 h</option>
          </select>
        </div>
      </FilterGroup>

      <FilterGroup title="Preço">
        <select className={selectCls} value={f.preco} onChange={(e) => setF({ ...f, preco: e.target.value as Filters["preco"] })} aria-label="Faixa de preço">
          <option value="">Qualquer valor</option>
          <option value="ate300">Até R$ 300 mil</option>
          <option value="300a700">R$ 300 – 700 mil</option>
          <option value="700mais">Acima de R$ 700 mil</option>
          <option value="consultar">Somente "a consultar"</option>
        </select>
      </FilterGroup>

      <FilterGroup title="Situação">
        {(["disponivel", "reservada", "vendida"] as const).map((s) => (
          <CheckRow key={s} label={s === "disponivel" ? "Disponível" : s === "reservada" ? "Reservada" : "Vendida"} checked={f.status === s} onToggle={() => setF({ ...f, status: f.status === s ? "" : s })} />
        ))}
      </FilterGroup>

      <FilterGroup title="Selos">
        {BADGE_OPTIONS.filter((b) => machinesInScope.some((m) => m.badges.includes(b))).map((b) => (
          <CheckRow key={b} label={b} checked={f.badges.includes(b)} onToggle={() => setF({ ...f, badges: toggleIn(f.badges, b) })} />
        ))}
      </FilterGroup>
    </div>
  );
}

const SEO_COPY: Record<CatalogMode, string> = {
  all: `A ${BUSINESS.name} mantém estoque próprio de máquinas agrícolas e pesadas em ${BUSINESS.address.city}/${BUSINESS.address.state}: trator à venda, colheitadeira, escavadeira e retroescavadeira com procedência, além de implementos e peças. Todas as unidades passam por checklist de entrega e podem ser financiadas ou entradas em consórcio.`,
  novos: `Máquinas novas com pronta entrega em ${BUSINESS.address.city}: tratores e escavadeiras zero hora com garantia de fábrica, faturamento direto e condições especiais para produtor rural e CNPJ.`,
  usados: `Procurando trator usado ou máquina pesada seminova? Nosso catálogo de usados tem horímetro verificado, histórico de manutenção e revisão de entrega. Usado bom é o que tem procedência — e aqui tem.`,
  implementos: `Implementos agrícolas à venda em ${BUSINESS.address.city}: arado, grade aradora, plantadeira, carreta graneleira, roçadeira, distribuidor de calcário e subsolador, compatíveis com as principais marcas de trator.`,
  favoritas: "Sua lista de máquinas salvas — disponível neste navegador.",
};

export default function Catalog({ mode }: { mode: CatalogMode }) {
  const meta = MODE_META[mode];
  const [params] = useSearchParams();
  const { favorites } = useApp();
  const [drawer, setDrawer] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevancia");
  const [implType, setImplType] = useState("");

  const [filters, setFilters] = useState<Filters>(() => {
    const cat = params.get("categoria");
    const valid: string[] = ["tratores", "colheitadeiras", "escavadeiras", "retroescavadeiras"];
    return {
      ...EMPTY,
      categorias: cat && valid.includes(cat) ? [cat as Category] : [],
    };
  });

  usePageMeta(
    `${meta.title} — ${BUSINESS.name} | ${BUSINESS.address.city}/${BUSINESS.address.state}`,
    SEO_COPY[mode],
  );

  const results = useMemo(() => {
    let list: Machine[] = MACHINES;
    if (mode === "novos") list = list.filter((m) => m.condition === "novo");
    if (mode === "usados") list = list.filter((m) => m.condition === "usado");
    if (mode === "favoritas") list = list.filter((m) => favorites.includes(m.id));

    const q = filters.q.trim().toLowerCase();
    if (q)
      list = list.filter((m) =>
        [m.brand, m.model, m.code, CATEGORY_META[m.category].label, m.application, String(m.year)].join(" ").toLowerCase().includes(q),
      );
    if (filters.categorias.length) list = list.filter((m) => filters.categorias.includes(m.category));
    if (filters.condicao) list = list.filter((m) => m.condition === filters.condicao);
    if (filters.marcas.length) list = list.filter((m) => filters.marcas.includes(m.brand));
    if (filters.status) list = list.filter((m) => m.status === filters.status);
    if (filters.pot)
      list = list.filter((m) => {
        if (!m.powerCv) return false;
        if (filters.pot === "ate100") return m.powerCv <= 100;
        if (filters.pot === "100a200") return m.powerCv > 100 && m.powerCv <= 200;
        return m.powerCv > 200;
      });
    if (filters.anoMin) list = list.filter((m) => m.year >= Number(filters.anoMin));
    if (filters.horasMax) list = list.filter((m) => (m.hours ?? 0) <= Number(filters.horasMax));
    if (filters.preco)
      list = list.filter((m) => {
        if (filters.preco === "consultar") return m.price === null;
        if (m.price === null) return false;
        if (filters.preco === "ate300") return m.price <= 300000;
        if (filters.preco === "300a700") return m.price > 300000 && m.price <= 700000;
        return m.price > 700000;
      });
    if (filters.badges.length) list = list.filter((m) => filters.badges.every((b) => m.badges.includes(b)));

    const sorted = [...list];
    switch (sort) {
      case "menor-preco":
        sorted.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
        break;
      case "maior-preco":
        sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
        break;
      case "menor-horas":
        sorted.sort((a, b) => (a.hours ?? 0) - (b.hours ?? 0));
        break;
      case "mais-novo":
        sorted.sort((a, b) => b.year - a.year);
        break;
      case "maior-potencia":
        sorted.sort((a, b) => (b.powerCv ?? 0) - (a.powerCv ?? 0));
        break;
      default:
        sorted.sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false));
    }
    return sorted;
  }, [mode, favorites, filters, sort]);

  const implResults = useMemo(() => {
    let list = IMPLEMENTS;
    const q = filters.q.trim().toLowerCase();
    if (q) list = list.filter((i) => [i.type, i.brand, i.model, i.code, i.compat].join(" ").toLowerCase().includes(q));
    if (implType) list = list.filter((i) => i.type === implType);
    return list;
  }, [filters.q, implType]);

  const isImpl = mode === "implementos";
  const count = isImpl ? implResults.length : results.length;

  return (
    <div className="pt-[76px] lg:pt-[118px]">
      {/* cabeçalho */}
      <header className="border-b border-line-dark bg-coal-900">
        <div className="hazard-thin h-1.5 w-full opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-(--container-site) px-6 py-12 md:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-2xl">
              <Reveal>
                <Kicker>{meta.kicker}</Kicker>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-3 font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.92]">{meta.title}</h1>
              </Reveal>
              <Reveal delay={150}>
                <p className="mt-4 text-lg text-steel-300">{meta.sub}</p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <p className="border border-line-dark bg-coal-950 px-5 py-3 font-cond text-sm font-bold uppercase tracking-[0.2em] text-bone-100">
                <span className="text-hz-300">{count}</span> {isImpl ? "implemento" + (count === 1 ? "" : "s") : "máquina" + (count === 1 ? "" : "s")}
              </p>
            </Reveal>
          </div>

          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <IcSearch size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400" />
              <input
                value={filters.q}
                onChange={(e) => setFilters({ ...filters, q: e.target.value })}
                placeholder={isImpl ? "Buscar implemento, marca ou código…" : "Buscar por marca, modelo, categoria ou código (ex.: TF-0143)…"}
                aria-label="Buscar no catálogo"
                className="w-full border border-line-dark bg-coal-950 py-3.5 pl-12 pr-4 text-[15px] text-bone-100 placeholder:text-steel-500 transition-colors focus:border-hz-400 focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={cx(selectCls, "py-3.5")} aria-label="Ordenar resultados">
                <option value="relevancia">Destaques primeiro</option>
                <option value="menor-preco">Menor preço</option>
                <option value="maior-preco">Maior preço</option>
                <option value="menor-horas">Menos horas</option>
                <option value="mais-novo">Mais novo</option>
                <option value="maior-potencia">Maior potência</option>
              </select>
              {!isImpl && (
                <button
                  onClick={() => setDrawer(true)}
                  className="flex items-center gap-2 border border-line-dark bg-coal-950 px-5 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300 lg:hidden"
                >
                  <IcFilter size={17} /> Filtrar
                </button>
              )}
            </div>
          </div>

          {isImpl && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => setImplType("")}
                className={cx("px-3.5 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.16em] transition-colors", !implType ? "bg-hz-400 text-coal-950" : "border border-line-dark text-steel-300 hover:border-hz-400 hover:text-hz-300")}
              >
                Todos
              </button>
              {[...new Set(IMPLEMENTS.map((i) => i.type))].map((t) => (
                <button
                  key={t}
                  onClick={() => setImplType(implType === t ? "" : t)}
                  className={cx("px-3.5 py-1.5 font-cond text-[12px] font-bold uppercase tracking-[0.16em] transition-colors", implType === t ? "bg-hz-400 text-coal-950" : "border border-line-dark text-steel-300 hover:border-hz-400 hover:text-hz-300")}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-(--container-site) px-6 py-12 md:py-16">
        <div className={cx(!isImpl && "grid gap-10 lg:grid-cols-[260px_1fr]")}>
          {!isImpl && (
            <aside className="hidden lg:block" aria-label="Filtros do catálogo">
              <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
                <FiltersPanel f={filters} setF={setFilters} mode={mode} />
              </div>
            </aside>
          )}

          <div>
            {count === 0 ? (
              <div className="grid place-items-center border border-dashed border-steel-500 px-6 py-24 text-center">
                {mode === "favoritas" ? (
                  <>
                    <IcHeart size={44} className="text-steel-500" />
                    <h2 className="mt-5 font-display text-3xl uppercase">Nenhuma máquina salva ainda</h2>
                    <p className="mt-3 max-w-sm text-[15px] text-steel-300">Toque no coração de qualquer card para guardar a máquina aqui — a lista fica neste navegador.</p>
                    <Btn to="/maquinas" className="mt-7">Ver o estoque</Btn>
                  </>
                ) : (
                  <>
                    <IcSearch size={44} className="text-steel-500" />
                    <h2 className="mt-5 font-display text-3xl uppercase">Nada encontrado com esses filtros</h2>
                    <p className="mt-3 max-w-sm text-[15px] text-steel-300">Afrouxe um filtro ou dois — ou fale com a gente: se não está no pátio, a gente caça para você.</p>
                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                      <Btn tone="outline" onClick={() => setFilters({ ...EMPTY })}>Limpar filtros</Btn>
                      <Btn to="/contato">Falar com vendedor</Btn>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className={cx("grid gap-6", isImpl ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-3")}>
                {isImpl
                  ? implResults.map((it, i) => <ImplementCard key={it.id} it={it} delay={(i % 3) * 70} />)
                  : results.map((m, i) => <MachineCard key={m.id} m={m} delay={(i % 3) * 70} />)}
              </div>
            )}
          </div>
        </div>

        <Reveal className="mt-16 border-t border-line-dark pt-8">
          <p className="max-w-4xl text-[14px] leading-relaxed text-steel-400">{SEO_COPY[mode]}</p>
        </Reveal>
      </div>

      {/* drawer mobile de filtros */}
      <div className={cx("fixed inset-0 z-[75] lg:hidden", drawer ? "pointer-events-auto" : "pointer-events-none")} aria-hidden={!drawer}>
        <div className={cx("absolute inset-0 bg-coal-950/70 transition-opacity duration-300", drawer ? "opacity-100" : "opacity-0")} onClick={() => setDrawer(false)} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filtros"
          className={cx("absolute bottom-0 right-0 top-0 flex w-[86vw] max-w-[340px] flex-col border-l border-line-dark bg-coal-900 transition-transform duration-300", drawer ? "translate-x-0" : "translate-x-full")}
        >
          <div className="flex items-center justify-between border-b border-line-dark px-5 py-4">
            <p className="font-display text-xl uppercase">Filtros</p>
            <button onClick={() => setDrawer(false)} className="grid h-10 w-10 place-items-center border border-line-dark text-bone-100 hover:border-hz-400 hover:text-hz-300" aria-label="Fechar filtros">
              <IcX size={18} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 pb-6">
            <FiltersPanel f={filters} setF={setFilters} mode={mode} />
          </div>
          <div className="border-t border-line-dark p-4">
            <Btn className="w-full" onClick={() => setDrawer(false)}>
              Ver {count} {count === 1 ? "máquina" : "máquinas"}
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
