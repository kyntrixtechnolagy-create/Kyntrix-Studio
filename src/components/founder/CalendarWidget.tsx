import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type CalendarEvent } from "@/lib/mock-data";
import { StatusBadge } from "./StatusBadge";

const dotType: Record<CalendarEvent["type"], string> = {
  meeting: "bg-primary",
  deadline: "bg-destructive",
  payment: "bg-success",
  task: "bg-info",
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CalendarWidget({
  onSelect,
  selected,
  events = [],
}: {
  onSelect?: ((date: string) => void) | undefined;
  selected?: string | undefined;
  events?: any[];
}) {
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const first = new Date(year, month, 1);
  const startOffset = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  const key = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="card-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {cursor.toLocaleString("en-US", { month: "long" })} {year}
        </h3>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(year, month - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(year, month + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
        {weekdays.map((d) => (
          <div key={d} className="pb-2 font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const dayKey = key(d);
          const dayEvents = events.filter((e) => e.date === dayKey);
          return (
            <button
              key={dayKey}
              onClick={() => onSelect?.(dayKey)}
              className={cn(
                "flex min-h-16 flex-col items-start gap-1 rounded-xl border border-transparent p-2 text-left text-sm transition-colors hover:bg-accent",
                selected === dayKey && "border-primary/40 bg-primary/5",
              )}
            >
              <span className={cn(dayEvents.length > 0 && "font-semibold")}>{d}</span>
              <div className="flex flex-wrap gap-1">
                {dayEvents.map((e) => (
                  <span key={e.id} className={cn("h-1.5 w-1.5 rounded-full", dotType[e.type as keyof typeof dotType] || "bg-primary")} />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t pt-4">
        {(["meeting", "deadline", "payment", "task"] as const).map((t) => (
          <StatusBadge key={t} status={t} />
        ))}
      </div>
    </div>
  );
}
