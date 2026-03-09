import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { AgentCard } from "./design-system/AgentCard";
import { useAgentsCatalog } from "../hooks/useApi";

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

interface Agent {
  id: string;
  emoji: string;
  name: string;
  description: string;
  integrations: string[];
  active: boolean;
  domain: string;
}

export default function AgentsLibrary() {
  const { agents: catalogAgents, loading } = useAgentsCatalog();
  const [filter, setFilter] = useState("all");

  const agents: Agent[] = catalogAgents.map((a) => ({
    id: a.agent_type,
    emoji: AGENT_EMOJI[a.agent_type] ?? (a.agent_type.startsWith("custom:") ? "🤖" : "🔹"),
    name: a.name,
    description: a.description ?? "",
    integrations: ["MCP", "Asana", "Slack"],
    active: false,
    domain: a.domain ?? "custom",
  }));

  const filteredAgents = agents.filter((agent) => {
    if (filter === "all") return true;
    return agent.domain === filter;
  });

  return (
    <div className="h-full overflow-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2">
            Biblioteca de Agentes
          </h1>
          <p className="text-gray-600">
            Configure e gerencie os agentes de IA disponíveis para seus projetos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {loading ? (
          <p className="text-gray-500">Carregando catálogo de agentes...</p>
        ) : (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#1B3A6B] mb-1">{agents.length}</div>
                <p className="text-sm text-gray-600">Agentes no catálogo</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm mb-8">
          <CardContent className="pt-6">
            <Tabs value={filter} onValueChange={setFilter}>
              <TabsList className="flex flex-wrap gap-2">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="gestao">Gestão</TabsTrigger>
                <TabsTrigger value="comunicacao">Comunicação</TabsTrigger>
                <TabsTrigger value="riscos">Riscos</TabsTrigger>
                <TabsTrigger value="tempo">Tempo</TabsTrigger>
                <TabsTrigger value="escopo">Escopo</TabsTrigger>
                <TabsTrigger value="custom">Custom</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <Card key={agent.id} className="shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <AgentCard
                  emoji={agent.emoji}
                  name={agent.name}
                  description={agent.description}
                  integrations={agent.integrations}
                  active={agent.active}
                  variant="library"
                />
                <p className="text-xs text-gray-500 mt-2">Disponível para uso no time do projeto</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAgents.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              Nenhum agente encontrado com os filtros selecionados
            </p>
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
}
