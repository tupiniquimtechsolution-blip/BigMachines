import { useState } from "react";
import { BUSINESS } from "../config/business";
import { generalMessage, usePageMeta, waLink } from "../lib/utils";
import { Btn, IcArrow, IcWhatsApp, Kicker, Reveal, SectionHead } from "../components/ui";
import { cx } from "../lib/utils";

const ARTICLES = [
  {
    tag: "Compra",
    title: "Qual potência de trator a sua operação pede?",
    minutes: 4,
    body: [
      "Potência demais custa caro na compra e no diesel; de menos, custa caro na janela de plantio. A conta começa pela largura do implemento mais pesado que você vai puxar: plantadeira de 11 linhas pede acima de 110 cv, grade de 28 discos pede acima de 100 cv, e colheita com carreta em rampa pede folga de uns 20%.",
      "Para pecuária e pequenas propriedades, tratores de 75 a 90 cv resolvem roçada, carreta e serviço de curral com custo por hora baixo. Acima de 300 hectares de grãos, pense em 130 cv para cima, com transmissão que aguenta transporte.",
      "No nosso pátio, os consultores cruzam talhão, implemento e relevo antes de indicar máquina — e se a conta fechar num usado de menor potência, a gente diz.",
    ],
  },
  {
    tag: "Usados",
    title: "Horas de uso: o que o horímetro diz (e o que esconde)",
    minutes: 5,
    body: [
      "Hora de trator não é igual para todo trator: 1.000 h de pulverização leve valem menos desgaste que 1.000 h de grade pesada em solo argiloso. Por isso, horímetro baixo sozinho não é atestado de máquina nova — é ponto de partida.",
      "O que confirma a história: notas de manutenção em sequência, folga de pedal e alavancas, cor de fumaça em aceleração fria, estado dos bicos e das mangueiras hidráulicas, e desgaste coerente de banco, volante e pneus com as horas declaradas.",
      "Toda máquina usada da casa passa por checklist de 120 pontos antes de entrar no anúncio. As horas que aparecem no card são as mesmas do horímetro físico — você confere no pátio.",
    ],
  },
  {
    tag: "Checklist",
    title: "12 pontos para conferir antes de fechar num usado",
    minutes: 6,
    body: [
      "1) Horímetro compatível com desgaste geral. 2) Motor frio: partida em 1–2 giros, fumaça clara some rápido. 3) Sem vazamento ativo em juntas e mangueiras. 4) Transmissão sem estalo ou patinação nas trocas. 5) TDF engatando e desengatando limpa.",
      "6) Hidráulica sustentando implemento levantado por 10 minutos sem ceder. 7) Folgas de eixo e terminal de direção dentro do limite. 8) Pneus com mais de 40% de vida e sem cortes profundos. 9) Cabine: ar gelando, vidros e comandos funcionando. 10) Estrutura sem solda 'artesanal' em chassi.",
      "11) Documentação: nota de origem, nada-consta de alienação. 12) Teste de trabalho real, não só volta no pátio. Se o vendedor recusar qualquer um desses itens, agradeça e saia — máquina boa aceita vistoria.",
    ],
  },
  {
    tag: "Crédito",
    title: "CDC, Finame ou consórcio: qual linha encaixa no seu fluxo",
    minutes: 5,
    body: [
      "CDC é o caminho mais rápido: crédito direto, máquina na mão em dias, parcelas fixas — bom para quem tem pressa e entrada. Finame atende CNPJ com taxas subsidiadas e prazos longos, mas exige projeto e documentação em dia.",
      "Consórcio é ferramenta de planejamento: sem juros, com contemplação por lance ou sorteio — funciona para renovar frota em 12–24 meses sem descapitalizar. Barter referenciada em sacas protege o fluxo de quem vive de safra.",
      "Nossa mesa de crédito aciona mais de um banco e traz as propostas lado a lado. Você compara taxa, prazo e carência — a decisão é sua, sem empurrão.",
    ],
  },
  {
    tag: "Implementos",
    title: "Implemento certo: casando a máquina com o talhão",
    minutes: 4,
    body: [
      "Implemento subdimensionado desperdiça trator; superdimensionado força transmissão e bebe diesel. A regra prática: a exigência de potência do implemento deve ficar entre 70% e 90% da potência disponível na barra.",
      "Para plantio direto consolidado, subsolador pontual e plantadeira com bom pantógrafo rendem mais que grade pesada todo ano. Em pastagem, roçadeira hidráulica e carreta de 10 t cobrem 90% da rotina.",
      "Todos os implementos do pátio trazem a faixa de trator compatível no card (ex.: 90–140 cv). Na dúvida, mande a ficha do seu trator no WhatsApp que casamos o implemento.",
    ],
  },
  {
    tag: "Manutenção",
    title: "Manutenção de entressafra que evita parada na colheita",
    minutes: 5,
    body: [
      "Parada em colheita tem custo de hora cheia: grão no pé, frete contratado, janela fechando. A entressafra é o momento mais barato do ano para trocar correias, revisar rolamentos de rotor, calibrar plataformas e testar sensores de perda.",
      "Em tratores, o pacote que salva safra: filtros e óleo no intervalo correto, teste de vazão hidráulica, reaperto de cardan e TDA, e verificação de bicos e bomba antes do plantio.",
      "Nossa oficina agenda entressafra com hora marcada e devolve a máquina com o checklist assinado. Agende pelo WhatsApp antes da correria — a fila dobra em setembro.",
    ],
  },
];

export default function Contents() {
  usePageMeta(
    `Conteúdos & Guias de Compra — ${BUSINESS.name}`,
    "Guias práticos: como escolher potência de trator, avaliar horas de uso, checklist de máquina usada, financiamento, implementos e manutenção de entressafra.",
  );
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="pt-[76px] lg:pt-[118px]">
      <header className="border-b border-line-dark bg-coal-900">
        <div className="hazard-thin h-1.5 w-full opacity-60" aria-hidden="true" />
        <div className="mx-auto max-w-(--container-site) px-6 py-14 md:py-20">
          <Reveal><Kicker>Biblioteca do pátio</Kicker></Reveal>
          <Reveal delay={80}>
            <h1 className="mt-3 max-w-3xl font-display text-[clamp(2.4rem,6vw,4.5rem)] uppercase leading-[0.92]">
              Antes de comprar, <span className="text-hz-400">leia isto</span>
            </h1>
          </Reveal>
          <Reveal delay={150}>
            <p className="mt-4 max-w-2xl text-lg text-steel-300">
              Guias diretos, escritos por quem vende e revisa máquina todo dia. Sem enrolação de blog corporativo.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-14 md:py-20">
        {ARTICLES.map((a, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={a.title} delay={i * 60}>
              <article className="border-b border-line-dark">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-center justify-between gap-6 py-7 text-left"
                >
                  <div>
                    <p className="font-cond text-[12px] font-bold uppercase tracking-[0.24em] text-hz-300">
                      {a.tag} · {a.minutes} min de leitura
                    </p>
                    <h2 className="mt-2 font-display text-2xl uppercase leading-tight transition-colors group-hover:text-hz-300 md:text-3xl">
                      {a.title}
                    </h2>
                  </div>
                  <span
                    className={cx(
                      "grid h-12 w-12 shrink-0 place-items-center border font-display text-2xl transition-all duration-300",
                      isOpen ? "rotate-45 border-hz-400 bg-hz-400 text-coal-950" : "border-line-dark text-steel-300 group-hover:border-hz-400 group-hover:text-hz-300",
                    )}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div className={cx("grid transition-all duration-500", isOpen ? "grid-rows-[1fr] pb-8 opacity-100" : "grid-rows-[0fr] opacity-0")}>
                  <div className="overflow-hidden">
                    {a.body.map((p, pi) => (
                      <p key={pi} className="mb-4 max-w-3xl text-[15px] leading-relaxed text-steel-200">{p}</p>
                    ))}
                    <a href={waLink(BUSINESS.whatsapp, `Olá! Li o guia "${a.title}" no site e quero falar com um consultor.`)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 font-cond text-[13px] font-bold uppercase tracking-[0.18em] text-hz-300 hover:text-hz-400">
                      <IcWhatsApp size={16} /> Tirar dúvida sobre este assunto
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}

        <div className="mt-14 border border-line-dark bg-coal-900 p-8 text-center">
          <SectionHead
            align="center"
            kicker="Aplicando no seu caso"
            title={<>A teoria fica melhor <span className="text-hz-400">no pátio</span></>}
          />
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Btn href={waLink(BUSINESS.whatsapp, generalMessage())} tone="hz"><IcWhatsApp size={17} /> Falar com consultor</Btn>
            <Btn to="/maquinas" tone="outline">Ver máquinas <IcArrow size={16} /></Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
