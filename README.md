# The Crows - Diablo Immortal (Guerra das Sombras)

Aplicação com frontend em React (Vite) e backend Node/Express, persistindo dados em Postgres. Deploy: Frontend no Netlify com proxy para o backend no Render.

## Visão Geral
- Frontend: React + Tailwind + React Hook Form + Recharts + Router.
- Backend: Express com rotas REST e arquivo CSV como fallback.
- Banco: Postgres (substitui Supabase).
- Infra:
  - Netlify build em `frontend/` e publicação de SPA com `_redirects`.
  - Render para o backend (Node runtime) e Postgres (via `POSTGRES_URL`).
  - Redis opcional (health/ping) para cenários de cache/teste.

## Estrutura
```
backend/
  routes/ (members, responses, admin)
  services/ (fileStore, supabaseStore [usa Postgres internamente], redisClient)
  data/members.csv
  server.js
frontend/
  public/_redirects
  src/pages (Public, Formulario, Login, Admin)
  src/services/api.js
  App.jsx, main.jsx, estilos
render.yaml
netlify.toml
```

## Ambiente e Variáveis
Backend (.env):
```
PORT=5000
POSTGRES_URL=postgres://USER:PASS@HOST:PORT/DBNAME
SUPABASE_MEMBERS_TABLE=members_logins
REDIS_URL=redis://HOST:PORT
```
- `POSTGRES_URL`: string de conexão completa (com SSL aceito pelo Render).
- `SUPABASE_MEMBERS_TABLE`: nome da tabela (mantido por compatibilidade).
- `REDIS_URL`: opcional, usado pelo endpoint `/api/admin/redis`.

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
Render (backend):
- Runtime: Node
- rootDir: `backend`
- buildCommand: `npm install`
- startCommand: `npm run start`
- healthCheckPath: `/health`
- Env Vars: `PORT=5000`, `POSTGRES_URL=<sua conexão>`, `REDIS_URL=<opcional>`

Netlify (frontend):
- [netlify.toml](netlify.toml) com base `frontend`, publish `dist`.
- `_redirects`:
  ```
  /api/* https://SEU_BACKEND.onrender.com/api/:splat 200
  /health https://SEU_BACKEND.onrender.com/health 200
  /* /index.html 200
  ```

## API (principais)
- GET `/health` → `{ status: "healthy" }`
- GET `/api/members` → lista de membros (Postgres → CSV fallback)
- POST `/api/members` → adiciona membro (Postgres + CSV)
- GET `/api/members/export` → CSV
- GET `/api/responses` / POST `/api/responses` → respostas (CSV)
- GET `/api/admin/ping` → `{ status: "healthy" }`
- GET `/api/admin/supabase` → status do DB (Postgres) [compatibilidade]
- GET `/api/admin/redis` → `{ ok: true, pong: "PONG" }` (se configurado)

## Scripts
- Raiz:
  - `npm run dev` (concurrently backend + frontend)
- Backend:
  - `npm run start` (produção)
  - `npm run test` (Vitest + Supertest)
- Frontend:
  - `npm run build`, `npm run preview`, `npm run test`, `npm run lint`

## Observações
- O endpoint `/api/admin/supabase` agora reporta o estado do Postgres.
- Em produção, o frontend chama `/api/*` e `/health` via mesmo domínio (proxy Netlify), evitando CORS/aborts.
- Configure o Postgres no Render ou serviço equivalente, com SSL ativo quando necessário.
