interface MessageBubbleProps {
  type: "user" | "agent";
  sender: string;
  content: string;
  timestamp: string;
  emoji?: string;
  /** Mensagens de erro do sistema (ex.: falha ao enviar) */
  isError?: boolean;
  structuredData?: {
    title?: string;
    items?: string[];
    confidence?: number;
  };
}

export function MessageBubble({
  type,
  sender,
  content,
  timestamp,
  emoji,
  isError,
  structuredData,
}: MessageBubbleProps) {
  if (type === "user") {
    return (
      <div className="flex justify-end gap-3 mb-4">
        <div className="max-w-[70%]">
          <div className="bg-primary text-white rounded-lg px-4 py-3">
            <p className="text-sm leading-relaxed">{content}</p>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">{timestamp}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white flex-shrink-0">
        {emoji || "🤖"}
      </div>
      <div className="flex-1">
        <p className="text-xs text-gray-500 mb-1">{sender}</p>
        {structuredData ? (
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-[85%]">
            {structuredData.title && (
              <h4 className="font-semibold text-[#1B3A6B] mb-2">{structuredData.title}</h4>
            )}
            {structuredData.items && (
              <ul className="space-y-1 mb-3">
                {structuredData.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {structuredData.confidence && (
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                <span>✓</span>
                <span>{structuredData.confidence}% confiança</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className={
              isError
                ? "bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 max-w-[85%]"
                : "bg-white border border-gray-200 rounded-lg px-4 py-3 max-w-[85%]"
            }
          >
            <p className={isError ? "text-sm text-destructive leading-relaxed" : "text-sm text-gray-700 leading-relaxed"}>
              {content}
            </p>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-1">{timestamp}</p>
      </div>
    </div>
  );
}
