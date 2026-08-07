import { cn } from "@/lib/utils";

const map: Record<string, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-primary/10 text-primary ring-primary/20" },
  completed: { label: "Completed", className: "bg-success/10 text-success ring-success/20" },
  "on-hold": { label: "On hold", className: "bg-warning/15 text-warning ring-warning/25" },
  planning: { label: "Planning", className: "bg-info/10 text-info ring-info/20" },
  paid: { label: "Paid", className: "bg-success/10 text-success ring-success/20" },
  partial: { label: "Partial", className: "bg-info/10 text-info ring-info/20" },
  pending: { label: "Pending", className: "bg-warning/15 text-warning ring-warning/25" },
  overdue: { label: "Overdue", className: "bg-destructive/10 text-destructive ring-destructive/25" },
  inactive: { label: "Inactive", className: "bg-muted text-muted-foreground ring-border" },
  lead: { label: "Lead", className: "bg-chart-5/10 text-chart-5 ring-chart-5/20" },
  high: { label: "High", className: "bg-destructive/10 text-destructive ring-destructive/25" },
  medium: { label: "Medium", className: "bg-warning/15 text-warning ring-warning/25" },
  low: { label: "Low", className: "bg-muted text-muted-foreground ring-border" },
  todo: { label: "Todo", className: "bg-muted text-muted-foreground ring-border" },
  "in-progress": { label: "In progress", className: "bg-primary/10 text-primary ring-primary/20" },
  review: { label: "Review", className: "bg-chart-5/10 text-chart-5 ring-chart-5/20" },
  meeting: { label: "Meeting", className: "bg-primary/10 text-primary ring-primary/20" },
  deadline: { label: "Deadline", className: "bg-destructive/10 text-destructive ring-destructive/25" },
  payment: { label: "Payment", className: "bg-success/10 text-success ring-success/20" },
  task: { label: "Task", className: "bg-info/10 text-info ring-info/20" },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const item = map[status] ?? { label: status, className: "bg-muted text-muted-foreground ring-border" };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        item.className,
        className,
      )}
    >
      {item.label}
    </span>
  );
}
