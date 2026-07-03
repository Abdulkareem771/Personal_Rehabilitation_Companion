import { NavLink } from "react-router-dom";
import { Home, Calendar, Dumbbell, BookOpen, Activity, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Today",     path: "/",         icon: Home },
  { label: "Programs",  path: "/programs", icon: Calendar },
  { label: "Workout",   path: "/workout",  icon: Dumbbell },
  { label: "Health",    path: "/health",   icon: Activity },
  { label: "Learn",     path: "/knowledge",icon: BookOpen },
  { label: "Settings",  path: "/settings", icon: Settings },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-1 py-1 flex items-center justify-around shadow-lg">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 px-2 rounded-xl transition-all min-w-[52px]",
                isActive
                  ? "text-primary font-extrabold scale-105"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              )
            }
          >
            <Icon size={19} />
            <span className="text-[10px] tracking-tight truncate max-w-[54px]">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
