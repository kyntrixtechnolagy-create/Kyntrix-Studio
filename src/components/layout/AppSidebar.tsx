import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Wallet,
  CreditCard,
  ListChecks,
  CalendarDays,
  FileText,
  Lightbulb,
  BarChart3,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAppStore } from "@/store/useAppStore";

const main = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Clients", url: "/clients", icon: Users },
  { title: "Projects", url: "/projects", icon: FolderKanban },
] as const;

const money = [
  { title: "Finance", url: "/finance", icon: Wallet },
  { title: "Payments", url: "/payments", icon: CreditCard },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
] as const;

const work = [
  { title: "Tasks", url: "/tasks", icon: ListChecks },
  { title: "Calendar", url: "/calendar", icon: CalendarDays },
  { title: "Documents", url: "/documents", icon: FileText },
  { title: "Ideas", url: "/ideas", icon: Lightbulb },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const profile = useAppStore((s) => s.profile);

  const group = (label: string, items: readonly { title: string; url: string; icon: typeof Users }[]) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <Link
                  to={item.url}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-white/40 hover:text-foreground"
                  }`}
                >
                  <item.icon
                    className={`h-5 w-5 transition-transform ${
                      isActive ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M7 4v16" />
              <path d="M18 5l-8 7 8 8" />
            </svg>
          </span>
          {!collapsed && (
            <span className="text-sm font-semibold tracking-tight">
              {profile.studioName || "FounderOS"}
              <span className="block text-xs font-normal text-muted-foreground">Solo studio</span>
            </span>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {group("Overview", main)}
        {group("Money", money)}
        {group("Workspace", work)}
      </SidebarContent>
    </Sidebar>
  );
}
