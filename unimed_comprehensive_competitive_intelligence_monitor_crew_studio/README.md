
# Unimed Comprehensive Competitive Intelligence Monitor

## Projeto desenvolvido no CREW Action São Paulo

### Equipe
- alexandre.montoia@totvs.com.br
- gcbs109@gmail.com
- giovannafantacini@gmail.com
- mauro.mantovano@visavia.com.br
- pamela.bsouza@totvs.com.br
- victorarruda_santos@hotmail.com


## Desenvolvido com Crew Studio

Esta implementação foi desenvolvida principalmente usando o Crew Studio e aperfeiçoada iterativamente com o assistente CrewAI. Integrações manuais realizadas durante o desenvolvimento incluem a configuração da conexão Gmail para envio automático de e-mails e a configuração do Google Calendar para acionar a execução diária.

### Visão geral do projeto
Este projeto é um sistema multiagente criado para entregar, diariamente, um relatório executivo ao gestor de portfólio da Unimed Seguros que resume eventos e tendências do dia anterior relacionados aos principais concorrentes (Bradesco Saúde, SulAmérica, Amil, Hapvida). O objetivo é apoiar decisões estratégicas com insights acionáveis sobre promoções concorrentes, sentimento dos clientes e sinais regulatórios.

Entregáveis principais:

- Coleta automatizada de dados públicos (Google Reviews, redes sociais, sites de reclamação e portais oficiais) priorizando comentários nas últimas 24–72 horas quando disponíveis.
- Detecção e sumário de promoções e campanhas dos concorrentes (janela móvel de 30 dias), com detalhes sobre descontos, benefícios e validade.
- Análise de sentimento em português por operadora, com classificação (positivo/neutro/negativo), identificação de temas recorrentes (atendimento, reembolso, rede credenciada, sinistros, preços) e escore de intensidade emocional.
- Consolidação de indicadores regulatórios da ANS (IDSS, índices de reclamação, multas e resoluções) para comparação competitiva.
- Geração de um relatório executivo pronto para apresentação (bullet points, recomendações estratégicas e seções separadas para promoções e indicadores ANS) entregue por e-mail/HTML/PDF ao gestor.

Os relatórios são enviados automaticamente todos os dias às 09:00 para o e-mail do gestor do portfólio.

Benefícios para o gestor:

- Visibilidade diária e acionável sobre o posicionamento competitivo em relação a promoções e percepção dos clientes.
- Identificação rápida de riscos regulatórios e de mercado que podem exigir resposta imediata.
- Mapas de oportunidades destacando áreas onde a Unimed pode explorar fraquezas dos concorrentes.

Arquitetura de alto nível (fluxo): Scheduler → Review Collector → Promotions & ANS Research → Parser/Extractor → Sentiment Analysis → Competitive Intelligence → Report Generation & Delivery.

### Estrutura do projeto
- **knowledge/**: Contém informações do usuário e preferências para personalização do sistema.
- **src/**: Código-fonte principal do sistema, incluindo agentes e ferramentas customizadas.

### Agentes
Resumo conciso dos agentes centrais e suas responsabilidades:

- **Coletor de Reviews (Brazilian Health Insurance Review Data Collector)** — Coleta avaliações e dados públicos de fontes web (sites, fóruns, redes sociais) para posterior processamento.
- **Especialista em Análise de Sentimento** — Analisa feedbacks em português para Unimed e concorrentes, classifica sentimentos e extrai temas-chaves.
- **Analista de Inteligência Competitiva** — Compara tendências entre operadoras, identifica forças, fraquezas, ameaças e oportunidades.
- **Gerador de Relatório Executivo** — Produz relatórios executivos diários (bullet points, recomendações) formatados para envio por e-mail/PDF/HTML.
- **Especialista em Inteligência de Mercado & Regulatório (ANS)** — Monitora promoções concorrentes e dados oficiais da ANS (atualizações regulatórias, multas, reclamações).

Definições completas e detalhadas dos agentes (papel/objetivo/backstory) estão nos arquivos de configuração do projeto (veja `src/.../config/agents.yaml`). Use esses arquivos para prompts e inicialização dos agentes.

### Tarefas automáticas
Resumos das tarefas automatizadas (o que fazem e o resultado esperado):

- **collect_brazilian_health_insurance_reviews** — Pesquisa e coleta avaliações recentes (últimas 24–72 horas quando disponível) para Unimed, Bradesco Saúde, SulAmérica, Amil e Hapvida de Google Reviews, redes sociais e plataformas públicas. Palavras-chave em português são priorizadas (por exemplo: "reembolso", "rede credenciada", "sinistros", "preços"). Saída: dataset estruturado de avaliações agrupadas por operadora com texto, fonte, data (se disponível) e temas principais.

- **research_competitor_promotions_and_ans_data** — Reúne promoções/campanhas dos concorrentes dos últimos 30 dias e dados oficiais da ANS (IDSS, reclamações, multas, resoluções). Saída: seções do relatório organizadas por operadora contendo "Promoções dos Concorrentes", "Dados Regulatórios (ANS)" e "Mudanças Regulatórias Recentes".

- **analyze_customer_sentiment_patterns** — Realiza análise de sentimento sobre as avaliações coletadas, classifica cada item (positivo/neutro/negativo), extrai temas principais e os top 5 pontos de reclamação e elogio por operadora. Saída: percentuais de sentimento, principais questões e pontos positivos, distribuição por tema e escores de intensidade emocional.

- **generate_unimed_competitive_intelligence_insights** — Compara Unimed versus concorrentes usando os dados de sentimento e regulatórios para identificar forças, fraquezas, ameaças e oportunidades. Saída: relatório de inteligência estratégica com comparações e recomendações de ação.

- **create_and_send_daily_executive_report** — Compila os insights em um relatório executivo diário e envia automaticamente por e-mail para giovannafantacini@gmail.com com o assunto "Daily Market Sentiment Report – Unimed vs Competitors". Saída: e-mail formatado (bullet points, recomendações, seções) e confirmação de entrega.

### Configuração de ambiente

Antes de executar, crie um arquivo `.env` na raiz do projeto com as seguintes chaves:

- OPENAI_API_KEY=
- SERPER_API_KEY=
- CREWAI_PLATFORM_INTEGRATION_TOKEN=

### Instalação

1. Crie e ative um ambiente virtual:

   python -m venv .venv
   source .venv/bin/activate

2. Instale o pacote em modo editável (usa o `pyproject.toml`):

   pip install -e .

(Alternativa com `hatch`: instale `hatch` e use `hatch run pip install -e .`)

### Como executar

Use o comando padrão do Crew para executar o projeto:

crew run

### Exemplos de uso

- Rodar a execução completa (gera e envia o relatório):

  crew run

### Dependências

As dependências estão definidas em `pyproject.toml`. Instale com `pip install -e .` como mostrado acima.

Consulte a seção `[project.scripts]` em `pyproject.toml` para ver os scripts disponíveis.



