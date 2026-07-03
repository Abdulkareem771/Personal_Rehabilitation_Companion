import { NavLink } from "react-router-dom";
import { Home, Calendar, Dumbbell, BookOpen, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { label: "Today",     path: "/",         icon: Home },
  { label: "Programs",  path: "/programs", icon: Calendar },
  { label: "Workout",   path: "/workout",  icon: Dumbbell },
  { label: "Learn",     path: "/knowledge",icon: BookOpen },
  { label: "Health",    path: "/health",   icon: Activity },
];

export function MobileNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border px-2 py-1 flex items-center justify-around shadow-lg">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center justify-center gap-1 py-1.5 px-3 rounded-xl transition-all min-w-[60px]",
                isActive
                  ? "text-primary font-extrabold scale-105"
                  : "text-muted-foreground hover:text-foreground font-semibold"
              )
            }
          >
            <Icon size={20} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
