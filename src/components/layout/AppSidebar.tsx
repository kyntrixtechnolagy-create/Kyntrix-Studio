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
  Boxes,
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
            const active = item.url === "/" ? pathname === "/" : pathname.startsWith(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                  <Link to={item.url} className="flex items-center gap-2.5">
                    <item.icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Boxes className="h-5 w-5" />
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
