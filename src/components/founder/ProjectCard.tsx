import { Link } from "@tanstack/react-router";
import { CalendarDays, ArrowUpRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "./StatusBadge";
import { currency, type Project } from "@/lib/mock-data";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      to="/projects/$projectId"
      params={{ projectId: project.id }}
      className="card-surface group block p-5 transition-all duration-300 hover:shadow-[var(--shadow-lift)] hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-medium">{project.name}</p>
          <p className="truncate text-xs text-muted-foreground">{project.client}</p>
        </div>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <div className="mt-4 space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium text-foreground">{project.progress}%</span>
        </div>
        <Progress value={project.progress} className="h-1.5" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <StatusBadge status={project.status} />
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> {project.deadline}
        </span>
        <span className="text-xs font-medium">{currency(project.price - project.advance)} due</span>
      </div>
    </Link>
  );
}
