# The Crows - Diablo Immortal (Guerra das Sombras)

Aplicação web com frontend em React (Vite) e backend via Google Apps Script (GAS) para gestão de membros e respostas da Guerra das Sombras do clã The Crows.

## Visão Geral
- Frontend moderno com Tailwind, Framer Motion, React Hook Form, Recharts e React Router.
- Sem backend próprio: toda persistência na planilha Google via Apps Script.
- Admin com login simples, métricas, gráfico e envio de lembretes via WhatsApp.

## Estrutura
```
frontend/
  public/
    members-example.csv
  src/
    pages/ (Public, Formulario, Login, Admin)
    services/api.js
    App.jsx, main.jsx, styles
  tailwind.config.js, postcss.config.js, .env.example
gas/
  appscript.gs
```

## Pré-requisitos
- Conta Google
- Planilha Google (pode ser a ativa) para receber dados
- Acesso ao Google Apps Script

## Configurar o Google Apps Script
1. Abra Google Apps Script (script.google.com) e crie um projeto.
2. Crie um arquivo `appscript.gs` e cole o conteúdo de [gas/appscript.gs](gas/appscript.gs).
3. No editor, menu Deploy > Test deployments para validar rapidamente.
4. Deploy como Web App:
   - Deploy > Manage deployments > New deployment
   - Type: Web app
   - Execute as: Me (owner)
   - Who has access: Anyone (ou restrito ao seu domínio)
   - Salve e copie a URL pública gerada.
5. A primeira execução pode pedir autorização; aceite.
6. A planilha ativa receberá abas: `Membros`, `Respostas`, `Config` (criadas automaticamente).

### Ações suportadas (via POST JSON)
- `ping` -> `{ status: "healthy" }`
- `addMember` -> `{ ok: true }`
- `getMembers` -> `[{ nome, telefone }, ...]`
- `addResponse` -> `{ ok: true }`
- `getResponses` -> `[{ nome, nick, quinta, sabado, classe, pet, ressonancia, tempo, telefone, createdAt }, ...]`

## Configurar o Frontend (.env)
Crie `frontend/.env` com:
```
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/SEU_DEPLOYMENT_ID/exec
VITE_ADMIN_PASSWORD=crowscrows
VITE_PUBLIC_URL=https://thecrows.vercel.app
```
- `VITE_APP_SCRIPT_URL`: URL pública do Web App do GAS
- `VITE_ADMIN_PASSWORD`: senha do painel admin
- `VITE_PUBLIC_URL`: domínio público (para link no WhatsApp). Se não definir, usa o `window.location.origin`.

## Rodar localmente
Na raiz:
```
npm install
npm run dev
```
Abra: http://localhost:5173/

## Deploy (Vercel/Netlify)
- Crie um projeto apontando para `frontend/`
- Configure variáveis em ambiente de build:
  - `VITE_APP_SCRIPT_URL`
  - `VITE_ADMIN_PASSWORD`
  - `VITE_PUBLIC_URL`
- Build com `npm run build` (padrão do Vite) e preview com `vite preview`

## Importar membros via CSV
- Exemplo: [members-example.csv](frontend/public/members-example.csv)
- Formato: `nome,telefone`
- No painel admin, use o campo de upload para importar.

## Boas práticas e erros
- O script GAS já cria abas e valida payloads mínimos.
- O frontend trata estados de carregamento e exibe mensagens simples.
- Não use API keys ou service accounts: todo acesso é via Apps Script com permissão do proprietário.

## Estilo e identidade
- Tema escuro, fontes góticas (Cinzel Decorative), cores sangue (blood) e ouro (gold), efeito vidro (glass), animações leves.

## Scripts úteis
- Raiz:
  - `npm run dev` (sobe somente o frontend)
- Frontend:
  - `npm run build` (build de produção)
  - `npm run preview` (preview local do build)
  - `npm run lint` (lint)

## Observações
- Se seu domínio público ainda não estiver ativo (ex.: vercel 404), publique o projeto e atualize `VITE_PUBLIC_URL`.
- Para mudar a planilha alvo, abra o Apps Script a partir da planilha desejada (Arquivo > Automação > Apps Script) e faça o deploy a partir dela; o projeto usa Spreadsheet ativa.
