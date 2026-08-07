import { cn } from "@/lib/utils";

export interface TimelineItem {
  title: string;
  meta: string;
  description?: string;
  done?: boolean;
  tone?: "primary" | "destructive" | "success" | "warning";
}

const dotTone: Record<string, string> = {
  primary: "bg-primary",
  destructive: "bg-destructive",
  success: "bg-success",
  warning: "bg-warning",
};

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-6 pl-6">
      <span className="absolute left-[5px] top-2 bottom-2 w-px bg-border" aria-hidden />
      {items.map((item, i) => (
        <li key={i} className="relative animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
          <span
            className={cn(
              "absolute -left-6 top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-background",
              item.done ? "bg-success" : dotTone[item.tone ?? "primary"],
            )}
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium">{item.title}</p>
            <span className="text-xs text-muted-foreground">{item.meta}</span>
          </div>
          {item.description && (
            <p className="mt-1 text-xs text-muted-foreground">{item.description}</p>
          )}
        </li>
      ))}
    </ol>
  );
}
