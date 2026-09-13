# AI Website Hunter

Ferramenta web **gratuita** para encontrar empresas/comércios que
potencialmente não possuem site e gerar rapidamente, para cada uma delas,
um site profissional — com preview responsivo, download do HTML e
persistência local dos sites salvos.

Não é uma landing page: é um dashboard de aplicativo (SaaS), com busca,
filtros, cards de resultado, geração assistida por IA (com modo demo
funcional) e gerenciamento dos sites gerados.

> Reconstrução completa do protótipo anterior (Aivio-ia, mantido em
> `legacy/` apenas como referência histórica) em uma arquitetura real de
> frontend + backend.

## Arquitetura

```
/frontend   React + TypeScript + Vite + Tailwind CSS v4 + lucide-react
/backend    Node.js + Express (ESM), sem nenhuma chave de API exposta ao cliente
/legacy     Protótipo HTML único anterior (mantido apenas como referência)
```

O frontend **nunca** guarda chaves secretas. Toda integração externa
(Nominatim, Overpass, Pexels, IA) roda no backend, que expõe apenas os
endpoints REST necessários.

## Como rodar (desenvolvimento)

Pré-requisitos: Node.js 20+.

```bash
npm install        # instala frontend e backend (npm workspaces)
npm run dev        # roda backend (porta 4000) e frontend (porta 5173) juntos
```

Abra http://localhost:5173 — o Vite já faz proxy de `/api/*` para o
backend em desenvolvimento (veja `frontend/vite.config.ts`).

Rodando cada parte separadamente, se preferir:

```bash
npm run dev -w backend     # http://localhost:4000
npm run dev -w frontend    # http://localhost:5173
```

## Variáveis de ambiente

Copie os exemplos e preencha apenas o que você tiver:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env   # opcional em dev
```

`backend/.env`:

| Variável         | Obrigatória? | Efeito quando vazia                                   |
|------------------|:------------:|--------------------------------------------------------|
| `PORT`           | não          | usa `4000`                                              |
| `CORS_ORIGIN`    | não          | usa `http://localhost:5173`                             |
| `AI_API_KEY`     | não          | usa o **gerador local por templates** (modo demo)       |
| `AI_API_URL`     | não          | usa a URL padrão da Anthropic                           |
| `AI_MODEL`       | não          | usa `claude-sonnet-5`                                   |
| `PEXELS_API_KEY` | não          | usa **imagens de placeholder** locais (SVG)             |

**O aplicativo funciona 100% sem nenhuma dessas chaves configuradas** —
esse é o modo gratuito/demo, e fica sempre identificado como tal na
interface (nunca é confundido com dados/geração reais).

`frontend/.env` (só necessário em produção, se o backend estiver em outro
domínio):

```
VITE_API_BASE_URL=https://sua-api.exemplo.com/api
```

## Build para produção

```bash
npm run build          # build do backend (no-op) + build do frontend (dist/)
npm start               # sobe o backend (node backend/src/index.js)
```

Sirva `frontend/dist` como estático (Vercel, Netlify, Nginx, etc.) e
aponte `VITE_API_BASE_URL` para onde o backend estiver publicado.

## Endpoints do backend

| Método | Rota                    | Descrição                                                                 |
|--------|--------------------------|----------------------------------------------------------------------------|
| GET    | `/api/health`            | Status da API e modo ativo (IA/demo, Pexels/placeholder)                  |
| GET    | `/api/search`            | Busca empresas reais (Nominatim + Overpass), com fallback demo            |
| GET    | `/api/search/categories` | Lista de categorias suportadas                                            |
| POST   | `/api/generate-site`     | Gera o conteúdo (headline, sobre, serviços, FAQ, SEO...) — IA ou local    |
| POST   | `/api/search-images`     | Busca imagens ilustrativas do segmento (Pexels ou placeholder)            |
| POST   | `/api/generate-html`     | Monta o HTML final e independente do site, pronto para baixar/publicar    |

Todas as chamadas a serviços externos têm timeout, retry (quando faz
sentido) e cache simples em memória, e nunca derrubam a experiência do
usuário: qualquer falha externa cai graciosamente em modo demonstração
(dados sinalizados como `demo`) sem inventar empresas reais.

## Fonte dos dados

- **Geocodificação**: Nominatim (OpenStreetMap), restrito ao Brasil.
- **Busca de empresas**: Overpass API (OpenStreetMap), em duas fases —
  `node` (rápida e prioritária) e `way`/`relation` (complemento
  best-effort) — com múltiplos espelhos para resiliência.
- **Imagens**: Pexels (quando configurado) ou placeholders locais — sempre
  rotuladas como "imagem ilustrativa do segmento", nunca como foto real da
  empresa.

Se a busca real falhar (rede indisponível, servidores fora do ar), a
resposta volta com `demo: true` e um motivo (`reason`), e o frontend exibe
um aviso claro de **DEMONSTRAÇÃO** — nunca apresenta dados de exemplo como
reais.

## Persistência

Favoritos, sites salvos e estatísticas ficam no `localStorage` do
navegador (sem exigir banco de dados pago). Veja `frontend/src/lib/storage.ts`
e `frontend/src/context/AppDataContext.tsx`.

## Estrutura de páginas (frontend)

- `/` — Dashboard (estatísticas reais da sessão)
- `/buscar` — Encontrar empresas (filtros + resultados)
- `/gerador` — Gerador de sites (formulário + preview responsivo)
- `/sites-gerados` — Sites salvos (abrir/editar/baixar/excluir)
- `/favoritos` — Empresas favoritadas
- `/configuracoes` — Status da API e limpeza de dados locais
