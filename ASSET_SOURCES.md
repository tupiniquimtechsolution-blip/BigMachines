# ASSET_SOURCES — Rastreabilidade de Assets

> Regra de prioridade aplicada ao projeto:
> **P1** conteúdo oficial da empresa → **P2** Instagram oficial → **P3** Google Maps → **P4** site oficial → **P5** placeholder.
>
> ⚠️ **Status atual:** como o repositório não recebeu os dados da empresa real (Instagram/Google Maps/site),
> **todos os assets visuais estão em P5 (placeholder gerado por IA, marcado para substituição)**.
> As URLs abaixo são os placeholders vigentes — substitua pelos arquivos originais seguindo o
> `CLIENT_REPLACEMENT_GUIDE.md`.

## Onde os assets são referenciados

Todos os caminhos de imagem vivem centralizados em `src/data/machines.ts` (constante `IMG`).
Para trocar qualquer imagem do site inteiro, basta editar essa constante.

## Inventário

| Asset (chave em `IMG`) | Tipo | Uso no site | Origem | Observação |
|---|---|---|---|---|
| `hero` | Imagem 1920×1080 | Hero, CTA final, fundo da linha do tempo | P5 — IA (qwenlm.ai/generated-images/7629fdd8…) | Substituir por vídeo real de trator em operação (poster atual) ou foto oficial do Instagram |
| `forca` | Imagem 1600×900 | Storytelling "FORÇA", hotspots, galeria trator verde | P5 — IA (…/ee368c4e…) | Substituir por foto real de trator do estoque |
| `produtividade` | Imagem 1600×900 | Storytelling "PRODUTIVIDADE", card da colheitadeira Case 4130 | P5 — IA (…/e1534e13…) | Substituir por tomada de drone real de colheita |
| `tecnologia` | Imagem 1600×900 | Storytelling "TECNOLOGIA", galeria | P5 — IA (…/26144723…) | Substituir por foto real de cabine/painel |
| `resultado` | Imagem 1600×900 | Storytelling "RESULTADO", cards (plantio/obra) | P5 — IA (…/b02296ab…) | Substituir por foto real de talhão pronto |
| `tratorVerde` | Imagem 1280×853 | Cards John Deere/Valtra, tile "Tratores" | P5 — IA (…/1215dc3a…) | Substituir por foto de pátio de cada máquina (1 foto por máquina) |
| `tratorVermelho` | Imagem 1280×853 | Cards NH/Case/MF | P5 — IA (…/6534fd8a…) | Idem — cada máquina merece a própria foto |
| `escavadeira` | Imagem 1280×853 | Cards Caterpillar, tile "Escavadeiras" | P5 — IA (…/c578c028…) | Idem |
| `retroescavadeira` | Imagem 1280×853 | Cards JCB, tile "Retroescavadeiras" | P5 — IA (…/6161c70d…) | Idem |
| `patio` | Imagem 1600×900 | Seção "Pátio", header institucional | P5 — IA (…/313131ad…) | Substituir por foto real do pátio (Google Maps / Instagram) |

## Fluxo recomendado para a empresa real

1. Baixar fotos/vídeos do **Instagram oficial** (reels de máquinas trabalhando = hero/vídeo).
2. Baixar fotos de fachada/pátio do **Google Maps**.
3. Otimizar para WebP/AVIF (thumbnails ~120px de largura para cards, 1600px para hero).
4. Substituir as URLs na constante `IMG` em `src/data/machines.ts`.
5. Atualizar esta tabela com a origem real de cada asset.

## Conteúdo textual

- Dados comerciais (telefone, WhatsApp, endereço, equipe, CNPJ): `src/config/business.ts` — **fictícios**, marcados para substituição.
- Máquinas e especificações: `src/data/machines.ts` — estoque **demonstrativo**; fichas técnicas seguem o formato real e devem ser preenchidas com os dados de cada unidade (o site só exibe campos presentes; nada é inventado em runtime).
