# Aivio-ia

`index.html` é o app em produção — um arquivo único (HTML+CSS+JS), sem
build, sem backend. É isso que fica publicado no Vercel a partir deste
repositório. Busca comércios sem site no OpenStreetMap (Nominatim +
Overpass) e gera, para cada um, uma página de apresentação com textos e
fotos reais (Pexels, com fallback automático).

Para publicar: qualquer host de arquivos estáticos serve — basta apontar
para este `index.html` (é o que o Vercel já faz automaticamente).

## `frontend/` e `backend/`

Essas duas pastas contêm uma reconstrução em andamento do mesmo app como
um SaaS de verdade (React + TypeScript + Vite + Tailwind no frontend,
Node/Express no backend — arquitetura de dashboard, com as integrações
externas rodando no servidor em vez do navegador). **Não é o que está em
produção agora** — fica aqui guardada para quando fizer sentido migrar.
Instruções de como rodá-la estão em `frontend/README_ARQUITETURA.md`
(scaffold com `npm create vite`; instale as dependências de cada pasta
separadamente com `npm install` dentro de `frontend/` e de `backend/`).
