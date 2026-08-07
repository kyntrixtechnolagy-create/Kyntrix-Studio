import { useEffect, useState } from "react";
import { fetchFromAPI } from "@/lib/api";
import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, SectionCard } from "@/components/layout/PageHeader";
import { CalendarWidget } from "@/components/founder/CalendarWidget";
import { StatusBadge } from "@/components/founder/StatusBadge";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — FounderOS" },
      { name: "description", content: "Monthly calendar with client meetings, project deadlines, payment due dates and tasks." },
      { property: "og:title", content: "Calendar — FounderOS" },
      { property: "og:description", content: "Meetings, deadlines, payments and tasks in one monthly view." },
    ],
  }),
  component: CalendarPage,
});

function CalendarPage() {
  const [selected, setSelected] = useState<string | undefined>();
  const [data, setData] = useState<any[]>([]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "MEETING",
    time: "09:00",
  });

  const loadCalendar = () => {
    fetchFromAPI('/calendar')
      .then(res => {
        if (!res?.calendars) return;
        const mapped = res.calendars.map((e: any) => ({
          id: e.id,
          title: e.title,
          description: e.description,
          date: e.startDate ? e.startDate.substring(0, 10) : "-",
          time: e.startDate ? new Date(e.startDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-",
          type: e.type.toLowerCase(),
        }));
        setData(mapped);
      })
      .catch(console.error);
  };

  useEffect(() => {
    loadCalendar();
  }, []);

  const handleSaveEvent = async () => {
    const targetDate = selected || new Date().toISOString().split('T')[0];
    if (!formData.title) {
      toast.error("Title is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const start = new Date(`${targetDate}T${formData.time}:00`);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        type: formData.type.toUpperCase(),
      };

      if (editingEventId) {
        await fetchFromAPI(`/calendar/${editingEventId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
        toast.success("Event updated successfully");
      } else {
        await fetchFromAPI('/calendar', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        toast.success("Event scheduled successfully");
      }
      
      setDialogOpen(false);
      setEditingEventId(null);
      setFormData({ title: "", description: "", type: "MEETING", time: "09:00" });
      loadCalendar();
    } catch (err: any) {
      toast.error(err.message || "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event: any) => {
    setEditingEventId(event.id);
    setFormData({
      title: event.title,
      description: event.description || "",
      type: event.type.toUpperCase(),
      time: event.time,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await fetchFromAPI(`/calendar/${id}`, { method: 'DELETE' });
      toast.success("Event deleted");
      loadCalendar();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event");
    }
  };

  const list = selected ? data.filter((e) => e.date === selected) : data;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <PageHeader title="Calendar" description="August 2026 · meetings, deadlines and payments." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarWidget selected={selected} onSelect={setSelected} events={data} />
        </div>
        <SectionCard 
          title={selected ? `Events on ${selected}` : "All events"}
          action={
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={() => {
                  setEditingEventId(null);
                  setFormData({ title: "", description: "", type: "MEETING", time: "09:00" });
                }}>
                  <Plus className="mr-1 h-4 w-4" /> Add event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingEventId ? "Edit event" : "Schedule event"}</DialogTitle>
                  <DialogDescription>
                    {editingEventId ? "Update your event details." : `Add a meeting or deadline for ${selected || "today"}.`}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label>Title</Label>
                    <Input placeholder="Client sync" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-1.5">
                      <Label>Time</Label>
                      <Input type="time" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                    </div>
                    <div className="grid gap-1.5">
                      <Label>Type</Label>
                      <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEETING">Meeting</SelectItem>
                          <SelectItem value="DEADLINE">Deadline</SelectItem>
                          <SelectItem value="EVENT">Event</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Description</Label>
                    <Input placeholder="Optional description..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSaveEvent} disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : (editingEventId ? "Save changes" : "Schedule")}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        >
          {list.length === 0 ? (
            <p className="rounded-xl border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
              Nothing scheduled for this day.
            </p>
          ) : (
            <ul className="space-y-3">
              {list.map((e) => (
                <li key={e.id} className="rounded-xl border p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{e.title}</p>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={e.type} />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(e)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(e.id)} className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {e.date} · {e.time}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
