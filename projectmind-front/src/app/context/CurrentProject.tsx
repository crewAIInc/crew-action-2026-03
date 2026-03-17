import { createContext, useContext, useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "pm_current_project";

interface CurrentProject {
  projectId: string | null;
  projectName: string | null;
}

const defaultState: CurrentProject = { projectId: null, projectName: null };

function loadStored(): CurrentProject {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as { projectId?: string; projectName?: string };
    if (parsed.projectId && parsed.projectName) {
      return { projectId: parsed.projectId, projectName: parsed.projectName };
    }
  } catch {
    // ignore
  }
  return defaultState;
}

function save(projectId: string | null, projectName: string | null) {
  if (projectId && projectName) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ projectId, projectName }));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

const CurrentProjectContext = createContext<{
  projectId: string | null;
  projectName: string | null;
  setProject: (projectId: string | null, projectName: string | null) => void;
}>({ ...defaultState, setProject: () => {} });

export function CurrentProjectProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CurrentProject>(loadStored);

  const setProject = useCallback((projectId: string | null, projectName: string | null) => {
    setState({ projectId, projectName });
    save(projectId, projectName);
  }, []);

  // Sync from storage (e.g. another tab)
  useEffect(() => {
    const stored = loadStored();
    if (stored.projectId !== state.projectId || stored.projectName !== state.projectName) {
      setState(stored);
    }
  }, []);

  return (
    <CurrentProjectContext.Provider
      value={{
        projectId: state.projectId,
        projectName: state.projectName,
        setProject,
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
}

export function useCurrentProject() {
  return useContext(CurrentProjectContext);
}
