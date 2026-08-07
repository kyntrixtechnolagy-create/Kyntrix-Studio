import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FolderKanban,
  ListChecks,
  Wallet,
  Settings,
  Plus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navActions = [
  { title: "Home", icon: LayoutDashboard, color: "text-blue-500", url: "/" },
  { title: "Projects", icon: FolderKanban, color: "text-purple-500", url: "/projects" },
  { title: "Tasks", icon: ListChecks, color: "text-emerald-500", url: "/tasks" },
  { title: "Finance", icon: Wallet, color: "text-amber-500", url: "/finance" },
  { title: "Settings", icon: Settings, color: "text-slate-500", url: "/settings" },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Heavy Glass Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(12px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-40 bg-background/60 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <div className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 md:hidden">
        {/* Floating Stack Menu */}
        <AnimatePresence>
          {isOpen && (
            <div className="absolute bottom-full left-1/2 mb-6 flex -translate-x-1/2 flex-col items-center gap-4">
              {navActions.slice().reverse().map((action, index) => {
                const isActive = action.url === "/" ? pathname === "/" : pathname.startsWith(action.url);
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Link
                      to={action.url}
                      onClick={() => setIsOpen(false)}
                      className={`glass-panel flex w-48 items-center gap-4 rounded-3xl p-3 pr-6 shadow-xl transition-all active:scale-95 ${
                        isActive ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                      }`}
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <action.icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <span className="text-base font-semibold tracking-tight text-foreground">
                        {action.title}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>

        {/* The Omnipresent Orb */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-400 text-white shadow-[0_8px_24px_rgba(79,70,229,0.4)] outline-none ring-offset-background transition-colors hover:shadow-[0_12px_32px_rgba(79,70,229,0.5)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <motion.div
            animate={{ rotate: isOpen ? 135 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Plus className="h-8 w-8" />
          </motion.div>
        </motion.button>
      </div>
    </>
  );
}
