interface RiskBadgeProps {
  severity: "critical" | "high" | "medium" | "low";
  className?: string;
}

export function RiskBadge({ severity, className = "" }: RiskBadgeProps) {
  const config = {
    critical: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Crítico",
    },
    high: {
      bg: "bg-orange-100",
      text: "text-orange-700",
      label: "Alto",
    },
    medium: {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      label: "Médio",
    },
    low: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Baixo",
    },
  };

  const { bg, text, label } = config[severity];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bg} ${text} ${className}`}>
      {label}
    </span>
  );
}
