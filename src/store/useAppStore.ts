import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type Task, type TaskColumn } from "@/lib/mock-data";

export interface UserProfile {
  name: string;
  studioName: string;
  email: string;
  currency: string;
}

interface AppState {
  theme: "light" | "dark";
  toggleTheme: () => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  moveTask: (id: string, column: TaskColumn) => void;
  toggleTask: (id: string) => void;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((s) => {
          const theme = s.theme === "light" ? "dark" : "light";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", theme === "dark");
          }
          return { theme };
        }),
      tasks: [],
      setTasks: (tasks) => set({ tasks }),
      moveTask: (id, column) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id ? { ...t, column, done: column === "completed" } : t,
          ),
        })),
      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
        })),
      profile: {
        name: "Rahul Sharma",
        studioName: "FounderOS Studio",
        email: "hello@founderos.dev",
        currency: "USD",
      },
      setProfile: (profile) => set({ profile }),
    }),
    {
      name: "founderos-storage",
    }
  )
);
