export interface Agent {
  id: string;
  name: string;
  role: string;
  expertise: string[];
  avatar: string;
  available: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: "planning" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  deadline?: string;
  team: Agent[];
  progress: number;
  sourceType?: "email" | "transcript" | "manual";
  messages?: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderType: "user" | "agent";
  content: string;
  timestamp: string;
  agentId?: string;
}

export interface Integration {
  id: string;
  name: string;
  type: "mcp" | "asana" | "slack" | "sharepoint" | "google-drive";
  connected: boolean;
  lastSync?: string;
}
