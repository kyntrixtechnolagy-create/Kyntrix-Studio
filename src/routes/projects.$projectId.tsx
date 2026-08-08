import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Clock, DollarSign, User, CheckCircle2, Circle, Loader2 } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { ProgressCircle } from "@/components/founder/ProgressCircle";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFromAPI } from "@/lib/api";
import { currency } from "@/lib/mock-data";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$projectId")({
  head: () => ({
    meta: [
      { title: "Project — FounderOS" },
      { name: "description", content: "Project details, tasks, payments and timeline." },
    ],
  }),
  component: ProjectDetail,
});

function ProjectDetail() {
  const { projectId } = Route.useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFromAPI(`/projects/${projectId}`)
      .then((data) => setProject(data))
      .catch(() => {
        toast.error("Project not found");
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="mx-auto max-w-7xl space-y-4">
        <Button variant="ghost" size="sm" asChild className="-ml-2">
          <Link to="/projects">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to projects
          </Link>
        </Button>
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-24 text-center text-muted-foreground">
          <p className="text-lg font-semibold">Project not found</p>
          <p className="mt-1 text-sm">This project may have been deleted.</p>
        </div>
      </div>
    );
  }

  const totalPrice = project.payments?.reduce((s: number, p: any) => s + p.amount, 0) ?? 0;
  const totalAdvance = project.payments?.reduce((s: number, p: any) => s + p.advancePaid, 0) ?? 0;
  const pending = totalPrice - totalAdvance;
  const collectedPct = totalPrice > 0 ? Math.round((totalAdvance / totalPrice) * 100) : 0;
  const status = (project.status ?? "").toLowerCase().replace("_", "-");

  const pendingTasks = project.tasks?.filter((t: any) => t.status !== "COMPLETED") ?? [];
  const doneTasks = project.tasks?.filter((t: any) => t.status === "COMPLETED") ?? [];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/projects">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to projects
        </Link>
      </Button>

      <PageHeader
        title={project.name}
        description={
          [
            project.client?.name && `Client: ${project.client.name}`,
            project.startDate && `Started: ${project.startDate.substring(0, 10)}`,
            project.endDate && `Due: ${project.endDate.substring(0, 10)}`,
          ]
            .filter(Boolean)
            .join(" · ")
        }
        actions={<StatusBadge status={status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress circle */}
        <SectionCard title="Progress" className="flex flex-col items-center">
          <ProgressCircle value={project.progress ?? 0} label="complete" />
          {project.description && (
            <p className="mt-4 text-center text-sm text-muted-foreground">{project.description}</p>
          )}
        </SectionCard>

        {/* Payment summary */}
        <SectionCard title="Payment summary" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Project value", value: currency(totalPrice), icon: DollarSign, color: "text-foreground" },
              { label: "Received", value: currency(totalAdvance), icon: CheckCircle2, color: "text-emerald-500" },
              { label: "Pending", value: currency(pending), icon: Clock, color: "text-amber-500" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                  {s.label}
                </div>
                <p className={`mt-1.5 text-xl font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Collected</span>
              <span>{collectedPct}%</span>
            </div>
            <Progress value={collectedPct} className="h-2" />
          </div>

          {/* Payment rows */}
          {project.payments?.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payments</p>
              {project.payments.map((pay: any) => (
                <div key={pay.id} className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm">
                  <span className="font-medium">{pay.title}</span>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{currency(pay.amount)}</span>
                    <StatusBadge status={pay.status?.toLowerCase()} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Tasks */}
        <SectionCard title={`Tasks (${project.tasks?.length ?? 0})`} className="lg:col-span-2">
          {!project.tasks?.length ? (
            <p className="text-sm text-muted-foreground">No tasks for this project.</p>
          ) : (
            <ul className="space-y-2">
              {project.tasks.map((t: any) => {
                const done = t.status === "COMPLETED";
                return (
                  <li key={t.id} className="flex items-start gap-3 rounded-lg bg-muted/40 px-3 py-2.5 text-sm">
                    {done
                      ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                      : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />}
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium ${done ? "line-through text-muted-foreground" : ""}`}>{t.title}</p>
                      {t.description && <p className="text-xs text-muted-foreground truncate">{t.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={t.priority?.toLowerCase()} />
                      {t.deadline && (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {t.deadline.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </SectionCard>

        {/* Client info */}
        {project.client && (
          <SectionCard title="Client">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{project.client.name}</p>
                  {project.client.email && <p className="text-xs text-muted-foreground">{project.client.email}</p>}
                </div>
              </div>
              {project.client.company && (
                <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  🏢 {project.client.company}
                </div>
              )}
              {project.client.phone && (
                <div className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  📞 {project.client.phone}
                </div>
              )}
            </div>
          </SectionCard>
        )}

        {/* Notes */}
        {project.notes && (
          <SectionCard title="Notes" className="lg:col-span-3">
            <p className="whitespace-pre-wrap rounded-xl bg-muted/50 p-4 text-sm text-muted-foreground">{project.notes}</p>
          </SectionCard>
        )}
      </div>
    </div>
  );
}
