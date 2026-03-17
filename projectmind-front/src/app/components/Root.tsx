import { Outlet, Link, useLocation } from "react-router";
import { Home, BarChart3, MessageSquare, Bot, Settings } from "lucide-react";
import { Button } from "./ui/button";

export default function Root() {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    if (path !== "/dashboard" && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Hide sidebar for onboarding and suggest-team pages
  const hideSidebar = location.pathname === "/" || location.pathname === "/suggest-team";

  if (hideSidebar) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar - 64px width */}
      <aside className="w-16 bg-[#1B3A6B] flex flex-col items-center py-6">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-[#1B3A6B]">PM</span>
          </div>
        </div>

        {/* Navigation Icons */}
        <nav className="flex-1 flex flex-col items-center gap-4">
          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                isActive("/dashboard")
                  ? "bg-[#2563EB] text-white hover:bg-[#2563EB]/90 hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Home className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/dashboard">
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 text-white/70 hover:text-white hover:bg-white/10"
            >
              <BarChart3 className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/chat">
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                isActive("/chat")
                  ? "bg-[#2563EB] text-white hover:bg-[#2563EB]/90 hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <MessageSquare className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/agents">
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                isActive("/agents")
                  ? "bg-[#2563EB] text-white hover:bg-[#2563EB]/90 hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Bot className="h-6 w-6" />
            </Button>
          </Link>

          <Link to="/integrations">
            <Button
              variant="ghost"
              size="icon"
              className={`w-12 h-12 ${
                isActive("/integrations")
                  ? "bg-[#2563EB] text-white hover:bg-[#2563EB]/90 hover:text-white"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <Settings className="h-6 w-6" />
            </Button>
          </Link>
        </nav>

        {/* User Avatar */}
        <div className="mt-auto">
          <div className="w-10 h-10 rounded-full bg-[#0EA5E9] flex items-center justify-center text-white font-semibold text-sm">
            PM
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
