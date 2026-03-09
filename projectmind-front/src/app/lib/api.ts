/**
 * Cliente da API ProjectMind (projectmind-api).
 * Sem login: o backend usa usuário dev quando não há token.
 */
const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

function getToken(): string | null {
  return localStorage.getItem("pm_token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    localStorage.removeItem("pm_token");
    localStorage.removeItem("pm_user");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const msg = err.detail == null
      ? "Erro inesperado"
      : Array.isArray(err.detail)
        ? err.detail.map((d: { msg?: string }) => d?.msg ?? String(d)).join(". ")
        : String(err.detail);
    throw new Error(msg || `Erro ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),

  getChatHistory(projectId: string): Promise<{ messages: Array<Record<string, unknown>> }> {
    return request<{ messages: Array<Record<string, unknown>> }>(`/projects/${projectId}/chat`);
  },
  sendChatMessage(projectId: string, content: string, targetAgent?: string): Promise<{ message: Record<string, unknown>; reply: string }> {
    return request<{ message: Record<string, unknown>; reply: string }>(
      `/projects/${projectId}/chat`,
      { method: "POST", body: JSON.stringify({ content, target_agent: targetAgent ?? undefined }) }
    );
  },
  streamChat(projectId: string, q: string, targetAgent?: string): EventSource {
    const token = getToken();
    const params = new URLSearchParams({ q });
    if (targetAgent) params.set("target_agent", targetAgent);
    if (token) params.set("token", token);
    return new EventSource(`${API_URL}/projects/${projectId}/chat/stream?${params}`);
  },
};
