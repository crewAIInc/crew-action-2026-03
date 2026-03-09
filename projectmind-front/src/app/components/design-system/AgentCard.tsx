import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";

interface AgentCardProps {
  emoji: string;
  name: string;
  description: string;
  integrations?: string[];
  active: boolean;
  onToggle?: (active: boolean) => void;
  disabled?: boolean;
  variant?: "suggested" | "library" | "active";
}

export function AgentCard({
  emoji,
  name,
  description,
  integrations = [],
  active,
  onToggle,
  disabled = false,
  variant = "suggested"
}: AgentCardProps) {
  return (
    <div className={`relative p-4 rounded-lg border-2 transition-all ${
      active 
        ? "border-primary bg-blue-50/50" 
        : "border-gray-200 bg-white hover:border-gray-300"
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <h3 className="font-semibold text-[#1B3A6B]">{name}</h3>
        </div>
        {!disabled && onToggle && variant !== "library" && (
          <span onClick={(e) => e.stopPropagation()}>
            <Switch
              checked={active}
              onCheckedChange={onToggle}
              className="data-[state=checked]:bg-primary"
            />
          </span>
        )}
        {variant === "library" && (
          <Badge
            className={`text-xs ${active ? "bg-[#10B981] text-white hover:bg-[#0d9668]" : "bg-gray-200 text-gray-700"}`}
          >
            {active ? "Ativo no projeto" : "Disponível"}
          </Badge>
        )}
      </div>
      
      <p className="text-sm text-gray-600 mb-3 leading-relaxed">{description}</p>
      
      {integrations.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {integrations.map((integration) => (
            <IntegrationChip key={integration} name={integration} />
          ))}
        </div>
      )}
    </div>
  );
}

export function IntegrationChip({ name }: { name: string }) {
  const icons: Record<string, string> = {
    "Asana": "📋",
    "Slack": "💬",
    "Google Drive": "📂",
    "SharePoint": "📁",
    "Gmail": "📧",
    "MCP": "🔗",
  };

  return (
    <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white">
      <span className="mr-1">{icons[name] || "🔌"}</span>
      {name}
    </Badge>
  );
}
