import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "./ui/dropdown-menu";
import { ChevronDown, Send, Paperclip, Download, ArrowRight, Loader2, MessageCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { MessageBubble } from "./design-system/MessageBubble";
import { HealthIndicator } from "./design-system/HealthIndicator";
import { RiskBadge } from "./design-system/RiskBadge";
import { Progress } from "./ui/progress";
import { useCurrentProject } from "../context/CurrentProject";
import { api } from "../lib/api";
import { useDashboard } from "../hooks/useApi";

interface Message {
  id: string;
  type: "user" | "agent";
  sender: string;
  content: string;
  timestamp: string;
  emoji?: string;
  structuredData?: {
    title?: string;
    items?: string[];
    confidence?: number;
  };
}

const AGENT_DISPLAY: Record<string, string> = {
  orchestrator: "🎯 Orquestrador",
  risk_agent: "⚠️ Riscos",
  scope_agent: "📋 Escopo",
  schedule_agent: "📅 Cronograma",
  stakeholder_agent: "👥 Stakeholders",
  comms_agent: "📣 Comunicação",
  budget_agent: "💰 Custos",
  blocker_agent: "🚧 Impedimentos",
  kpi_agent: "📊 KPIs",
  quality_agent: "✅ Qualidade",
  resource_agent: "👤 Recursos",
  change_agent: "🔄 Mudança",
  docs_agent: "📄 Documentação",
};

function mapApiMessageToMessage(m: Record<string, unknown>): Message {
  const senderType = (m.sender_type as string) || "agent";
  const isUser = senderType === "user";
  const agentType = (m.agent_type as string) || (m.sender_id as string) || "";
  const senderName = isUser ? "Você" : (AGENT_DISPLAY[agentType] || agentType || "Agente");
  const content = (m.content as string) || "";
  const created = (m.created_at as string) || "";
  const time = created ? new Date(created).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
  return {
    id: (m.id as string) || String(Math.random()),
    type: isUser ? "user" : "agent",
    sender: senderName,
    content,
    timestamp: time,
    emoji: isUser ? undefined : (AGENT_DISPLAY[agentType]?.slice(0, 2) || "🤖"),
    structuredData: (m.structured_content as Message["structuredData"]) ?? undefined,
  };
}

export default function ChatView() {
  const { projectId, projectName } = useCurrentProject();
  const navigate = useNavigate();
  const { snapshot } = useDashboard(projectId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(!!projectId);
  const [sending, setSending] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  // Orquestrador fica oculto na UI; ele orquestra em background. Seleção múltipla de agentes visíveis.
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(["all"]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const allAgentsOption = { id: "all", name: "Todos os Agentes", emoji: "👥" };
  const selectableAgents = [
    allAgentsOption,
    { id: "risk_agent", name: "Riscos & Impedimentos", emoji: "⚠️" },
    { id: "schedule_agent", name: "Cronograma & Sprints", emoji: "📅" },
    { id: "stakeholder_agent", name: "Stakeholders", emoji: "👥" },
    { id: "comms_agent", name: "Comunicação", emoji: "📣" },
    { id: "budget_agent", name: "Custos & Orçamento", emoji: "💰" },
    { id: "blocker_agent", name: "Impedimentos", emoji: "🚧" },
    { id: "kpi_agent", name: "KPIs & Métricas", emoji: "📊" },
    { id: "quality_agent", name: "Qualidade", emoji: "✅" },
    { id: "resource_agent", name: "Recursos & Capacidade", emoji: "👤" },
    { id: "change_agent", name: "Mudança & Impacto", emoji: "🔄" },
    { id: "docs_agent", name: "Documentação & Status", emoji: "📄" },
  ];

  const isAllSelected = selectedAgentIds.includes("all");
  const toggleAgent = (id: string) => {
    if (id === "all") {
      setSelectedAgentIds(["all"]);
      return;
    }
    setSelectedAgentIds((prev) => {
      const withoutAll = prev.filter((x) => x !== "all");
      const has = withoutAll.includes(id);
      if (has) {
        const next = withoutAll.filter((x) => x !== id);
        return next.length ? next : ["all"];
      }
      return [...withoutAll, id];
    });
  };
  const label =
    selectedAgentIds.length === 0 || isAllSelected
      ? "Todos os Agentes"
      : selectedAgentIds.length === 1
        ? selectableAgents.find((a) => a.id === selectedAgentIds[0])?.name ?? "Agentes"
        : `${selectedAgentIds.length} agentes`;

  const loadHistory = useCallback(async () => {
    if (!projectId) return;
    setLoadingHistory(true);
    try {
      const res = await api.getChatHistory(projectId);
      const list = (res.messages || []).map(mapApiMessageToMessage);
      setMessages(list);
    } catch {
      setMessages([]);
    } finally {
      setLoadingHistory(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickSuggestions = [
    "Quais são os maiores riscos?",
    "Gere status report",
    "O que está atrasado?",
  ];

  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text || !projectId || sending) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      type: "user",
      sender: "Você",
      content: text,
      timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setSending(true);
    try {
      const targetAgent = selectedAgentIds.includes("all") || selectedAgentIds.length === 0
        ? undefined
        : selectedAgentIds[0] === "all"
          ? undefined
          : selectedAgentIds[0];
      const res = await api.sendChatMessage(projectId, text, targetAgent);
      const agentMessage: Message = {
        id: `a-${Date.now()}`,
        type: "agent",
        sender: AGENT_DISPLAY[res.message.agent_type as string] || (res.message.agent_type as string) || "Agente",
        content: res.reply,
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
        emoji: AGENT_DISPLAY[res.message.agent_type as string]?.slice(0, 2) || "🤖",
      };
      setMessages((prev) => [...prev, agentMessage]);
    } catch (e) {
      const errMsg: Message = {
        id: `e-${Date.now()}`,
        type: "agent",
        sender: "Sistema",
        content: e instanceof Error ? e.message : "Erro ao enviar mensagem.",
        timestamp: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  if (!projectId) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F8FAFC]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-4">Selecione um projeto no painel para usar o chat com os agentes.</p>
            <Button onClick={() => navigate("/dashboard")}>
              <ArrowRight className="mr-2 h-4 w-4" />
              Ir para painel
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const riskCount = snapshot?.risks?.length ?? 0;
  const actionCount = snapshot?.actions?.length ?? 0;
  const health = snapshot?.health === "green" ? "healthy" : snapshot?.health === "yellow" ? "warning" : "critical";
  const progressPct =
    typeof snapshot?.timeline === "object" && snapshot?.timeline && "progress" in snapshot.timeline
      ? Number((snapshot.timeline as { progress?: number }).progress)
      : null;

  const handleExportChat = () => {
    const lines = messages.map(
      (m) => `[${m.timestamp}] ${m.sender}: ${m.content}`
    );
    const blob = new Blob([lines.join("\n\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chat-${projectName ?? "projeto"}-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-full overflow-hidden flex">
      {/* Left Panel - Resumo do projeto (50%) */}
      <div className="w-1/2 min-w-0 border-r border-gray-200 overflow-auto bg-[#F8FAFC]">
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                Projetos / <span className="text-[#1B3A6B] font-medium">{projectName ?? "Projeto"}</span>
              </nav>
            </div>
            <HealthIndicator status={health} />
          </div>
        </div>
        <div className="p-6 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-[#1B3A6B]">Visão Geral</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-2xl font-bold text-[#1B3A6B] mb-1">
                    {progressPct != null ? `${Math.round(progressPct)}%` : "—"}
                  </div>
                  <Progress value={progressPct ?? 0} className="h-1.5 mb-2" />
                  <p className="text-xs text-gray-600">Progresso</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600 mb-1">{riskCount}</div>
                  <Badge variant="destructive" className="text-xs mb-2">Riscos</Badge>
                  <p className="text-xs text-gray-600">Identificados</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600 mb-1">{actionCount}</div>
                  <Badge className="bg-yellow-500 text-xs mb-2">Ações</Badge>
                  <p className="text-xs text-gray-600">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard")}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Ver painel completo
          </Button>
        </div>
      </div>

      {/* Right Panel - Chat (50%) */}
      <div className="w-1/2 min-w-0 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#1B3A6B]">Chat com o Time</h2>
            <Button variant="ghost" size="sm" onClick={handleExportChat} disabled={messages.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between font-normal" type="button">
                <span>{label}</span>
                <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="min-w-[16rem] max-h-[min(20rem,70vh)] overflow-y-auto"
              sideOffset={6}
            >
              {selectableAgents.map((agent) => (
                <DropdownMenuCheckboxItem
                  key={agent.id}
                  checked={agent.id === "all" ? isAllSelected : selectedAgentIds.includes(agent.id)}
                  onCheckedChange={() => toggleAgent(agent.id)}
                  onSelect={(e) => e.preventDefault()}
                >
                  <span className="mr-2">{agent.emoji}</span>
                  {agent.name}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-6">
          {loadingHistory ? (
            <p className="text-sm text-gray-500">Carregando histórico...</p>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MessageCircle className="h-12 w-12 text-gray-300 mb-4" />
              <p className="text-sm font-medium text-gray-600">Nenhuma mensagem ainda</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[260px]">
                Envie uma mensagem ou use uma sugestão abaixo para começar a conversar com os agentes.
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  type={message.type}
                  sender={message.sender}
                  content={message.content}
                  timestamp={message.timestamp}
                  emoji={message.emoji}
                  isError={message.sender === "Sistema"}
                  structuredData={message.structuredData}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-6">
          {/* Quick Suggestions */}
          <div className="flex flex-wrap gap-2 mb-4">
            {quickSuggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleQuickSuggestion(suggestion)}
              >
                {suggestion}
              </Button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Pergunte ao seu time de agentes..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              rows={2}
              className="resize-none"
              disabled={sending}
            />
            <div className="flex flex-col gap-2">
              <Button variant="outline" size="icon" disabled title="Anexos em breve">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={handleSendMessage} disabled={sending} title={sending ? "Enviando..." : "Enviar"}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
