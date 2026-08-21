# Guia de Substituição para o Cliente

Checklist para transformar este site demonstrativo no site oficial da sua revenda.
Quase tudo se resolve editando **3 arquivos** — sem tocar no restante do código.

---

## 1. Dados da empresa — `src/config/business.ts`

- [ ] `name`, `legalName`, `slogan`, `tagline`
- [ ] `cnpj` (hoje: 00.000.000/0001-00)
- [ ] Telefones: `phoneDisplay`, `phoneRaw`, `whatsapp` (formato 55 + DDD + número)
- [ ] `email`
- [ ] `address` (rua, complemento, cidade, UF, CEP) e `mapsLink` (rota real do Google Maps)
- [ ] `hours` (horários de atendimento)
- [ ] `instagram` / `instagramUrl` / `facebookUrl` / `youtubeUrl`
- [ ] `team[]` — nome, área, telefone/WhatsApp e e-mail de cada vendedor (fotos: ver item 8)
- [ ] `stats[]` — apenas números **confirmados** (anos, máquinas entregues, cidades, oficina)
- [ ] `brands[]` — **somente marcas com as quais a empresa efetivamente trabalha**

## 2. Estoque de máquinas — `src/data/machines.ts`

Cada máquina é um objeto em `MACHINES[]`:

- [ ] `brand`, `model`, `year`, `category`, `condition` (novo/usado)
- [ ] `status`: `disponivel` | `reservada` | `vendida` — vendida ganha tarja e some das CTAs de compra
- [ ] `price` (null = "a consultar") e `priceWas` (para selo "redução de preço")
- [ ] `hours`, `powerCv`, `weightKg`, `fuel`, `transmission`, `drive`
- [ ] `badges[]`: Revisado / Único dono / Baixas horas / Pronta entrega / Oportunidade / Redução de preço — use só selos verdadeiros
- [ ] `images[]` — fotos reais da unidade (mínimo 3: ¾ frente, lateral, cabine/horímetro)
- [ ] `specGroups[]` — ficha técnica por grupo (Motor, Transmissão, Dimensões, Operação). **Campos ausentes simplesmente não aparecem** — nunca invente valores
- [ ] `featured` — alimenta a seção "Oportunidades"
- [ ] `slug` e `code` — slug gera a URL `/maquinas/[slug]`; code é o código de estoque (ex.: TF-0143)

Implementos: edite `IMPLEMENTS[]` (tipo, marca, modelo, compatibilidade de trator, preço).

## 3. Imagens — constante `IMG` em `src/data/machines.ts`

Todas as imagens do site (hero, storytelling, cards, pátio) saem desta constante.
- [ ] Substituir pelas fotos reais (ver `ASSET_SOURCES.md` para o mapa completo)
- [ ] Preferir WebP/AVIF; ~1200–1900px de largura; vídeos com poster

## 4. Vídeos

- [ ] Hero: substituir `IMG.hero` por um `<video>` com poster (reel de máquina trabalhando)
- [ ] Máquina individual: campo pronto para evoluir — galeria aceita sequência de fotos (o selo "360°" já está preparado e só deve ser ativado com sequência fotográfica real)

## 5. WhatsApp & mensagens — `src/lib/utils.ts`

- [ ] Ajustar os templates `machineMessage`, `financeMessage`, `quoteMessage`, `tradeMessage` ao tom da empresa
- [ ] O número de destino vem de `business.whatsapp` (ou do vendedor, na página de contato)

## 6. SEO

- [ ] `index.html`: title, description, JSON-LD (AutoDealer) com dados reais
- [ ] Cada página gera title/description via `usePageMeta()` — textos em `SEO_COPY` (catálogo) e nos cabeçalhos
- [ ] Schema.org Product é gerado automaticamente na página da máquina (preço/estoque só entram quando verdadeiros)
- [ ] Substituir os textos de SEO local (`SEO_COPY`) citando cidade/bairro reais

## 7. Formulários

Nenhum formulário "finge" envio: todos abrem o WhatsApp com a mensagem estruturada.
- [ ] Para envio a um CRM/e-mail, conectar o `submit` de `QuoteModal`, `FinancingPage` e `TradeInPage` ao endpoint real
- [ ] Upload de fotos na troca: hoje as fotos são anexadas pelo próprio usuário no WhatsApp (honesto, sem backend)

## 8. Conteúdos pendentes de material real

- [ ] Fotos individuais de cada máquina do estoque (hoje há reaproveitamento de 5 fotos-base)
- [ ] Fotos da equipe (hoje: avatares com iniciais)
- [ ] Fotos da fachada/office (Google Maps)
- [ ] Vídeo hero (reel oficial)
- [ ] Seção "Antes/Depois" (só publicar com registros reais de serviço)
- [ ] Efeito 360° (requer sequência de ~24 fotos da máquina em giratório)

## 9. Evolução para painel administrativo

A arquitetura já separa dados (`src/data/machines.ts`) da interface. Para um painel:
1. Criar tabela `machines` (Supabase/Postgres) com os mesmos campos do tipo `Machine`
2. Trocar o import estático por um fetch/cache (o tipo já está definido em TypeScript)
3. Rotas de catálogo, filtros, comparador e favoritos seguem funcionando sem mudança

## 10. Checklist final antes de publicar

- [ ] `npm run build` passando
- [ ] Testar em 360 / 390 / 430 / 768 / 1024 / 1440 / 1920 px
- [ ] WhatsApp abrindo com mensagem correta em cada contexto (máquina, financiamento, troca, orçamento)
- [ ] Favoritos e comparador persistindo (localStorage)
- [ ] `prefers-reduced-motion` respeitado (Lenis/GSAP desligados)
- [ ] Nenhuma máquina vendida aparecendo como disponível
