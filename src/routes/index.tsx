import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { fetchFromAPI } from "@/lib/api";
import {
  DollarSign,
  Clock,
  PiggyBank,
  FolderKanban,
  CheckCircle2,
  ListChecks,
  UserPlus,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { StatCard } from "@/components/founder/StatCard";
import { RevenueChart } from "@/components/founder/RevenueChart";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { Timeline } from "@/components/founder/Timeline";
import { TaskCard } from "@/components/founder/TaskCard";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/mock-data";
import { useAppStore } from "@/store/useAppStore";
import { useFakeLoading } from "@/hooks/useFakeLoading";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — FounderOS" },
      {
        name: "description",
        content:
          "FounderOS dashboard: revenue, pending payments, active projects, tasks and deadlines for a solo software studio.",
      },
      { property: "og:title", content: "Dashboard — FounderOS" },
      {
        property: "og:description",
        content: "Your solo business operating system: revenue, projects, payments and tasks in one view.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [data, setData] = useState<any>({
    totals: { revenue: 0, pending: 0, savings: 0, activeProjects: 0, completedProjects: 0, pendingTasks: 0, newLeads: 0 },
    trends: { revenue: 0, pending: 0, savings: 0, activeProjects: 0, completedProjects: 0, pendingTasks: 0, newLeads: 0 },
    recent: [],
    events: [],
  });
  const [loading, setLoading] = useState(true);

  const tasks = useAppStore((s) => s.tasks);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const todays = tasks.filter((t) => t.today);

  useEffect(() => {
    fetchFromAPI('/dashboard')
      .then(res => {
        const d = res;
        if (!d) return;
        setData(prev => ({
          ...prev,
          totals: {
            revenue: d.revenue || 0,
            pending: d.pendingAmount || 0,
            savings: d.savings || 0,
            activeProjects: d.activeProjects || 0,
            completedProjects: d.completedProjects || 0,
            pendingTasks: d.pendingTasks || 0,
            newLeads: 0,
          },
          trends: d.trends || prev.trends,
        }));
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Also fetch recent projects
    fetchFromAPI('/projects?limit=6')
      .then(res => {
        if (!res.data || !Array.isArray(res.data)) return;
        setData(prev => ({
          ...prev,
          recent: res.data.map((p: any) => ({
             id: p.id,
             name: p.name,
             client: p.client?.name || 'Unknown',
             progress: p.progress,
             status: p.status.toLowerCase().replace('_', '-'),
             deadline: p.endDate ? p.endDate.substring(0, 10) : '-',
             price: p.payments?.reduce((s: number, pay: any) => s + pay.amount, 0) || 0,
             advance: p.payments?.reduce((s: number, pay: any) => s + pay.advancePaid, 0) || 0,
          }))
        }));
      }).catch(console.error);

    // Also fetch upcoming events
    fetchFromAPI('/calendar')
      .then(res => {
        if (!res?.calendars) return;
        setData(prev => ({
          ...prev,
          events: res.calendars.slice(0, 6).map((e: any) => ({
             title: e.title,
             date: e.startDate ? e.startDate.substring(0, 10) : "-",
             time: e.startDate ? new Date(e.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-",
             type: e.type.toLowerCase()
          }))
        }));
      }).catch(console.error);
  }, []);

  const { totals, trends, recent, events } = data;
  const profile = useAppStore((s) => s.profile);
  const firstName = profile?.name ? profile.name.split(' ')[0] : 'Rahul';

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
      }}
      className="mx-auto max-w-7xl space-y-6"
    >
      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <PageHeader
          title={`Good afternoon, ${firstName}`}
          description="Here's how the studio is doing this month."
          actions={
            <Button variant="neu" asChild>
              <Link to="/projects">
                View projects <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          }
        />
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-[152px] rounded-xl" />
            ))
          : (
              [
                { label: "Total revenue", value: currency(totals.revenue), subtitle: "Year to date", icon: DollarSign, trend: trends.revenue, tone: "primary" as const },
                { label: "Pending amount", value: currency(totals.pending), subtitle: "Unpaid invoices", icon: Clock, trend: trends.pending, tone: "warning" as const },
                { label: "Savings", value: currency(totals.savings), subtitle: "Reserve account", icon: PiggyBank, trend: trends.savings, tone: "success" as const },
                { label: "Active projects", value: `${totals.activeProjects}`, subtitle: "In delivery", icon: FolderKanban, trend: trends.activeProjects, tone: "info" as const },
                { label: "Completed projects", value: `${totals.completedProjects}`, subtitle: "Shipped in 2026", icon: CheckCircle2, trend: trends.completedProjects, tone: "success" as const },
                { label: "Pending tasks", value: `${totals.pendingTasks}`, subtitle: "Across all boards", icon: ListChecks, trend: trends.pendingTasks, tone: "destructive" as const },
                { label: "New leads", value: `${totals.newLeads}`, subtitle: "This month", icon: UserPlus, trend: trends.newLeads, tone: "primary" as const },
              ].map((c) => <StatCard key={c.label} {...c} />)
            )}
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <SectionCard
          title="Revenue analytics"
          action={<span className="text-xs text-muted-foreground">Revenue · Expenses · Profit</span>}
        >
          {loading ? <Skeleton className="h-[320px] rounded-xl" /> : <RevenueChart />}
        </SectionCard>
      </motion.div>

      <motion.div 
        variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        className="grid grid-cols-1 gap-6 xl:grid-cols-3"
      >
        <SectionCard
          title="Recent projects"
          className="xl:col-span-2"
          action={
            <Button variant="ghost" size="sm" asChild>
              <Link to="/projects">All projects</Link>
            </Button>
          }
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead className="w-[140px]">Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead className="text-right">Pending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recent.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer">
                    <TableCell className="font-medium">
                      <Link to="/projects/$projectId" params={{ projectId: p.id }}>
                        {p.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.client}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={p.progress} className="h-1.5" />
                        <span className="w-8 text-xs text-muted-foreground">{p.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={p.status} />
                    </TableCell>
                    <TableCell className="text-muted-foreground">{p.deadline}</TableCell>
                    <TableCell className="text-right font-medium">
                      {currency(p.price - p.advance)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </SectionCard>

        <SectionCard title="Upcoming deadlines">
          <Timeline
            items={events.map((e: any) => ({
              title: e.title,
              meta: e.date.slice(5),
              description: `${e.type} · ${e.time}`,
              tone: e.type === "deadline" ? "destructive" : e.type === "payment" ? "success" : "primary",
            }))}
          />
        </SectionCard>
      </motion.div>

      <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
        <SectionCard title="Today's tasks">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {todays.map((t) => (
              <TaskCard key={t.id} task={t} onToggle={toggleTask} />
            ))}
          </div>
        </SectionCard>
      </motion.div>
    </motion.div>
  );
}
