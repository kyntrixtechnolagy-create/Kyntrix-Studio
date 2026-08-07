import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Paperclip, Download } from "lucide-react";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { ProgressCircle } from "@/components/founder/ProgressCircle";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { Timeline } from "@/components/founder/Timeline";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { currency, projects, type Project } from "@/lib/mock-data";

export const Route = createFileRoute("/projects/$projectId")({
  loader: ({ params }): { project: Project } => {
    const project = projects.find((p) => p.id === params.projectId);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Project unavailable — FounderOS" }, { name: "robots", content: "noindex" }],
      };
    }
    const { project } = loaderData;
    return {
      meta: [
        { title: `${project.name} — FounderOS` },
        { name: "description", content: `${project.name} for ${project.client}: modules, timeline, requirements and payment summary.` },
        { property: "og:title", content: `${project.name} — FounderOS` },
        { property: "og:description", content: `Project details for ${project.client}.` },
      ],
    };
  },
  component: ProjectDetail,
});

function ProjectDetail() {
  const { project } = Route.useLoaderData() as { project: Project };
  const pending = project.price - project.advance;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link to="/projects">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to projects
        </Link>
      </Button>

      <PageHeader
        title={project.name}
        description={`${project.client} · started ${project.startedAt} · due ${project.deadline}`}
        actions={<StatusBadge status={project.status} />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Progress" className="flex flex-col items-center">
          <ProgressCircle value={project.progress} label="complete" />
          <p className="mt-4 text-center text-sm text-muted-foreground">{project.description}</p>
        </SectionCard>

        <SectionCard title="Payment summary" className="lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { label: "Project value", value: currency(project.price) },
              { label: "Received", value: currency(project.advance) },
              { label: "Pending", value: currency(pending) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-semibold">{s.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Collected</span>
              <span>{Math.round((project.advance / project.price) * 100)}%</span>
            </div>
            <Progress value={(project.advance / project.price) * 100} className="h-2" />
          </div>
        </SectionCard>

        <SectionCard title="Modules">
          <ul className="space-y-3">
            {project.modules.map((m) => (
              <li key={m.name} className="flex items-center gap-3 text-sm">
                <Checkbox checked={m.done} aria-label={m.name} />
                <span className={m.done ? "text-muted-foreground line-through" : ""}>{m.name}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Timeline">
          <Timeline
            items={project.timeline.map((t) => ({ title: t.label, meta: t.date, done: t.done }))}
          />
        </SectionCard>

        <SectionCard title="Requirements">
          <ul className="space-y-2 text-sm text-muted-foreground">
            {project.requirements.map((r) => (
              <li key={r} className="flex gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                {r}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Notes" className="lg:col-span-2">
          <ul className="space-y-3">
            {project.notes.map((n) => (
              <li key={n} className="rounded-xl bg-muted/50 p-3 text-sm">
                {n}
              </li>
            ))}
          </ul>
        </SectionCard>

        <SectionCard title="Attachments">
          <ul className="space-y-2">
            {project.attachments.map((a) => (
              <li
                key={a.name}
                className="flex items-center gap-3 rounded-xl border p-3 text-sm transition-colors hover:bg-accent"
              >
                <Paperclip className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{a.name}</span>
                <span className="text-xs text-muted-foreground">{a.size}</span>
                <Download className="h-4 w-4 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>
    </div>
  );
}
