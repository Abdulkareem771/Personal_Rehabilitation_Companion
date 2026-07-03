import { NavLink } from "react-router-dom";
import {
  Home, Calendar, Dumbbell, BookOpen, UserCheck, Activity,
  LineChart, FileText, Settings, Sun, Moon, Palette, ChevronLeft, ChevronRight
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard",       path: "/",          icon: Home },
  { label: "Programs",        path: "/programs",  icon: Calendar },
  { label: "Workout Mode",    path: "/workout",   icon: Dumbbell },
  { label: "Knowledge Base",  path: "/knowledge", icon: BookOpen },
  { label: "Posture Routine", path: "/posture",   icon: UserCheck },
  { label: "Health Hub",      path: "/health",    icon: Activity },
  { label: "Progress & PRs",  path: "/progress",  icon: LineChart },
  { label: "Medical Vault",   path: "/medical",   icon: FileText },
  { label: "Settings",        path: "/settings",  icon: Settings },
];

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, theme, setTheme } = useAppStore();

  const cycleTheme = () => {
    if (theme === "light")        setTheme("dark");
    else if (theme === "dark")    setTheme("medical-blue");
    else                          setTheme("light");
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card transition-all duration-300 h-screen sticky top-0 shrink-0",
        sidebarCollapsed ? "w-20 p-3" : "w-64 p-5"
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-8 px-2">
        {!sidebarCollapsed ? (
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-lg shrink-0 shadow-sm">
              R
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight block leading-tight text-foreground">
                ReForge
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
                Rehab OS v4
              </span>
            </div>
          </div>
        ) : (
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xl mx-auto shadow-sm">
            R
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors hidden lg:flex"
          title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
              title={sidebarCollapsed ? item.label : undefined}
            >
              <Icon size={20} className="shrink-0" />
              {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Theme Toggle */}
      <div className="pt-4 border-t border-border mt-auto">
        <button
          onClick={cycleTheme}
          className={cn(
            "flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary hover:text-foreground transition-all",
            sidebarCollapsed && "justify-center px-0"
          )}
          title={`Current theme: ${theme}. Click to switch.`}
        >
          {theme === "dark" ? (
            <Moon size={18} className="text-rehab-blue shrink-0" />
          ) : theme === "medical-blue" ? (
            <Palette size={18} className="text-primary shrink-0" />
          ) : (
            <Sun size={18} className="text-rehab-amber shrink-0" />
          )}
          {!sidebarCollapsed && (
            <span className="capitalize truncate">Theme: {theme}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
