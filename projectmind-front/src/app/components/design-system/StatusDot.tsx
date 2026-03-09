interface StatusDotProps {
  status: "online" | "processing" | "offline";
  className?: string;
}

export function StatusDot({ status, className = "" }: StatusDotProps) {
  const config = {
    online: "bg-green-500",
    processing: "bg-yellow-500 animate-pulse",
    offline: "bg-gray-400",
  };

  return (
    <span className={`inline-block w-2 h-2 rounded-full ${config[status]} ${className}`} />
  );
}
