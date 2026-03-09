import { useState, useCallback, useEffect } from "react";
import { api } from "../lib/api";

export interface ApiProject {
  id: string;
  name: string;
  description?: string;
  status: string;
  health: string;
  context_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface ApiDashboardSnapshot {
  health: string;
  risks: Array<{ id?: string; description: string; severity?: string; mitigation?: string; agent?: string }>;
  actions: Array<{ id?: string; description: string; owner?: string; due_date?: string; status?: string }>;
  timeline: Record<string, unknown>;
  stakeholders: Array<{ name: string; role?: string }>;
  next_steps: unknown[];
  generated_by_agents?: string[];
  created_at?: string;
}

export function useProjects() {
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ projects: ApiProject[] }>("/projects");
      setProjects(res.projects ?? []);
    } catch {
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const createProject = useCallback(
    async (name: string, description?: string) => {
      const project = await api.post<ApiProject>("/projects", {
        name,
        objective: name,
        description: description ?? "",
      });
      setProjects((prev) => [project, ...prev]);
      return project;
    },
    []
  );

  return { projects, loading, refetch: fetchProjects, createProject };
}

export function useDashboard(projectId: string | null) {
  const [snapshot, setSnapshot] = useState<ApiDashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(!!projectId);

  const fetchDashboard = useCallback(async () => {
    if (!projectId) {
      setSnapshot(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await api.get<ApiDashboardSnapshot>(`/projects/${projectId}/dashboard`);
      setSnapshot(data);
    } catch {
      setSnapshot(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    await api.post(`/projects/${projectId}/dashboard/refresh`);
    setTimeout(fetchDashboard, 2000);
  }, [projectId, fetchDashboard]);

  return { snapshot, loading, refetch: fetchDashboard, refresh };
}

export function useIngest(projectId: string | null) {
  const ingest = useCallback(
    async (type: "transcript" | "email", content: string) => {
      if (!projectId || !content.trim()) return null;
      const res = await api.post<{ ingestion_id: string; status: string }>(
        `/projects/${projectId}/ingest`,
        { type, content }
      );
      return res;
    },
    [projectId]
  );
  return { ingest };
}

export interface ApiTeamAgent {
  agent_type: string;
  active: boolean;
  config?: { justification?: string };
}

export interface ApiTeamResponse {
  agents: ApiTeamAgent[];
  suggested_by_ai: boolean;
}

export function useTeamSuggest(projectId: string | null) {
  const suggestTeam = useCallback(
    async (context: string): Promise<ApiTeamResponse | null> => {
      if (!projectId || !context.trim()) return null;
      const res = await api.post<ApiTeamResponse>(
        `/projects/${projectId}/team/suggest`,
        { context }
      );
      return res;
    },
    [projectId]
  );
  const getTeam = useCallback(async (): Promise<ApiTeamResponse | null> => {
    if (!projectId) return null;
    try {
      return await api.get<ApiTeamResponse>(`/projects/${projectId}/team`);
    } catch {
      return null;
    }
  }, [projectId]);
  return { suggestTeam, getTeam };
}

export interface ApiCatalogAgent {
  agent_type: string;
  name: string;
  description?: string;
  role?: string;
  domain?: string;
  is_custom?: boolean;
}

export function useAgentsCatalog() {
  const [agents, setAgents] = useState<ApiCatalogAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<{ agents: ApiCatalogAgent[] }>("/agents/catalog");
      setAgents(res.agents ?? []);
    } catch {
      setAgents([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);
  return { agents, loading, refetch: fetchCatalog };
}
