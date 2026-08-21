import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { BUSINESS } from "../config/business";
import { availableCount, CATEGORY_META } from "../data/machines";
import { cx, generalMessage, waLink } from "../lib/utils";
import { HazardStrip, IcClock, IcMenu, IcPhone, IcPin, IcWhatsApp, IcX } from "./ui";

const NAV = [
  { to: "/maquinas", label: "Máquinas" },
  { to: "/novos", label: "Novos" },
  { to: "/usados", label: "Usados" },
  { to: "/implementos", label: "Implementos" },
  { to: "/financiamento", label: "Financiamento" },
  { to: "/empresa", label: "Empresa" },
  { to: "/contato", label: "Contato" },
];

export function Logo() {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label={`${BUSINESS.name} — página inicial`}>
      <span className="grid h-10 w-10 shrink-0 place-items-center bg-hz-400 font-display text-2xl leading-none text-coal-950 transition-transform duration-300 group-hover:-rotate-6">
        T
      </span>
      <span className="leading-none">
        <span className="block font-display text-[19px] tracking-[0.04em] text-bone-100">TERRAFORTE</span>
        <span className="mt-1 block font-cond text-[10px] font-semibold uppercase tracking-[0.32em] text-steel-400">
          Máquinas · {BUSINESS.address.city}
        </span>
      </span>
    </Link>
  );
}

function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - window.innerHeight;
        setP(max > 0 ? (h.scrollTop / max) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <div className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-transparent" aria-hidden="true">
      <div className="h-full bg-hz-400" style={{ width: `${p}%` }} />
    </div>
  );
}

export function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <ScrollProgress />
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          scrolled ? "bg-coal-950/90 shadow-plate backdrop-blur-md" : "bg-gradient-to-b from-coal-950/80 to-transparent",
        )}
      >
        {/* barra utilitária */}
        <div
          className={cx(
            "hidden border-b border-line-dark transition-all duration-300 lg:block",
            scrolled ? "h-0 overflow-hidden border-b-0 opacity-0" : "opacity-100",
          )}
        >
          <div className="mx-auto flex max-w-(--container-site) items-center justify-between px-6 py-2 text-[13px] text-steel-300">
            <p className="flex items-center gap-2 font-cond uppercase tracking-[0.18em]">
              <IcPin size={14} className="text-hz-400" />
              {BUSINESS.address.street}, {BUSINESS.address.city}/{BUSINESS.address.state}
            </p>
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-2 font-cond uppercase tracking-[0.18em]">
                <IcClock size={14} className="text-hz-400" />
                Seg–Sex 07h30–18h · Sáb até 12h30
              </span>
              <a href={`tel:+${BUSINESS.phoneRaw}`} className="flex items-center gap-2 font-cond font-semibold uppercase tracking-[0.18em] text-bone-100 transition-colors hover:text-hz-300">
                <IcPhone size={14} className="text-hz-400" />
                {BUSINESS.phoneDisplay}
              </a>
            </div>
          </div>
        </div>

        {/* barra principal */}
        <div className={cx("mx-auto flex max-w-(--container-site) items-center justify-between px-6 transition-all duration-300", scrolled ? "py-3" : "py-5")}>
          <Logo />
          <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegação principal">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  cx(
                    "group relative font-cond text-[14px] font-semibold uppercase tracking-[0.18em] transition-colors",
                    isActive ? "text-hz-300" : "text-bone-100/85 hover:text-bone-100",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {n.label}
                    <span
                      className={cx(
                        "absolute -bottom-1.5 left-0 h-[2px] bg-hz-400 transition-all duration-300",
                        isActive ? "w-full" : "w-0 group-hover:w-full",
                      )}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <span className="mr-1 hidden items-center gap-2 border border-agri-500/40 bg-agri-500/10 px-3 py-1.5 font-cond text-[12px] font-semibold uppercase tracking-[0.16em] text-agri-300 xl:inline-flex">
              <span className="h-1.5 w-1.5 animate-pulse bg-agri-400" aria-hidden="true" />
              {availableCount()} no pátio
            </span>
            <a
              href={waLink(BUSINESS.whatsapp, generalMessage())}
              target="_blank"
              rel="noreferrer"
              className="clip-cut-sm hidden items-center gap-2 bg-hz-400 px-5 py-2.5 font-cond text-[13px] font-bold uppercase tracking-[0.16em] text-coal-950 transition-all duration-200 hover:-translate-y-0.5 hover:bg-hz-300 sm:inline-flex"
            >
              <IcWhatsApp size={16} />
              Falar com vendedor
            </a>
            <button
              onClick={() => setOpen(true)}
              className="grid h-11 w-11 place-items-center border border-line-dark bg-coal-900 text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300 lg:hidden"
              aria-label="Abrir menu"
            >
              <IcMenu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* menu mobile fullscreen */}
      <div
        className={cx(
          "noise fixed inset-0 z-[70] flex flex-col bg-coal-950 transition-all duration-400 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-6 py-5">
          <Logo />
          <button
            onClick={() => setOpen(false)}
            className="grid h-11 w-11 place-items-center border border-line-dark text-bone-100 transition-colors hover:border-hz-400 hover:text-hz-300"
            aria-label="Fechar menu"
          >
            <IcX size={20} />
          </button>
        </div>
        <HazardStrip className="opacity-40" />
        <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8" aria-label="Navegação mobile">
          {NAV.map((n, i) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                cx(
                  "group flex items-baseline gap-4 border-b border-line-dark py-4 transition-all duration-500",
                  open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                  isActive ? "text-hz-300" : "text-bone-100",
                )
              }
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              <span className="font-cond text-xs font-semibold text-steel-500">0{i + 1}</span>
              <span className="font-display text-3xl uppercase tracking-wide">{n.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="space-y-3 border-t border-line-dark px-6 py-6">
          <a
            href={waLink(BUSINESS.whatsapp, generalMessage())}
            target="_blank"
            rel="noreferrer"
            className="clip-cut-sm flex items-center justify-center gap-3 bg-hz-400 px-6 py-4 font-cond text-sm font-bold uppercase tracking-[0.16em] text-coal-950"
          >
            <IcWhatsApp size={18} /> Chamar no WhatsApp
          </a>
          <a href={`tel:+${BUSINESS.phoneRaw}`} className="flex items-center justify-center gap-3 border border-line-dark px-6 py-4 font-cond text-sm font-semibold uppercase tracking-[0.16em] text-bone-100">
            <IcPhone size={18} /> {BUSINESS.phoneDisplay}
          </a>
        </div>
      </div>
    </>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-coal-900">
      <HazardStrip />
      <div className="pointer-events-none select-none overflow-hidden" aria-hidden="true">
        <p className="-mb-[3vw] mt-2 whitespace-nowrap text-center font-display text-[15vw] leading-[0.85] text-coal-800">
          TERRAFORTE
        </p>
      </div>
      <div className="relative mx-auto grid max-w-(--container-site) gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-steel-300">{BUSINESS.tagline}</p>
          <div className="mt-6 flex gap-3">
            {[
              { label: "Instagram", href: BUSINESS.instagramUrl, d: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5ZM17.5 6.6h.01" },
              { label: "Facebook", href: BUSINESS.facebookUrl, d: "M14 8h3V4h-3a5 5 0 0 0-5 5v3H6v4h3v8h4v-8h3l1-4h-4V9a1 1 0 0 1 1-1Z" },
              { label: "YouTube", href: BUSINESS.youtubeUrl, d: "M3 7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Zm7 2v6l6-3-6-3Z" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center border border-line-dark text-steel-300 transition-all duration-200 hover:-translate-y-0.5 hover:border-hz-400 hover:text-hz-300"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d={s.d} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        <nav aria-label="Rodapé — navegação">
          <h3 className="font-cond text-sm font-bold uppercase tracking-[0.24em] text-bone-100">Navegação</h3>
          <ul className="mt-5 space-y-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="group flex items-center gap-2 text-[15px] text-steel-300 transition-colors hover:text-hz-300">
                  <span className="h-[2px] w-3 bg-steel-500 transition-all group-hover:w-5 group-hover:bg-hz-400" aria-hidden="true" />
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Rodapé — categorias">
          <h3 className="font-cond text-sm font-bold uppercase tracking-[0.24em] text-bone-100">Estoque</h3>
          <ul className="mt-5 space-y-3">
            {(["tratores", "colheitadeiras", "escavadeiras", "retroescavadeiras", "implementos"] as const).map((c) => (
              <li key={c}>
                <Link
                  to={c === "implementos" ? "/implementos" : `/maquinas?categoria=${c}`}
                  className="group flex items-center gap-2 text-[15px] text-steel-300 transition-colors hover:text-hz-300"
                >
                  <span className="h-[2px] w-3 bg-steel-500 transition-all group-hover:w-5 group-hover:bg-hz-400" aria-hidden="true" />
                  {CATEGORY_META[c].plural}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/troca" className="group flex items-center gap-2 text-[15px] text-steel-300 transition-colors hover:text-hz-300">
                <span className="h-[2px] w-3 bg-steel-500 transition-all group-hover:w-5 group-hover:bg-hz-400" aria-hidden="true" />
                Avaliar minha máquina
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="font-cond text-sm font-bold uppercase tracking-[0.24em] text-bone-100">Pátio & contato</h3>
          <ul className="mt-5 space-y-4 text-[15px] text-steel-300">
            <li className="flex gap-3">
              <IcPin size={18} className="mt-0.5 shrink-0 text-hz-400" />
              <span>
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.city}/{BUSINESS.address.state} · CEP {BUSINESS.address.zip}
              </span>
            </li>
            <li className="flex gap-3">
              <IcPhone size={18} className="mt-0.5 shrink-0 text-hz-400" />
              <a href={`tel:+${BUSINESS.phoneRaw}`} className="transition-colors hover:text-hz-300">
                {BUSINESS.phoneDisplay} · {BUSINESS.whatsappDisplay}
              </a>
            </li>
            <li className="flex gap-3">
              <IcClock size={18} className="mt-0.5 shrink-0 text-hz-400" />
              <span>Seg–Sex 07h30–18h · Sáb 08h–12h30</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className="mx-auto flex max-w-(--container-site) flex-col items-center justify-between gap-3 px-6 py-5 text-[13px] text-steel-500 md:flex-row">
          <p>
            © {new Date().getFullYear()} {BUSINESS.legalName} · CNPJ {BUSINESS.cnpj}
          </p>
          <p className="font-cond uppercase tracking-[0.22em]">
            {BUSINESS.slogan} <span className="text-hz-400">///</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  const { pathname } = useLocation();
  const isMachinePage = pathname.startsWith("/maquinas/");
  return (
    <a
      href={waLink(BUSINESS.whatsapp, generalMessage())}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com um consultor pelo WhatsApp"
      className={cx(
        "group fixed bottom-5 right-5 z-40 flex items-center bg-agri-500 text-bone-100 shadow-plate transition-all duration-300 hover:bg-agri-400",
        "clip-cut-sm animate-pulse-ring",
        isMachinePage ? "hidden md:flex" : "flex",
      )}
    >
      <span className="grid h-14 w-14 place-items-center">
        <IcWhatsApp size={26} />
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap font-cond text-sm font-bold uppercase tracking-[0.14em] opacity-0 transition-all duration-300 group-hover:max-w-[230px] group-hover:pr-5 group-hover:opacity-100">
        Fale com um consultor
      </span>
    </a>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
