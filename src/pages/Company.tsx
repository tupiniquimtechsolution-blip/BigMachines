import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BUSINESS } from "../config/business";
import { availableCount, IMG } from "../data/machines";
import { generalMessage, prefersReducedMotion, usePageMeta, waLink } from "../lib/utils";
import { Btn, Counter, IcArrow, IcShield, IcTractor, IcWhatsApp, IcWrench, Kicker, Reveal, SectionHead } from "../components/ui";

gsap.registerPlugin(ScrollTrigger);

const MILESTONES = [
  { year: "1999", text: "Família Almeida abre a primeira revenda de tratores usados no distrito industrial." },
  { year: "2008", text: "Oficina própria: máquinas passam a sair revisadas com checklist assinado." },
  { year: "2016", text: "Chegada da linha pesada — escavadeiras e retroescavadeiras para construção e prefeitura." },
  { year: "2024", text: "1.850ª máquina entregue e pátio ampliado para 12.000 m² às margens da Anhanguera." },
];

export default function Company() {
  usePageMeta(
    `A Empresa — ${BUSINESS.name} | Tratores e Máquinas Pesadas`,
    `Desde ${BUSINESS.founded} vendendo tratores, colheitadeiras e máquinas pesadas com procedência em ${BUSINESS.address.city}/${BUSINESS.address.state}. Pátio próprio, oficina e time comercial dedicado.`,
  );

  const bgRef = useRef<HTMLImageElement | null>(null);
  const secRef = useRef<HTMLElement | null>(null);

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
    <div className="pt-[76px] lg:pt-[118px]">
      <header className="relative overflow-hidden border-b border-line-dark">
        <div className="absolute inset-0" aria-hidden="true">
          <img src={IMG.patio} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-coal-950/85" />
        </div>
        <div className="relative mx-auto max-w-(--container-site) px-6 py-24 md:py-32">
          <Reveal><Kicker>Desde {BUSINESS.founded}</Kicker></Reveal>
          <Reveal delay={90}>
            <h1 className="mt-4 max-w-4xl font-display text-[clamp(2.6rem,7vw,5.5rem)] uppercase leading-[0.9]">
              Máquina boa não se vende <span className="text-hz-400">sozinha</span>. Se entrega.
            </h1>
          </Reveal>
          <Reveal delay={170}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-200/90">
              A {BUSINESS.name} nasceu vendendo trator usado de procedência para produtor da região. Vinte e poucos anos depois, o pátio tem linha agrícola, linha pesada, implementos, oficina própria e mesa de crédito — mas o combinado continua o mesmo: máquina revisada, histórico aberto e pós-venda que atende o telefone.
            </p>
          </Reveal>
        </div>
      </header>

      {/* números */}
      <section className="border-b border-line-dark bg-coal-900">
        <div className="mx-auto grid max-w-(--container-site) grid-cols-2 lg:grid-cols-4">
          {BUSINESS.stats.map((s, i) => (
            <div key={s.label} className={`border-line-dark px-6 py-10 md:py-14 ${i % 2 === 0 ? "border-r" : ""} ${i < 2 ? "border-b lg:border-b-0" : ""} ${i === 1 ? "lg:border-r" : ""} ${i === 2 ? "border-r lg:border-r" : ""}`}>
              <p className="font-display text-[clamp(2.4rem,5vw,4rem)] leading-none text-hz-300">
                <Counter to={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-3 font-cond text-[13px] font-semibold uppercase tracking-[0.24em] text-steel-300">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="border-t border-line-dark">
          <p className="mx-auto max-w-(--container-site) px-6 py-4 font-cond text-[12px] font-semibold uppercase tracking-[0.22em] text-steel-500">
            <span className="mr-2 inline-block h-2 w-2 animate-pulse bg-agri-400" aria-hidden="true" />
            Agora no pátio: {availableCount()} máquinas disponíveis para faturamento imediato
          </p>
        </div>
      </section>

      {/* pilares */}
      <section className="border-b border-line-dark bg-coal-950 py-24 md:py-32">
        <div className="mx-auto max-w-(--container-site) px-6">
          <SectionHead
            kicker="Como trabalhamos"
            title={<>Três regras que não <span className="text-hz-400">negociamos</span></>}
          />
          <div className="mt-14">
            {[
              { n: "01", icon: IcShield, t: "Histórico aberto", d: "Horímetro verificado, notas de manutenção e procedência de dono. Se a máquina tem passagem feia, ela não entra no pátio — e se entrou, você fica sabendo antes de pagar." },
              { n: "02", icon: IcWrench, t: "Revisão de entrega", d: "Toda máquina sai com checklist de 120 pontos assinado pela oficina: filtros, óleo, hidráulica, rodado e elétrica. Máquina usada nossa não chega pingando na sua porteira." },
              { n: "03", icon: IcTractor, t: "Pós-venda que atende", d: "Peças originais, atendimento em campo e consultor que responde depois da venda. Máquina parada é prejuízo seu e reputação nossa." },
            ].map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.n} delay={i * 90}>
                  <div className="group grid gap-6 border-t border-line-dark py-9 transition-colors hover:bg-coal-900/60 md:grid-cols-[120px_64px_1fr] md:items-start md:px-6">
                    <span className="font-display text-5xl text-coal-600 transition-colors duration-300 group-hover:text-hz-400">{p.n}</span>
                    <span className="hidden text-hz-400 md:block"><Icon size={30} /></span>
                    <div>
                      <h3 className="font-display text-2xl uppercase md:text-3xl">{p.t}</h3>
                      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-steel-300">{p.d}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* história com parallax */}
      <section ref={secRef} className="relative overflow-hidden border-b border-line-dark">
        <img ref={bgRef} src={IMG.hero} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-[120%] w-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-coal-950/80" aria-hidden="true" />
        <div className="relative mx-auto max-w-(--container-site) px-6 py-24 md:py-32">
          <SectionHead
            kicker="Linha do tempo"
            title={<>De revenda de usados a <span className="text-hz-400">pátio completo</span></>}
          />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {MILESTONES.map((m, i) => (
              <Reveal key={m.year} delay={i * 100}>
                <div className="border-t-2 border-hz-400 pt-5">
                  <p className="font-display text-4xl text-bone-100">{m.year}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-steel-300">{m.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA institucional */}
      <section className="bg-coal-950 py-24">
        <div className="mx-auto max-w-(--container-site) px-6">
          <div className="flex flex-wrap items-center justify-between gap-8 border border-line-dark bg-coal-900 p-8 md:p-12">
            <div className="max-w-xl">
              <Kicker tone="agri">Porteira aberta</Kicker>
              <h2 className="mt-4 font-display text-3xl uppercase leading-tight md:text-4xl">
                Venha ver a máquina trabalhando antes de decidir
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-steel-300">
                Pátio aberto para visita com hora marcada em {BUSINESS.address.city}/{BUSINESS.address.state}. Ligue a máquina, ande no talhão de teste e leve a ficha técnica impressa.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn href={waLink(BUSINESS.whatsapp, `Olá! Quero agendar uma visita ao pátio da ${BUSINESS.name}.`)} tone="agri" size="lg">
                <IcWhatsApp size={17} /> Agendar visita
              </Btn>
              <Btn to="/maquinas" tone="outline" size="lg">
                Ver estoque <IcArrow size={16} />
              </Btn>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
