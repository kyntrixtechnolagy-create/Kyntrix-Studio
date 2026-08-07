import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { TaskCard } from "@/components/founder/TaskCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { TaskColumn } from "@/lib/mock-data";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — FounderOS" },
      { name: "description", content: "Kanban board for solo delivery work: todo, in progress, review and completed with drag and drop." },
      { property: "og:title", content: "Tasks — FounderOS" },
      { property: "og:description", content: "A drag-and-drop kanban board for your delivery work." },
    ],
  }),
  component: TasksPage,
});

const columns: { id: TaskColumn; label: string; accent: string }[] = [
  { id: "todo", label: "Todo", accent: "bg-muted-foreground" },
  { id: "in-progress", label: "In progress", accent: "bg-primary" },
  { id: "review", label: "Review", accent: "bg-chart-5" },
  { id: "completed", label: "Completed", accent: "bg-success" },
];

function TasksPage() {
  const tasks = useAppStore((s) => s.tasks);
  const setTasks = useAppStore((s) => s.setTasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<TaskColumn | null>(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", projectId: "", priority: "MEDIUM", status: "PENDING", deadline: "" });
  const [projectsList, setProjectsList] = useState<any[]>([]);

  const loadTasks = () => {
    fetchFromAPI('/tasks')
      .then(res => {
        if (!res?.data) return;
        const mapped = res.data.map((t: any) => ({
          id: t.id,
          title: t.title,
          description: t.description,
          projectId: t.projectId,
          status: t.status,
          deadline: t.deadline,
          project: t.project?.name || "Unknown",
          priority: t.priority.toLowerCase(),
          time: t.deadline ? new Date(t.deadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-",
          dueDate: t.deadline ? t.deadline.substring(0, 10) : "-",
          column: t.status === "PENDING" ? "todo" : t.status.toLowerCase().replace('_', '-'),
          done: t.status === "COMPLETED",
          today: t.deadline ? new Date(t.deadline).toDateString() === new Date().toDateString() : false,
        }));
        setTasks(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadTasks();
    fetchFromAPI('/projects').then(res => {
      if (res?.data) setProjectsList(res.data);
    }).catch(console.error);
  }, []);

  const handleSaveTask = async () => {
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        projectId: formData.projectId || null,
        priority: formData.priority,
        status: formData.status,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : new Date().toISOString()
      };

      if (editingTaskId) {
        await fetchFromAPI(`/tasks/${editingTaskId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
        toast.success("Task updated successfully");
      } else {
        await fetchFromAPI('/tasks', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success("Task created successfully");
      }
      setDialogOpen(false);
      setEditingTaskId(null);
      setFormData({ title: "", description: "", projectId: "", priority: "MEDIUM", status: "PENDING", deadline: "" });
      loadTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (task: any) => {
    setEditingTaskId(task.id);
    setFormData({
      title: task.title,
      description: task.description || "",
      projectId: task.projectId || "",
      priority: task.priority?.toUpperCase() || "MEDIUM",
      status: task.status || "PENDING",
      deadline: task.deadline ? new Date(task.deadline).toISOString().substring(0, 16) : "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await fetchFromAPI(`/tasks/${id}`, { method: 'DELETE' });
      toast.success("Task deleted");
      loadTasks();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete task");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader
        title="Tasks"
        description="Drag cards between columns to update status."
        actions={
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingTaskId(null);
                setFormData({ title: "", description: "", projectId: "", priority: "MEDIUM", status: "PENDING", deadline: "" });
              }}>
                <Plus className="mr-1 h-4 w-4" /> New task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingTaskId ? "Edit task" : "Create task"}</DialogTitle>
                <DialogDescription>{editingTaskId ? "Update your task details." : "Add a new task to your board."}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="ttitle">Title</Label>
                  <Input id="ttitle" placeholder="Fix invoice bug" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="tdesc">Description</Label>
                  <Input id="tdesc" placeholder="Optional task description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Project (Optional)</Label>
                    <Select value={formData.projectId} onValueChange={v => setFormData({ ...formData, projectId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projectsList.map((p: any) => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Priority</Label>
                    <Select value={formData.priority} onValueChange={v => setFormData({ ...formData, priority: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Status</Label>
                    <Select value={formData.status} onValueChange={v => setFormData({ ...formData, status: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PENDING">Todo</SelectItem>
                        <SelectItem value="IN_PROGRESS">In progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="tdeadline">Deadline</Label>
                    <Input id="tdeadline" type="datetime-local" value={formData.deadline} onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleSaveTask} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : (editingTaskId ? "Save changes" : "Create task")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {columns.map((col) => {
          const items = tasks.filter((t) => t.column === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setOver(col.id); }}
              onDragLeave={() => setOver(null)}
              onDrop={() => {
                if (dragging) {
                  moveTask(dragging, col.id);
                  const newStatus = col.id === "todo" ? "PENDING" : col.id === "review" ? "REVIEW" : col.id === "in-progress" ? "IN_PROGRESS" : "COMPLETED";
                  fetchFromAPI(`/tasks/${dragging}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ status: newStatus })
                  }).catch(console.error);
                }
                setDragging(null);
                setOver(null);
              }}
              className={cn(
                "flex flex-col gap-3 rounded-2xl border bg-muted/30 p-3 transition-colors",
                over === col.id && "border-primary/50 bg-primary/5",
              )}
            >
              <div className="flex items-center gap-2 px-1">
                <span className={cn("h-2 w-2 rounded-full", col.accent)} />
                <p className="text-sm font-medium">{col.label}</p>
                <span className="ml-auto rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              {items.map((t) => (
                <TaskCard
                  key={t.id}
                  task={t}
                  onToggle={toggleTask}
                  onEdit={() => handleEdit(t)}
                  onDelete={handleDelete}
                  draggable
                  onDragStart={() => setDragging(t.id)}
                />
              ))}
              {items.length === 0 && (
                <p className="rounded-xl border border-dashed px-3 py-8 text-center text-xs text-muted-foreground">
                  Drop tasks here
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
