import { Clock, CalendarDays, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "./StatusBadge";
import { cn } from "@/lib/utils";
import type { Task } from "@/lib/mock-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function TaskCard({
  task,
  onToggle,
  onEdit,
  onDelete,
  draggable,
  onDragStart,
}: {
  task: Task;
  onToggle?: (id: string) => void;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      className={cn(
        "relative card-surface p-4 transition-all duration-200 hover:shadow-[var(--shadow-lift)]",
        draggable && "cursor-grab active:cursor-grabbing",
        task.done && "opacity-70",
      )}
    >
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={() => onDelete(task.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="flex items-start gap-3 mt-1 pr-6">
        <Checkbox
          checked={task.done}
          onCheckedChange={() => onToggle?.(task.id)}
          className="mt-0.5"
          aria-label={`Toggle ${task.title}`}
        />
        <div className="min-w-0 flex-1">
          <p className={cn("text-sm font-medium", task.done && "line-through text-muted-foreground")}>
            {task.title}
          </p>
          <p className="truncate text-xs text-muted-foreground">{task.project}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={task.priority} />
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" /> {task.time}
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="h-3 w-3" /> {task.dueDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
