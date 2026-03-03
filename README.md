# The Crows - Diablo Immortal (Guerra das Sombras)

Aplicação com frontend em React (Vite) e armazenamento 100% local no navegador via IndexedDB. Deploy: site estático no Netlify.

## Visão Geral
- Frontend: React + Tailwind + React Hook Form + Recharts + Router.
- Armazenamento: IndexedDB no navegador.
- Infra:
  - Netlify build em `frontend/` e publicação de SPA.
- Sem backend ou funções serverless.

## Estrutura
```
frontend/
  public/_redirects
  src/pages (Public, Formulario, Login, Admin)
  src/services/api.js
  src/services/db.js
  App.jsx, main.jsx, estilos
netlify.toml
```

## Armazenamento local (IndexedDB)
- O app cria o banco `crows-db` com as coleções `members` e `responses`.
- As operações de adicionar, listar, atualizar e remover dados são feitas localmente.
- Os dados persistem entre recarregamentos, mas podem ser apagados se o usuário limpar os dados do navegador.

## Exportar/Importar
- No painel Admin:
  - Exportar JSON: baixa um arquivo `backup_<ISO>.json` com todas as coleções.
  - Importar JSON: lê um arquivo `.json` gerado pelo app e restaura os dados no IndexedDB.

## Rodar localmente
Na raiz:
```
npm install
npm run dev
```
Abre frontend em http://localhost:5173.

## Deploy
Netlify (SPA estática):
- [netlify.toml](netlify.toml): base `frontend`, publish `dist`.
- Redirects:
  - `/*` → `/index.html` (SPA)

## API (principais)
- Não há API remota; todas as operações são locais via IndexedDB.

## Scripts
- Raiz:
  - `npm run dev`
- Frontend:
  - `npm run build`, `npm run preview`, `npm run test`, `npm run lint`

## Observações
- Os dados ficam no navegador do usuário. Recomende exportar JSON periodicamente.
