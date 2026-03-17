import { useLocation, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { RefreshCw, ArrowRight, CheckSquare, FolderOpen } from "lucide-react";
import { HealthIndicator } from "./design-system/HealthIndicator";
import { RiskBadge } from "./design-system/RiskBadge";
import { StatusDot } from "./design-system/StatusDot";
import { useDashboard, useProjects } from "../hooks/useApi";
import { useCurrentProject } from "../context/CurrentProject";

interface Risk {
  id: string;
  description: string;
  detectedBy: string;
  severity: "critical" | "high" | "medium" | "low";
  status: string;
}

interface Action {
  id: string;
  description: string;
  agent: string;
  completed: boolean;
}

const AGENT_EMOJI: Record<string, string> = {
  orchestrator: "🎯",
  risk_agent: "⚠️",
  scope_agent: "📋",
  schedule_agent: "📅",
  stakeholder_agent: "👥",
  comms_agent: "📣",
  budget_agent: "💰",
  blocker_agent: "🚧",
  kpi_agent: "📊",
  quality_agent: "✅",
  resource_agent: "👤",
  change_agent: "🔄",
  docs_agent: "📄",
};

export default function DashboardMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId: stateProjectId, projectName: stateProjectName, activeAgents = [] } = location.state || {};
  const { projectId: contextProjectId, projectName: contextProjectName, setProject } = useCurrentProject();
  const projectId = stateProjectId ?? contextProjectId ?? null;
  const projectName = stateProjectName ?? contextProjectName ?? "Projeto";
  const { projects, loading: projectsLoading } = useProjects();
  const { snapshot, loading: dashboardLoading, refresh } = useDashboard(projectId);

  const risks: Risk[] =
    snapshot?.risks?.map((r, i) => ({
      id: r.id ?? String(i + 1),
      description: r.description,
      detectedBy: r.agent ? `${AGENT_EMOJI[r.agent] ?? "⚠️"} ${r.agent}` : "⚠️ Riscos",
      severity: (r.severity as Risk["severity"]) ?? "medium",
      status: "Em análise",
    })) ?? [];

  const actions: Action[] =
    snapshot?.actions?.map((a, i) => ({
      id: a.id ?? String(i + 1),
      description: a.description,
      agent: "📋",
      completed: a.status === "done",
    })) ?? [];

  const healthStatus = snapshot?.health ?? "green";
  const criticalCount = risks.filter((r) => r.severity === "critical").length;
  const pendingCount = actions.filter((a) => !a.completed).length;
  const progressPct = typeof snapshot?.timeline === "object" && snapshot?.timeline && "progress" in snapshot.timeline
    ? Number((snapshot.timeline as { progress?: number }).progress) : null;
  const stakeholders = snapshot?.stakeholders ?? [];
  const generatedByAgents = snapshot?.generated_by_agents ?? [];

  const agentStatuses = activeAgents.length > 0
    ? activeAgents.map((a: { name?: string; emoji?: string }) => ({
        emoji: a.emoji ?? "🤖",
        name: a.name ?? "Agente",
        status: "online" as const,
        lastAction: "Ativo",
      }))
    : generatedByAgents.length > 0
      ? generatedByAgents.map((agentType: string) => ({
          emoji: AGENT_EMOJI[agentType] ?? "🤖",
          name: agentType,
          status: "online" as const,
          lastAction: "Participou da última análise",
        }))
      : [
          { emoji: "🎯", name: "Orquestrador", status: "online" as const, lastAction: "Orquestra em background" },
          { emoji: "⚠️", name: "Riscos", status: "online" as const, lastAction: "Agente ativo" },
          { emoji: "📅", name: "Cronograma", status: "online" as const, lastAction: "Agente ativo" },
          { emoji: "👥", name: "Stakeholders", status: "online" as const, lastAction: "Agente ativo" },
          { emoji: "📣", name: "Comunicação", status: "online" as const, lastAction: "Agente ativo" },
        ];

  const handleSelectProject = (id: string, name: string) => {
    setProject(id, name);
    navigate("/dashboard", { state: { projectId: id, projectName: name }, replace: true });
  };

  if (!projectId) {
    return (
      <div className="h-full overflow-auto bg-[#F8FAFC]">
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h1 className="text-2xl font-bold text-[#1B3A6B]">Projetos</h1>
          <p className="text-gray-600">Selecione um projeto para ver o painel ou crie um novo na página inicial.</p>
        </div>
        <div className="max-w-3xl mx-auto p-8">
          {projectsLoading ? (
            <p className="text-gray-500">Carregando projetos...</p>
          ) : projects.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-gray-600 mb-4">Nenhum projeto ainda. Crie um projeto na página inicial (colando transcrição ou e-mail) para começar.</p>
                <Button onClick={() => navigate("/")}>Ir para página inicial</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <Card key={p.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => handleSelectProject(p.id, p.name)}>
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                      <FolderOpen className="h-6 w-6 text-[#2563EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#1B3A6B]">{p.name}</p>
                      <p className="text-sm text-gray-500 truncate">{p.description || p.context_summary || "Sem descrição"}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (dashboardLoading && !snapshot) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Carregando painel...</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      {/* Topbar */}
      <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <nav className="text-sm text-gray-500">
              Projetos / <span className="text-[#1B3A6B] font-medium">{projectName}</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <HealthIndicator status={healthStatus === "green" ? "healthy" : healthStatus === "yellow" ? "warning" : "critical"} />
            <Button variant="outline" size="sm" onClick={() => refresh()} disabled={!projectId}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Atualizar análise
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white text-xs font-semibold">
                PM
              </div>
              <span className="text-sm font-medium text-[#1B3A6B]">Project Manager</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column (70%) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Health Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1B3A6B]">Saúde Geral do Projeto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-6 mb-4">
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-[#1B3A6B]">{progressPct != null ? progressPct : "—"}</span>
                      {progressPct != null && <span className="text-lg text-gray-500">%</span>}
                    </div>
                    <Progress value={progressPct ?? 0} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">Progresso</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-red-600">{criticalCount}</span>
                    </div>
                    <Badge variant="destructive" className="mb-2">Crítico</Badge>
                    <p className="text-sm text-gray-600">Riscos Críticos</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-bold text-yellow-600">{pendingCount}</span>
                    </div>
                    <Badge className="mb-2 bg-yellow-500">Pendente</Badge>
                    <p className="text-sm text-gray-600">Ações Pendentes</p>
                  </div>
                </div>
                {snapshot?.created_at && (
                  <p className="text-xs text-gray-500">
                    Última atualização: {new Date(snapshot.created_at).toLocaleString("pt-BR")}
                    {generatedByAgents.length > 0 && ` · por ${generatedByAgents.length} agente(s)`}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Risks Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1B3A6B]">Riscos Priorizados</CardTitle>
                <Button variant="ghost" size="sm">
                  Ver todos os riscos →
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Risco
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Agente
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Severidade
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {risks.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="py-8 text-center text-sm text-gray-500">
                            Nenhum risco identificado. Execute &quot;Atualizar análise&quot; após ingestão para gerar o painel.
                          </td>
                        </tr>
                      ) : (
                        risks.map((risk) => (
                          <tr key={risk.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-3 px-4 text-sm text-gray-900">{risk.description}</td>
                            <td className="py-3 px-4 text-sm text-gray-700">{risk.detectedBy}</td>
                            <td className="py-3 px-4"><RiskBadge severity={risk.severity} /></td>
                            <td className="py-3 px-4 text-sm text-gray-600">{risk.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Timeline / Snapshot */}
            {snapshot?.timeline && typeof snapshot.timeline === "object" && Object.keys(snapshot.timeline).length > 0 && (
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#1B3A6B]">Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs text-gray-600 overflow-auto max-h-40 bg-gray-50 p-3 rounded">
                    {JSON.stringify(snapshot.timeline, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Column (30%) */}
          <div className="space-y-6">
            {/* Active Agents Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1B3A6B]">Agentes Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentStatuses.map((agent, idx) => (
                    <div key={idx} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                      <StatusDot status={agent.status} className="mt-1.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-base">{agent.emoji}</span>
                          <span className="text-sm font-medium text-[#1B3A6B]">{agent.name}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">
                          {agent.lastAction}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Next Actions Card */}
            <Card className="shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-[#1B3A6B]">Próximas Ações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {actions.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma ação pendente. Execute &quot;Atualizar análise&quot; para gerar o painel.</p>
                  ) : actions.map((action, idx) => (
                    <div key={action.id} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        action.completed ? "bg-primary border-primary" : "border-gray-300"
                      }`}>
                        {action.completed && (
                          <CheckSquare className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          action.completed ? "line-through text-gray-500" : "text-gray-900"
                        }`}>
                          {action.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">{action.agent} {action.agent === "📅" ? "Cronograma" : action.agent === "📋" ? "Escopo" : action.agent === "📣" ? "Comunicação" : "Riscos"}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Exportar para Asana
                </Button>
              </CardContent>
            </Card>

            {/* Stakeholders Card */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#1B3A6B]">Stakeholders</CardTitle>
              </CardHeader>
              <CardContent>
                {stakeholders.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum stakeholder mapeado ainda. Execute uma análise no projeto.</p>
                ) : (
                  <div className="space-y-2">
                    {stakeholders.slice(0, 8).map((s: { name?: string; role?: string }, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-8 h-8 rounded-full bg-[#2563EB]/20 flex items-center justify-center text-[#1B3A6B] font-medium text-xs">
                          {(s.name ?? "?").slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{s.name ?? "—"}</span>
                        {s.role && <span className="text-gray-500">· {s.role}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
