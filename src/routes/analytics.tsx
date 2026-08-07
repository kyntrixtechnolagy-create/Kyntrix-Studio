import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { fetchFromAPI } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { currency } from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — FounderOS" },
      { name: "description", content: "Revenue trends, client growth, project completion rate, pending payments and weekly productivity." },
      { property: "og:title", content: "Analytics — FounderOS" },
      { property: "og:description", content: "Trends across revenue, clients, delivery and productivity." },
    ],
  }),
  component: AnalyticsPage,
});

const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid var(--border)",
  background: "var(--card)",
  fontSize: 12,
};

function AnalyticsPage() {
  const [data, setData] = useState<{
    revenueSeries: any[];
    clientGrowth: any[];
    completionRate: any[];
    pendingByClient: any[];
    productivity: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromAPI('/analytics')
      .then(res => {
        if (res) {
          setData(res);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <PageHeader title="Analytics" description="Loading metrics..." />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={`h-[340px] rounded-xl ${i === 4 ? 'lg:col-span-2' : ''}`} />
          ))}
        </div>
      </div>
    );
  }

  const { revenueSeries, clientGrowth, completionRate, pendingByClient, productivity } = data;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Analytics"
        description={`${revenueSeries.length > 0 ? currency(revenueSeries.at(-1)!.revenue) : currency(0)} last month · 8 months of history`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Monthly revenue">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueSeries} margin={{ left: -16 }}>
              <defs>
                <linearGradient id="anaRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="var(--chart-1)" strokeWidth={2.5} fill="url(#anaRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Client growth">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={clientGrowth} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="clients" name="Clients" stroke="var(--chart-2)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Project completion rate">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={completionRate} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                {completionRate.map((c, i) => (
                  <Cell key={c.name} fill={["var(--chart-2)", "var(--chart-1)", "var(--chart-3)"][i % 3]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Pending payments by client">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pendingByClient} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="client" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="pending" name="Pending" fill="var(--chart-3)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Productivity" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={productivity} margin={{ left: -16 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="hours" name="Focus hours" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="tasks" name="Tasks shipped" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>
    </div>
  );
}

