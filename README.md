# The Crows - Diablo Immortal (Guerra das Sombras)

Aplicação com frontend em React (Vite) e backend em Netlify Functions, persistindo dados em Postgres. Deploy: tudo no Netlify (SPA + funções).

## Visão Geral
- Frontend: React + Tailwind + React Hook Form + Recharts + Router.
- Backend: Express com rotas REST e arquivo CSV como fallback.
- Banco: Postgres (substitui Supabase).
- Infra:
  - Netlify build em `frontend/` e publicação de SPA.
  - Netlify Functions em `netlify/functions/api.js` para as rotas.
  - Postgres via `POSTGRES_URL`.

## Estrutura
```
frontend/
  public/_redirects
  src/pages (Public, Formulario, Login, Admin)
  src/services/api.js
  App.jsx, main.jsx, estilos
netlify.toml
netlify/functions/api.js
netlify/functions/package.json
```

## Ambiente e Variáveis
Netlify (Environment):
```
POSTGRES_URL=postgres://USER:PASS@HOST:PORT/DBNAME
SUPABASE_MEMBERS_TABLE=members_logins
RESPONSES_TABLE=responses
```
- `POSTGRES_URL`: string de conexão completa (SSL aceito).
- `SUPABASE_MEMBERS_TABLE`: nome da tabela de membros (compatibilidade).
- `RESPONSES_TABLE`: nome da tabela de respostas.

Frontend (build):
- Em produção usa caminhos relativos para `/health` e `/api/*` com proxy do Netlify.
- Admin password: `VITE_ADMIN_PASSWORD` (opcional; default `crowscrows`).

## Banco (Postgres)
Crie a tabela de membros:
```sql
CREATE TABLE IF NOT EXISTS members_logins (
  id SERIAL PRIMARY KEY,
  nome TEXT,
  whatsapp TEXT,
  ts TIMESTAMPTZ
);
```

## Rodar localmente
Na raiz:
```
npm install
npm run dev
```
Abre frontend em http://localhost:5173 e backend em http://localhost:5000.

## Deploy
Netlify (SPA + funções):
- [netlify.toml](netlify.toml): base `frontend`, publish `dist`, functions `netlify/functions`.
- Redirects:
  - `/*` → `/index.html` (SPA)
  - `/health` → `/.netlify/functions/api`
  - `/api/*` → `/.netlify/functions/api`

## API (principais)
- GET `/health` → `{ status: "healthy" }`
- GET `/api/members` → lista de membros (Postgres)
- POST `/api/members` → adiciona membro (Postgres)
- GET `/api/members/export` → CSV
- GET `/api/responses` / POST `/api/responses` → respostas (Postgres)
- GET `/api/admin/ping` → `{ status: "healthy" }`
- GET `/api/admin/supabase` → status do DB (Postgres) [compatibilidade]
- GET `/api/admin/redis` → `{ ok: true, pong: "PONG" }` (se configurado)

## Scripts
- Raiz:
  - `npm run dev` (concurrently backend + frontend)
- Frontend:
  - `npm run build`, `npm run preview`, `npm run test`, `npm run lint`

## Observações
- O endpoint `/api/admin/supabase` agora reporta o estado do Postgres.
- Em produção, o frontend chama `/api/*` e `/health` via mesmo domínio (proxy Netlify), evitando CORS/aborts.
- Configure o Postgres no provedor desejado e defina `POSTGRES_URL` no Netlify.
