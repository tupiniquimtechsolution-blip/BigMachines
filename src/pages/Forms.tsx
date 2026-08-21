import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { BUSINESS } from "../config/business";
import { IMPLEMENTS, MACHINES } from "../data/machines";
import { cx, formatBRL, generalMessage, tradeMessage, usePageMeta, waLink } from "../lib/utils";
import { Btn, IcArrow, IcCheck, IcClock, IcPhone, IcPin, IcShield, IcWhatsApp, IcWrench, Kicker, Reveal, SectionHead } from "../components/ui";

const inputCls =
  "w-full border border-line-dark bg-coal-950 px-4 py-3 text-[15px] text-bone-100 placeholder:text-steel-500 transition-colors focus:border-hz-400 focus:outline-none";
const labelCls = "mb-1.5 block font-cond text-[12px] font-semibold uppercase tracking-[0.2em] text-steel-300";

function PageHeader({ kicker, title, sub }: { kicker: string; title: ReactNode; sub: string }) {
  return (
    <header className="border-b border-line-dark bg-coal-900">
      <div className="hazard-thin h-1.5 w-full opacity-60" aria-hidden="true" />
      <div className="mx-auto max-w-(--container-site) px-6 py-14 md:py-20">
        <Reveal><Kicker>{kicker}</Kicker></Reveal>
        <Reveal delay={80}><h1 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.92]">{title}</h1></Reveal>
        <Reveal delay={150}><p className="mt-4 max-w-2xl text-lg text-steel-300">{sub}</p></Reveal>
      </div>
    </header>
  );
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span className="grid h-16 w-16 shrink-0 place-items-center border border-hz-500/40 bg-coal-800 font-display text-2xl text-hz-300">
      {initials}
    </span>
  );
}

/* ================= FINANCIAMENTO ================= */

export function FinancingPage() {
  usePageMeta(
    `Financiamento de Tratores e Máquinas — ${BUSINESS.name} | ${BUSINESS.address.city}/${BUSINESS.address.state}`,
    "Simulação de financiamento de trator, colheitadeira e máquina pesada: CDC rural, Finame, consórcio e barter. Solicite pelo WhatsApp sem compromisso.",
  );
  const [params] = useSearchParams();
  const preCode = params.get("maquina");
  const machineOptions = useMemo(
    () =>
      MACHINES.filter((m) => m.status !== "vendida").map((m) => ({
        value: `${m.brand} ${m.model} ${m.year} (${m.code})`,
        label: `${m.brand} ${m.model} ${m.year} — ${m.price ? formatBRL(m.price) : "consultar"}`,
        price: m.price,
      })),
    [],
  );
  const pre = machineOptions.find((o) => preCode && o.value.includes(preCode));

  const [f, setF] = useState({
    name: "", phone: "", doc: "",
    machine: pre?.value ?? "", value: pre?.price ? String(pre.price) : "",
    down: "", term: "60", city: "", msg: "",
  });
  const [sent, setSent] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = [
      "Olá! Quero uma SIMULAÇÃO DE FINANCIAMENTO:",
      "",
      `• Máquina: ${f.machine || "ainda não escolhi"}`,
      f.value ? `• Valor estimado: R$ ${f.value}` : "",
      f.down ? `• Entrada: R$ ${f.down}` : "",
      `• Prazo desejado: ${f.term} meses`,
      `• Cidade: ${f.city}`,
      `• Contato: ${f.phone} (${f.name})`,
      f.doc ? `• CPF/CNPJ: ${f.doc}` : "",
      f.msg ? `• Obs: ${f.msg}` : "",
      "",
      "Pode me apresentar CDC, Finame ou consórcio?",
    ].filter(Boolean).join("\n");
    window.open(waLink(BUSINESS.whatsapp, msg), "_blank", "noopener");
    setSent(true);
  };

  return (
    <div className="pt-[76px] lg:pt-[118px]">
      <PageHeader
        kicker="Financiamento & consórcio"
        title={<>A máquina trabalha. <span className="text-hz-400">O capital respira.</span></>}
        sub="Montamos a operação com as principais linhas do mercado. A simulação oficial vem da instituição financeira — aqui você não recebe promessa de taxa, recebe proposta."
      />
      <div className="mx-auto grid max-w-(--container-site) gap-12 px-6 py-14 md:py-20 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Reveal>
            <h2 className="font-display text-3xl uppercase">Como funciona</h2>
            <ol className="mt-6 space-y-0">
              {[
                ["Envie a simulação", "Você escolhe a máquina, o prazo e a entrada. Leva 2 minutos."],
                ["Análise de crédito", "Nossa mesa de crédito aciona os bancos parceiros em até 48h úteis."],
                ["Assinatura e retirada", "Contrato assinado, máquina faturada e retirada no pátio — ou entregue na sua porteira."],
              ].map(([t, d], i) => (
                <li key={t} className="flex gap-5 border-l-2 border-line-dark pb-8 pl-6 last:pb-0" style={{ borderColor: i === 0 ? "var(--color-hz-400)" : undefined }}>
                  <div>
                    <p className="font-cond text-sm font-bold uppercase tracking-[0.2em] text-hz-300">Passo 0{i + 1}</p>
                    <h3 className="mt-1 font-display text-xl uppercase">{t}</h3>
                    <p className="mt-2 text-[14px] leading-relaxed text-steel-300">{d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120} className="mt-10">
            <h3 className="font-cond text-sm font-bold uppercase tracking-[0.24em] text-bone-100">Linhas que operamos</h3>
            <ul className="mt-4 divide-y divide-line-dark border border-line-dark">
              {[
                ["CDC rural", "Parcelas alinhadas ao ciclo da safra, com carência de até 180 dias."],
                ["Finame / BNDES", "Para CNPJ, com taxas subsidiadas e prazos longos."],
                ["Consórcio", "Planejamento sem juros: contemplação por lance ou sorteio."],
                ["Barter", "Parcelas referenciadas em sacas — o campo paga a máquina."],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start gap-3 p-4">
                  <IcCheck size={17} className="mt-0.5 shrink-0 text-agri-400" />
                  <div>
                    <p className="font-cond text-[15px] font-bold uppercase tracking-[0.1em] text-bone-100">{t}</p>
                    <p className="mt-0.5 text-[13px] leading-snug text-steel-400">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 border border-hz-500/30 bg-hz-400/5 p-4 text-[13px] leading-relaxed text-steel-300">
              <strong className="text-hz-300">Transparência:</strong> não exibimos taxas nem calculadoras de parcela neste site. Condições reais dependem de análise de crédito da instituição financeira.
            </p>
          </Reveal>
        </div>

        <Reveal variant="right" className="lg:col-span-3">
          <form onSubmit={submit} className="border border-line-dark bg-coal-900 p-7 md:p-9">
            <h2 className="font-display text-2xl uppercase">Solicitar simulação</h2>
            <p className="mt-2 text-[14px] text-steel-400">A solicitação abre pronta no WhatsApp — sem cadastro, sem spam.</p>
            {sent ? (
              <div className="mt-8 border border-agri-500/40 bg-agri-500/5 p-6 text-center">
                <IcCheck size={34} className="mx-auto text-agri-300" />
                <h3 className="mt-3 font-display text-2xl uppercase">Simulação a caminho</h3>
                <p className="mt-2 text-[14px] text-steel-300">Abrimos seu WhatsApp com os dados preenchidos. Confirme o envio e nossa mesa de crédito responde em horário comercial.</p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="fn-name" className={labelCls}>Nome *</label><input id="fn-name" required className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Nome completo" /></div>
                <div><label htmlFor="fn-phone" className={labelCls}>WhatsApp *</label><input id="fn-phone" required inputMode="tel" className={inputCls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="(00) 00000-0000" /></div>
                <div>
                  <label htmlFor="fn-machine" className={labelCls}>Máquina *</label>
                  <select id="fn-machine" required className={inputCls} value={f.machine} onChange={(e) => setF({ ...f, machine: e.target.value, value: machineOptions.find((o) => o.value === e.target.value)?.price ? String(machineOptions.find((o) => o.value === e.target.value)?.price) : f.value })}>
                    <option value="">Selecione a máquina</option>
                    {machineOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    <option value="Ainda não escolhi">Ainda não escolhi — quero orientação</option>
                  </select>
                </div>
                <div><label htmlFor="fn-value" className={labelCls}>Valor estimado (R$)</label><input id="fn-value" inputMode="numeric" className={inputCls} value={f.value} onChange={(e) => setF({ ...f, value: e.target.value.replace(/\D/g, "") })} placeholder="Ex.: 389000" /></div>
                <div><label htmlFor="fn-down" className={labelCls}>Entrada (R$)</label><input id="fn-down" inputMode="numeric" className={inputCls} value={f.down} onChange={(e) => setF({ ...f, down: e.target.value.replace(/\D/g, "") })} placeholder="Opcional" /></div>
                <div>
                  <label htmlFor="fn-term" className={labelCls}>Prazo</label>
                  <select id="fn-term" className={inputCls} value={f.term} onChange={(e) => setF({ ...f, term: e.target.value })}>
                    {["24", "36", "48", "60", "72", "96"].map((t) => <option key={t} value={t}>{t} meses</option>)}
                  </select>
                </div>
                <div><label htmlFor="fn-city" className={labelCls}>Cidade *</label><input id="fn-city" required className={inputCls} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Cidade/UF" /></div>
                <div><label htmlFor="fn-doc" className={labelCls}>CPF/CNPJ (opcional)</label><input id="fn-doc" className={inputCls} value={f.doc} onChange={(e) => setF({ ...f, doc: e.target.value })} placeholder="Acelera a análise — não é obrigatório" /></div>
                <div className="sm:col-span-2"><label htmlFor="fn-msg" className={labelCls}>Observações</label><textarea id="fn-msg" rows={3} className={inputCls} value={f.msg} onChange={(e) => setF({ ...f, msg: e.target.value })} placeholder="Carência, safra de referência, outro bem na operação…" /></div>
                <div className="sm:col-span-2">
                  <Btn type="submit" tone="agri" size="lg" className="w-full"><IcWhatsApp size={18} /> Solicitar simulação</Btn>
                  <p className="mt-2 text-center text-[12px] text-steel-500">Suus dados seguem apenas para o WhatsApp da loja. CPF/CNPJ só é usado na análise, se você informar.</p>
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= TROCA ================= */

export function TradeInPage() {
  usePageMeta(
    `Dê sua Máquina na Troca — Avaliação de Usados | ${BUSINESS.name}`,
    "Avaliamos seu trator ou máquina usada pelo estado real: horas, revisões, pneus e documentos. O valor vira entrada na próxima máquina.",
  );
  const [f, setF] = useState({ name: "", phone: "", brand: "", model: "", year: "", hours: "", state: "Bom", city: "", desc: "" });
  const [photos, setPhotos] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onFiles = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 8);
    setPhotos(files.map((file) => URL.createObjectURL(file)));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const msg = tradeMessage({ ...f, photos: photos.length });
    window.open(waLink(BUSINESS.whatsapp, msg), "_blank", "noopener");
    setSent(true);
  };

  return (
    <div className="pt-[76px] lg:pt-[118px]">
      <PageHeader
        kicker="Troca inteligente"
        title={<>Dê sua máquina <span className="text-safety-400">na troca</span></>}
        sub="Usado bom não encalha: vira entrada. Descreva a máquina, anexe as fotos e receba a avaliação do nosso time — sem enrolação e sem proposta-clichê."
      />
      <div className="mx-auto grid max-w-(--container-site) gap-12 px-6 py-14 md:py-20 lg:grid-cols-5">
        <Reveal variant="left" className="lg:col-span-2">
          <h2 className="font-display text-3xl uppercase">O que olhamos na avaliação</h2>
          <ul className="mt-6 space-y-4">
            {[
              [IcClock, "Horímetro & histórico", "Horas reais, horas de motor vs. trabalho pesado e notas de manutenção."],
              [IcWrench, "Mecânica & hidráulica", "Motor, transmissão, bombas e vazamentos. Teste de carga na oficina."],
              [IcShield, "Documentação", "Nota fiscal de origem, alienação e situação cadastral limpa."],
              [IcCheck, "Rodado & estrutura", "Pneus, eixos, chassi, cabine e implementos que acompanham."],
            ].map(([Icon, t, d]) => {
              const Ic = Icon as typeof IcClock;
              return (
                <li key={t as string} className="flex gap-4 border border-line-dark bg-coal-900 p-5">
                  <span className="grid h-11 w-11 shrink-0 place-items-center bg-coal-800 text-safety-400"><Ic size={21} /></span>
                  <div>
                    <h3 className="font-cond text-[15px] font-bold uppercase tracking-[0.12em] text-bone-100">{t as string}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-steel-400">{d as string}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 border border-line-dark bg-coal-900 p-5 text-[14px] leading-relaxed text-steel-300">
            Fotos que mais ajudam: <strong className="text-bone-100">frente, traseira, laterais, cabine, motor, horímetro e pneus</strong>. Pode ser do celular mesmo, com luz do dia.
          </p>
        </Reveal>

        <Reveal variant="right" delay={100} className="lg:col-span-3">
          <form onSubmit={submit} className="border border-line-dark bg-coal-900 p-7 md:p-9">
            <h2 className="font-display text-2xl uppercase">Descreva sua máquina</h2>
            {sent ? (
              <div className="mt-8 border border-agri-500/40 bg-agri-500/5 p-6 text-center">
                <IcCheck size={34} className="mx-auto text-agri-300" />
                <h3 className="mt-3 font-display text-2xl uppercase">Avaliação solicitada</h3>
                <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-steel-300">
                  Abrimos seu WhatsApp com a ficha preenchida{photos.length > 0 ? ` — agora anexe as ${photos.length} foto(s) na conversa` : ""}. Nosso avaliador responde em horário comercial.
                </p>
              </div>
            ) : (
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="t-name" className={labelCls}>Seu nome *</label><input id="t-name" required className={inputCls} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                <div><label htmlFor="t-phone" className={labelCls}>WhatsApp *</label><input id="t-phone" required inputMode="tel" className={inputCls} value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="(00) 00000-0000" /></div>
                <div><label htmlFor="t-brand" className={labelCls}>Marca *</label><input id="t-brand" required className={inputCls} value={f.brand} onChange={(e) => setF({ ...f, brand: e.target.value })} placeholder="Ex.: John Deere" /></div>
                <div><label htmlFor="t-model" className={labelCls}>Modelo *</label><input id="t-model" required className={inputCls} value={f.model} onChange={(e) => setF({ ...f, model: e.target.value })} placeholder="Ex.: 6110J" /></div>
                <div><label htmlFor="t-year" className={labelCls}>Ano *</label><input id="t-year" required inputMode="numeric" className={inputCls} value={f.year} onChange={(e) => setF({ ...f, year: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="2020" /></div>
                <div><label htmlFor="t-hours" className={labelCls}>Horas de uso</label><input id="t-hours" inputMode="numeric" className={inputCls} value={f.hours} onChange={(e) => setF({ ...f, hours: e.target.value.replace(/\D/g, "") })} placeholder="Ex.: 3200" /></div>
                <div>
                  <label htmlFor="t-state" className={labelCls}>Estado de conservação *</label>
                  <select id="t-state" className={inputCls} value={f.state} onChange={(e) => setF({ ...f, state: e.target.value })}>
                    {["Excelente", "Bom", "Regular", "Precisando de reparo"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div><label htmlFor="t-city" className={labelCls}>Cidade *</label><input id="t-city" required className={inputCls} value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Cidade/UF" /></div>
                <div className="sm:col-span-2"><label htmlFor="t-desc" className={labelCls}>Detalhes & implementos que acompanham</label><textarea id="t-desc" rows={3} className={inputCls} value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} placeholder="Revisões, único dono, piloto automático, plataforma…" /></div>

                <div className="sm:col-span-2">
                  <span className={labelCls}>Fotos da máquina (até 8)</span>
                  <input ref={fileRef} type="file" accept="image/*" multiple onChange={onFiles} className="sr-only" aria-label="Selecionar fotos da máquina" />
                  <button type="button" onClick={() => fileRef.current?.click()} className="w-full border border-dashed border-steel-500 px-4 py-6 text-center font-cond text-[13px] font-semibold uppercase tracking-[0.18em] text-steel-300 transition-colors hover:border-hz-400 hover:text-hz-300">
                    {photos.length > 0 ? `${photos.length} foto(s) selecionada(s) — toque para trocar` : "Escolher fotos (frente, cabine, motor, horímetro, pneus…)"}
                  </button>
                  {photos.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {photos.map((p, i) => (
                        <img key={i} src={p} alt={`Foto selecionada ${i + 1}`} className="h-16 w-20 border border-line-dark object-cover" />
                      ))}
                    </div>
                  )}
                  <p className="mt-2 text-[12px] leading-relaxed text-steel-500">
                    Este formulário não envia as fotos por si só — elas viajam com você: ao confirmar, o WhatsApp abre com a ficha pronta e você anexa as imagens lá. Sem upload falso.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <Btn type="submit" tone="safety" size="lg" className="w-full"><IcWhatsApp size={18} /> Pedir avaliação no WhatsApp</Btn>
                </div>
              </div>
            )}
          </form>
        </Reveal>
      </div>
    </div>
  );
}

/* ================= CONTATO ================= */

export function ContactPage() {
  usePageMeta(
    `Contato & Pátio em ${BUSINESS.address.city}/${BUSINESS.address.state} — ${BUSINESS.name}`,
    `Fale com um especialista em tratores e máquinas pesadas em ${BUSINESS.address.city}/${BUSINESS.address.state}. WhatsApp, telefone, endereço do pátio e horários de atendimento.`,
  );
  return (
    <div className="pt-[76px] lg:pt-[118px]">
      <PageHeader
        kicker="Atendimento comercial"
        title={<>Fale com um <span className="text-hz-400">especialista</span></>}
        sub="Cada linha de máquina tem um consultor dedicado. Escolha a área, chame direto — sem central, sem robô, sem espera."
      />

      <div className="mx-auto max-w-(--container-site) px-6 py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {BUSINESS.team.map((p, i) => (
            <Reveal key={p.name} delay={i * 90}>
              <div className="flex h-full flex-col border border-line-dark bg-coal-900 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-steel-500 hover:shadow-plate">
                <div className="flex items-center gap-4">
                  <Avatar name={p.name} />
                  <div>
                    <h2 className="font-display text-2xl uppercase leading-none">{p.name}</h2>
                    <p className="mt-1.5 font-cond text-[12px] font-semibold uppercase tracking-[0.18em] text-hz-300">{p.role}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2.5 text-[14px] text-steel-300">
                  <li className="flex items-center gap-2.5"><IcPhone size={15} className="text-hz-400" /> {p.phoneDisplay}</li>
                  <li className="flex items-center gap-2.5"><IcWhatsApp size={15} className="text-agri-400" /> {p.phoneDisplay}</li>
                  <li className="flex items-center gap-2.5 break-all"><IcPin size={15} className="text-steel-400" /> {p.email}</li>
                </ul>
                <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
                  <Btn href={waLink(p.whatsapp, `Olá ${p.name.split(" ")[0]}! Vim pelo site da ${BUSINESS.name} e quero falar sobre máquinas.`)} tone="agri" size="sm">
                    <IcWhatsApp size={15} /> WhatsApp
                  </Btn>
                  <Btn href={`tel:+${p.whatsapp}`} tone="dark" size="sm">
                    <IcPhone size={15} /> Ligar
                  </Btn>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* pátio / mapa */}
        <div className="mt-20 grid overflow-hidden border border-line-dark bg-coal-900 lg:grid-cols-2">
          <div className="relative min-h-[340px]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(143,150,138,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(143,150,138,0.12) 1px, transparent 1px)",
                backgroundSize: "36px 36px",
                backgroundColor: "var(--color-coal-950)",
              }}
              aria-hidden="true"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <span className="relative mx-auto block h-5 w-5">
                <span className="absolute inset-0 animate-ping bg-hz-400/60" aria-hidden="true" />
                <span className="relative block h-5 w-5 rotate-45 border-2 border-hz-400 bg-coal-950" aria-hidden="true" />
              </span>
              <p className="mt-4 font-cond text-sm font-bold uppercase tracking-[0.22em] text-bone-100">{BUSINESS.name}</p>
              <p className="mt-1 font-cond text-[12px] uppercase tracking-[0.18em] text-steel-400">Rod. Anhanguera, km 308</p>
              <a
                href={BUSINESS.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 bg-hz-400 px-4 py-2.5 font-cond text-[12px] font-bold uppercase tracking-[0.16em] text-coal-950 transition-colors hover:bg-hz-300"
              >
                Abrir rota no Google Maps <IcArrow size={14} />
              </a>
            </div>
            <span className="absolute bottom-3 left-3 bg-coal-950/85 px-3 py-1.5 font-cond text-[11px] uppercase tracking-[0.18em] text-steel-400">
              Mapa ilustrativo — use o botão para a rota real
            </span>
          </div>
          <div className="p-8 md:p-10">
            <Kicker>Visite nosso pátio</Kicker>
            <h2 className="mt-3 font-display text-3xl uppercase leading-tight md:text-4xl">
              {BUSINESS.address.street}
            </h2>
            <p className="mt-2 text-[15px] text-steel-300">
              {BUSINESS.address.complement} — {BUSINESS.address.city}/{BUSINESS.address.state}, CEP {BUSINESS.address.zip}
            </p>
            <dl className="mt-7 divide-y divide-line-dark border-y border-line-dark">
              {BUSINESS.hours.map((h) => (
                <div key={h.days} className="flex items-center justify-between py-3">
                  <dt className="font-cond text-[14px] font-semibold uppercase tracking-[0.14em] text-steel-300">{h.days}</dt>
                  <dd className={cx("font-cond text-[14px] font-bold uppercase tracking-[0.14em]", h.time === "Fechado" ? "text-safety-400" : "text-bone-100")}>{h.time}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between py-3">
                <dt className="font-cond text-[14px] font-semibold uppercase tracking-[0.14em] text-steel-300">Telefone</dt>
                <dd><a href={`tel:+${BUSINESS.phoneRaw}`} className="font-cond text-[14px] font-bold uppercase tracking-[0.14em] text-hz-300 hover:text-hz-400">{BUSINESS.phoneDisplay}</a></dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Btn href={waLink(BUSINESS.whatsapp, generalMessage())} tone="agri"><IcWhatsApp size={16} /> Chamar no WhatsApp</Btn>
              <Btn to="/maquinas" tone="outline">Ver estoque antes de vir</Btn>
            </div>
          </div>
        </div>

        <Reveal className="mt-14">
          <SectionHead
            kicker="Implementos em destaque"
            title={<>Já que está por aqui…</>}
            lead={`Temos ${IMPLEMENTS.length} implementos no pátio agora — e mais ${MACHINES.filter((m) => m.status === "disponivel").length} máquinas disponíveis em 5 categorias.`}
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Btn to="/implementos" tone="hz">Ver implementos</Btn>
            <Btn to="/usados" tone="outline">Usados selecionados</Btn>
            <Btn to="/novos" tone="outline">Máquinas novas</Btn>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
