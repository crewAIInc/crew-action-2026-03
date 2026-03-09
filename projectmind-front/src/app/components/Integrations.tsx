import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { RefreshCw, ExternalLink, CheckCircle2, XCircle, Network, Settings } from "lucide-react";
import { Integration } from "../types/project";

export default function Integrations() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);

  const toggleIntegration = (id: string) => {
    setIntegrations(
      integrations.map((int) =>
        int.id === id ? { ...int, connected: !int.connected } : int
      )
    );
  };

  const syncIntegration = (id: string) => {
    setSyncing(id);
    setTimeout(() => {
      setIntegrations(
        integrations.map((int) =>
          int.id === id
            ? { ...int, lastSync: new Date().toISOString() }
            : int
        )
      );
      setSyncing(null);
    }, 2000);
  };

  const getIntegrationIcon = (type: string) => {
    const icons: Record<string, string> = {
      "mcp": "🔗",
      "asana": "📋",
      "slack": "💬",
      "sharepoint": "📁",
      "google-drive": "📂",
    };
    return icons[type] || "🔌";
  };

  const formatLastSync = (lastSync?: string) => {
    if (!lastSync) return "Nunca sincronizado";
    const date = new Date(lastSync);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `${diffMins} min atrás`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h atrás`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d atrás`;
  };

  return (
    <div className="h-full overflow-auto bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1B3A6B] mb-2">Integrações</h1>
          <p className="text-gray-600">
            Conecte suas ferramentas de trabalho favoritas
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Integrações</p>
                  <p className="text-4xl font-bold text-[#1B3A6B]">{integrations.length}</p>
                </div>
                <Network className="h-12 w-12 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conectadas</p>
                  <p className="text-4xl font-bold text-green-600">
                    {integrations.filter((i) => i.connected).length}
                  </p>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Disponíveis</p>
                  <p className="text-4xl font-bold text-gray-400">
                    {integrations.filter((i) => !i.connected).length}
                  </p>
                </div>
                <XCircle className="h-12 w-12 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Integrations List */}
        {integrations.length === 0 && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <p className="text-gray-600">Nenhuma integração configurada. Conecte MCP, Asana, Slack e outras ferramentas quando disponíveis.</p>
            </CardContent>
          </Card>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((integration) => (
            <Card key={integration.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{getIntegrationIcon(integration.type)}</div>
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {integration.name}
                        <Badge
                          variant={integration.connected ? "default" : "outline"}
                          className="ml-2"
                        >
                          {integration.connected ? "Conectado" : "Desconectado"}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {integration.connected
                          ? `Último sync: ${formatLastSync(integration.lastSync)}`
                          : "Configure para começar a usar"}
                      </CardDescription>
                    </div>
                  </div>
                  <Switch
                    checked={integration.connected}
                    onCheckedChange={() => toggleIntegration(integration.id)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                    <TabsTrigger value="settings">Configurações</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {integration.type === "mcp" && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Model Context Protocol</p>
                          <p className="text-gray-600">
                            Permite que agentes acessem contexto e recursos externos de forma segura.
                          </p>
                        </div>
                      )}
                      {integration.type === "asana" && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Gerenciamento de Tarefas</p>
                          <p className="text-gray-600">
                            Sincronize tarefas e projetos automaticamente com seu workspace Asana.
                          </p>
                        </div>
                      )}
                      {integration.type === "slack" && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Comunicação em Equipe</p>
                          <p className="text-gray-600">
                            Receba notificações e atualizações diretamente nos seus canais Slack.
                          </p>
                        </div>
                      )}
                      {integration.type === "sharepoint" && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Gestão de Documentos</p>
                          <p className="text-gray-600">
                            Acesse e compartilhe documentos armazenados no SharePoint.
                          </p>
                        </div>
                      )}
                      {integration.type === "google-drive" && (
                        <div className="text-sm text-gray-700">
                          <p className="font-medium mb-1">Armazenamento em Nuvem</p>
                          <p className="text-gray-600">
                            Integre seus arquivos do Google Drive diretamente nos projetos.
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      {integration.connected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => syncIntegration(integration.id)}
                          disabled={syncing === integration.id}
                        >
                          <RefreshCw
                            className={`mr-2 h-4 w-4 ${
                              syncing === integration.id ? "animate-spin" : ""
                            }`}
                          />
                          {syncing === integration.id ? "Sincronizando..." : "Sincronizar"}
                        </Button>
                      )}
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Documentação
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`api-key-${integration.id}`}>API Key</Label>
                        <Input
                          id={`api-key-${integration.id}`}
                          type="password"
                          placeholder={
                            integration.connected
                              ? "••••••••••••••••"
                              : "Cole sua API key aqui"
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor={`webhook-${integration.id}`}>Webhook URL</Label>
                        <Input
                          id={`webhook-${integration.id}`}
                          placeholder="https://..."
                        />
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="mr-2 h-4 w-4" />
                        Configurações Avançadas
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add More Integrations */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Precisa de mais integrações?</CardTitle>
            <CardDescription>
              Estamos sempre adicionando novas integrações baseadas no feedback dos usuários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              Solicitar Nova Integração
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}