import { Bell, Search, Moon, Sun } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppStore } from "@/store/useAppStore";

const notifications = [
  "Orbit Freight invoice is overdue by 4 days",
  "Kalpa design review starts in 30 minutes",
  "Souk Marketplace v2 hit 80% progress",
];

export function Navbar() {
  const profile = useAppStore((s) => s.profile);
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 glass-panel px-4 md:px-6">
      <SidebarTrigger className="shrink-0" />
      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search clients, projects, invoices…" className="h-9 pl-9" />
      </div>
      <div className="ml-auto flex items-center gap-1.5">
        <span className="hidden rounded-lg bg-muted px-2.5 py-1.5 text-xs font-medium text-muted-foreground md:inline">
          {today}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem key={n} className="whitespace-normal text-xs">
                {n}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary uppercase">
            {profile?.name
              ? profile.name.split(' ').map((n) => n[0]).join('').substring(0, 2)
              : 'RS'}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
