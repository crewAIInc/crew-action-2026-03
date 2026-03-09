# Project Management Tool (ProjectMind — Frontend)

Interface para gestão de projetos que se conecta à API **projectmind-api** (CrewAI). Inclui onboarding, sugestão de time com ingestão de conteúdo, dashboard com riscos e ações, chat com agentes e integrações.

Design original: [Figma — Project Management Tool](https://www.figma.com/design/oiXe3q6nvkzvktxEfOC2rC/Project-Management-Tool).

## Stack

- **Runtime:** Node 18+
- **Build:** Vite 6 + React 18
- **UI:** Tailwind CSS 4, Radix UI, Lucide, Motion
- **Backend:** projectmind-api (FastAPI + CrewAI) — opcional

## Instalação

```bash
cd projectmind-front
npm install
```

## Variáveis de ambiente

Copie `.env.example` para `.env` e ajuste se a API rodar em outra URL:

```bash
cp .env.example .env
```

Variável necessária:

| Variável       | Descrição                          | Exemplo              |
|----------------|------------------------------------|----------------------|
| `VITE_API_URL` | URL base da API projectmind-api    | `http://localhost:8000` |

Sem `.env`, o front usa `http://localhost:8000` por padrão.

## Como executar

```bash
npm run dev
```

Abre em http://localhost:5173 (ou a porta que o Vite indicar).

Para usar com o backend:

1. Suba a API na pasta `projectmind-api`: `uvicorn app.main:app --reload --port 8000`
2. No front: **Onboarding** cria o projeto na API → **Sugestão de time** envia o conteúdo (ingest) → **Dashboard** mostra riscos e ações quando há `projectId` → **Chat** conversa com os agentes CrewAI.

Build para produção:

```bash
npm run build
```

## Exemplos de uso

- **Onboarding:** preencha nome e descrição do projeto; ao avançar, o projeto é criado na API (se `VITE_API_URL` estiver configurado).
- **Sugestão de time:** adicione contexto (escopo, prazos, etc.); o conteúdo é enviado como ingestão para o projectmind-api.
- **Dashboard:** exibe último snapshot do projeto (riscos, escopo, cronograma, ações) quando o projeto está vinculado à API.
- **Chat:** envie mensagens para os agentes CrewAI do projeto (orquestrador, risco, escopo, etc.).

## Estrutura resumida

```
src/
├── app/
│   ├── components/     # Onboarding, SuggestTeam, DashboardMain, ChatView, etc.
│   ├── context/        # CurrentProject
│   ├── hooks/          # useApi
│   └── lib/            # api.ts (chamadas à projectmind-api)
├── styles/
└── ...
```

## Licença

MIT.
