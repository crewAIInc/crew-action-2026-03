Crie o design completo do MVP de uma plataforma chamada ProjectMind AI —
uma ferramenta de gestão estratégica de projetos com multi-agentes de IA
para Project Managers e PMOs.

## IDENTIDADE VISUAL
- Nome: ProjectMind AI
- Estilo: SaaS B2B moderno, clean, profissional e confiável
- Paleta principal: Azul escuro (#1B3A6B), Azul médio (#2563EB), Azul claro (#DBEAFE), Fundo (#F8FAFC), Branco (#FFFFFF)
- Acento: Ciano (#0EA5E9) para highlights de IA e agentes ativos
- Estados de saúde (RAG): Verde (#10B981), Amarelo (#F59E0B), Vermelho (#EF4444)
- Tipografia: Inter (títulos bold, corpo regular)
- Bordas: arredondadas 8–12px, sombras suaves (shadow-sm)
- Ícones: Lucide Icons ou similar (stroke, não filled)

## TELAS DO MVP — Fluxo Principal

### TELA 1 — Onboarding / Ingestão de Contexto
Layout em duas colunas:
- Coluna esquerda (40%): hero com nome do produto, tagline "De transcrição a estratégia em minutos", ilustração abstrata de rede de agentes conectados (nós circulares azuis com linhas)
- Coluna direita (60%): formulário de ingestão com:
  - Campo "Nome do Projeto" (input text)
  - Selector de tipo de entrada com dois tabs: "📋 Transcrição de Reunião" | "📧 Thread de E-mail"
  - Textarea grande (min 200px) com placeholder: "Cole aqui a transcrição ou thread de e-mail do projeto..."
  - Upload de arquivo (.txt .docx .pdf) com área drag-and-drop pontilhada
  - Botão primário grande "Analisar com IA →" em azul (#2563EB)
  - Badge de segurança embaixo: "🔒 Seus dados são processados sem retenção"

### TELA 2 — Sugestão do Time de Agentes
Header com progresso: Ingerir → Montar Time → Painel → Chat (step 2 ativo)

Seção superior: card de resumo do que foi detectado pela IA
- Ícone de faísca azul
- "Contexto analisado: Projeto de lançamento de produto · 3 riscos identificados · 8 ações detectadas"
- Chip: "Modelo: claude-sonnet-4"

Seção principal — "Time Sugerido pela IA" (grid 3 colunas):
Cada card de agente deve ter:
- Ícone emoji + nome do agente em negrito
- Descrição curta da função (1 linha)
- Chips das integrações que ele usa (ex: "Asana" "Slack")
- Toggle switch azul "Ativo" no canto superior direito
- Borda azul suave quando ativo, borda cinza quando inativo

Agentes sugeridos nos cards:
1. 🎯 Orquestrador (sempre ativo, toggle desabilitado)
2. ⚠️ Riscos & Impedimentos (ativo)
3. 📅 Cronograma & Sprints (ativo)
4. 👥 Stakeholders (ativo)
5. 📣 Comunicação (ativo)
6. 📋 Escopo & Requisitos (inativo — toggle off)

Seção inferior:
- Botão ghost "＋ Adicionar agente da biblioteca" (abre modal)
- Botão primário "Ativar time e gerar painel →"

### TELA 3 — Dashboard / Painel de Gestão
Layout: Sidebar esquerda fixa (64px) + Área principal

SIDEBAR (64px, fundo #1B3A6B):
- Logo "PM" em branco
- Ícones: 🏠 Home, 📊 Painel, 💬 Chat, 🤖 Agentes, ⚙️ Settings
- Avatar do usuário no rodapé

TOPBAR:
- Breadcrumb: "Projetos / Lançamento App Mobile"
- Badge de saúde RAG: círculo verde + "Saudável"
- Botão "Atualizar análise" com ícone de refresh
- Avatar + nome do PM

ÁREA PRINCIPAL — Grid de cards (2 colunas + 1 coluna lateral):

**Coluna principal (70%):**

Card 1 — Saúde Geral do Projeto
- Três métricas grandes lado a lado: Progresso (68%, barra azul), Riscos Críticos (2, badge vermelho), Ações Pendentes (7, badge amarelo)
- Última atualização: "há 3 minutos · por Agente Orquestrador"

Card 2 — Riscos Priorizados (tabela compacta)
- Colunas: Risco | Agente que detectou | Severidade | Status
- 4 linhas de risco com badges de severidade coloridos
- Botão "Ver todos os riscos →"

Card 3 — Timeline / Sprints (visual horizontal)
- Barra de gantt simplificada mostrando 3 sprints
- Sprint atual destacado em azul
- Marcador "hoje" com linha vertical tracejada

**Coluna lateral (30%):**

Card — Agentes Ativos
- Lista compacta de cada agente com dot verde (online) ou cinza
- Última ação de cada agente em texto pequeno cinza
- Ex: "⚠️ Riscos · Detectou novo bloqueio há 5min"

Card — Próximas Ações
- Lista numerada de 5 ações com checkboxes
- Tag do agente que gerou cada ação
- Botão "Exportar para Asana"

Card — Stakeholders
- Avatars circulares empilhados dos 4 principais stakeholders
- Indicador de "quem precisa de update"

### TELA 4 — Chat com Time de Agentes
Layout: Painel de gestão reduzido (50% esquerda) + Chat (50% direita)

PAINEL CHAT (direita):
Header do chat:
- "Chat com o Time" em negrito
- Dropdown seletor de agente: "Todos os Agentes" ou individual (com ícone e cor por agente)
- Ícone de exportar

Área de mensagens (scrollável):
- Mensagem do usuário: balão alinhado à direita, fundo azul (#2563EB), texto branco
- Mensagem de agente: balão alinhado à esquerda, fundo branco com borda, com avatar do agente (ícone emoji + nome em cinza acima)
- Exemplo de mensagem de agente "⚠️ Riscos": card estruturado com título "Análise de Risco Detectado", lista de bullets, chip de confiança "92% confiança"
- Separador de data entre mensagens

Sugestões rápidas (chips clicáveis acima do input):
"Quais são os maiores riscos?" · "Gere status report" · "O que está atrasado?"

Input:
- Textarea com placeholder "Pergunte ao seu time de agentes..."
- Ícone de clipe (anexar) + botão enviar azul

### TELA 5 — Biblioteca de Agentes (Modal ou página)
Grid 3 colunas de cards de todos os 9 agentes disponíveis:
- Card maior que os da tela 2
- Nome + ícone + descrição completa (2 linhas)
- Chips de integrações com ícone da ferramenta (Asana, Slack, Google Drive, etc.)
- Status: "Ativo no projeto" (badge verde) ou "Disponível" (badge cinza)
- Botão: "Configurar" ou "Adicionar ao time"

Filtros no topo: Todos | Ativo | Disponível | [por domínio]

## COMPONENTES REUTILIZÁVEIS (criar em Design System)
- AgentCard (ativo / inativo / sugerido)
- RiskBadge (crítico / alto / médio / baixo)
- StatusDot (online / processando / offline)
- IntegrationChip (Asana / Slack / Drive / SharePoint / Gmail)
- HealthIndicator RAG (verde / amarelo / vermelho)
- MessageBubble (user / agent com variante de card estruturado)
- SectionCard (container padrão de cards do dashboard)
- ProgressBar (com percentual e label)

## FLUXO DE INTERAÇÃO (prototype)
Conectar as telas na ordem:
Tela 1 (botão "Analisar") → Tela 2 (loading 2s → aparece sugestão de time)
Tela 2 (botão "Ativar time") → Tela 3 (painel carregando cards progressivamente)
Tela 3 (ícone de chat na sidebar) → Tela 4 (chat abre à direita)
Tela 3 (card Agentes → "＋ Adicionar") → Tela 5 (modal)

## ESPECIFICAÇÕES TÉCNICAS
- Frame size: 1440x900 (desktop web)
- Grid: 12 colunas, gutter 24px, margin 48px
- Spacing system: 4px base (4, 8, 12, 16, 24, 32, 48, 64)
- Componentes em Auto Layout para responsividade
- Criar variantes de estado: default, hover, active, disabled, loading
- Dark mode: opcional (fundo #0F172A, cards #1E293B)