import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import Onboarding from "./components/Onboarding";
import SuggestTeam from "./components/SuggestTeam";
import DashboardMain from "./components/DashboardMain";
import ChatView from "./components/ChatView";
import AgentsLibrary from "./components/AgentsLibrary";
import Integrations from "./components/Integrations";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Onboarding },
      { path: "suggest-team", Component: SuggestTeam },
      { path: "dashboard", Component: DashboardMain },
      { path: "chat", Component: ChatView },
      { path: "agents", Component: AgentsLibrary },
      { path: "integrations", Component: Integrations },
    ],
  },
]);
