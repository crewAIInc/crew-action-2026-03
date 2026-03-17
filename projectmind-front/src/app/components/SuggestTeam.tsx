import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { AgentCard } from "./design-system/AgentCard";
import { useIngest, useTeamSuggest, type ApiTeamAgent } from "../hooks/useApi";
import { useCurrentProject } from "../context/CurrentProject";

const AGENT_DISPLAY: Record<string, { name: string; emoji: string; description: string; integrations: string[] }> = {
  orchestrator: { name: "Orquestrador", emoji: "🎯", description: "Coordena todos os agentes e mantém a visão estratégica do projeto", integrations: ["MCP", "Asana", "Slack"] },
  risk_agent: { name: "Riscos & Impedimentos", emoji: "⚠️", description: "Identifica, monitora e prioriza riscos e bloqueios em tempo real", integrations: ["Asana", "Slack"] },
  schedule_agent: { name: "Cronograma & Sprints", emoji: "📅", description: "Gerencia timeline, sprints e marcos do projeto", integrations: ["Asana", "Google Drive"] },
  stakeholder_agent: { name: "Stakeholders", emoji: "👥", description: "Mapeia, engaja e mantém comunicação com stakeholders", integrations: ["Gmail", "Slack"] },
  comms_agent: { name: "Comunicação", emoji: "📣", description: "Gera relatórios, status updates e comunicados automáticos", integrations: ["Slack", "Gmail", "SharePoint"] },
  scope_agent: { name: "Escopo & Requisitos", emoji: "📋", description: "Documenta, valida e acompanha requisitos e escopo", integrations: ["SharePoint", "Google Drive"] },
  budget_agent: { name: "Custos & Orçamento", emoji: "💰", description: "Analisa custos, orçamento, burn rate e alertas de estouro", integrations: [] },
  blocker_agent: { name: "Impedimentos", emoji: "🚧", description: "Identifica impedimentos ativos, dependências e gargalos do time", integrations: ["Asana", "Slack"] },
  kpi_agent: { name: "KPIs & Métricas", emoji: "📊", description: "Extrai e acompanha KPIs de progresso, prazo e qualidade", integrations: [] },
  quality_agent: { name: "Qualidade", emoji: "✅", description: "Critérios de aceite, débito técnico e riscos de qualidade", integrations: [] },
  resource_agent: { name: "Recursos & Capacidade", emoji: "👤", description: "Alocação, capacidade da equipe e sobrecarga", integrations: ["Asana"] },
  change_agent: { name: "Mudança & Impacto", emoji: "🔄", description: "Análise de mudanças e impacto em escopo, prazo e custo", integrations: [] },
  docs_agent: { name: "Documentação & Status", emoji: "📄", description: "Documentação faltante, artefatos e status reports", integrations: ["Google Drive", "SharePoint"] },
};

interface Agent {
  id: string;
  emoji: string;
  name: string;
  description: string;
  integrations: string[];
  active: boolean;
  alwaysActive?: boolean;
  justification?: string;
}

function apiAgentsToDisplay(apiAgents: ApiTeamAgent[]): Agent[] {
  return apiAgents.map((a, i) => {
    const display = AGENT_DISPLAY[a.agent_type] ?? { name: a.agent_type, emoji: "🤖", description: "", integrations: [] };
    return {
      id: String(i + 1),
      emoji: display.emoji,
      name: display.name,
      description: display.description,
      integrations: display.integrations,
      active: a.active,
      alwaysActive: a.agent_type === "orchestrator",
      justification: a.config?.justification,
    };
  });
}

const DEFAULT_AGENTS: Agent[] = Object.entries(AGENT_DISPLAY).map(([agent_type], i) => ({
  id: String(i + 1),
  ...AGENT_DISPLAY[agent_type],
  active: agent_type !== "scope_agent",
  alwaysActive: agent_type === "orchestrator",
}));

export default function SuggestTeam() {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId, projectName, inputType, content } = location.state || {};
  const { setProject } = useCurrentProject();
  const { ingest } = useIngest(projectId ?? null);
  const { suggestTeam } = useTeamSuggest(projectId ?? null);

  const [analyzing, setAnalyzing] = useState(!!(projectId && content));
  const [analysisResult, setAnalysisResult] = useState<{ suggestedByAi: boolean } | null>(null);
  const [agents, setAgents] = useState<Agent[]>(DEFAULT_AGENTS);
  const [suggestError, setSuggestError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!projectId || !content) {
      setAnalyzing(false);
      return;
    }
    (async () => {
      try {
        await ingest(inputType || "transcript", content);
      } catch {
        // ignore
      }
      if (cancelled) return;
      try {
        const res = await suggestTeam(content);
        if (cancelled) return;
        if (res?.agents && res.suggested_by_ai) {
          setAgents(apiAgentsToDisplay(res.agents));
          setAnalysisResult({ suggestedByAi: true });
        } else {
          setAnalysisResult({ suggestedByAi: false });
        }
      } catch (e) {
        if (cancelled) return;
        setSuggestError(e instanceof Error ? e.message : "Erro ao analisar contexto com IA.");
        setAnalysisResult({ suggestedByAi: false });
      } finally {
        if (!cancelled) setAnalyzing(false);
      }
    })();
    return () => { cancelled = true; };
  }, [projectId, content, inputType, ingest, suggestTeam]);

  const toggleAgent = (id: string) => {
    setAgents(agents.map(agent => 
      agent.id === id && !agent.alwaysActive
        ? { ...agent, active: !agent.active }
        : agent
    ));
  };

  const handleActivateTeam = () => {
    if (projectId && projectName) setProject(projectId, projectName);
    const activeAgents = agents.filter(a => a.active);
    navigate("/dashboard", {
      state: {
        projectId: projectId ?? undefined,
        projectName,
        inputType,
        content,
        activeAgents,
        analysisResult,
      },
    });
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-2">
            Analisando contexto...
          </h2>
          <p className="text-gray-600">
            Nossa IA está processando as informações do seu projeto
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Progress Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                  ✓
                </div>
                <span className="text-sm font-medium text-gray-900">Ingerir</span>
              </div>
              <div className="w-16 h-0.5 bg-primary" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-semibold">
                  2
                </div>
                <span className="text-sm font-medium text-gray-900">Montar Time</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-semibold">
                  3
                </div>
                <span className="text-sm text-gray-500">Painel</span>
              </div>
              <div className="w-16 h-0.5 bg-gray-300" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-500 flex items-center justify-center text-sm font-semibold">
                  4
                </div>
                <span className="text-sm text-gray-500">Chat</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Analysis Result Card */}
        {(analysisResult || suggestError) && (
          <Card className={`mb-8 border-2 ${suggestError ? "border-amber-300 bg-amber-50" : "border-accent/20 bg-gradient-to-r from-white to-blue-50"}`}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className={`w-6 h-6 ${suggestError ? "text-amber-600" : "text-[#0EA5E9]"}`} />
                <p className={suggestError ? "text-amber-900 font-medium" : "text-gray-700"}>
                  {suggestError
                    ? suggestError
                    : analysisResult?.suggestedByAi
                      ? "Contexto analisado pelo agente de análise (Orquestrador). Time sugerido com base no conteúdo do projeto."
                      : "Use os agentes abaixo ou ajuste conforme necessário."}
                </p>
              </div>
              {analysisResult?.suggestedByAi && !suggestError && (
                <Badge variant="outline" className="bg-white">
                  Sugestão pela IA
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {/* Team Suggestion Section */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-[#1B3A6B] mb-2">
            Time Sugerido pela IA
          </h2>
          <p className="text-gray-600">
            Baseado na análise, recomendamos os seguintes agentes para o seu projeto
          </p>
        </div>

        {/* Agent Cards Grid — clique no card ou no switch para selecionar/desmarcar */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {agents.map((agent) => (
            <div
              key={agent.id}
              role="button"
              tabIndex={0}
              onClick={() => !agent.alwaysActive && toggleAgent(agent.id)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && !agent.alwaysActive) {
                  e.preventDefault();
                  toggleAgent(agent.id);
                }
              }}
              className={`rounded-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                agent.alwaysActive ? "cursor-default" : "cursor-pointer"
              }`}
            >
              <AgentCard
                emoji={agent.emoji}
                name={agent.name}
                description={agent.description}
                integrations={agent.integrations}
                active={agent.active}
                onToggle={() => toggleAgent(agent.id)}
                disabled={agent.alwaysActive}
                variant="suggested"
              />
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-gray-200 pt-6">
          <Button variant="ghost" size="lg">
            ＋ Adicionar agente da biblioteca
          </Button>
          <Button
            onClick={handleActivateTeam}
            size="lg"
            disabled={!agents.some(a => a.active)}
            className="px-8"
          >
            Ativar time e gerar painel →
          </Button>
        </div>
      </div>
    </div>
  );
}
