import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Theme, UserProfile } from "@/types";

interface AppState {
  // ── User ────────────────────────────────────────────────────────────────
  profile: UserProfile | null;
  setProfile: (profile: UserProfile | null) => void;

  // ── Theme ───────────────────────────────────────────────────────────────
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleDark: () => void;

  // ── Sidebar ─────────────────────────────────────────────────────────────
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // ── Active Program ───────────────────────────────────────────────────────
  activeProgramId: string | null;
  setActiveProgramId: (id: string | null) => void;

  // ── Learning Tips ────────────────────────────────────────────────────────
  learningTipsEnabled: boolean;
  setLearningTipsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),

      theme: "light",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggleDark: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        get().setTheme(next);
      },

      sidebarCollapsed: false,
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

      activeProgramId: null,
      setActiveProgramId: (id) => set({ activeProgramId: id }),

      learningTipsEnabled: true,
      setLearningTipsEnabled: (enabled) => set({ learningTipsEnabled: enabled }),
    }),
    {
      name: "reforge-app-store",
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        activeProgramId: state.activeProgramId,
        learningTipsEnabled: state.learningTipsEnabled,
      }),
    }
  )
);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "medical-blue");
  if (theme === "dark")          root.classList.add("dark");
  if (theme === "medical-blue")  root.classList.add("medical-blue");
}
