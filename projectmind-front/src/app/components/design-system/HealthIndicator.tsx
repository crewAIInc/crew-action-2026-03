interface HealthIndicatorProps {
  status: "healthy" | "warning" | "critical";
  label?: string;
  className?: string;
}

export function HealthIndicator({ status, label, className = "" }: HealthIndicatorProps) {
  const config = {
    healthy: {
      bg: "bg-green-500",
      text: "text-green-700",
      label: label || "Saudável",
    },
    warning: {
      bg: "bg-yellow-500",
      text: "text-yellow-700",
      label: label || "Atenção",
    },
    critical: {
      bg: "bg-red-500",
      text: "text-red-700",
      label: label || "Crítico",
    },
  };

  const { bg, text, label: statusLabel } = config[status];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-200 ${className}`}>
      <span className={`w-2.5 h-2.5 rounded-full ${bg}`} />
      <span className={`text-sm font-medium ${text}`}>{statusLabel}</span>
    </div>
  );
}
